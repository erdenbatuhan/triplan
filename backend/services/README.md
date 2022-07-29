# Triplan - Backend (Services)

### Local Setup

1) Install the dependencies:

```bash
npm i
```

2) Get the application properties file from [here](https://drive.google.com/file/d/1n1vtqwHx_w7fkoQ91jhU3dYdqzsw8ypD/view) and place it in this directory (**./backend/services**).

3) In order for the security side of our application to work, you need to create a new file called **.env** under this directory (**./backend/services**), which stores the **JWT TOKEN**. The content of the file should look like this:

```bash
JWT_SECRET=auth
```

4) Run the app and then test the HelloWorld endpoint by going to [this](http://localhost:8008/hello-world) URL.

```bash
npm start
```

