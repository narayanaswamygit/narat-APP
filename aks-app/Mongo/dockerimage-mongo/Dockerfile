FROM mongo
RUN mkdir -p /dbdata
RUN mkdir -p /dbdata/logs
# Give MongoDB permissions to write to the custom data path
RUN chown -R mongodb:mongodb /dbdata
RUN chown -R mongodb:mongodb /dbdata/logs
RUN rm /etc/mongod.conf.orig
ADD mongod.conf.orig /etc/
WORKDIR /
COPY initiateReplSet.js ./docker-entrypoint-initdb.d/
COPY mongo-init.js ./docker-entrypoint-initdb.d/
CMD ["-replSet", "rs0"]


EXPOSE 9008

