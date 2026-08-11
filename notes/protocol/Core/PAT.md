# PAT (Port Address Translation)

## Overview
- Subset of NAT — **many-to-one** translation
- Also called **NAT Overload** or **NAPT**
- Maps multiple private IPs to a **single public IP** using different source ports

## How It Works
- Translates source IP + source port → public IP + unique source port
- Destination IP/port remain unchanged (for outbound)
- NAT table tracks: `(private IP, private port, public IP, public port, dest IP, dest port, protocol)`

## Example
```
Internal Host A: 192.168.1.10:12345 → 203.0.113.1:54321
Internal Host B: 192.168.1.11:12345 → 203.0.113.1:54322
Internal Host C: 192.168.1.12:8080  → 203.0.113.1:54323
```
All three share public IP `203.0.113.1`, differentiated by port.

## Port Range
- **16-bit** source port (0–65535)
- Ephemeral ports: 49152–65535 (preferred for PAT translations)
- Theoretical max: ~65000 concurrent sessions per public IP
- Can use multiple public IPs to scale (PAT pool)

## Configuration (Cisco)
```cisco
! PAT with interface IP
ip nat inside source list ACL_NAT interface GigabitEthernet0/0 overload

! PAT with pool of public IPs
ip nat pool PUBLIC 203.0.113.1 203.0.113.5 netmask 255.255.255.248
ip nat inside source list ACL_NAT pool PUBLIC overload
```

## PAT vs Static/Dynamic NAT
| Feature | PAT (Overload) | Static NAT | Dynamic NAT |
|---|---|---|---|
| Translation | Many:1 | 1:1 | Many:Many (pool) |
| Public IPs needed | 1+ | 1 per host | Pool size |
| Port translation | Yes | No | No |
| Use case | Internet access | Public servers | General |

## Limitations
- **Port exhaustion** — Too many sessions exhaust port range
- **Some protocols break** — FTP, SIP, IPSec (needs ALG or NAT-T)
- **No inbound access** — Need static port forwarding for incoming connections
- **Logging/tracing** — Hard to trace which private IP made a connection

See also: [NAT](NAT.md)
