# IPv4 (Internet Protocol version 4)

## Overview
- **Layer 3** (Network Layer) protocol
- 32-bit address space (~4.3 billion addresses)
- Defined in **RFC 791**
- Connectionless, best-effort delivery

## IPv4 Header
| Field | Size | Description |
|---|---|---|
| Version | 4 bits | Always 4 |
| IHL | 4 bits | Header length (×4 bytes), min 5 |
| DSCP/ToS | 1 byte | QoS / Differentiated Services |
| Total Length | 2 bytes | Packet (header + payload), max 65535 |
| Identification | 2 bytes | Fragment identification |
| Flags | 3 bits | DF (Don't Fragment), MF (More Fragments) |
| Fragment Offset | 13 bits | Position in original datagram (×8) |
| TTL | 1 byte | Hop limit (max 255, decremented each hop) |
| Protocol | 1 byte | Next layer protocol (1=ICMP, 6=TCP, 17=UDP) |
| Header Checksum | 2 bytes | Error check on header only |
| Source IP | 4 bytes | |
| Destination IP | 4 bytes | |
| Options | 0–40 bytes | Rarely used |

## Addressing
- **32-bit**, dotted decimal notation: `192.168.1.1`
- **Network portion** + **Host portion** (subnet mask determines boundary)

### Address Classes (Classful)
| Class | Range | Default Mask | Networks | Hosts/Network |
|---|---|---|---|---|
| A | 1.0.0.0–126.255.255.255 | /8 (255.0.0.0) | 126 | 16,777,214 |
| B | 128.0.0.0–191.255.255.255 | /16 (255.255.0.0) | 16,384 | 65,534 |
| C | 192.0.0.0–223.255.255.255 | /24 (255.255.255.0) | 2,097,152 | 254 |
| D | 224.0.0.0–239.255.255.255 | — | Multicast | — |
| E | 240.0.0.0–255.255.255.255 | — | Reserved | — |
| **Loopback** | 127.0.0.0/8 | — | Local host | — |

### CIDR (Classless Inter-Domain Routing)
- Replaces classful addressing — prefix notation: `192.168.1.0/24`
- Allows VLSM (Variable Length Subnet Mask) — different masks within same network

## Private IPv4 Addresses (RFC 1918)
| Range | CIDR |
|---|---|
| 10.0.0.0–10.255.255.255 | 10.0.0.0/8 |
| 172.16.0.0–172.31.255.255 | 172.16.0.0/12 |
| 192.168.0.0–192.168.255.255 | 192.168.0.0/16 |

## Special Addresses
| Address | Purpose |
|---|---|
| 0.0.0.0/8 | "This network" (source for DHCP) |
| 127.0.0.0/8 | Loopback (localhost) |
| 169.254.0.0/16 | APIPA (Link-local, no DHCP) |
| 224.0.0.0/4 | Multicast |
| 240.0.0.0/4 | Reserved / Future use |
| 255.255.255.255 | Limited broadcast |
| x.x.x.0 | Network address (host bits all 0) |
| x.x.x.255 | Directed broadcast (host bits all 1) |

## Subnetting
```
IP: 192.168.1.130
Mask: 255.255.255.192 (/26)
Network: 192.168.1.128
Broadcast: 192.168.1.191
Range: 192.168.1.129–190
Hosts per subnet: 62
Subnets created from /24: 4
```

### Quick Subnetting
```
/24  → 256 addresses, 254 hosts
/25  → 128 addresses, 126 hosts (2 subnets from /24)
/26  → 64 addresses, 62 hosts (4 subnets)
/27  → 32 addresses, 30 hosts (8 subnets)
/28  → 16 addresses, 14 hosts (16 subnets)
/29  → 8 addresses, 6 hosts (32 subnets)
/30  → 4 addresses, 2 hosts (point-to-point)
/31  → 2 addresses, 2 hosts (P2P, RFC 3021)
/32  → 1 address (host route)
```

## Fragmentation
- When packet exceeds MTU of outgoing link, router fragments
- **DF bit** = 1 → drop packet, send ICMP Type 3 Code 4 (PMTUD)
- MF flag + Fragment Offset reassembles fragments at destination
- **Minimum reassembly buffer**: 576 bytes

## QoS / DSCP
- DiffServ Code Point (6 bits) in ToS byte
- **EF** (Expedited Forwarding) — 46 — low loss/latency (VoIP)
- **AF41–43** (Assured Forwarding) — video
- **CS0–CS7** (Class Selector) — backward compatibility with IPP

## Common Issues
- **IP Exhaustion** — solved by NAT, CIDR, IPv6
- **TTL expiry** — routing loops
- **Fragmentation** — performance hit, frag attacks
- **Header Checksum** — must be recalculated at each hop (unlike IPv6)
