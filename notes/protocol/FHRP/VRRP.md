# VRRP (Virtual Router Redundancy Protocol)

## Overview
- **Open standard** FHRP — **RFC 3768** (v2), **RFC 5798** (v3)
- Similar to HSRP but interoperable across vendors
- Active/Standby model with virtual IP

## Key Differences from HSRP
| Feature | VRRP | HSRP |
|---|---|---|
| Standard | Open (RFC 3768/5798) | Cisco proprietary |
| Virtual MAC | 0000.5e00.01XX | 0000.0c07.acXX |
| Group range | 1–255 (v2), 1–4095 (v3) | 0–255 (v1), 0–4095 (v2) |
| IPv6 support | v3 (RFC 5798) | v2 |
| Active router | **Master** (also owns real IP optionally) | **Active** (always virtual IP) |
| Standby | **Backup** | **Standby** |
| Preemption | **Default enabled** | Default disabled |
| Authentication | None (removed in RFC 5798) | MD5/plaintext |
| IP address owner | Master can be the owner of real IP | No |

## Virtual MAC
- **0000.5e00.01{VRID}** (VRRPv2, IPv4)
- **0000.5e00.02{VRID}** (VRRPv3, IPv6)
- VRID = VRRP group number (hex)

## Roles
| Role | Description |
|---|---|
| **Master** | Forwards traffic for virtual IP, sends VRRP advertisements |
| **Backup** | Monitors Master, takes over if Master fails |
| **IP Address Owner** | Router whose real IP = virtual IP (always becomes Master) |

## VRRP Advertisement
- Uses **IP protocol 112**
- Multicast: **224.0.0.18** (IPv4) or **FF02::12** (IPv6)
- Default interval: **1s** (vs HSRP 3s)
- Master-down timer = 3× advertisement = 3s (configurable)

## Priority
- **0–255** (default 100)
- **255** reserved for IP address owner
- Higher = more likely to be Master

## Preemption
- **Enabled by default** — higher priority router becomes Master
- Can be disabled: `no preempt`

## States
```
Initialize → Backup → Master
```
- **Initialize** — Start, waiting for event
- **Backup** — Monitoring Master, ready to take over
- **Master** — Forwarding traffic, sending advertisements

## Config Example (Cisco)
```cisco
interface Vlan10
 ip address 192.168.10.2 255.255.255.0
 vrrp 1 ip 192.168.10.1
 vrrp 1 priority 150
 vrrp 1 timers advertise 1
 vrrp 1 track GigabitEthernet0/0 30
```

## VRRPv3 (RFC 5798)
- Adds IPv6 support
- Extends group number to 4095
- Removes authentication (replaced by IPSec)
- Uses shorter advertisement interval options

## Troubleshooting
```bash
show vrrp
show vrrp brief
debug vrrp
```
