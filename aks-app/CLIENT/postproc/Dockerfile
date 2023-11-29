#FROM python:3.7-slim-stretch
FROM python:3.10 as builder

# set the working directory in the container
WORKDIR /app

# copy the dependencies file to the working directory
COPY pyproject.toml poetry.lock  /app/

# install dependencies
RUN pip install poetry

RUN poetry config virtualenvs.create false
RUN poetry install --no-interaction --no-ansi

# Stage 2: Runtime environment
FROM python:3.10-slim-buster

RUN apt-get update -y

RUN apt-get install ffmpeg libsm6 libxext6  -y
RUN apt-get install -y gcc g++
RUN apt-get install -y libzbar0
RUN apt-get install -y ghostscript

RUN pip install --upgrade pip

# Set the working directory
WORKDIR /app

# Copy only the required files from the build stage
COPY --from=builder /usr/local/lib/python3.10/site-packages /usr/local/lib/python3.10/site-packages
COPY --from=builder /app /app

#Expose ports
ENV LISTEN_PORT=4444
EXPOSE 4444

# copy the content of the local src directory to the working directory
COPY . .

# command to run on container start
CMD ["python", "./postExtraction_service_flask.py"]
