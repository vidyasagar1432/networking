# OSPF (Open Shortest Path First)

## Overview
- **Link-state** IGP routing protocol
- Uses **SPF (Dijkstra's) algorithm** to compute shortest path
- **Open standard** (RFC 2328 for OSPFv2, RFC 5340 for OSPFv3)
- Supports VLSM/CIDR, fast convergence
- Metric = **Cost** (reference bandwidth / interface bandwidth, default ref=100 Mbps)

## OSPF Packet Types
| Type | Name | Purpose |
|---|---|---|
| 1 | Hello | Neighbor discovery & maintenance |
| 2 | DBD (Database Description) | Database summary (LSDB contents) |
| 3 | LSR (Link State Request) | Request missing LSAs |
| 4 | LSU (Link State Update) | Send requested LSAs |
| 5 | LSAck | Acknowledge LSU |

## OSPF Operation
```
1. Hello → become neighbors (2-Way)
2. DBD exchange → become ExStart (Master/Slave election)
3. LSR/LSU/LSAck → Exchange (Full state)
4. SPF runs → populate routing table
```

## Router ID
- Highest loopback IP → highest physical interface IP → manually configured (`router-id`)
- Must be unique within OSPF domain — changes require `clear ip ospf process`

## OSPF Area Types
| Area | Description |
|---|---|
| **Standard** (0) | Backbone, all other areas must connect to it |
| **Regular** (Non-backbone) | Connects to backbone (Area 0) |
| **Stub** | No external routes (Type 5 blocked), default route instead |
| **Totally Stubby** | No external + no inter-area routes (Cisco proprietary) |
| **NSSA** | Allows limited external routes (Type 7 → Type 5 at ABR) |
| **Totally NSSA** | NSSA + no inter-area routes |

## LSA Types
| Type | Name | Origin | Scope |
|---|---|---|---|
| 1 | Router LSA | Every router | Area |
| 2 | Network LSA | DR | Area |
| 3 | Summary LSA (Network) | ABR | Inter-area |
| 4 | Summary LSA (ASBR) | ABR | Inter-area |
| 5 | External LSA (Type 1/2) | ASBR | AS (entire OSPF domain) |
| 6 | Group Membership LSA | MOSPF | (Deprecated) |
| 7 | NSSA External LSA | ASBR in NSSA | NSSA area |
| 8 | External Attributes LSA | BGP | (Uncommon) |
| 9–11 | Opaque LSAs | Various | Traffic Engineering, Graceful Restart |

## OSPF Network Types
| Type | DR Election | Hello | Dead |
|---|---|---|---|
| Broadcast (Ethernet) | Yes | 10s | 40s |
| Non-Broadcast (Frame Relay) | Yes | 30s | 120s |
| Point-to-Point (PPP/HDLC) | No | 10s | 40s |
| Point-to-Multipoint | No | 30s | 120s |
| Loopback | No | — | — |

## DR / BDR Election
- DR (Designated Router) and BDR (Backup DR) reduce LSA flooding on multi-access segments
- Election: highest OSPF priority (default 1) → highest Router ID
- **Preemptive** — new higher-priority router doesn't preempt unless current DR fails

## OSPF States
```
Down → Init → 2-Way → ExStart → Exchange → Loading → Full
```
- **Down** — No Hellos received
- **Init** — Hello received, but my RID not in neighbor's Hello
- **2-Way** — Bidirectional communication (both see each other in Hello)
- **ExStart** — Master/Slave election for DBD exchange
- **Exchange** — DBD packets exchanged
- **Loading** — LSR/LSU exchange
- **Full** — Adjacency complete, LSDBs synchronized

## Path Selection (Route Types)
1. **O** (Intra-area) — cost
2. **O IA** (Inter-area) — cost
3. **E1** (External Type 1) — cost (internal + external)
4. **E2** (External Type 2) — external cost only (default)
5. **N1/N2** (NSSA) — similar to E1/E2

## Timers
- **Hello** — 10s (broadcast/P2P), 30s (NBMA)
- **Dead** — 40s (broadcast/P2P), 120s (NBMA) (= 4× Hello)
- **Wait** — Dead interval (before DR election)
- **Retransmit** — 5s (wait before resending unacknowledged LSU)
- **LSA Refresh** — 30 min (LSA refreshed by originator)

## Authentication
- **Null** (Type 0) — No auth (default)
- **Simple** (Type 1) — Plaintext password (insecure)
- **MD5** (Type 2) — MD5 hash (secure)
- **SHA/HMAC** (Type 3+, in later versions)

## OSPFv3 (IPv6)
- Runs directly on IPv6 (link-local addresses for neighbor adjacency)
- Same SPF algorithm, area hierarchy, packet types
- Multiple instances per link
- Authentication moved to IPSec (AH/ESP)

## Virtual Link
- Connects non-backbone area to Area 0 through another area (transit area)
- Last resort — causes suboptimal routing
```
area 1 virtual-link 192.168.99.1
```

## Config Example
```cisco
router ospf 1
 router-id 1.1.1.1
 network 10.0.0.0 0.255.255.255 area 0
 network 192.168.1.0 0.0.0.255 area 10

interface GigabitEthernet0/0
 ip ospf cost 10          # Manually set cost
 ip ospf priority 100     # Influence DR election
 ip ospf hello-interval 5 # (must match neighbor)
```

## Troubleshooting
```bash
show ip ospf neighbor
show ip ospf database
show ip ospf interface
show ip ospf
show ip route ospf
debug ip ospf adj
debug ip ospf events
```
