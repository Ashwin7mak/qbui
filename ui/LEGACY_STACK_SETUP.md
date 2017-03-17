# Legacy Stack Setup with QBUI

## Knowledge Prerequisites
* QBUI is running on MAC host
* QuickBase sbserver and qbserverdotnet instances up and running on Windows VM

## Setup
    
### Setup QBUI for multi-stack dev work
To make QBUI work in a multienvironment system, we need to disable and/or setup a couple of things.

#### Local.js files
Edit local.js, and uncomment the line for the "noHotLoad" property. And make sure you have the legacyBase setup appropriately.

    //set notHotLoad true to disable hotloading
    noHotLoad : true,
    legacyBase: '.quickbase-dev.com',
    
#### To serve the app:

    node server/src/app.js

#### To run the watcher (for the JS bundles), in a different terminal:

    npm run watch
    
### Networking Setup

#### Get VMWare NAT IP for MAC
Open a terminal in your mac and run

    ifconfig

You should see multiple results, but look for a line starting with `vmnet8`

    vmnet8: flags=8863<UP,BROADCAST,SMART,RUNNING,SIMPLEX,MULTICAST> mtu 1500
    	ether 00:50:56:c0:00:08 
    	inet 192.168.90.1 netmask 0xffffff00 broadcast 192.168.90.255

The IP starting after `inet` is the IP. In my case, it was `192.168.90.1`. Take a note of that IP. It should always end in `.1`
   
#### Static IP for Windows VM
Now we need to set up the Windows VM to have a static IP address. First, make sure your network adapter for Windows is 
using the VMWare NAT. If it is using bridged, set up a second network adapter to use the NAT. 

Open in command prompt in windows and run

    ipconfig

Look for the network adaptor associated with your VMWare adaptor. Mine looked like
    
    Ethernet adapter Local Area Connection:
    
       Connection-specific DNS Suffix  . :
       Link-local IPv6 Address . . . . . : fe80::2059:828:a4a0:72dd%10
       IPv4 Address. . . . . . . . . . . : 192.168.90.101
       Subnet Mask . . . . . . . . . . . : 255.255.255.0
       Default Gateway . . . . . . . . . : 192.168.90.2

Keep the values above open.

Now open the `Control Panel` in Windows. Navigate to `Control Panel\Network and Internet\Network Connections`.

Right-click on the Local Area Connection that matches the VMWare network adaptor.

Click on `Properties`

Click on `Internet Protocol Version 4 (TCP/IPv4)` and then `Properties`

In the window that opens, select `Use the following IP address`. In the input boxes, fill in `Subnet Mask` and `Default Gateway`
with the values listed in the command prompt as the previous values. For `IP Address`, note the IP Address, Default Gatway, and
the IP of your mac all start with the same first 3 octets. In my case `192.168.90`. For the last octet, my Mac has `.1`,
the default gateway had `.2` and my VM IP had `.101`. Choose a value that is higher than your mac and default gateway but lower
than 100. In my case I chose `192.168.90.3`. Enter that as your IP. OK all the windows.

If you disable/enable the network adaptor or restart Windows. You should now have a fixed IP address.

#### Dnsmasq Install

        # Update your homebrew installation
        brew up
        
        # Install Dnsmasq
        brew install dnsmasq

        # Copy the default configuration file:
        mkdir -p /usr/local/etc && cp $(brew list dnsmasq | grep /dnsmasq.conf.example$) /usr/local/etc/dnsmasq.conf

        # Copy the daemon configuration file into place:
        sudo cp $(brew list dnsmasq | grep /homebrew.mxcl.dnsmasq.plist$) /Library/LaunchDaemons/

        # Start Dnsmasq automatically when the OS starts:
        sudo launchctl load /Library/LaunchDaemons/homebrew.mxcl.dnsmasq.plist

##### If you need to uninstall Dnsmasq
Run the following:

        sudo launchctl remove homebrew.mxcl.dnsmasq
        sudo launchctl unload /Library/LaunchDaemons/homebrew.mxcl.dnsmasq.plist

#### Dnsmasq Config Setup
Configure Dnsmasq: The configuration file lives at `/usr/local/etc/dnsmasq.conf` by default, so open this file in your 
favourite editor or just run `sudo nano /usr/local/etc/dnsmasq.conf`. Add the following lines to the top of th conf file.

        address=/ns.quickbase-dev.com/192.168.90.1
        address=/quickbase-dev.com/192.168.90.3
        address=/localhost/127.0.0.1

Replace the IP address with the appropriate ones for your Host and VM. Your host IP should go in with `ns.quickbase-dev.com`
and your Windows VM IP will go under `quickbase-dev.com`.


Now to start/restart Dnsmasq

        sudo launchctl stop homebrew.mxcl.dnsmasq
        sudo launchctl start homebrew.mxcl.dnsmasq
        
At this point Dnsmasq is being used for all DNS requests. We want to configure the Mac OS to just use Dnsmasq for localhost callbacks:

        sudo mkdir -p /etc/resolver
        sudo tee /etc/resolver/quickbase-dev.com >/dev/null <<EOF
        nameserver 127.0.0.1
        EOF

At this point if both QBUI and SBserver are running, on your Host, you should be able to visit both [QBUI](http://www.ns.quickbase-dev.com/qbase/components)
and [Legacy Quickbase](https://www.quickbase-dev.com/db/main?a=signin) using the appropriate domain names.

