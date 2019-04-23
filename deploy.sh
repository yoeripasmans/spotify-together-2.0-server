#!/bin/bash
PROJECT=spotify-together-api

TEST_PORT=2028

#Don't touch this
ENV=$1

if [ -z "$PROD_USER" ]; then
   PROD_USER=
fi

if [ -z "$ACC_USER" ]; then
   ACC_USER=
fi

if [ -z "$TEST_HOST" ]; then
   TEST_HOST=peggy.label-a.nl
fi

if [ -z "$TEST_USER" ]; then
   TEST_USER=monty
fi

if [ -z "$ROOT_USER" ]; then
   ROOT_USER=labela
fi

if [ -z "$ACC_PORT" ]; then
   ACC_PORT=
fi

if [ -z "$PROD_PORT" ]; then
   PROD_PORT=
fi

if [ -z "$PM2_CONFIG_NAME" ]; then
   PM2_CONFIG_NAME=pm2-server.json
fi

#Environment switch
if [ "$1" = PROD ]; then
   APP_ENV=production
   export PORT=$PROD_PORT
   USER=$PROD_USER
   HOST=$PROD_HOST
   INSTANCES=1
elif [ "$1" = ACC ]; then
   APP_ENV=acceptation
   export PORT=$ACC_PORT
   USER=$ACC_USER
   HOST=$ACC_HOST
   INSTANCES=1
elif [ "$1" = TEST ]; then
   APP_ENV=test
   export PORT=$TEST_PORT
   USER=$TEST_USER
   HOST=$TEST_HOST
   INSTANCES=1
fi

PDIR=/home/$USER/www/$PROJECT
FILENAME=build.tar.gz
c='\033[1m'
nc='\033[0m'
red='\033[1;31m'

#Checks if correct arguments are given
if [ "$1" != ACC ] && [ "$1" != PROD ] && [ "$1" != TEST ]
then
   echo -e ":no_entry_sign: $c Missing environment: PROD, ACC or TEST $nc"
   exit
else
   echo -e ":rocket: $c Deploying $PROJECT for $1 $nc"
fi

git fetch --tags
BUMP=false
VERSION=$(git describe --abbrev=0 --tags)

if [ "$2" = "1" ]; then
   BUMP=major;
elif [ "$2" = "2" ]; then
   BUMP=minor;
elif [ "$2" = "3" ]; then
   BUMP=patch;
elif [ "$2" = "4" ]; then
   BUMP=false;
else
   echo "Current version is: $VERSION - Do you want to update?"
   options=("Major" "Minor" "Patch" "Continue")
   select opt in "${options[@]}"
   do
       case $opt in
           "Major") BUMP=major; break;;
           "Minor" ) BUMP=minor; break;;
           "Patch" ) BUMP=patch; break;;
           * ) break;;
       esac
   done
fi

if [ "$BUMP" != false ]; then
   #Checks if there are no changes when you want to create a tag
   HAS_CHANGES=false
   git diff-index --quiet HEAD -- || HAS_CHANGES=true;

   if [ "$HAS_CHANGES" = true ]; then
       echo "Commit your changes first";
       exit;
   fi
   npm version $BUMP;
   echo -e ":gem: $c Updated version $nc"
   git push --tags
fi

VERSION=$(git describe --abbrev=0 --tags)

#Creating project build
echo -e ":hammer_and_wrench: $c Creating project build $nc"
APP_ENV=$APP_ENV npm run build

#Create PM2 config file
echo -e ":zap: $c Generating PM2 server file $nc"
sed "s/USER/$USER/g; s/PROJECT/$PROJECT/g; s/INSTANCES/$INSTANCES/g" ./pm2-template-server.json > $PM2_CONFIG_NAME

#Build tar and copy to server
echo -e ":truck: $c Copying files to server $nc"
tar -czf $FILENAME ./dist ./package.json ./package-lock.json ./tsconfig-paths-bootstrap.js ./tsconfig.json ./$PM2_CONFIG_NAME
scp -r ./$FILENAME $ROOT_USER@$HOST:~
rm ./$FILENAME
rm ./$PM2_CONFIG_NAME

echo -e ":key: $c Connecting to $HOST $nc"
#Set-up new files, install packages and run server
ssh $ROOT_USER@$HOST << EOF
   echo -e ":dog: $c Initializing server $nc"
   if [ "$1" = TEST ]; then
       sudo rm -rf $PDIR*
   fi
   sudo mkdir -p $PDIR-$VERSION;
   sudo chown $USER:$USER $PDIR-$VERSION;
   sudo chown $USER:$USER /home/$USER/www;
   sudo mv /home/$ROOT_USER/$FILENAME $PDIR-$VERSION;
   sudo su - $USER;
   echo -e ":eyes: $c Extracting files $nc"
   tar -zxvf $PDIR-$VERSION/$FILENAME -C $PDIR-$VERSION;
   rm $PDIR-$VERSION/$FILENAME;
   ln -n -f -s $PDIR-$VERSION $PDIR;
   echo -e ":zap: $c Installing packages $nc"
   npm install --production --prefix $PDIR-$VERSION;
   mv $PDIR-$VERSION/$PM2_CONFIG_NAME /home/$USER/www/
   echo -e ":house_with_garden: $c Starting server $nc"
   NODE_ENV=production PORT=$PORT pm2 start $PDIR-$VERSION/$PM2_CONFIG_NAME;
EOF

if [ $? -eq 0 ]; then
   echo -e ":the_horns: $c Successfully deployed $PROJECT $VERSION on $HOST $nc"
else
echo -e ":x: $red Deploy failed for $PROJECT $VERSION on $HOST $nc"
fi
