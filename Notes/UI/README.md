---
# _pAIges_UI_
---

# _Mongo, Nodejs & Angular Installation_

### Clone the code for mongo 

    cd /home
    git clone https://github.com/taodevelopment/tapp-devops.git --single-branch mongo -b master
    cd /home/mongo
    sudo sh ./provision.sh
    
   ##### After installation check mongo is running or not
        
         Run mongo
         It should show as PRIMARY in below pic
          
![image](https://user-images.githubusercontent.com/102030394/184146208-00bf406a-4f7b-44e2-91f6-2ceff98037cd.png)

          If not run this again "sudo sh ./provision.sh"
          Run this sudo sh ./provision.sh until it shows mongo db as PRIMARY

## _pm2 Installation with npm_

    npm install pm2 -g
    pm2 --version
 

# _UI Installation_

### Make directory where the code to be installed 

    mkdir /home/pAIges_home/pAIges_UI/swiggy/
    cd /home/pAIges_home/pAIges_UI/swiggy/
    
### Clone the UI code branch into app

    git clone https://github.com/taodevelopment/pAIges_code_db_with_data.git --single-branch app -b pAIges_UI_v2
    
### Go to /home/pAIges_home/pAIges_UI/swiggy/app folder

    Modify port in server.js file 
    Modify the config.js [mongo_host, mongo_db_name, api_host]
    Create a .env file
    
### NPM steps

    cd /home/pAIges_home/pAIges_UI/swiggy/app/client 
    sudo npm install
    cd /home/pAIges_home/pAIges_UI/swiggy/app
    sudo npm install
    
### Mongo db building 

    cd /home/pAIges_home/pAIges_UI/swiggy/app/scripts
    node schema.js
    node mockData.js
    
### pm2 commands

    pm2 ls
    pm2 start server.js 
    pm2 start cronScheduler.js
    pm2 start reviewerDocStatusCronScheduler.js
    
    pm2 monit [for logs]
    
## Check the UI application by hitting ip address with port in chrome ✨✨    
  
  
   
   
