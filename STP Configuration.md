## **1. Primary Root Bridge Configuration (Core Switch)**

Forces this switch to win the Spanning Tree election for the specified VLANs by setting the lowest priority (`4096` or via the primary macro). Uses Rapid PVST+ for sub-second convergence.

```
configure terminal

! Set Spanning Tree mode to Rapid-PVST
spanning-tree mode rapid-pvst

! Configure Root Bridge priority (Method A: Macro, or Method B: Explicit Priority)
spanning-tree vlan 1-4094 root primary
! Alternative: spanning-tree vlan 1-4094 priority 4096

! Global STP Protections
spanning-tree portfast default
spanning-tree portfast bpduguard default
spanning-tree loopguard default

end
write memory
```

## **2. Secondary Root Bridge Configuration (Backup Core / Distribution Switch)**

Takes over immediately if the primary root switch fails (priority `8192` or via the secondary macro).

```
configure terminal

spanning-tree mode rapid-pvst

! Configure Secondary Root Bridge priority
spanning-tree vlan 1-4094 root secondary
! Alternative: spanning-tree vlan 1-4094 priority 8192

! Global STP Protections
spanning-tree portfast default
spanning-tree portfast bpduguard default
spanning-tree loopguard default

end
write memory
```

## **3. Access Switch Port-Level STP Protections**

Hardens edge ports facing end devices and guards trunk ports against rogue superior BPDUs.

```
configure terminal

spanning-tree mode rapid-pvst

! Edge Port Configuration (PC / Server / Printer)
interface GigabitEthernet1/0
 description End-Device-Port
 switchport access vlan 10
 switchport mode access
 spanning-tree portfast edge
 spanning-tree bpduguard enable
 exit

! Uplink / Trunk Port to Core Switch (Protects against rogue switches claiming root)
interface GigabitEthernet1/1
 description Uplink-To-Core
 switchport mode trunk
 switchport nonegotiate
 spanning-tree rootguard
 exit

end
write memory
```

**Verification Commands**

```
show spanning-tree
show spanning-tree summary
show spanning-tree root
show spanning-tree interface GigabitEthernet1/0 detail
show interfaces status err-disabled
```