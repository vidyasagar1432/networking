# IP Multicast

## Overview
- **One-to-many** or **many-to-many** communication
- Efficient — send once, reach multiple receivers (reduces bandwidth vs unicast)
- Uses **Class D** IPv4 addresses (224.0.0.0–239.255.255.255)
- No multicast equivalent in IPv6 — uses multicast natively

## Multicast IP Ranges (IPv4)
| Range | Type | Description |
|---|---|---|
| 224.0.0.0/24 | Link-local | Protocol traffic (OSPF, PIM, EIGRP) — TTL=1 |
| 224.0.1.0–238.255.255.255 | Global | Internet-wide multicast |
| 232.0.0.0/8 | SSM | Source-Specific Multicast |
| 239.0.0.0/8 | Admin-local | Organization scope (private) |

## Multicast MAC
- **01:00:5E** prefix + lower 23 bits of multicast IP
- Example: 224.0.0.1 → 01:00:5E:00:00:01
- **25 bits of IP mapped to 23 bits of MAC** — multiple IPs map to same MAC

## IGMP (Internet Group Management Protocol)
- Host-to-router protocol — hosts join/leave multicast groups
- **IGMPv1** — queries + membership reports (host leave = timeout)
- **IGMPv2** — adds leave group message (explicit leave)
- **IGMPv3** — SSM (source filtering — include/exclude sources)
- **IGMP Snooping** — switch listens to IGMP to prune multicast ports

## MLD (Multicast Listener Discovery)
- IPv6 equivalent of IGMP
- **MLDv1** (RFC 2710) — equivalent to IGMPv2
- **MLDv2** (RFC 3810) — equivalent to IGMPv3 (SSM)

## PIM (Protocol Independent Multicast)
- **Protocol Independent** — uses any underlying unicast routing (OSPF, EIGRP, BGP)
- Multicast routing protocol between routers
- **PIM-DM** — Dense Mode (flood-and-prune)
- **PIM-SM** — Sparse Mode (explicit join via RP)
- **PIM-SSM** — Source-Specific Multicast (232.0.0.0/8)
- **Bidirectional PIM** — Shared tree, bidirectional

## RP (Rendezvous Point)
- Central meeting point in PIM-SM
- Receivers join RP, sources register with RP
- RP distributes traffic down shared tree (RP-tree / RPT)
- Can switch to source tree (SPT) for optimal path

### RP Discovery Methods
| Method | Description |
|---|---|
| **Static** | Manual RP config on each router |
| **Auto-RP** | Cisco proprietary — RP mapping agent |
| **BSR** (BootStrap Router) | PIMv2 standard — BSR floods RP-set |
| **Anycast RP** | Multiple RPs with same IP + MSDP |

## MSDP (Multicast Source Discovery Protocol)
- Connects multiple PIM-SM domains
- Shares active source information between RPs
- Allows inter-domain multicast (e.g., between ISPs)
- Replaced by **Embedded RP** (IPv6) in some cases

## Multicast Flow
```
Source ──(register)──→ RP ──(join)──→ Receiver
   │                                    │
   └─────── (SPT switch) ──────────────┘
```
1. Source sends to RP (register)
2. Receiver joins group, connects to RP (shared tree)
3. Last-hop router switches to source tree (SPT) for optimal path

## Config Example (PIM-SM)
```cisco
ip multicast-routing

interface GigabitEthernet0/0
 ip pim sparse-mode

interface Loopback0
 ip pim sparse-mode

ip pim rp-address 10.0.0.1                    # Static RP
ip pim rp-candidate Loopback0 priority 10     # BSR candidate
ip pim bsr-candidate Loopback0 0              # BSR
```

## Troubleshooting
```bash
show ip mroute
show ip mroute active
show ip pim neighbor
show ip pim rp mapping
show ip igmp groups
show ip igmp interface
show ip multicast
```
