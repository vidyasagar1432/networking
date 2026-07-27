# MSTP (Multiple Spanning Tree Protocol)

## Overview
- **IEEE 802.1s** — extends RSTP (802.1w) for multiple VLANs
- Groups VLANs into **MST instances** (MSTI) — each runs its own RSTP
- Reduces number of STP instances (vs PVST+ which has one per VLAN)

## Key Concepts
| Term | Description |
|---|---|
| **MST Region** | Group of switches with same MST config (name, revision, VLAN-to-instance map) |
| **IST** (Internal Spanning Tree) | Instance 0 — spans entire MST region (acts like CST) |
| **MSTI** (MST Instance) | Instance 1–4094 — each has its own root bridge, topology |
| **CST** (Common Spanning Tree) | Interconnects MST regions and legacy STP/RSTP bridges |
| **CIST** (Common and Internal Spanning Tree) | IST + CST — single spanning tree connecting all bridges |

## MST Region
A region is defined by:
1. Same **Region Name** (configurable)
2. Same **Revision Number**
3. Same **VLAN-to-Instance mapping**

Switches outside the region see the region as a single bridge (via CST).

## Instance Mapping
```
VLANs 1–100  → MSTI 1
VLANs 101–200 → MSTI 2
VLANs 201–300 → MSTI 3
Default (rest) → IST (Instance 0)
```

## Port Roles (MST adds to RSTP)
- **Boundary Port** — Port connecting to another region or legacy STP bridge
- **Master Port** — Boundary port that is root of the CST for this region (on IST)

## Benefits over PVST+
| Feature | PVST+ | MSTP |
|---|---|---|
| Instances per switch | One per VLAN (up to 4094) | Limited (configurable, often 1–16) |
| CPU/memory overhead | High (many instances) | Low (few instances) |
| Standard | Cisco proprietary | IEEE 802.1s |
| Interoperability | Cisco only | Multi-vendor |

## Config Example (Cisco)
```cisco
spanning-tree mode mst
spanning-tree mst configuration
 name REGION1
 revision 1
 instance 1 vlan 1-100
 instance 2 vlan 101-200
 instance 3 vlan 201-300

! Set root for MSTI 1
spanning-tree mst 1 priority 4096
spanning-tree mst 1 root primary

! Interface config
interface GigabitEthernet0/1
 spanning-tree mst 1 port-priority 32
```

## Troubleshooting
```bash
show spanning-tree mst configuration
show spanning-tree mst 1
show spanning-tree mst interface gigabitEthernet 0/1
```
