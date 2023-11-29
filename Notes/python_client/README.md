---
# _pAIges_client_
---

## _Installation of Kafka_

    cd /home

    sudo apt update

    sudo apt install -y default-jdk

    wget https://dlcdn.apache.org/kafka/3.1.0/kafka_2.13-3.1.0.tgz

    tar -xvf kafka_2.13-3.1.0.tgz

    cd kafka_2.13-3.1.0/
  
  #### Starting Kafka
  
     cd /home/kafka_2.13-3.1.0

     ./bin/zookeeper-server-stop.sh

     ./bin/kafka-server-stop.sh

     nohup bin/zookeeper-server-start.sh config/zookeeper.properties > server-kafka.log &

     nohup bin/kafka-server-start.sh config/server.properties > broker-kafka.log &


## _Installation of pAIges_client_

### Installing python packages and requirements for pAIges_client
    
    cd /home
    
    sudo apt install -y python3.8
    
#### Installation of pip

    sudo apt-get install -y python3-pip
 
#### Installation of Ghostscript

    sudo apt-get install -y ghostscript
    ghostscript -v  
     
#### Installation of Tesseract   

    sudo apt-get install -y tesseract-ocr
    tesseract -v
    
#### Installation of Virtual environment

    mkdir /home/pAIges_home
    cd /home/pAIges_home
    sudo apt install -y virtualenv
    virtualenv -p python3.8 venv
    
#### Activate Virtual Environment

    source venv/bin/activate
    
#### Clone the pAIges_client code 

    mkdir /home/pAIges_home/pAIges_client/test/
    
    cd /home/pAIges_home/pAIges_client/test/
    
    git clone https://github.com/taodevelopment/pAIges_Client.git --single-branch src -b client_demo
    
    cd /home/pAIges_home/pAIges_client/test/src
    
#### Installation of Dependant Packages
  
    cat requirements.txt | xargs -n 1 pip install
    
#### Installing Levenshtein for fuzzyway

    apt-get install yum
    
    sudo apt-get install -y python3 python-dev python3-dev \
    build-essential libssl-dev libffi-dev \
    libxml2-dev libxslt1-dev zlib1g-dev \
    python3-pip 
    
    sudo apt-get install -y python3.8-dev
    
#### Installing the Levenshtein
    
    pip install python-Levenshtein
    
#### Installing Poppler

    sudo apt-get install -y python3-poppler
    sudo apt-get install -y poppler-utils
    
#### install pyzbar

    pip install pyzbar
    sudo apt-get install -y zbar-tools
    
#### Other dependencies

    pip install polling
    
    pip install typing-extensions --upgrade
    
    sudo apt-get install -y python3-tk
    
    pip install python-magic
    
    pip install xlrd
    
    pip install openpyxl
    
    pip install xlrd-2.0.1
    
    pip install et-xmlfile-1.1.0
    
    pip install openpyxl-3.0.10
    
    pip install tifftools
    
    pip install -U pypdf2
    
    pip install python-dotenv
    
    

### _⚓Add the env file in the code and modify the key_value pairs⚓_



### _Start preprocess, postprocess flask services & kafka services_     
    
    Virtual environment should be enabled to run python services
    
    cd /home/pAIges_home
    
    source venv/bin/activate
    
   #### Kafka services
    
    cd /home/pAIges_home/pAIges_client/swiggy/src
    
    pkill python 
    
    python kafka_consumer_read_all.py
    
    pkill python
    
    python start_kafka_consumer.py
    
    
### _Upload an invoice in UI application and check the status_ ✨✨


    
    
    
    
    
