FROM node:14.17.1
RUN npm install @angular/cli@12.1.0
COPY . /usr/src/
WORKDIR /usr/src
# Set the entrypoint to your custom script
ENTRYPOINT ["/usr/src/entrypoint.sh"]
