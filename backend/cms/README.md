# Triplan - Backend (Content Management System)

### Local Setup

1) Install the **Serverless CLI** via **NPM**:

```bash
npm install -g serverless
```

2) Create an **IAM** user in your **AWS** account **with an access key** and **the policy, AdministratorAccess**. After creating the **IAM** user, create the following files with the **access key**:

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

### Local Invocation

Invoke the lambda functions locally:

```bash
sls invoke local --aws-profile triplan-cms-aws-user -f upload -p events/upload_image.json
sls invoke local --aws-profile triplan-cms-aws-user -f find -p events/find_images.json
```

### Deployment

Before your first deployment, you must create the following buckets on **AWS S3**:

- **triplan-cms-deployment-bucket**
- **triplan-cms-bucket**

Deploy the app to **AWS** via the **Serverless** framework:

```bash
sls deploy --aws-profile triplan-cms-aws-user
```

