# IPv6 (Internet Protocol version 6)

## Overview
- 128-bit address space (3.4×10³⁸ addresses)
- Defined in **RFC 2460** (original), updated by **RFC 8200**
- No NAT needed (globally routable by design)
- Simplified header, no checksum, no fragmentation at routers

## IPv6 Header
| Field | Size | Description |
|---|---|---|
| Version | 4 bits | Always 6 |
| Traffic Class | 1 byte | DSCP / ECN (like IPv4 ToS) |
| Flow Label | 20 bits | Per-flow QoS (no equivalent in IPv4) |
| Payload Length | 2 bytes | Payload only (excludes header) |
| Next Header | 1 byte | Extension header or upper-layer protocol |
| Hop Limit | 1 byte | Replaces TTL |
| Source Address | 16 bytes (128 bits) | |
| Destination Address | 16 bytes (128 bits) | |

**Fixed size: 40 bytes** — no options in main header, no checksum, no fragmentation fields.

## Address Representation
- 8 groups of 16-bit hex: `2001:0db8:85a3:0000:0000:8a2e:0370:7334`
- Leading zeros omitted: `2001:db8:85a3:0:0:8a2e:370:7334`
- Double colon (`::`) once: `2001:db8:85a3::8a2e:370:7334`
- IPv4-mapped: `::ffff:192.168.1.1`

## Address Types
| Type | Prefix | Description |
|---|---|---|
| **Global Unicast** | 2000::/3 | Internet-routable |
| **Unique Local** (ULA) | fc00::/7 | Private (like RFC 1918) |
| **Link-Local** | fe80::/10 | Mandatory, not routable (like 169.254.x.x) |
| **Multicast** | ff00::/8 | Replaces broadcast |
| **Loopback** | ::1/128 | localhost |
| **Unspecified** | ::/128 | Source unknown (DHCPv6) |
| **Solicited-Node Multicast** | ff02::1:ff00:0/104 | NDP — replaces ARP |

**No broadcast** in IPv6 — replaced by multicast.

## EUI-64 Address Generation
- Interface ID derived from MAC:
  - Split MAC: `AA:BB:CC:DD:EE:FF`
  - Insert FFFE: `AA:BB:CC:FF:FE:DD:EE:FF`
  - Flip U/L bit (7th bit): `A8:BB:CC:FF:FE:DD:EE:FF`
- Modern systems use **Privacy Extensions** (random IID, rotate over time)

## Extension Headers
| Next Header | Extension | Purpose |
|---|---|---|
| 0 | Hop-by-Hop | Options processed by each hop (Jumbogram, RL) |
| 43 | Routing | Source routing (Type 0 deprecated, Type 2 for Mobile IPv6) |
| 44 | Fragment | Fragmentation (source-only, unlike IPv4) |
| 50 | ESP | IPSec Encapsulating Security Payload |
| 51 | AH | IPSec Authentication Header |
| 60 | Destination | Options for destination |
| 59 | No Next Header | End of headers |

## Neighbor Discovery Protocol (NDP)
Replaces ARP + ICMP Redirect:
- **NS/NA** (Neighbor Solicitation/Advertisement) — MAC resolution (like ARP)
- **RS/RA** (Router Solicitation/Advertisement) — discover routers & prefixes
- **Redirect** — Better next-hop
- **DAD** (Duplicate Address Detection) — NS to own tentative address
- Uses ICMPv6 (Types 133–137)

## SLAAC vs DHCPv6
| Method | Address Assignment | Other Info |
|---|---|---|
| **SLAAC** (Stateless) | RA provides prefix, host generates IID | No DNS (can add RDNSS option in RA) |
| **Stateless DHCPv6** | SLAAC for address, DHCPv6 for DNS/domain | |
| **Stateful DHCPv6** | DHCPv6 provides address + other info | RA sets M=1 (Managed) |

## Transition Mechanisms
| Mechanism | Description |
|---|---|
| **Dual Stack** | Run IPv4 and IPv6 simultaneously (preferred) |
| **6to4** | Encapsulate IPv6 in IPv4, uses 2002::/16 |
| **Teredo** | IPv6 over UDP/IPv4 (NAT traversal) |
| **ISATAP** | IPv6 over IPv4 in enterprise |
| **NAT64 / DNS64** | Translate IPv6 → IPv4 for legacy access |
| **Dual-Stack Lite** | Carrier NAT44 + IPv6 transport |
| **464XLAT** | CLAT + PLAT for IPv6-only to IPv4 |

## IPv4 vs IPv6
| Feature | IPv4 | IPv6 |
|---|---|---|
| Address size | 32 bits | 128 bits |
| Header | 20–60 bytes (variable) | 40 bytes (fixed) |
| Fragmentation | Routers can fragment | Source only |
| Checksum | Yes | No |
| Broadcast | Yes | No (multicast) |
| ARP | Yes | NDP replaces it |
| NAT | Common | Unnecessary (by design) |
| IPSec | Optional | Originally mandatory (now "recommended") |
