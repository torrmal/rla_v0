#!/bin/bash

# IP or URL of the server you want to deploy to


# Uncomment this if your host is an EC2 instance
# EC2_PEM_FILE=path/to/your/file.pem

# You usually don't need to change anything below this line
APP_HOST=54.187.11.61
APP_NAME=meteorapp
ROOT_URL=http://$APP_HOST
PORT=80
APP_DIR=/var/www/$APP_NAME
MONGO_URL=mongodb://localhost:27017/$APP_NAME

EC2_PEM_FILE=ops-works.pem
STATIC_FILES_PATH=/var/rlafiles
METEOR_CMD=meteor


chmod 700 $EC2_PEM_FILE

if [ -z "$EC2_PEM_FILE" ]; then
    SSH_HOST="ubuntu@$APP_HOST" SSH_OPT=""
  else
    SSH_HOST="ubuntu@$APP_HOST" SSH_OPT="-i $EC2_PEM_FILE"
fi




case "$1" in
setup )
echo Preparing the server...
echo Get some coffee, this will take a while.
ssh $SSH_OPT $SSH_HOST DEBIAN_FRONTEND=noninteractive 'sudo su -'  <<'ENDSSH'
apt-get update
apt-get install -y python-software-properties
add-apt-repository ppa:chris-lea/node.js
apt-get update
apt-get install -y build-essential nodejs mongodb
npm update
npm install -g forever
npm install -g MD5
npm install -g mime
npm install -g decompress-zip
npm install -g underscore
npm install -g fibers
npm install source-map-support
npm install semver
ENDSSH
echo Done. You can now deploy your app.
;;
deploy )
echo Deploying...
$METEOR_CMD  build /tmp/bundle  --server=$ROOT_URL
scp $SSH_OPT /tmp/bundle/*gz $SSH_HOST:/tmp/bundle.tgz

rm -rf /tmp/bundle
ssh $SSH_OPT $SSH_HOST PORT=$PORT MONGO_URL=$MONGO_URL ROOT_URL=$ROOT_URL APP_DIR=$APP_DIR 'sudo su -'  <<'ENDSSH'
APP_HOST=54.187.11.61
APP_NAME=meteorapp
ROOT_URL=http://$APP_HOST
PORT=80
APP_DIR=/var/www/$APP_NAME
MONGO_URL=mongodb://localhost:27017/$APP_NAME

EC2_PEM_FILE=ops-works.pem
STATIC_FILES_PATH=/var/rlafiles
METEOR_CMD=meteor

rm -rf $APP_DIR
if [ ! -d "$APP_DIR" ]; then
mkdir -p $APP_DIR
chown -R www-data:www-data $APP_DIR
fi
export APP_HOST=$APP_HOST
export APP_NAME=$APP_NAME
export ROOT_URL=$ROOT_URL
export PORT=$PORT
export APP_DIR=$APP_DIR
export MONGO_URL=$MONGO_URL

pushd $APP_DIR
forever stop bundle/main.js
rm -rf bundle
tar xfz /tmp/bundle.tgz -C $APP_DIR

pushd bundle/programs/server
npm install
pushd $APP_DIR
chown -R www-data:www-data bundle
pushd bundle
forever start main.js

mkdir $STATIC_FILES_PATH
chown -R www-data:www-data $STATIC_FILES_PATH
chmod -R 777 /tmp
rm /tmp/bundle.tgz

ENDSSH
echo Your app is deployed and serving on: $ROOT_URL
;;
* )
cat <<'ENDCAT'
./meteor.sh [action]

Available actions:

  setup   - Install a meteor environment on a fresh Ubuntu server
  deploy  - Deploy the app to the server
ENDCAT
;;
esac
