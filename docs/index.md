# GATAS Conspicuity Device

!!! Disclaimer
      **Use at Your Own Risk**      
      GATAS is provided "as is," without any warranties.  
      By downloading or using this device, you acknowledge that you do so at your own risk.  
      The creators are not liable for any damages or issues resulting from its use.  
      GATAS is intended for General Aviation only and should not be relied upon as the sole source of traffic or navigation information.  
      Users are responsible for ensuring compliance with local aviation regulations.

The GATAS Conspicuity device is designed for General Aviation pilots flying in areas where multiple protocols, such as OGN, Flarm, ADS-L, and FANET, are used. It can transmit and receive multiple protocols simultaneously (excluding sending ADS-B) using one or more transceiver modules. All received traffic is sent to your Electronic Flight Bag (EFB), such as SkyDemon, via the GLD90 protocol.

The device is built around the Raspberry Pi Pico 2040 and can be configured with a custom PCB that supports either two transceivers or a simpler configuration with one. In both setups, it can send and receive all protocols using time-sharing technology. The device can store configurations for multiple aircraft, which can be selected through an easy-to-use web interface.

Powered by a Li-Ion battery, the device includes a PCB with a USB-C charger. The estimated battery life is between 4 and 6 hours, though this is subject to further testing.

### Pulse Version


<div class="grid cards" markdown>
- ![Plane Pulse](images/gatas-Pulse/1.png){width=320}
- ![Pulse materials](images/gatas-Pulse/2.png){width=320}
</div>

[Build Instructions for GATAS Pulse](./gatas-Pulse.md)

---

### Full Version

<div class="grid cards" markdown>
- ![OpenScad View (Open)](images/gatas-plane.png){width=320}
- ![kiCAD PCB View (Open)](images/kicadpcb.jpg){width=320}
</div>

The PCB measures approximately 8x9 cm.

---

## External Libraries and Frameworks Used

Most libraries are used "as-is." Some of them have been slightly modified for performance, compatibility, or other reasons.

1. **Raspberry Pi Pico SDK**  
   [https://github.com/raspberrypi/pico-sdk](https://github.com/raspberrypi/pico-sdk)
2. **FreeRTOS**  
   GATAS uses tasks and timers, avoids loops, and runs in multi-core SMP mode.  
   [https://www.freertos.org](https://www.freertos.org)
3. **LWiP**  
   A powerful yet sometimes confusing TCP/IP protocol suite.  
   [https://savannah.nongnu.org/projects/lwip/](https://savannah.nongnu.org/projects/lwip/)
4. **ArduinoJSON**  
   Used for loading and storing configuration.  
   [https://arduinojson.org](https://arduinojson.org)
5. **ETL (Embedded Template Library)**  
   A robust library written by John Wellbelove.  
   [https://www.etlcpp.com](https://www.etlcpp.com)
6. **libcrc**  
   [https://github.com/lammertb/libcrc](https://github.com/lammertb/libcrc)
7. **minnmea**  
   Used for parsing NMEA sentences.  
   [https://github.com/kosma/minmea/](https://github.com/kosma/minmea/)
8. **Catch2**  
   A modern unit testing framework.  
   [https://github.com/catchorg/Catch2](https://github.com/catchorg/Catch2)


!!! INFO
      **GATAS is an ongoing project** that is continuously being developed and improved.  
      As a result, features, functionality, and performance may be updated or modified at any time without prior notice.  
      We value feedback and collaboration!  
      If you have any questions, suggestions, or concerns, feel free to reach out.  
      Your input helps us improve the project and ensure it meets the needs of the community.

If you require further assistance or have specific questions about the GATAS PULSE firmware, soldering process, or case design, please refer to the project's GitHub repository or contact the maintainers directly.

---