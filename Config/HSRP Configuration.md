## **1. Active Router Configuration (Primary Gateway)**

Configures HSRP Version 2 with a higher priority (`110`) and preemption so this device acts as the default gateway under normal conditions.

Cisco CLI

```
configure terminal

interface GigabitEthernet0/0/1
 description Primary-Gateway-Link
 ip address 192.168.10.2 255.255.255.0
 no shutdown

 ! HSRP Configuration
 standby version 2
 standby 10 ip 192.168.10.1
 standby 10 priority 110
 standby 10 preempt
 standby 10 authentication md5 key-string CiscoHSRPKey123
 standby 10 timers 1 3
 exit

end
write memory
```

## **2. Standby Router Configuration (Backup Gateway)**

Configures the backup gateway with the default priority (`100`) to take over the virtual IP (`192.168.10.1`) if the primary router fails.

```
configure terminal

interface GigabitEthernet0/0/1
 description Backup-Gateway-Link
 ip address 192.168.10.3 255.255.255.0
 no shutdown

 ! HSRP Configuration (Must match Group ID, Virtual IP, and Auth)
 standby version 2
 standby 10 ip 192.168.10.1
 standby 10 priority 100
 standby 10 preempt
 standby 10 authentication md5 key-string CiscoHSRPKey123
 standby 10 timers 1 3
 exit

end
write memory
```

## **3. Primary Router with Interface Tracking (Optional - WAN Failover)**

Reduces the primary router's priority if its WAN uplink goes down, allowing the backup router to take over automatically.

```
configure terminal

! Define an object to track the WAN uplink status
track 1 interface GigabitEthernet0/0/0 line-protocol

interface GigabitEthernet0/0/1
 ! Decrement priority by 20 if WAN link fails (110 - 20 = 90, dropping below Standby's 100)
 standby 10 track 1 decrement 20
 exit

end
write memory
```

**Verification Commands**

```
show standby
show standby brief
show standby neighbors
show track
```