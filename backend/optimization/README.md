# Triplan - Backend (Optimization)

### Local Setup & Invocation

Make sure that you have [docker](https://docs.docker.com/get-docker/) installed!

Build and run the [docker](https://docs.docker.com/get-docker/) container (The port is in *constants.json*):

```bash
docker build -t triplan-optimization:latest .
docker run -p 6006:6006 -d triplan-optimization:latest
```

Invoke the endpoint (*POST*) with the request body *events/partner_locations.json*:

```bash
http://127.0.0.1:6006
```

### Deployment

1) Install the **Serverless CLI** via **NPM**:

```bash
npm install -g serverless
```

3) Create an **IAM** user in your **AWS** account **with an access key** and **the policy, AdministratorAccess**. After creating the **IAM** user, create the following files with the **access key**:

- **~/.aws/credentials**
```bash
[triplan-cms-aws-user]
aws_access_key_id=YOUR_AWS_ACCESS_KEY_ID
aws_secret_access_key=YOUR_AWS_SECRET_ACCESS_KEY
```

- **~/.aws/config**
```bash
[profile triplan-cms-aws-user]
region=eu-central-1
```

Before your first deployment, you must create the following buckets on **AWS S3**:

- **triplan-optimization-deployment-bucket**

Deploy the app to **AWS** via the **Serverless** framework:

```bash
sls deploy --aws-profile triplan-cms-aws-user
```

