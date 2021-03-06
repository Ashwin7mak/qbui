#!/bin/sh
# this is a script used by Jenkins in AWS to download the sauce binary from nexus
#set -x #echo on
echo PATH=$PATH

#get sauce-sc

if [ ! -d "SAUCELABS_SC_INSTALL_DIR" ]; then
  echo creating tmp dir  [SAUCELABS_SC_INSTALL_DIR for saucelabs_sc
  mkdir "$SAUCELABS_SC_INSTALL_DIR"
else
  echo $SAUCELABS_SC_INSTALL_DIR already exists
fi

if [ ! -f "$SAUCELABS_SC_INSTALL_DIR/$SAUCELABS_SC_TARBALL" ]; then
  echo fetching saucelabs_sc
  wget -q "--directory-prefix=$SAUCELABS_SC_INSTALL_DIR" "https://nexus1.ci.quickbaserocks.com/nexus/content/repositories/thirdparty/saucelabs_sc/sc/4.3.16/sc-4.3.16-linux.tar.gz"
  ls "$SAUCELABS_SC_INSTALL_DIR"
else
  echo "SauceLabs_sc archive $SAUCELABS_SC_INSTALL_DIR/$SAUCELABS_SC_TARBALL already exists"
fi

if [ ! -d "$SAUCELABS_SC_INSTALLED_DIR" ]; then
 echo unpacking saucelabs_sc
  tar -zxvf  $SAUCELABS_SC_INSTALL_DIR/$SAUCELABS_SC_TARBALL -C $SAUCELABS_SC_INSTALL_DIR
  ls "$SAUCELABS_SC_INSTALL_DIR"
# grunt-sauce-connect-launcher is expecting 4.3.11 but we need 4.3.16 to get through the proxy issues in CI
  ln -sf $SAUCELABS_SC_INSTALL_DIR/sc-4.3.16-linux $SAUCELABS_SC_INSTALL_DIR/sc-4.3.11-linux
else
  echo "Saucelabs_sc install dir $SAUCELABS_SC_INSTALLED_DIR already exists"
fi
