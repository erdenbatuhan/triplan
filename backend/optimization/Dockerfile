# Start by pulling the python image
FROM python:3.8-slim-buster

# Copy the requirements file into the image
COPY ./requirements.txt /app/requirements.txt

# Change the working directory
WORKDIR /app

# Install the dependencies and packages in the requirements file
RUN pip install -r requirements.txt

# Copy every content from the local file to the image
COPY . .

# Configure the container to run in an executed manner
ENTRYPOINT [ "python" ]

# Run the app (The port is in constants.json)
EXPOSE 6006
CMD [ "app.py" ]
