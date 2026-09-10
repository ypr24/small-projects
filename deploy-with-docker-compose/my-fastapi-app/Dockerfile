# Use the official Python image based on Alpine as the base image
FROM python:3.9-alpine

# Set environment variables for proxy
# ENV HTTP_PROXY=http://192.168.49.1:8282
# ENV HTTPS_PROXY=http://192.168.49.1:8282

# Install dependencies for building Python packages
# RUN apk add --no-cache \
#     gcc \
#     musl-dev \
#     linux-headers

# Set the working directory
WORKDIR /app

# Copy the requirements file and install the dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8000

# Command to run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
