# IS-IS (Intermediate System to Intermediate System)

## Overview
- **Link-state** IGP routing protocol
- Defined in **ISO 10589** (OSI), adapted for IP in **RFC 1195** (Integrated IS-IS)
- Uses **SPF (Dijkstra's)** algorithm
- Common in ISP/service provider backbones
- **CLNS** native — supports IP via CLNP (Connectionless Network Protocol)

## Key Differences from OSPF
| Feature | IS-IS | OSPF |
|---|---|---|
| Origin | ISO (OSI) | IETF (IP) |
| Area design | Areas within router (NET) | Areas within network (ABRs) |
| L1/L2 routers | Router can be Level 1, Level 2, or both | ABRs connect areas |
| Network types | Broadcast, Point-to-Point only | Multiple (NBMA, P2MP, etc.) |
| Metric | Narrow (6 bits) / Wide (24 bits) | Cost (variable) |
| Backbone | L2 routers form backbone | Area 0 |

## Router Levels
| Level | Role |
|---|---|
| **L1** (Level 1) | Intra-area routing (like OSPF internal) |
| **L2** (Level 2) | Inter-area routing (like OSPF backbone) |
| **L1/L2** | Connects L1 area to L2 backbone (like OSPF ABR) |

## Areas
- **Area** encoded in **NET** (Network Entity Title) — e.g., `49.0001.1921.6800.1001.00`
- Format: Area ID + System ID + NSEL (Selector)
  - Area ID: `49.0001`
  - System ID: `1921.6800.1001` (6 bytes, typically derived from MAC/IP)
  - NSEL: `00` (always 00 for router)
- No concept of backbone area (L2 routers serve as backbone)

## IS-IS Packets
| Type | Name | Purpose |
|---|---|---|
| **IIH** | IS-IS Hello | Neighbor discovery |
| **LSP** | Link State PDU | Topology information |
| **CSNP** | Complete Sequence Numbers PDU | Database summary |
| **PSNP** | Partial Sequence Numbers PDU | Request/ack for specific LSPs |

## Network Types
- **Broadcast** (Ethernet) — DIS election (like DR in OSPF)
- **Point-to-Point** (serial) — No DIS
- IS-IS does **not** support NBMA, Point-to-Multipoint natively

## DIS (Designated IS)
- Similar to OSPF DR — reduces LSP flooding on LAN
- **Priority** 0–127 (default 64), highest wins
- **Preemptive** — unlike OSPF (no hold-down)
- CSNP sent every 10s by DIS (DBD equivalent)

## Metrics
| Metric Type | Width | Max Link | Max Path |
|---|---|---|---|
| Narrow (default) | 6 bits | 63 | 1023 |
| Wide (modern) | 24 bits | 16,777,215 | 4.29 billion |

**Wide metrics required** for: MPLS TE, traffic engineering, large networks.
```cisco
metric-style wide
```

## LSP Overload Bit
- Set during startup or maintenance — tells other routers "don't transit through me"
- Router still reachable if destination itself (not transit)
- Similar to OSPF Router LSAs with no transit capability

## Authentication
- **Level 1** / **Level 2** authentication
- **MD5** HMAC (most common)
- Password stored as clear or keychain
```cisco
key chain ISIS-KEY
 key 1
  key-string SECRET
!
router isis
 authentication mode md5 level-2
 authentication key-chain ISIS-KEY level-2
```

## Config Example (Cisco)
```cisco
router isis
 net 49.0001.1921.6800.1001.00
 is-type level-2-only
 metric-style wide
 passive-interface default
 no passive-interface GigabitEthernet0/0

interface GigabitEthernet0/0
 ip router isis
 isis circuit-type level-2
 isis network point-to-point         # Override broadcast to P2P
```

## Troubleshooting
```bash
show isis neighbors
show isis topology
show isis database
show isis route
show clns neighbors
debug isis adj-packets
debug isis spf-triggers
```
