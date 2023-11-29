---
# _Configure Nginx to serve Multiple Websites on a Single Server_
---

### Create Directory Structure

    mkdir /var/www/html/preproc
    mkdir /var/www/html/postproc
  
   #### Create an index.htmlfile
   
     nano /var/www/html/preproc/index.preproc.html
     nano /var/www/html/preproc/index.postproc.html
     
   #### Replace the following html markup which will be served when you connect to the site

     Replace the statements "Welcome to Nginx" with "Welcome to Preprocessor!"
     Replace the statements "Welcome to Nginx" with "Welcome to Postprocessor!"
     
#### Save and close the file. Then, change the ownership of both website directories to www-data  

    chown -R www-data:www-data /var/www/html/preproc
    chown -R www-data:www-data /var/www/html/postproc
    
### Create a virtual host configuration file and add the preprocess and postprocess configuration files data

    nano /etc/nginx/sites-available/preproc
    nano /etc/nginx/sites-available/postproc
   
### Create a soft link files in sites-enabled

    ln -s /etc/nginx/sites-available/preproc /etc/nginx/sites-enabled/
    ln -s /etc/nginx/sites-available/postproc /etc/nginx/sites-enabled/
    
### Verify the Nginx for any syntax error

    nginx -t
    
   ##### You should see the following output
   
      nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
      nginx: configuration file /etc/nginx/nginx.conf test is successful
      

### Restart the Nginx service to apply the changes

    systemctl restart nginx
    
## Verify the api call through postman with some payload 🕵️‍♂️🕵️‍♂️



    
