FROM python:3.7-slim-stretch

RUN apt-get update -y
RUN apt-get install -y python3
RUN apt-get install -y python3-pip
RUN apt-get install ffmpeg libsm6 libxext6  -y
RUN pip3 install --no-cache-dir --upgrade pip

# set the working directory in the container
WORKDIR /code

# copy the dependencies file to the working directory
COPY requirements.txt .


RUN apt-get install -y poppler-utils

RUN pip install pyzbar

RUN apt-get install -y zbar-tools

RUN pip install polling

RUN pip install --upgrade pip

RUN pip install -U PyMuPDF 

RUN pip install ghostscript

RUN pip install typing-extensions --upgrade

RUN pip install wheel

RUN pip install gunicorn flask


RUN pip install azure-cognitiveservices-vision-computervision

RUN apt-get install -y python-tk python3-tk tk-dev

RUN pip install tifftools

RUN pip install -U pypdf2

RUN pip install python-magic



# install dependencies
RUN pip install -r requirements.txt
# RUN python3 -m spacy download en_core_web_sm
RUN pip install python-Levenshtein



#Expose ports
ENV LISTEN_PORT=4444
EXPOSE 4444

# copy the content of the local src directory to the working directory
COPY src/ .


# command to run on container start
CMD [ "python", "./postExtraction_service_flask.py" ]
