#!/bin/sh
# this is a script used by Jenkins to prepare the environment for building and testing the ui
set -x #echo on   
echo PATH=$PATH
echo JRUBY_JAR=$JRUBY_JAR
echo GEM_PATH=$GEM_PATH
if [ ! -d "$JRUBY_TMP" ]; then
  echo creating tmp dir  [$JRUBY_TMP for ruby
  mkdir "$JRUBY_TMP"
else
  echo $JRUBY_TMP already exists
fi

if [ ! -f "$JRUBY_TMP/$JRUBY_TARBALL" ]; then
  echo fetching ruby
  wget -q "--directory-prefix=$JRUBY_TMP" "http://pppdc9prd0t4.corp.intuit.net:8081/nexus/service/local/repositories/phoenix/content/jruby/jruby-bin/1.7.16.tar/jruby-bin-1.7.16.tar.gz"
  ls "$JRUBY_TMP"
else
  echo "JRuby archive $JRUBY_TMP/$JRUBY_TARBALL already exists"
fi

if [ ! -d "$JRUBY_INSTALL_DIR" ]; then
 echo unpacking jruby
  tar -xf  $JRUBY_TMP/$JRUBY_TARBALL -C $TOOLS_DIR
  ls "$TOOLS_DIR"
  $JRUBY_INSTALL_DIR/bin/jruby -S gem install compass
else
  echo "Ruby install dir $JRUBY_INSTALL_DIR already exists"
fi

echo Ruby version:
echo "Running Ruby version:"
jruby -v


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

