---
# _Nginx_
---

  After creating flask application configure it to nginx conf file. So that flask application is served in nginx web server.
 
### Configure Nginx as a Reverse Proxy for Flask Application

    nano /etc/nginx/sites-enabled/default
  
### Add these lines:

    ##
    # You should look at the following URL's in order to grasp a solid understanding
    # of Nginx configuration files in order to fully unleash the power of Nginx.
    # https://www.nginx.com/resources/wiki/start/
    # https://www.nginx.com/resources/wiki/start/topics/tutorials/config_pitfalls/
    # https://wiki.debian.org/Nginx/DirectoryStructure
    #
    # In most cases, administrators will remove this file from sites-enabled/ and
    # leave it as reference inside of sites-available where it will continue to be
    # updated by the nginx packaging team.
    #
    # This file will automatically load configuration files provided by other
    # applications, such as Drupal or Wordpress. These applications will be made
    # available underneath a path with that package name, such as /drupal8.
    #
    # Please see /usr/share/doc/nginx-doc/examples/ for more detailed examples.
    ##

    # Default server configuration
    #
    server {
            listen 8888 default_server;
            listen [::]:8888 default_server;

            # SSL configuration
            #
            # listen 443 ssl default_server;
            # listen [::]:443 ssl default_server;
            #
            # Note: You should disable gzip for SSL traffic.
            # See: https://bugs.debian.org/773332
            #
            # Read up on ssl_ciphers to ensure a secure configuration.
            # See: https://bugs.debian.org/765782
            #
            # Self signed certs generated by the ssl-cert package
            # Don't use them in a production server!
            #
            # include snippets/snakeoil.conf;

            root /var/www/html;

            # Add index.php to the list if you are using PHP
            index index.html index.htm index.nginx-debian.html;

            server_name www.hhdsoow.com;

            location / {
                    proxy_pass http://127.0.0.1:5000;
                    # Redefine the header fields that NGINX sends to the upstream server
                    proxy_set_header Host \$host;
                    proxy_set_header X-Real-IP \$remote_addr;
                    #proxy_set_header X-Forwarded-For \$remote_addr;
                    # First attempt to serve request as file, then
                    # as directory, then fall back to displaying a 404.
                    try_files $uri $uri/ =404;
            }
            location /document/getResult {
                    proxy_pass http://127.0.0.1:5000; 
                    proxy_set_header Host \$host;
                    proxy_set_header X-Real-IP \$remote_addr;
                    proxy_set_header X-Forwarded-For \proxy_add_x_forwarded_for;

                    proxy_set_header X-Script-Name /document/getResult;
                    client_max_body_size 5M;
            }
            location /ui/upload/invoice {
                    proxy_pass http://127.0.0.1:5000;
                    proxy_set_header Host \$host;
                    proxy_set_header X-Real-IP \$remote_addr;
                    proxy_set_header X-Forwarded-For \proxy_add_x_forwarded_for;

                    proxy_set_header X-Script-Name /document/getResult;
                    client_max_body_size 5M;
            }
            location /document/updateFailed {
                    proxy_pass http://127.0.0.1:5000;
                    proxy_set_header Host \$host;
                    proxy_set_header X-Real-IP \$remote_addr;
                    proxy_set_header X-Forwarded-For \proxy_add_x_forwarded_for;

                    proxy_set_header X-Script-Name /document/getResult;
                    client_max_body_size 5M;
            }
            location /document/updateNew {
                    proxy_pass http://127.0.0.1:5000;
                    proxy_set_header Host \$host;
                    proxy_set_header X-Real-IP \$remote_addr;
                    proxy_set_header X-Forwarded-For \proxy_add_x_forwarded_for;

                    proxy_set_header X-Script-Name /document/getResult;
                    client_max_body_size 5M;
            }
            location /static {
                    alias /var/www/;
                    autoindex on;
            }

            # pass PHP scripts to FastCGI server
            #
            #location ~ \.php$ {
            #       include snippets/fastcgi-php.conf;
            #
            #       # With php-fpm (or other unix sockets):
            #       fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
            #       # With php-cgi (or other tcp sockets):
            #       fastcgi_pass 127.0.0.1:9000;
            #}

            # deny access to .htaccess files, if Apache's document root
            # concurs with nginx's one
            #
            #location ~ /\.ht {
            #       deny all;
            #}
    }


    # Virtual Host configuration for example.com
    #
    # You can move that to a different file under sites-available/ and symlink that
    # to sites-enabled/ to enable it.
    #
    #server {
    #       listen 80;
    #       listen [::]:80;
    #
    #       server_name example.com;
    #
    #       root /var/www/example.com;
    #       index index.html;
    #
    #       location / {
    #               try_files $uri $uri/ =404;
    #       }
    #}
    
### Details 

The nginx serves flask application on this port


 ![image](https://user-images.githubusercontent.com/102030394/184123508-5e469257-de2c-46e1-b800-9bfbde8c2e1a.png)
 
The nginx webserver ( html file location: /var/www/html ) & ( file name: index.nginx-debian.html ) and server name give anything 

 ![image](https://user-images.githubusercontent.com/102030394/184124310-19f37f09-bf99-4ff3-8072-3f552143e378.png)
 
Here specify the flask application port and location paths are where the particular api calls in the flask application

 ![image](https://user-images.githubusercontent.com/102030394/184124972-d9328c2a-7a44-47a0-93d8-7d005f0c6a58.png)


### Save and close the file then verify the Nginx for any syntax error

    nginx -t
    
   ##### You should see the following output
   
      nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
      nginx: configuration file /etc/nginx/nginx.conf test is successful
      

### Restart the Nginx service to apply the changes

    systemctl restart nginx


## Verify the api call through postman with some payload 🕵️‍♂️🕵️‍♂️

   





    
    
