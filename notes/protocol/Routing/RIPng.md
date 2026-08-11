# RIPng (RIP Next Generation)

## Overview
- **RIP for IPv6** — defined in **RFC 2080**
- Same distance-vector algorithm as RIPv2 (Bellman-Ford)
- Metric = Hop count (max 15, 16 = unreachable)
- Uses **UDP 521**

## Differences from RIPv2
| Feature | RIPv2 | RIPng |
|---|---|---|
| Addressing | IPv4 | IPv6 |
| Transport | UDP 520 (broadcast/multicast 224.0.0.9) | UDP 521 (multicast FF02::9) |
| Subnet mask | In route entry | Prefix length in route entry |
| Authentication | MD5/plaintext in packet | Relies on IPSec (AH/ESP) |
| Next hop | In route entry | Embedded in route entry |
| Route tag | 16 bits | 16 bits (same) |

## RIPng Packet Format
Same structure as RIPv2 but with IPv6 prefix/length instead of IPv4 address + mask:
- Command (1=Request, 2=Response)
- Version (1)
- Route entries: IPv6 prefix (128 bits), prefix length, metric

## Timers
| Timer | Default | Description |
|---|---|---|
| Update | 30s | Periodic full-table advertisement |
| Invalid | 180s | Mark route invalid if no update |
| Holddown | 180s | Ignore worse metrics |
| Flush | 240s | Remove route from table |

## Cisco Configuration
```cisco
ipv6 router rip RIPNG
 !
interface GigabitEthernet0/0
 ipv6 rip RIPNG enable
```

## Limitations
- Same as RIPv2: max 15 hops, slow convergence, full-table updates
- Suitable only for small, simple IPv6 networks

## Quick Comparison with Other IPv6 IGPs
| Protocol | Convergence | Metric | Max Hops | Use Case |
|---|---|---|---|---|
| **RIPng** | Slow (minutes) | Hop count | 15 | Tiny networks |
| **EIGRP for IPv6** | Fast (DUAL) | Composite | No limit | Cisco shops |
| **OSPFv3** | Fast (SPF) | Cost | No limit | Enterprise |
