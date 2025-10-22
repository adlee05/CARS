FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install
RUN apt-get update && apt-get install -y awscli

COPY . .

EXPOSE 3000

# Set environment variables for AWS credentials (Optional: You can do this outside Docker if needed)
# ENV AWS_ACCESS_KEY_ID your-access-key-id
# ENV AWS_SECRET_ACCESS_KEY your-secret-access-key
# ENV AWS_REGION your-region

# Fetch the ONNX model from the S3 bucket during the build or startup
RUN aws s3 cp s3://your-bucket-name/path/to/model.onnx /usr/src/app/model.onnx

# Command to start the Express server
CMD ["npm", "start"]
