FROM python:3.7-slim-stretch

RUN apt-get update -y
RUN apt-get install -y python3
RUN apt-get install -y python3-pip
RUN apt-get install ffmpeg libsm6 libxext6  -y
RUN pip3 install --no-cache-dir --upgrade pip

WORKDIR /code

RUN apt update

RUN apt install -y wget
RUN apt install -y tar
RUN apt install -y curl
RUN apt install -y coreutils
RUN apt install -y bash-completion

ENV PATH=$PATH:/opt/java/jdk-15.0.2/bin

WORKDIR /opt/java

RUN curl https://download.java.net/java/GA/jdk15.0.2/0d1cfde4252546c6931946de8db48ee2/7/GPL/openjdk-15.0.2_linux-x64_bin.tar.gz -o openjdk-15.0.2_linux-x64_bin.tar.gz

RUN tar -xzf openjdk-15.0.2_linux-x64_bin.tar.gz && \
    rm -rf openjdk-15.0.2_linux-x64_bin.tar.gz



WORKDIR /code

RUN wget https://dlcdn.apache.org/kafka/3.1.0/kafka_2.13-3.1.0.tgz
RUN tar -xvf kafka_2.13-3.1.0.tgz

WORKDIR kafka_2.13-3.1.0/bin

RUN chmod 777 *

RUN bash zookeeper-server-stop.sh
RUN bash zookeeper-server-start.sh 
RUN bash kafka-server-stop.sh
RUN bash kafka-server-start.sh

#Expose ports
ENV LISTEN_PORT=9100
EXPOSE 9100
