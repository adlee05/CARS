FROM node:18-slim

RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    curl \
    unzip \
    && pip3 install awscli --break-system-packages \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY .env ./

RUN npm ci

COPY src ./src

RUN npm run build

RUN mkdir -p /app/models

ARG S3_BUCKET_NAME
ARG S3_MODEL_PATH
ARG AWS_DEFAULT_REGION=us-east-1

RUN --mount=type=secret,id=aws_access_key_id \
    --mount=type=secret,id=aws_secret_access_key \
    if [ -n "${S3_BUCKET_NAME}" ] && [ -n "${S3_MODEL_PATH}" ]; then \
    export AWS_ACCESS_KEY_ID=$(cat /run/secrets/aws_access_key_id) && \
    export AWS_SECRET_ACCESS_KEY=$(cat /run/secrets/aws_secret_access_key) && \
    export AWS_DEFAULT_REGION=${AWS_DEFAULT_REGION} && \
    echo "Downloading models from s3://${S3_BUCKET_NAME}/${S3_MODEL_PATH}" && \
    aws s3 sync s3://${S3_BUCKET_NAME}/${S3_MODEL_PATH} /app/models/ && \
    echo "Download complete. Files in /app/models:" && \
    ls -lah /app/models/; \
    fi

RUN npm prune --production

EXPOSE 3000

CMD ["node", "dist/index.js"]
