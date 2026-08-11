# HSRP (Hot Standby Router Protocol)

## Overview
- **Cisco proprietary** FHRP (First Hop Redundancy Protocol)
- Provides default gateway redundancy
- Defined in **RFC 2281**
- Active/Standby model with virtual IP

## Virtual IP & MAC
- **Virtual IP** — Shared IP across routers (default gateway)
- **Virtual MAC** — `0000.0c07.acXX` (XX = HSRP group number in hex)
- Clients ARP for virtual IP → get virtual MAC → traffic goes to active router

## Group Roles
| Role | Description |
|---|---|
| **Active** | Forwards traffic for virtual IP |
| **Standby** | Monitors active, takes over if it fails |
| **Speaking** | Votes in election but not active/standby |
| **Listening** | Candidate for active/standby |

## States
```
Initial → Learn → Listen → Speak → Standby → Active
```
- **Initial** — Start
- **Learn** — Waiting to hear virtual IP
- **Listen** — Knows virtual IP, not speak/standby/active
- **Speak** — Sends Hello, participates in election
- **Standby** — Next to become active
- **Active** — Forwards traffic

## Priority & Preemption
- **Priority** — 0–255 (default 100), higher = more likely to be active
- **Preemption** — If enabled, higher priority router takes over active role
```cisco
standby 1 priority 150
standby 1 preempt
```

## Versions
| Feature | HSRPv1 | HSRPv2 |
|---|---|---|
| Group range | 0–255 | 0–4095 |
| Virtual MAC | 0000.0c07.acXX | 0000.0c9f.fXXX |
| IPv6 support | No | Yes |
| Millisecond timers | No | Yes |

## Timers
- **Hello** — 3s (default)
- **Hold** — 10s (default, 3× Hello)
```cisco
standby 1 timers 1 3   # Hello=1s, Hold=3s
```

## Authentication
```cisco
standby 1 authentication md5 key-string P@ssw0rd
```

## Object Tracking
- Tracks upstream interface/IP and adjusts priority if it fails
```cisco
track 1 ip sla 1
standby 1 track 1 decrement 30
```

## HSRP vs VRRP vs GLBP
| Feature | HSRP | VRRP | GLBP |
|---|---|---|---|
| Standard | Cisco prop | RFC 3768/5798 | Cisco prop |
| Active/Standby | Yes | Yes | AVG/AVF (load sharing) |
| Load balancing | No | No | Yes (multiple virtual MACs) |
| Preemption | Configurable | Yes (default) | Configurable |

## Config Example (Cisco)
```cisco
interface Vlan10
 ip address 192.168.10.2 255.255.255.0
 standby 1 ip 192.168.10.1
 standby 1 priority 150
 standby 1 preempt
 standby 1 timers 1 3
 standby 1 authentication md5 key-string SECRET
 standby 1 track GigabitEthernet0/0 30
```

## Troubleshooting
```bash
show standby
show standby brief
debug standby
debug standby terse
```
