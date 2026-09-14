# Counter frontend

This folder contains two browser UIs for the local dApps. `Counter.html` is the Counter page and `bank.html` is the Bank page. Both load ethers.js 6 from a browser CDN and connect to Anvil at `http://127.0.0.1:8545`.

## Quick start

From the project root, start Anvil in one terminal:

```bash
anvil
```

Anvil prints funded development accounts and private keys. In another terminal, set the values used by the deployment commands:

```bash
export RPC_URL="http://127.0.0.1:8545"
export ANVIL_PRIVATE_KEY="0xPASTE_ANVIL_PRIVATE_KEY_HERE"
export ANVIL_ACCOUNT="$(cast wallet address --private-key "$ANVIL_PRIVATE_KEY")"
```

The account address is public; the private key is used only to sign local deployment transactions. Use only the disposable keys printed by Anvil.

Deploy the contract:

```bash
forge script script/Counter.s.sol:CounterScript \
  --rpc-url "$RPC_URL" \
  --private-key "$ANVIL_PRIVATE_KEY" \
  --broadcast
```

Copy the `Contract Address` from the output and set that address as `CONTRACT_ADDRESS` in `Counter.html`. Verify the deployment:

```bash
export COUNTER_ADDRESS="0xPASTE_DEPLOYED_CONTRACT_ADDRESS_HERE"
cast call "$COUNTER_ADDRESS" "number()(uint256)" --rpc-url "$RPC_URL"
```

Serve this folder over HTTP:

```bash
python3 -m http.server 8080 --directory frontend
```

Then open [http://127.0.0.1:8080](http://127.0.0.1:8080).

The counter page is [http://127.0.0.1:8080/Counter.html](http://127.0.0.1:8080/Counter.html).

## MetaMask setup

Add a custom network in MetaMask with:

- Network name: `Anvil Local`
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`
- Currency symbol: `ETH`

Import the same Anvil account whose private key was used for deployment. Select `Anvil Local`, return to the page, and click **Connect Wallet**. Never use a real account private key here.

## Features

- **Counter:** reads `number()` from the deployed contract.
- **Increment:** asks MetaMask to sign `increment()` and waits for Anvil to mine it.
- **All blocks:** lists every block from `0` through the current latest block.
- **Block lookup:** finds a block by number and shows its hash, parent hash, timestamp, and transaction count.

## Bank page

Deploy the bank contract from the project root:

```bash
forge script script/Bank.s.sol:BankScript \
  --rpc-url "$RPC_URL" \
  --private-key "$ANVIL_PRIVATE_KEY" \
  --broadcast
```

Copy the new `Contract Address` from the output and replace `BANK_ADDRESS` in `bank.html`:

```js
const BANK_ADDRESS = "0xPASTE_DEPLOYED_BANK_ADDRESS_HERE";
```

Open [http://127.0.0.1:8080/bank.html](http://127.0.0.1:8080/bank.html), connect MetaMask, then enter an amount in ETH and choose **Deposit** or **Withdraw**. The bank balance belongs to the connected wallet. A withdrawal cannot exceed the amount that wallet previously deposited.

If either page cannot connect, confirm that Anvil is running and that MetaMask is using chain ID `31337`. If a contract is redeployed, update its address in the matching HTML file and reload the page.