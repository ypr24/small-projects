# DeployWithKubernetes

A small Express application packaged with Docker and deployed to Kubernetes.
The application returns the hostname of the pod handling the request, making it
easy to see that Kubernetes is routing traffic across multiple replicas.

## Quick start

```sh
minikube start
minikube image build -t app-1-k8s:1 .
kubectl apply -f K8s/main.yaml
kubectl rollout status deployment/express-test-app
curl "$(minikube service express-test-service --url)"
```

For a step-by-step explanation, continue with the sections below.

## How it works

```text
Browser or curl
      |
      v
Service: express-test-service:6100
      |
      v
Deployment: express-test-app (2 replicas)
      |
      v
Express container: port 3010
```

- `index.js` starts an Express server on port `3010`.
- A request to `/` returns JSON containing the current pod hostname.
- `K8s/main.yaml` creates two pods through a Deployment.
- The Service selects pods with the label `app: express-test-app`, exposes port
  `6100`, and forwards requests to container port `3010`.
- `imagePullPolicy: Never` tells Kubernetes to use the locally available image
  instead of trying to pull it from a registry.

## How Kubernetes works

Kubernetes is a system for running containers while keeping them in a desired
state. You describe what you want, and Kubernetes continually compares that
description with the cluster's actual state. Controllers create, replace, or
remove resources until the actual state matches the desired state.

### The cluster

This project uses Minikube, which runs a small Kubernetes cluster locally. A
cluster has these main parts:

- **Control plane:** stores resource definitions and decides what should run.
- **API server:** receives commands such as `kubectl apply` and provides the
  Kubernetes API used by the dashboard and other tools.
- **Scheduler:** chooses a node for each new pod.
- **Controllers:** watch resources and correct differences between desired and
  actual state. The Deployment controller is responsible for this project's
  Deployment.
- **Node:** runs application pods. Minikube provides one local node here.
- **Kubelet:** runs on the node and makes sure the node's assigned pods are
  running.
- **Container runtime:** starts the containers from images. This Minikube setup
  uses `containerd`, which is why the README uses `minikube image build`.

### The Kubernetes object hierarchy

The resources in this project work together in a hierarchy:

```text
Deployment: express-test-app
                        |
                        v
ReplicaSet: creates the requested number of pods
                        |
                        v
Pods: two running copies of the Express container
                        ^
                        |
Service: selects ready pods by label and routes traffic to them
```

- A **container** is the running Express process created from `app-1-k8s:1`.
- A **pod** is the smallest unit Kubernetes schedules. This project has one
  container in each pod.
- A **ReplicaSet** maintains the requested number of equivalent pods. It is
- A **Deployment** manages ReplicaSets and performs controlled updates.
- A **Service** gives the changing pods a stable name and network endpoint.

### The reconciliation loop

Kubernetes is continuously observing and reconciling the cluster:

1. `kubectl apply -f K8s/main.yaml` sends the desired configuration to the API
      server.
2. The Deployment controller sees that two replicas are required.
3. A ReplicaSet creates pods from the pod template.
4. The scheduler assigns each pod to the Minikube node.
5. The kubelet asks the container runtime to start `app-1-k8s:1`.
6. The Service finds ready pods whose labels match its selector and adds them
   to its endpoints.
7. If a pod is deleted or crashes, the controllers notice the difference and
   create or restart what is needed to return to two ready replicas.

This is why Kubernetes is described as declarative: the YAML says what the
result should be, while Kubernetes decides the individual actions required to
reach and maintain that result.

## How the Kubernetes configuration works

`K8s/main.yaml` contains two Kubernetes resources separated by `---`:

1. A `Service` named `express-test-service` provides a stable network endpoint.
2. A `Deployment` named `express-test-app` creates and manages the application
      pods.

### Service

```yaml
kind: Service
metadata:
  name: express-test-service
spec:
  selector:
    app: express-test-app
  ports:
  - port: 6100
    targetPort: 3010
  type: LoadBalancer
```

The Service is the entry point for requests from outside the application pods:

- `metadata.name` gives the Service its Kubernetes name.
- `selector` tells the Service which pods should receive traffic. It must match
      the `app` label in the Deployment's pod template.
- `port: 6100` is the port exposed by the Service.
- `targetPort: 3010` is the port where Express is listening inside each pod.
- `type: LoadBalancer` requests an externally reachable load balancer. Minikube
      simulates this locally with `minikube service` or `minikube tunnel`.

The Service does not run the application itself. It finds matching pods and
forwards requests to one of their IP addresses. Kubernetes also updates the
Service endpoints when pods are created, removed, or replaced.

### Deployment

```yaml
kind: Deployment
metadata:
  name: express-test-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: express-test-app
  template:
    metadata:
      labels:
        app: express-test-app
    spec:
      containers:
      - name: express-test-app
        image: app-1-k8s:1
        imagePullPolicy: Never
        ports:
        - containerPort: 3010
```

The Deployment keeps the desired number of application pods running:

- `replicas: 2` asks Kubernetes to run two copies of the application.
- `template` describes how each pod should be created.
- The pod label `app: express-test-app` connects the pods to the Service.
- `image: app-1-k8s:1` is the Docker image built for this project.
- `imagePullPolicy: Never` prevents Kubernetes from looking for this image in a
      public registry. The image must already exist inside Minikube.
- `containerPort: 3010` documents the port used by the Express process.

The Deployment creates a ReplicaSet, and the ReplicaSet creates the pods. If a
pod crashes or is deleted, Kubernetes creates a replacement so the desired
replica count remains two. During an update, the Deployment can replace old
pods with new ones while keeping the application available.

### Request flow

When you run `curl "$(minikube service express-test-service --url)"`:

1. Minikube gives you a local URL for the LoadBalancer Service.
2. The Service receives the request on port `6100`.
3. Its selector finds pods labeled `app: express-test-app`.
4. Kubernetes forwards the request to port `3010` on one selected pod.
5. Express handles `/` and returns that pod's hostname as JSON.

Because there are two pods, the hostname can identify which replica handled a
request. The Service balances requests across the available pod endpoints.

### What `kubectl apply` does

```sh
kubectl apply -f K8s/main.yaml
```

This sends the desired Service and Deployment definitions to the Kubernetes API
server. Kubernetes compares the desired state in the file with the current
cluster state and creates or updates resources as needed. `kubectl apply` is
safe to run again after changing the YAML; it reconciles the resources instead
of creating duplicate resources with the same names.

## Prerequisites

Install and make sure these commands are available:

- Docker
- Minikube
- `kubectl`
- A Minikube driver such as Docker, VirtualBox, or another supported VM driver

## Run locally with Node.js

Install dependencies and start the development server:

```sh
npm install
npm run dev
```

The app is then available at <http://localhost:3010>. The `dev` script uses
Nodemon, so it restarts the server when source files change.

## Deploy to Minikube

### 1. Start Minikube

```sh
minikube version
minikube start
kubectl get nodes
```

### 2. Build the image inside Minikube

This project does not publish its image to a registry. Build the image directly
inside Minikube so it is available to the cluster's container runtime:

```sh
minikube image build -t app-1-k8s:1 .
```

Using `minikube image build` also works when Minikube is using `containerd`.
The older `eval "$(minikube docker-env)"` and `docker build` workflow is only
appropriate when Minikube is using Docker as its container runtime.

### 3. Apply the Kubernetes resources

```sh
kubectl apply -f K8s/main.yaml
kubectl get deployments,pods,svc
```

Wait until both replicas are ready:

```sh
kubectl rollout status deployment/express-test-app
```

### 4. Open the service

The simplest Minikube-specific way to open the service is:

```sh
minikube service express-test-service --url
```

Use the returned URL with a browser or `curl`:

```sh
curl "$(minikube service express-test-service --url)"
```

The response resembles:

```json
{"message":"Welcome : express-test-app-... to app-1 "}
```

The hostname changes when a different pod handles the request.

### Optional: Minikube dashboard

```sh
minikube dashboard
```

The dashboard opens a graphical view of the Kubernetes cluster. Select the
`default` namespace, because these resources do not define another namespace.
Use it to compare what Kubernetes should be running with what is actually
running.

#### 1. Check the Deployment

Open **Workloads** and find `express-test-app`:

- **Desired** or **Replicas** should be `2`.
- **Available** and **Ready** should also be `2`.
- A healthy Deployment should show no ongoing rollout or warning status.
- The Deployment's image should be `app-1-k8s:1`.

If desired is `2` but available is `0` or `1`, Kubernetes cannot currently run
all replicas. Open the Deployment details and check its events and pod list.

#### 2. Check the Pods

Open the pods belonging to `express-test-app`. There should be two pods, and
each should show a **Running** status and **Ready** state.

The pod details help explain common failures:

- `Running` and `Ready`: the container started successfully and can receive
      traffic.
- `Pending`: Kubernetes has not been able to start or schedule the pod yet.
- `ErrImageNeverPull` or `ImagePullBackOff`: the image is missing from
      Minikube. Run `minikube image build -t app-1-k8s:1 .` again.
- `CrashLoopBackOff`: the container starts and then exits repeatedly. Open the
      pod logs and check the container events.
- A high **Restart Count** means the container has been restarting.

Open a pod's **Logs** view to see the Express startup message. The **Events**
section is especially useful for image, scheduling, and container errors.

#### 3. Check the Service

Open **Services** and find `express-test-service`:

- **Type** should be `LoadBalancer`.
- The Service port should be `6100`.
- The target port should be `3010`.
- The selector should be `app: express-test-app`.
- The endpoints should contain two pod addresses on port `3010`.

If the Service has no endpoints, its selector is not finding ready pods. Check
that the Service selector and pod label both say `app: express-test-app`. If
the endpoints exist but the URL does not respond, inspect the pod logs and
confirm that Express is listening on port `3010`.

#### 4. Follow a request through the dashboard

Use this order when investigating the application:

1. **Deployment:** are two replicas desired and available?
2. **Pods:** are both pods running and ready?
3. **Service:** does it have two endpoints on port `3010`?
4. **Service URL:** does `curl "$(minikube service express-test-service --url)"`
      return the Express JSON response?

This order moves from workload creation, to container health, to network
routing. It helps identify whether a problem is with the image, the pod, or the
Service instead of treating the dashboard as one large status page.

### Simulate a pod failure and recovery

Kubernetes reacts differently depending on what failed. Make sure the
Deployment is healthy before starting:

```sh
kubectl get pods -l app=express-test-app -w
```

The `-w` option watches the pods and prints changes as they happen. Leave this
command running in one terminal.

#### Delete a pod

This simulates a pod disappearing because of a node problem, manual deletion,
or another infrastructure failure:

```sh
kubectl delete pod -l app=express-test-app --wait=false
```

What to observe:

1. The old pods enter `Terminating`.
2. The Deployment notices that fewer than two replicas are available.
3. The ReplicaSet creates replacement pods.
4. The replacement pods move from `Pending` or `ContainerCreating` to
   `Running` and `Ready`.
5. The Service updates its endpoints and continues sending traffic to ready
   pods.

The pod names change because Kubernetes replaces deleted pods; the Deployment
and Service names stay the same. This is the normal self-healing behavior of a
Deployment.

#### Kill the container process

To test a container crash while keeping the pod object, first get one pod name:

```sh
pod_name="$(kubectl get pod -l app=express-test-app -o jsonpath='{.items[0].metadata.name}')"
kubectl exec "$pod_name" -- kill 1
```

The container's main process is PID 1. Killing it causes the kubelet to restart
the container in the same pod. In the dashboard or with the following command,
you should see the restart count increase:

```sh
kubectl get pods -l app=express-test-app
```

This differs from deleting a pod: the pod name usually remains the same, but
the container restart count increases. If a container repeatedly crashes,
Kubernetes eventually reports `CrashLoopBackOff` and increases the delay
between restart attempts.

#### Watch traffic during recovery

In another terminal, send repeated requests while deleting one pod:

```sh
while true; do
      curl --silent "$(minikube service express-test-service --url)"
      echo
      sleep 1
done
```

Requests should continue to receive responses while at least one ready replica
is available. During recovery, the Service removes terminating or unready pods
from its endpoints and adds replacement pods after they become ready. Press
`Ctrl+C` to stop the loop.

### Optional: Minikube tunnel

The Service is declared as a `LoadBalancer`. If its external IP remains
`<pending>`, run this in another terminal:

```sh
minikube tunnel
```

Then inspect the assigned address with:

```sh
kubectl get svc express-test-service
```

## Useful commands

```sh
# Inspect pods and their labels
kubectl get pods --show-labels

# View application logs from all matching pods
kubectl logs -l app=express-test-app

# Describe a pod or service when diagnosing a problem
kubectl describe deployment express-test-app
kubectl describe svc express-test-service

# Remove the application from the cluster
kubectl delete -f K8s/main.yaml

# Stop or remove the local cluster
minikube stop
minikube delete
```

## Project structure

```text
.
├── index.js          # Express server and / route
├── package.json      # Node.js dependencies and scripts
├── Dockerfile        # Node 16 Alpine image definition
├── K8s/main.yaml     # Service and Deployment resources
└── README.md         # Project documentation
```

## Container details

The Dockerfile uses `node:16-alpine`, installs the dependencies from
`package.json`, copies the application into `/app`, and starts it with
Nodemon. The container listens on port `3010`. Keep `node_modules` out of the
build context with a `.dockerignore` file containing:

```text
node_modules
```


