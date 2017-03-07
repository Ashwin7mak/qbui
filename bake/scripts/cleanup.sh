#!/bin/bash -xe
set -o pipefail

#######################################################################
# Remove instance-specific files to prepare for templating.
# Remember that this is used for both AWS and VirtualBox/Vagrant
# so don't rely on cloud-init to clean things up (e.g. SSH host keys)
# because that doesn't run in VirtualBox/Vagrant
#######################################################################

# Clean up /tmp
rm -rf /tmp/*

# Clean up cloud-init
rm -rf /var/lib/cloud/*

# Clean up /var/log
# Use the 'install' command to guarantee (in one command line):
# 1) a new inode (as some of these files are still in use and you'll
#    otherwise leak shutdown information into the template)
# 2) the right owner and permissions on the new, empty file
# The "-b" is crucial for getting a new inode (which is why we
# remove /var/log/*~ afterwards)
install -b -m 600 /dev/null /var/log/cron
install -b -m 600 /dev/null /var/log/dmesg
install -b -m 644 /dev/null /var/log/lastlog
install -b -m 600 /dev/null /var/log/maillog
install -b -m 644 /dev/null /var/log/mcelog
install -b -m 600 /dev/null /var/log/messages
install -b -m 600 /dev/null /var/log/secure
install -b -m 664 -g utmp /dev/null /var/log/wtmp
rm -f /var/log/*.old /var/log/*.log /var/log/*~ /var/log/audit/audit.log /var/log/datadog/*.log /var/log/tuned/tuned.log
rm -rf /var/log/anaconda

# Clean up ssh host keys
rm -rf /etc/ssh/ssh_host*_key*

# Clear out machine ID
rm -f /etc/machine-id

# Clear out hostname
hostnamectl set-hostname ""

