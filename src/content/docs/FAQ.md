# FAQ

## What is GATAS?
GATAS is a conspicuity device for General Aviation. It can send and receive on various protocols like FLARM, ADS-L, OGN and was developed by R. van Twisk.

## What is the standard username and password of the hotspot of GATAS?
**SSID**: `GATAS`  
**Password**: `12345678`  
**IP**: [http://192.168.1.1](http://192.168.1.1)

## What is the IP address of GATAS when connected to my WIFI network or Hotspot?
There are two ways to find out the IP address of GATAS.

- Connect a serial terminal like [https://webserial.io/](https://webserial.io/) The IP address is logged when GATAS starts up.
- When you did setup GATAS Connect with your pincode, the current IP address is shown on the web interface at [https://gatas.vantwisk.nl](https://gatas.vantwisk.nl) after entering your pincode and GATAS has a GPS Fix and you allow your browser to lookup its position. This works best on a mobile phone, however it also worked with my Local Browser on my Computer.

## I have connected to the LED, what does the flash pattern mean?
The LED indicates **two independent states**:

1. **Flash interval** → GPS status  
2. **Number of flashes per interval** → Wi-Fi status  

**Flash Interval (GPS Status)**

- **Flashes every 1 second** → GPS fix obtained
- **Flashes every 3 seconds** → No GPS fix yet (GATAS is still searching for GPS)

**Number of Flashes (Wi-Fi Status)**

- **1 flash** → GATAS is connected to an external Wi-Fi access point or hotspot
- **2 flashes** → GATAS is operating as a Wi-Fi access point
- **3 flashes** → GATAS has no Wi-Fi connection and is actively scanning for networks

**Examples**

- **Two flashes every second** → GPS fix obtained, GATAS is acting as a Wi-Fi access point
- **Three flashes every 3 seconds** → No GPS fix, GATAS is scanning for Wi-Fi networks

## What is DDB, should I enable this in gatas Connect?
DDB is an [online database](https://ddb.glidernet.org) of hexcode to callsign managed by the OGN network. Enabling it will allow GATAS to fetch callsign information for aircraft received over radio protocols where the protocol does not carry any callsign information. This allow you, the user to see the callsign of the aircraft in the EFB.

> [!WARNING]
> **DDB Accuracy**
> The DDB is not always up-to-date and thus not always correct. Leave it off if you only care about if a aircraft is in range, not what the exact registration is.

## After I turn off my mobile hotspot, GATAS does not create its own hotspot. Why?
GATAS always tries to connect to any known or available Wi-Fi network first.
If the current connection drops, it will automatically and seamlessly try other networks from its list. During this process, it will not start its own hotspot.
GATAS will only create its own hotspot if it has never been able to connect to any Wi-Fi network at all. 
This behavior is intentional. It allows time to restore your phone’s hotspot (for example, by connecting a power bank when the phone battery dies). Once your phone is back online, GATAS will automatically reconnect to it.

## My iPhone functions as a hotspot and I want to use another iPad with ForeFlight.
This is unfortunately not possible, iPhone creates a hotspot with network isolation. This means that unfortunately we cannot provide GDL90 data to another device connected to the hotspot. However, if the other software supports Bluetooth BLE, you can use that to provide NMEA data to your EFB, SkyDemon allows you to do this, ForeFlight does not.

## I use a Mobile Router, and my EFB on my IPAD does not receive GDL90 data
The most likely reason is that your EFB is not ForeFlight. if you use EasyVFR or SkyDemon, then these EFB's don't advertise
themselves like ForeFlight would do. That means, with ForeFlight we use the extended GDL90 spec, and we receive the IP of the EFB.
With SkyDemon or EasyVFR you unfortunately need to manually configure the IP of the EFB.
You can do this in the gdlOverUDP module. Simply fill in the IP address if the tablet/phone your RUN the EFB on.
You can configure up to 2 additional EFB's for GDL90 traffic.
In the below example, I also run a EFB on IP 192.168.178.191, and GATAS is more than happy to send GDL90 data to that IP.
![GDL Over UDP Configuration](/images/FAQ/image.png)

## What are the big and small dots I am seeing at some of the protocols?
The big and small dots help me to understand on what frequency GATAS did receive a package for that protocol.
The sending and reception of some radio protocols need to adhere to a specific timings and frequencies, logging and showing this allows us to validate if GATAS is working as expected.
Every big dot is a received package, every small dot means nothing was received yet.
![Big and Small dots](/images/FAQ/image-1.png)
