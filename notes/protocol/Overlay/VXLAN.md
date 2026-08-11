# VXLAN (Virtual Extensible LAN)

## Overview
- **Overlay** network technology — encapsulates Layer 2 Ethernet in UDP
- Defined in **RFC 7348** (original), **RFC 8365** (EVPN)
- Extends VLANs across a Layer 3 underlay (IP network)
- **24-bit VNI** (VXLAN Network Identifier) — up to 16 million segments (vs 4094 VLANs)

## Encapsulation
```
[Outer MAC | Outer IP | UDP | VXLAN | Inner MAC | Inner IP | Payload | FCS]
```

| Field | Description |
|---|---|
| **Outer MAC** | Underlay destination MAC (next-hop) |
| **Outer IP** | Underlay source/dest IP (VTEP addresses) |
| **UDP** | Port 4789 (IANA assigned) |
| **VXLAN** | Flags (8 bits) + Reserved (24 bits) + VNI (24 bits) + Reserved (8 bits) |
| **Inner MAC** | Original Ethernet frame |

## VTEP (VXLAN Tunnel Endpoint)
- Encapsulates/decapsulates VXLAN traffic
- Can be: switch, router, server (hypervisor)
- VTEPs communicate over the IP underlay

## VXLAN Packet Flow
```
VM1 (VNI 100) → VTEP1 → IP Underlay → VTEP2 → VM2 (VNI 100)
```
- VTEP1 encapsulates: inner frame + VNI 100 → UDP 4789 → destination VTEP2 IP
- VTEP2 decapsulates, strips outer headers, forwards to VM2

## VXLAN Modes
| Mode | Learning | Description |
|---|---|---|
| **Flood-and-learn** | Data-plane | ARP flooding (like traditional Ethernet) |
| **EVPN** (BGP) | Control-plane | BGP EVPN distributes MAC/VTEP mappings (no flooding) |

## VXLAN & EVPN
- **BGP EVPN** (RFC 7432) is the preferred control plane for VXLAN
- Distributes: MAC addresses, IPs, VNI mappings, VTEP info
- Type 2 route: MAC/IP advertisement
- Type 3 route: IMET (Inclusive Multicast Ethernet Tag) — multicast group per VNI

## VXLAN vs VLAN
| Feature | VLAN (802.1Q) | VXLAN |
|---|---|---|
| Segment ID | 12 bits (4094) | 24 bits (16M) |
| Transport | Layer 2 (same subnet) | Layer 3 (IP underlay) |
| Encapsulation | 802.1Q tag | MAC-in-UDP |
| Scope | Single data center | Multi-DC, WAN |
| Learning | Data-plane (MAC table) | Data-plane or EVPN |

## Config Example (Cisco NX-OS)
```cisco
feature nv overlay

interface nve1
 no shutdown
 source-interface loopback0
 member vni 10010
  ingress-replication protocol bgp
```

## VXLAN Chassis (VXLAN to the host)
- **VXLAN Gateway** — connects VXLAN fabric to classic VLAN network

## Geneve vs VXLAN
- **Geneve** (Generic Network Virtualization Encapsulation — RFC 8926) is a newer, more flexible overlay
- Variable-length options (TLV), larger header
- VXLAN is more widely deployed (simpler)
