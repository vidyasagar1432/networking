
## To harden an end-device access port

```
! ==========================================
! 1. Global Layer 2 Security Configurations
! ==========================================
configure terminal

! Enable DHCP Snooping globally and for VLAN 10
ip dhcp snooping
ip dhcp snooping vlan 10
no ip dhcp snooping information option

! Enable Dynamic ARP Inspection (DAI) for VLAN 10
ip arp inspection vlan 10

! (Optional) Set auto-recovery if port gets err-disabled by security violations
errdisable recovery cause psecure-violation
errdisable recovery cause bpduguard
errdisable recovery cause arp-inspection
errdisable recovery cause dhcp-rate-limit
errdisable recovery interval 300

! ==========================================
! 2. End-Device Interface Configuration
! ==========================================
interface GigabitEthernet1/0
 description End-Device-Port
 switchport access vlan 10
 switchport mode access
 switchport nonegotiate
 switchport port-security
 switchport port-security maximum 1
 switchport port-security mac-address sticky
 switchport port-security violation shutdown
 storm-control broadcast level 20.00
 storm-control multicast level 20.00
 storm-control action trap
 spanning-tree portfast edge
 spanning-tree bpduguard enable
 ip verify source
 exit

end
write memory
```

**Required Uplink / Trunk Port Configuration**

Run these commands on whichever port connects to your upstream router, core switch, or DHCP server (e.g., `GigabitEthernet1/1` or `TenGigabitEthernet1/1`):

```
interface GigabitEthernet1/1
 description Trunk-To-Core-Router-or-Switch
 ip dhcp snooping trust
 ip arp inspection trust
 exit
```

>Ensure your uplink/trunk ports leading to legitimate DHCP servers or default gateways are configured with `ip dhcp snooping trust` and `ip arp inspection trust` so responses aren't blocked switch-wide.

If you do not want to configure trust on the uplink ports, you **must remove** the features that require a trust hierarchy—specifically:
- `ip dhcp snooping` (global)
- `ip arp inspection` (global)
- `ip verify source` / IP Source Guard (interface-level, depends on DHCP snooping)
Without those global features, you can still fully harden the access port using **Port Security, BPDU Guard, DTP disabling, and Storm Control**. These controls operate entirely locally on `GigabitEthernet1/0` with zero impact on trunk links, gateways, or DHCP servers.

```
configure terminal

interface GigabitEthernet1/0
 description Secured-End-Device-Port
 switchport access vlan 10
 switchport mode access
 switchport nonegotiate
 switchport port-security
 switchport port-security maximum 1
 switchport port-security mac-address sticky
 switchport port-security violation shutdown
 storm-control broadcast level 20.00
 storm-control multicast level 20.00
 storm-control action trap
 spanning-tree portfast edge
 spanning-tree bpduguard enable
 exit

! Optional: Automatically re-enable the port after 5 minutes if shut down by Port Security or BPDU Guard
errdisable recovery cause psecure-violation
errdisable recovery cause bpduguard
errdisable recovery interval 300

end
write memory
```

**Protection this provides:**

- **MAC Flooding & Spoofing:** Blocked by `port-security` (only 1 sticky MAC allowed).
- **Rogue Switches & Loops:** Blocked by `bpduguard` and `portfast edge`.
- **VLAN Hopping:** Blocked by `switchport nonegotiate` + `mode access`.
- **Broadcast / Multicast Storms:** Capped at 20% by `storm-control`.