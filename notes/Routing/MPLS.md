# MPLS (Multiprotocol Label Switching)

## Overview
- **Label-based switching** — forwards packets based on labels (not IP headers)
- Operates between Layer 2 and Layer 3 ("Layer 2.5")
- Defined in **RFC 3031**
- Used in: ISP backbones, VPNs, Traffic Engineering, QoS

## Key Concepts
- **Label** — Fixed-length 20-bit identifier (inserted as shim header)
- **FEC** (Forwarding Equivalence Class) — Group of packets forwarded the same way
- **LSP** (Label Switched Path) — Path through MPLS network
- **LDP** (Label Distribution Protocol) — Distributes labels between LSRs
- **CEF** (Cisco Express Forwarding) — Required switching mode (FIB + LFIB)

## MPLS Header (Shim)
| Field | Bits | Description |
|---|---|---|
| **Label** | 20 | Forwarding label (0–1,048,575) |
| **Exp** (Experimental) | 3 | QoS / CoS (also called TC) |
| **S** (Bottom of Stack) | 1 | 1 = last label in stack |
| **TTL** | 8 | Time-to-live (like IP TTL) |

Total: **4 bytes** (inserted between L2 header and L3 payload)

## Label Operations
| Operation | Description |
|---|---|
| **Push** | Insert label (ingress LER) |
| **Swap** | Replace label (transit LSR) |
| **Pop** | Remove label (egress LER — penultimate hop popping) |
| **PHP** (Penultimate Hop Popping) | Pop label before final hop (egress doesn't need to look up) |

## Router Roles
| Role | Description |
|---|---|
| **LER** (Label Edge Router) | Ingress/egress — push/pop labels |
| **LSR** (Label Switch Router) | Transit — swap labels |
| **LSP** | Path through MPLS network |

## MPLS Architecture
```
IP ─→ LER (push label) ─→ LSR (swap) ─→ LSR (swap) ─→ LER (pop label) → IP
```

## LDP (Label Distribution Protocol)
- Distributes label bindings between LSRs
- Uses **UDP 646** (discovery) and **TCP 646** (session)
- Discovers neighbors via **multicast 224.0.0.2**
- **LIB** (Label Information Base) — all label bindings
- **LFIB** (Label FIB) — active label entries used for forwarding

## Label Allocation Modes
- **Independent** — Each LSR allocates labels independently
- **Ordered** — Labels allocated from egress → ingress (per RFC)

## MPLS VPNs
- **Layer 3 VPN** — VRF-based (provider routes in VPNv4 table)
- **Layer 2 VPN** (VPWS/VPLS) — Ethernet point-to-point / multipoint
- Uses **MP-BGP** (Multiprotocol BGP) for VPN route distribution
- **RD** (Route Distinguisher) — Makes overlapping VPN routes unique
- **RT** (Route Target) — Controls route import/export between VRFs

## Label Stack / MPLS over TE / FRR
- **Label stacking** — Multiple labels for hierarchy (e.g., VPN label + transport LSP label)
- **Traffic Engineering** — Explicit LSPs with bandwidth constraints (RSVP-TE / CR-LDP)
- **FRR** (Fast Reroute) — Backup LSP for sub-50ms failover

## Traffic Engineering (MPLS-TE)
- **CR-LDP** — Constraint-based LDP (deprecated)
- **RSVP-TE** — RSVP with traffic engineering extensions (most common)
- **Attributes**: bandwidth, affinity (color), explicit path
- **Tunnel interface** — headend configuration

## Cisco Configuration
```cisco
! Enable MPLS
ip cef
mpls ip
mpls label protocol ldp

interface GigabitEthernet0/0
 mpls ip
 mpls mtu 1508                    # Adjust for MPLS header

! LDP
mpls ldp router-id Loopback0 force
mpls ldp neighbor 10.0.0.2 password MPLSKey

! VRF for L3VPN
ip vrf CUSTOMER
 rd 65000:1
 route-target export 65000:100
 route-target import 65000:100
```

## Troubleshooting
```bash
show mpls ldp neighbor
show mpls ldp bindings
show mpls forwarding-table
show mpls interfaces
show ip cef
show ip route vrf CUSTOMER
ping mpls ipv4 10.0.0.1/32
traceroute mpls ipv4 10.0.0.1/32
```
