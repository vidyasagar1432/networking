# Frame Relay

## Overview
- **Layer 2** WAN protocol — packet-switched (not circuit-switched)
- Defined in **ITU-T Q.922** / ANSI T1.618
- Legacy — largely replaced by MPLS, Ethernet WAN, VPN
- Used for connecting branch offices in the 1990s–2000s

## Key Concepts
| Term | Description |
|---|---|
| **DLCI** (Data Link Connection Identifier) | Virtual circuit identifier (10 bits, 16–1007) |
| **PVC** (Permanent Virtual Circuit) | Static, always-on connection |
| **SVC** (Switched Virtual Circuit) | Dynamic, on-demand (rare) |
| **LMI** (Local Management Interface) | Signaling between router and Frame Relay switch |
| **CIR** (Committed Information Rate) | Guaranteed bandwidth |
| **Bc** (Committed Burst) | Max data per Tc at CIR |
| **Be** (Excess Burst) | Extra data allowed above CIR (DE marked) |
| **DE** (Discard Eligibility) | Marked frames can be dropped first |
| **FECN/BECN** | Forward/Backward Explicit Congestion Notification |

## Frame Format
| Field | Size | Description |
|---|---|---|
| Flag | 1 byte | 01111110 |
| DLCI (high) | 6 bits | |
| C/R | 1 bit | Command/Response |
| EA0 | 1 bit | Extended Address (0 = more bytes) |
| DLCI (low) / FECN/BECN/DE/EA1 | 4 bits | |
| Information | Variable | Payload (IP packet) |
| FCS | 2 bytes | CRC |

## LMI Types
| Type | Standard | Status messages |
|---|---|---|
| **Cisco** | Proprietary | Full status every 60s, keepalive every 10s |
| **ANSI** | T1.617 Annex D | Full status every 60s |
| **ITU-T** | Q.933 Annex A | Full status every 60s |

## Inverse ARP (InARP)
- Maps **DLCI → IP address** automatically (like ARP for Frame Relay)
- Enabled by default on Frame Relay interfaces
- Cisco: `no frame-relay inverse-arp` to disable

## Subinterfaces
- **Point-to-point** — One subnet, one DLCI (like a physical link)
- **Multipoint** — Multiple DLCIs in one subnet (NBMA)
- Resolves **split horizon** issues for routing protocols

## Config Example (Cisco)
```cisco
interface Serial0/0
 encapsulation frame-relay
 frame-relay lmi-type cisco
 frame-relay map ip 10.0.0.2 102 broadcast

interface Serial0/0.1 point-to-point
 ip address 10.0.1.1 255.255.255.0
 frame-relay interface-dlci 102
```
