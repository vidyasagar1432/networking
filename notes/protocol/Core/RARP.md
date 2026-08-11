# RARP (Reverse Address Resolution Protocol)

## Overview
- Maps **MAC address → IP address** (reverse of ARP)
- Defined in **RFC 903**
- Legacy — replaced by **BOOTP**, then **DHCP**
- Used historically by diskless workstations to discover their IP on boot

## How It Works
1. Client broadcasts RARP request (MAC address)
2. RARP server responds with IP address
3. Client configures its IP

## RARP vs ARP
| Feature | ARP | RARP |
|---|---|---|
| Direction | IP → MAC | MAC → IP |
| Operation | Request: who has IP? | Request: what is my IP? |
| Server needed? | No (peer response) | Yes (RARP server) |

## Limitations
- **Layer 2 only** — can't cross routers (no relay)
- **No subnet mask** — client gets IP only
- **No default gateway** — must be configured separately
- **Minimal features** — just IP assignment, nothing else
- Required **manual configuration** on server per MAC

## RARP vs BOOTP vs DHCP
| Feature | RARP | BOOTP | DHCP |
|---|---|---|---|
| IP assignment | Yes | Yes | Yes |
| Subnet mask | No | Yes | Yes |
| Default gateway | No | Yes | Yes |
| DNS | No | No | Yes |
| Relay (cross subnet) | No | Yes | Yes |
| Dynamic allocation | No | No | Yes (leases) |
| Layer | 2 | 3/4 (UDP) | 3/4 (UDP) |

## Gratuitous ARP (GARP)
- ARP reply sent **without a request**
- Purposes:
  - **Duplicate Address Detection (DAD)** — check if IP is already in use
  - **Update neighbor MAC tables** — after IP/MAC change
  - **Failover notification** — HSRP/VRRP active router change
- Format: Sender IP = Target IP = own IP

## Proxy ARP
- Router answers ARP request on behalf of another device
- Allows hosts without routing knowledge to reach remote subnets
- Router responds with its own MAC (as if it has the target IP)
- **Disable** if not needed (`no ip proxy-arp`)
- Security risk: can help attackers bypass network segmentation

## Inverse ARP (InARP)
- Maps **DLCI → IP address** (Frame Relay)
- Defined in **RFC 2390**
- Used in Frame Relay to automatically learn remote IP from DLCI
- Enabled by default on Frame Relay interfaces
- Cisco: `no frame-relay inverse-arp` to disable
