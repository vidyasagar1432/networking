# EVPN (Ethernet VPN)

## Overview
- **BGP-based** control plane for Layer 2/Layer 3 VPNs
- Defined in **RFC 7432** (BGP MPLS-Based EVPN), **RFC 8365** (VXLAN EVPN)
- Replaces: VPLS, TRILL, SPB — provides unified control plane for overlays
- Used in: Data center (VXLAN EVPN), Service provider (MPLS EVPN)

## Key Concepts
| Term | Description |
|---|---|
| **EVI** (EVPN Instance) | Logical VPN (maps to VNI or VPLS instance) |
| **MAC-VRF** | MAC forwarding table per EVI |
| **IP-VRF** | IP forwarding table (L3VPN) |
| **VTEP** (VXLAN Tunnel Endpoint) | Overlay endpoint |
| **ESI** (Ethernet Segment ID) | Identifies multi-homed site |

## EVPN Route Types (NLRI)
| Type | Name | Purpose |
|---|---|---|
| 1 | Ethernet Auto-Discovery | Redundency (ESI, split-horizon) |
| 2 | MAC/IP Advertisement | Host MAC + IP (with VNI) |
| 3 | Inclusive Multicast Ethernet Tag (IMET) | Broadcast/multicast tunnel |
| 4 | Ethernet Segment | Multi-homed ESI discovery |
| 5 | IP Prefix Route | Inter-subnet (L3) prefix advertising |

## EVPN Benefits over VPLS
| Feature | VPLS | EVPN |
|---|---|---|
| MAC learning | Data-plane (flood) | Control-plane (BGP) |
| Convergence | Slow (MAC flush) | Fast (BGP withdraw) |
| Multi-homing | Complex (STP) | Native (ESI/ES-Import) |
| Efficiency | Flood all | IMET per EVI |

## EVPN Multi-Homing
- **Single-active** — One PE forwards, others standby
- **All-active** — All PEs forward (per-flow load balance)
- **DF Election** (Designated Forwarder) per ESI

## EVPN VXLAN (Data Center)
```
VM1 → VTEP1 (VNI 10010) → IP Fabric → VTEP2 (VNI 10010) → VM2
```
- BGP EVPN distributes MAC/IP/VTEP mappings (no flooding)
- **Type 2 route**: MAC + IP + VNI + VTEP-IP
- **Type 3 route**: Multicast group per EVI (BUM traffic)

## EVPN MPLS (Service Provider)
- Similar architecture with MPLS labels instead of VNI
- Uses MPLS transport (LDP/RSVP-TE/Segment Routing)

## Config Example (Cisco NX-OS EVPN VXLAN)
```cisco
feature bgp
feature vn-segment-vlan-based
feature nv overlay

evpn
 vni 10010 l2
  rd auto
  route-target import auto
  route-target export auto

interface nve1
 no shutdown
 source-interface loopback0
 member vni 10010
  ingress-replication protocol bgp

router bgp 65000
 address-family l2vpn evpn
  neighbor 10.0.0.2 remote-as 65000
  neighbor 10.0.0.2 update-source loopback0
  neighbor 10.0.0.2 address-family l2vpn evpn
```

## TRILL (Transparent Interconnection of Lots of Links)
- **RFC 6325** — RBridges (Routing Bridges)
- Layer 2 multipath (replaces STP)
- Uses IS-IS for topology + MAC learning
- **Legacy** — replaced by VXLAN/EVPN/SPB

## SPB (Shortest Path Bridging)
- **IEEE 802.1aq** — Layer 2 multipath
- Uses IS-IS — computes shortest path trees
- SPBM (MAC mode) — VLAN-based
- SPBV (VID mode) — Shortest Path Tree VLAN
- Evolved into TRILL → largely replaced by EVPN/VXLAN

## BGP EVPN
- EVPN address family in BGP
- AFI/SAFI: L2VPN/EVPN (AFI=25, SAFI=70)
- MP-BGP carries EVPN NLRI with next-hop (VTEP IP)
- RT/RD for multi-tenancy
