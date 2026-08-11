# EIGRP (Enhanced Interior Gateway Routing Protocol)

## Overview
- **Hybrid routing protocol** (advanced distance-vector with link-state features)
- **Cisco proprietary** (open standard since 2013 as "EIGRP for IP" — RFC 7868)
- Metric = Composite (bandwidth, delay, load, reliability, MTU)
- Fast convergence, loop-free via **DUAL** algorithm
- Supports VLSM/CIDR, unequal-cost load balancing

## Key Features
- **DUAL** (Diffusing Update Algorithm) — Guarantees loop-free routes at all times
- **RTP** (Reliable Transport Protocol) — Reliable multicast (224.0.0.10) for updates/queries
- **PDM** (Protocol Dependent Modules) — Supports IPv4, IPv6, IPX, AppleTalk
- **Partial updates** — Only changes sent (not full table)
- **Equal & unequal-cost load balancing** (variance)

## Metrics
**Default K values:** K1=1 (bandwidth), K2=0 (load), K3=1 (delay), K4=0 (reliability), K5=0 (MTU)

**Formula (default):** Metric = bandwidth + delay
- Bandwidth = (10⁷ / min_bw) × 256
- Delay = (sum_delays / 10) × 256

## EIGRP Packets
| Packet | Transport | Purpose |
|---|---|---|
| Hello | Unreliable (multicast, every 5/60s) | Neighbor discovery & keepalive |
| Update | Reliable | Route information (unicast on new adj, multicast for changes) |
| Query | Reliable | Ask neighbors for alternate path (when successor lost) |
| Reply | Reliable | Response to Query |
| ACK | Unreliable | Acknowledgment for reliable packets |
| SIA-Query/Reply | Reliable | Stuck-In-Active (query not answered) |

## Neighbor Discovery
- Multicast to **224.0.0.10** (IPv4) or **FF02::A** (IPv6)
- Hello: 5s (high-speed links), 60s (low-speed, T1)
- Hold: 15s (3× Hello)
- K-values must match between neighbors — otherwise adjacency won't form

## DUAL Concepts
| Term | Description |
|---|---|
| **Successor** | Primary next-hop (has lowest FD) |
| **Feasible Distance (FD)** | Total metric to destination via successor |
| **Reported Distance (RD)** | Metric as reported by neighbor |
| **Feasible Condition (FC)** | RD < FD (loop-free guarantee) |
| **Feasible Successor (FS)** | Backup route meeting FC — used immediately if successor fails |
| **Active state** | No FS exists → sends queries to find alternate path |
| **Passive state** | Stable — has successor/FS |

Automatic failover if FS exists (no query, no delay).

## Route Types
| Code | Type | Source |
|---|---|---|
| D | EIGRP (internal) | Within AS |
| EX | EIGRP (external) | Redistributed from another protocol/AS |

## Unequal-Cost Load Balancing
```cisco
router eigrp 100
 variance 2               # Accept routes with metric ≤ 2× best
 traffic-share min across-interfaces  # Unequal distribution
```

## Hello Timers
| Bandwidth | Hello | Hold |
|---|---|---|
| ≥ 1.544 Mbps (T1+) | 5s | 15s |
| < 1.544 Mbps (64k) | 60s | 180s |

## Config Example (Cisco)
```cisco
router eigrp 100
 eigrp router-id 1.1.1.1
 network 10.0.0.0 0.255.255.255
 network 192.168.1.0 0.0.0.255
 no auto-summary
 passive-interface default
 no passive-interface GigabitEthernet0/0

interface GigabitEthernet0/0
 bandwidth 100000            # 100 Mbps
 delay 100                   # 10 microseconds
```

## Troubleshooting
```bash
show ip eigrp neighbors
show ip eigrp topology
show ip eigrp interfaces
show ip route eigrp
debug eigrp packets
```
