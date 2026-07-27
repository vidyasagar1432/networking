# GLBP (Gateway Load Balancing Protocol)

## Overview
- **Cisco proprietary** FHRP — load balances across multiple gateways
- Unlike HSRP/VRRP (active/standby), GLBP uses all available routers
- Defined in **RFC** — not standardized, Cisco proprietary
- Single **virtual IP**, multiple **virtual MACs** (load balancing)

## Roles
| Role | Description |
|---|---|
| **AVG** (Active Virtual Gateway) | Elected leader, assigns virtual MACs to AVFs |
| **AVF** (Active Virtual Forwarder) | Forwards traffic for assigned virtual MAC |
| **Secondary AVF** | Backup if primary AVF fails |

## Virtual MAC Allocation
- AVG assigns each AVF a unique virtual MAC: `0007.b4XX.XXYY`
- Up to **4 AVFs** per GLBP group
- Clients ARP for virtual IP → AVG responds with one of the virtual MACs (round-robin or weighted)

## Load Balancing Methods
| Method | Description |
|---|---|
| **Round-robin** | Each ARP reply cycles through AVFs (default) |
| **Weighted** | Based on configured weight (proportional to capacity) |
| **Host-dependent** | Same host always gets same AVF (source MAC hash) |

## States
| State | Description |
|---|---|
| **Disabled** | Interface down |
| **Listen** | Not AVG/AVF, monitoring |
| **Speak** | Sends Hello, participates in election |
| **Standby** | Backup AVG |
| **Active** | AVG — assigns virtual MACs |

## GLBP vs HSRP vs VRRP
| Feature | GLBP | HSRP | VRRP |
|---|---|---|---|
| Active/Standby | No (load balanced) | Yes | Yes |
| Load balancing | Yes (round-robin, weighted) | No | No |
| Virtual MACs | Multiple (per AVF) | One | One |
| Max routers | 4 AVFs | 1 active + standbys | 1 master + backups |
| Standard | Cisco proprietary | Cisco proprietary | RFC 3768/5798 |

## Weighting & Tracking
- Higher weight → more traffic
- Track upstream interfaces — decrement weight if link fails
```cisco
track 1 ip sla 1
 glbp 1 weighting track 1 decrement 10
```

## Preemption
```cisco
glbp 1 preempt
glbp 1 priority 150
```

## Config Example (Cisco)
```cisco
interface Vlan10
 ip address 192.168.10.2 255.255.255.0
 glbp 1 ip 192.168.10.1
 glbp 1 priority 150
 glbp 1 preempt
 glbp 1 load-balancing round-robin
 glbp 1 timers 1 3
 glbp 1 authentication md5 key-string GLBPKey
```

## Troubleshooting
```bash
show glbp
show glbp brief
debug glbp
```
