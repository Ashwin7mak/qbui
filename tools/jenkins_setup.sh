#!/bin/sh
# this is a script used by Jenkins to prepare the environment for building and testing the ui
#set -x #echo on
echo PATH=$PATH

#get phantomjs install

echo PHANTOMJS_TAR=$PHANTOMJS_TAR
if [ ! -d "$PHANTOMJS_TMP" ]; then
  echo creating tmp dir  [$PHANTOMJS_TMP for phantomjs
  mkdir "$PHANTOMJS_TMP"
else
  echo $PHANTOMJS_TMP already exists
fi

if [ ! -f "$PHANTOMJS_TMP/$PHANTOMJS_TARBALL" ]; then
  echo fetching phantomjs
  wget -q "--directory-prefix=$PHANTOMJS_TMP" "http://pppdc9prd0t4.corp.intuit.net:8081/nexus/service/local/repositories/phoenix/content/phantomjs/phantomjs/1.9.8-linux/phantomjs-1.9.8-linux-x86_64.tar.bz2"
  ls "$PHANTOMJS_TMP"
else
  echo "Phantomjs archive $PHANTOMJS_TMP/$PHANTOMJS_TARBALL already exists"
fi


if [ ! -d "$PHANTOMJS_INSTALL_DIR" ]; then
 echo unpacking jphantomjs
  tar -xf  $PHANTOMJS_TMP/$PHANTOMJS_TARBALL -C $TOOLS_DIR
  ls "$TOOLS_DIR"
else
  echo "Phantomjs install dir $PHANTOMJS_INSTALL_DIR already exists"
fi


echo Phantomjs version:
echo "Running Phantomjs version:"
phantomjs -v


echo copy phantomjs to node_module
cp $PHANTOMJS_INSTALL_DIR/bin/phantomjs $PHANTOMJS_NODEMODULE
ls -l "$PHANTOMJS_NODEMODULE"

#echo back the list of installed gems (compass 1.0.1 needs to be installed)
echo "List of installed gems:"
gem list

