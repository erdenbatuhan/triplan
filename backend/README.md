# Triplan - Backend

### Microservices

In order to fully have a running backend, the **Backend Services (NodeJS Express App)** and **Optimization Service (Dockerized Python Application)** projects should be up and running. The **Content Management Systems (CMS)** is currently running on **AWS** to store images (and restore the previously uploaded ones when necessary through our **User Interface**) on **AWS S3**.

- [Backend Services](./services): The actual backend project, running on the port **8008**.
- [Optimization Service](./optimization): The service optimizing the route plan, running on the port **6006**.
- [Content Management System](https://github.com/erdenbatuhan/basic-cms): The content management system for storing BLOB data, running remotely as an **AWS Lambda** function.

