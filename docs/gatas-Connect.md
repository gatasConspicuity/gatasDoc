# What is GA/TAS Connect?

!!! Disclaimer
      **Use at Your Own Risk**      
      GA/TAS is provided "as is," without any warranties.  
      By downloading or using this device, you acknowledge that you do so at your own risk.  
      The creators are not liable for any damages or issues resulting from its use.  
      GA/TAS is intended for General Aviation only and should not be relied upon as the sole source of traffic or navigation information.  
      Users are responsible for ensuring compliance with local aviation regulations.


GA/TAS Connect is an online service that delivers additional ADS-B Out and MLAT traffic to your GA/TAS device and, in turn, to your EFB.
Internally, it uses a compact binary protocol designed for reliability and minimal data usage, making it suitable for limited or unstable bandwidth environments.

The service also allows you to select the aircraft you are flying via a simple web interface. This avoids the need for complex onboard user interfaces to change configuration. 
Aircraft can be pre-configured at home, so in the cockpit you only power up and fly — with minimal interaction and minimal friction.
This service is free for you to use.

<div class="grid cards" markdown>
 - ![Additional ADSB/MLAT Traffic](images/gatasServer.png){width=320}<br>Additional traffic via gatas Connect
 - ![Aircraft Selection](images/gatasServer_sel.png){width=320}<br> GA/TAS Server selecting Aircraft
</div>


To have GA/TAS working, please see the setup documentation of GA/TAS first, usually this means just enable the module and pincode.
And ensure that GA/TAS connect via your mobile phone's hotspot or when at home, uses your home network to connect to the internet.

Without any configuration, GA/TAS connect will already pull in ADSB data and send them to your aircraft, however to also change the aircraft you are flying in, if configured 
for multiple aircraft you will need to use your unique GA/TAS ID OR you use setup a pincode.

# GA/TAS Connect — Setup and Usage

## Prerequisites

Before using **GA/TAS Connect**, ensure that GA/TAS itself is set up correctly.  
Refer to the GA/TAS setup documentation first.

In most cases, this means:

- Enabling the GA/TAS Connect module
- Configuring a **PIN code**

GA/TAS must have internet access. This can be provided by:

- A mobile phone hotspot (typical in-flight use)
- A home network (for configuration and testing)

---

## Basic Operation

Without any additional configuration, GA/TAS Connect will automatically retrieve ADS-B and MLAT traffic and forward it to GA/TAS and your EFB.

To switch between multiple configured aircraft, you must either:

- Use your **unique GA/TAS ID**
- Configure and use a **PIN code**

---

## Setup Using a PIN Code

### Requirements

- A web browser that provides location information
- GA/TAS connected to the internet via a mobile hotspot
- GA/TAS must have a valid GPS fix

### Configuration Steps

1. In the GA/TAS configuration, set a PIN code with a value between **1000** and **999999**.


![Gatas Connect Configuration](images/gatasConnectConfig.png){width=640}

2. Open a browser and navigate to:  (url may change in future)
   [https://gatas.vantwisk.nl](https://gatas.vantwisk.nl)

3. Enter the configured PIN code.

   Access is granted only when the browser and GA/TAS are within physical proximity.  
   The server validates this by correlating the browser’s location with the GPS position of GA/TAS.

4. If multiple aircraft are configured, they will be displayed on the page.  
   Selecting an aircraft will:
    - Update the active aircraft
    - Reconfigure GA/TAS accordingly

---

## Setup Using GA/TAS ID

### Requirements

- A web browser (location information is **not** required)
- GA/TAS connected to the internet via a mobile hotspot or other network

### Configuration Steps

1. Open a browser and navigate to:  
   <https://gatas.vantwisk.nl>

2. If multiple aircraft are configured, they will be displayed on the page.  
   Selecting an aircraft will:
    - Update the active aircraft
    - Reconfigure GA/TAS accordingly

In this mode, a GPS fix is **not required**.
