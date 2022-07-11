# This is a base image for any OIC nodeJS based micro-service. This base image will be built and tagged
# as oicanodejs:<version>. Other microservices will have a simpler Dockerfile with app specific settings.
#
FROM odo-docker-signed-local.artifactory.oci.oraclecorp.com/oci-oel7x-base:1.0.294
MAINTAINER Horst Heistermann (horst.heistermann@oracle.com) / David Keyes (david.keyes@oracle.com)

# Proxy information
ENV TZ="America/Los_Angeles"

# Install nodeJS, assumes that the build script downloads the NodeJS beforehand
RUN mkdir -p /app

COPY start-dev-server.sh /start-dev-server.sh
COPY http-server /app/http-server

# clean out the node_modules that might have been created on local laptops
RUN  rm -rf /app/http-server/node_modules

# do not use proxy for yum (this works for my hosted box) but we may need this for a local laptop build
# RUN echo proxy="http://www-proxy-hqdc.us.oracle.com:80" >> /etc/yum.conf

# Install various tools
RUN echo 'sslverify=0' >> /etc/yum.conf
RUN yum install -y bash procps vim nmap-ncat net-tools && \
    yum clean all && \
    rm -rf /var/cache/yum

#copy the production webpack build to the http server dist directory
#COPY build /app/http-server/dist
COPY web /app/http-server/dist

# add some static files for the health checks to query
RUN mkdir /app/http-server/dist/health/  && \
    echo '{"status": "alive"}' >> /app/http-server/dist/health/liveness && \
    echo '{"status": "ready"}' >> /app/http-server/dist/health/readiness

# this should be mounted as a volume in the helm chart pointing to a folder on the OS
ENV OIC_JVM_LOGS=/hdfs-data/log/oic
RUN mkdir -p $OIC_JVM_LOGS

# install node version manager to handle the install of node and npm
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash

# install yarn, and then use yarn to install the http server modules
RUN NVM_DIR=$HOME/.nvm && \
    source $NVM_DIR/nvm.sh && \
    nvm install 12.22 && \
    npm set registry 'https://artifactory.oci.oraclecorp.com/api/npm/global-dev-npm' && \
    npm install --global yarn && \
    cd /app/http-server && \
    yarn install

# Start the Microservice
ENTRYPOINT ["/start-dev-server.sh"]

ONBUILD CMD []
