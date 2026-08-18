## **1. VTP Server Configuration (Core/Distribution Switch)**

Creates, edits, and advertises VLAN configurations across the network.

```
configure terminal

! Configure VTP domain, password, and mode
vtp domain MYCOMPANY
vtp password CiscoSecurePass123
vtp version 2
vtp mode server

! (Trunk ports must be active to propagate VTP)
interface GigabitEthernet1/1
 description Uplink-Trunk-Port
 switchport mode trunk
 switchport nonegotiate
 exit

end
write memory
```

## **2. VTP Client Configuration (Access Switch)**

Receives and synchronizes VLANs from the VTP server; cannot create local VLANs.

```
configure terminal

! Configure matching VTP domain, password, and set mode to client
vtp domain MYCOMPANY
vtp password CiscoSecurePass123
vtp version 2
vtp mode client

! (Ensure uplink trunk port is active)
interface GigabitEthernet1/1
 description Uplink-Trunk-Port
 switchport mode trunk
 switchport nonegotiate
 exit

end
write memory
```

## **3. VTP Transparent / Off (Best Practice for Standalone Management)**

Passes VTP advertisements through trunks to other switches without modifying its own local VLAN database (or set `vtp mode off` in VTPv3).

```
configure terminal

vtp mode transparent

end
write memory
```

**Verification Commands**

```
show vtp status
show vtp password
show vlan brief
```