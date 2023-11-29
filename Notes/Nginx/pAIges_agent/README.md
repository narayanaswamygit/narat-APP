---
# _pAIges_Agent_
---
### CONFIGURATION

### Install Required Dependencies

    apt-get install python3 python3-pip python3-dev build-essential libssl-dev libffi-dev python3-setuptools -y
    apt-get install python3-venv -y
    pip install wheel
    pip install gunicorn flask

### Install Nginx Web Server

    apt-get install nginx -y
 
### Create a Systemd Service File for Flask Application

    nano /etc/systemd/system/flask.service
  
   ##### Add the following lines:
    
    [Unit]
    Description=Gunicorn instance to serve Flask
    After=network.target
    [Service]
    User=root
    Group=www-data
    WorkingDirectory=/root/project                    
    Environment="PATH=/root/project/venv/bin"         
    ExecStart=/root/project/venv/bin/gunicorn --workers 10 --bind 0.0.0.0:5000 wsgi:app      
    [Install]
    WantedBy=multi-user.target
    
   ##### Edit file:
    
      /root/project = Working directory of where Flask application is running
      Environment   = Working directory of where virtual environment installed (venv)
      --workers     = produce copies of flask 
           wsgi     = flask application file name 
           
   #### Save and close the file then set proper ownership and permission to flask project 
   
    chown -R root:www-data /root/project
    chmod -R 775 /root/project
    
   #### Reload the systemd daemon    
   
    systemctl daemon-reload
    
   #### Start the flask service and Enable it to start at system reboot
   
    systemctl start flask
    systemctl enable flask
    
   #### Verify the status of the flask
    
    systemctl status flask
    
  ### _Configure this Flask Application in nginx config file_
  
  ### For more details visit this site:
  
    
    https://www.rosehosting.com/blog/how-to-deploy-flask-application-with-nginx-and-gunicorn-on-ubuntu-20-04/
           

  
	
	
