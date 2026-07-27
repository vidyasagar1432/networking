# RIP (Routing Information Protocol)

## Overview
- **Distance-vector** IGP routing protocol
- Metric = **Hop count** (max 15, 16 = infinity/unreachable)
- Defined in **RFC 1058** (RIPv1), **RFC 2453** (RIPv2), **RFC 2080** (RIPng)
- Simple, easy to configure, but **slow convergence** and **limited scale**

## Versions
| Feature | RIPv1 | RIPv2 | RIPng |
|---|---|---|---|
| Addressing | Classful only | Classless (VLSM/CIDR) | IPv6 |
| Subnet Mask | No | Yes (in route entry) | Yes (prefix length) |
| Authentication | No | MD5 / Plaintext | IPSec (AH/ESP) |
| Multicast | No (broadcast 255.255.255.255) | Yes (224.0.0.9) | Yes (FF02::9) |
| Next Hop | No | Yes (next-hop field) | Yes |
| Transport | UDP 520 | UDP 520 | UDP 521 |

## Operation
- **Periodic updates** — Every 30 seconds (full routing table)
- **Triggered updates** — Immediate update on topology change
- Uses **Bellman-Ford** algorithm

## Timers
| Timer | Default | Purpose |
|---|---|---|
| Update | 30s | Send full routing table to neighbors |
| Invalid | 180s (6×) | If no update, route marked as invalid |
| Holddown | 180s | Prevents route flapping (ignores worse metrics) |
| Flush | 240s (8×) | Route removed from table |

## Route Metrics
- Each hop increments metric by 1
- Max 15 hops (16 = unreachable)
- Equal-cost load balancing (up to 4/8/16 paths depending on platform)

## Split Horizon
- Route learned on an interface is **not advertised back out that interface**
- **Split horizon with poison reverse** — Advertise with metric 16 (poison) back out the interface

## Limitations
- Max 15 hops — not suitable for large networks
- Slow convergence (minutes)
- Full table updates waste bandwidth
- No path quality metric (bandwidth, delay)

## Loop Prevention
- **Maximum hop count** (16 = infinity)
- **Split horizon**
- **Route poisoning** (metric 16)
- **Hold-down timer**
- **Triggered updates**

## Config Example (Cisco)
```cisco
router rip
 version 2
 no auto-summary
 network 192.168.0.0
 network 10.0.0.0
 passive-interface GigabitEthernet0/1
```
