# DHCPv6

## Overview
- DHCP for **IPv6** (RFC 8415, obsoletes RFC 3315)
- Uses **UDP 546 (client)** and **UDP 547 (server/relay)**
- Does **not** provide default gateway — learned via **Router Advertisement (RA)**

## DHCPv6 vs DHCPv4
| Feature | DHCPv4 | DHCPv6 |
|---|---|---|
| Ports | 67/68 | 546/547 |
| Address assignment | Always | Optional (SLAAC may be used) |
| Default gateway | Yes (Option 3) | No (RA provides) |
| DNS | Yes (Option 6) | Yes (Option 23) or RDNSS in RA |
| DUID | No | Yes (DHCP Unique Identifier) |
| IA (Identity Association) | No | Yes (IA_NA, IA_PD, IA_TA) |

## DUID (DHCP Unique Identifier)
Identifies DHCP client/server. Types:
- **DUID-LLT** — Link-layer + time
- **DUID-EN** — Enterprise number + vendor ID
- **DUID-LL** — Link-layer address
- **DUID-UUID** — UUID (RFC 6355)

## IA (Identity Association)
| Type | Description |
|---|---|
| **IA_NA** | Non-temporary Addresses (global unicast) |
| **IA_TA** | Temporary Addresses (privacy) |
| **IA_PD** | Prefix Delegation (delegate /64 to downstream router) |

## DHCPv6 Modes
### Stateless DHCPv6
- Address: **SLAAC** (from RA)
- Other info: DHCPv6 (DNS, domain, NTP)
- RA has **O-bit** = 1 (Other config)

### Stateful DHCPv6
- Address: **DHCPv6** (IA_NA)
- Other info: DHCPv6
- RA has **M-bit** = 1 (Managed)

## DHCPv6 Flow (Stateful)
```
Client → SOLICIT (multicast ff02::1:2)
Server → ADVERTISE
Client → REQUEST
Server → REPLY
```

## Prefix Delegation (IA_PD)
- Upstream router delegates a prefix to downstream router
- Downstream router uses prefix for LAN (SLAAC)
- Common in ISP broadband (delegates /56 or /48, client uses /64)

## DHCPv6 Relay
- `ipv6 dhcp relay destination <server-ip>` (Cisco)
- Similar to DHCP relay (ip helper-address) for IPv4

## Rapid Commit
- **2-message exchange**: SOLICIT (with Rapid Commit option) → REPLY
- Skips ADVERTISE/REQUEST — faster (like DHCPv4 rapid commit)

## Config Example (Cisco)
```cisco
ipv6 dhcp pool MYPOOL
 address prefix 2001:db8:100::/64
 dns-server 2001:4860:4860::8888
 domain-name example.com

interface GigabitEthernet0/0
 ipv6 dhcp server MYPOOL
 ipv6 nd other-config-flag      # Stateless DHCPv6
```
