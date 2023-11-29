FROM python:3.7-slim-stretch

#FROM python:3.7-bullseye


#RUN apt-get update -y
#RUN apt-get install -y python3
#RUN apt-get install -y python3-pip
#ENV DEBIAN_FRONTEND=nonintercative
#RUN apt-get install ffmpeg libsm6 libxext6  -y
RUN pip3 install --no-cache-dir --upgrade pip

# set the working directory in the container
WORKDIR /code

# copy the dependencies file to the working directory
COPY requirements.txt .

# install dependencies
RUN pip install -r requirements.txt

RUN pip install wheel

RUN pip install gunicorn flask

#RUN pip install pdf2image

#RUN pip install image

#Expose ports
ENV LISTEN_PORT=8787
EXPOSE 8787

# copy the content of the local src directory to the working directory
COPY src/ .


# command to run on container start
CMD [ "python3", "./pAIges_Agent.py" ]
