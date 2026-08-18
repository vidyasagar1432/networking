## **1. Standard Named ACL (Filter based only on Source IP)**

Place close to the **destination** to avoid unintentionally blocking traffic to other services.

```
configure terminal

! Define Standard Named ACL
ip access-list standard BLOCK_GUEST_TO_INTERNAL
 remark Allow Management Host
 permit host 192.168.20.50
 remark Deny Guest Subnet
 deny 192.168.20.0 0.0.0.255
 remark Allow all other traffic
 permit any
 exit

! Apply ACL outbound on the destination interface
interface GigabitEthernet0/0/1
 ip access-group BLOCK_GUEST_TO_INTERNAL out
 exit

end
write memory
```

## **2. Extended Named ACL (Filter by Source, Destination, Protocol, and Port)**

Place close to the **source** to drop unauthorized traffic before it consumes network bandwidth.

```
configure terminal

! Define Extended Named ACL
ip access-list extended SECURE_VLAN10_OUT
 remark Allow Established / Return TCP Traffic
 permit tcp any any established

 remark Allow DNS queries to Core DNS Server
 permit udp 192.168.10.0 0.0.0.255 host 10.10.10.2 eq 53
 permit tcp 192.168.10.0 0.0.0.255 host 10.10.10.2 eq 53

 remark Allow Web Browsing (HTTP/HTTPS) to anywhere
 permit tcp 192.168.10.0 0.0.0.255 any eq 80
 permit tcp 192.168.10.0 0.0.0.255 any eq 443

 remark Allow Ping (ICMP Echo) outbound
 permit icmp 192.168.10.0 0.0.0.255 any echo

 remark Explicitly block access to Finance Subnet and Log Violations
 deny ip 192.168.10.0 0.0.0.255 10.10.20.0 0.0.0.255 log

 remark Implicit Deny Any is at the end by default
 exit

! Apply ACL inbound on the source interface/VLAN SVI
interface GigabitEthernet0/0/0
 ip access-group SECURE_VLAN10_OUT in
 exit

end
write memory
```

## **3. VTY Line ACL (Secure SSH / Telnet Management Access)**

Restricts administrative access to the switch or router so only authorized admin IPs can connect.

```
configure terminal

! Standard ACL defining allowed Admin management IPs
ip access-list standard ADMIN_SSH_ONLY
 remark Allow Network Admin Workstations
 permit host 192.168.1.100
 permit host 192.168.1.101
 deny any log
 exit

! Apply to VTY lines
line vty 0 15
 access-class ADMIN_SSH_ONLY in
 transport input ssh
 exit

end
write memory
```

**Verification Commands**

```
show access-lists
show ip access-lists SECURE_VLAN10_OUT
show ip interface GigabitEthernet0/0/0 | include access list
```