# GRE (Generic Routing Encapsulation)

## Overview
- **Tunneling protocol** — encapsulates any Layer 3 protocol inside IP
- Defined in **RFC 2784**, updated by **RFC 2890** (key/sequence)
- IP protocol **47**
- Simple, stateless, no encryption

## GRE Header
```
| IP header | GRE header | Payload packet |
```
| Field | Size | Description |
|---|---|---|
| C (Checksum) | 1 bit | Checksum present |
| K (Key) | 1 bit | Key field present |
| S (Sequence) | 1 bit | Sequence number present |
| Protocol Type | 2 bytes | EtherType of payload (0x0800 = IPv4, 0x86DD = IPv6) |
| Checksum (optional) | 2 bytes | GRE checksum |
| Key (optional) | 4 bytes | Identifies tunnel flow |
| Sequence (optional) | 4 bytes | Ordering/fragmentation |

## Characteristics
- **Encapsulates** IP (or other protocols) inside IP
- **No encryption** — use with **IPSec** for security (GRE over IPSec)
- **Multiprotocol** — can carry IPv4, IPv6, MPLS, etc.
- **Multicast support** — unlike IPSec transport (useful for routing protocols)
- **MTU issue** — extra 24+ bytes of overhead

## GRE over IPSec
- GRE handles multicast/routing protocols
- IPSec encrypts the GRE tunnel
- Common design: **DMVPN** (Dynamic Multipoint VPN)

## DMVPN (Dynamic Multipoint VPN)
- Cisco proprietary (based on mGRE + NHRP + IPSec)
- **Hub-and-spoke** topology with dynamic spoke-to-spoke tunnels
- Components:
  - **mGRE** — Multipoint GRE (single interface, multiple peers)
  - **NHRP** — Next Hop Resolution Protocol (peer discovery)
  - **IPSec** — Encryption
  - **Routing protocol** — EIGRP/OSPF/BGP

## Config Example (Cisco)
```cisco
interface Tunnel0
 ip address 10.0.0.1 255.255.255.0
 tunnel source GigabitEthernet0/0
 tunnel destination 203.0.113.1
 tunnel mode gre ip
 ip mtu 1400                    # Reduce MTU for overhead
 ip tcp adjust-mss 1360         # Adjust MSS
```

## GRE Keepalive
- Periodic tunnel keepalive (like physical interface keepalive)
- Configured on the tunnel, requires both sides to support
```cisco
keepalive 10 3                  # 10s interval, 3 retries
```

## MTU/MSS Considerations
- GRE adds **24 bytes** (20 IP + 4 GRE) or more with options
- GRE + IPSec adds ~40–60 more bytes
- **Common fix**: `ip tcp adjust-mss 1360` (to avoid fragmentation)
