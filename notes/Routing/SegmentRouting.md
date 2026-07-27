# Segment Routing (SR-MPLS / SRv6)

## Overview
- **Source routing** paradigm — ingress node encodes path as a list of segments
- No per-flow state on transit routers (unlike RSVP-TE)
- Defined in **RFC 8402** (Segment Routing Architecture)
- Two data planes: **SR-MPLS** (MPLS labels) and **SRv6** (IPv6 extension headers)

## Key Concepts
| Term | Description |
|---|---|
| **Segment** | Instruction (MPLS label or IPv6 address) |
| **SID** (Segment ID) | Identifier for a segment |
| **Segment List** | Ordered list of SIDs (the path) |
| **SRGB** (SID Block) | Label range reserved for SR (default 16000–23999) |
| **IGP Segment** | Prefix or adjacency segment from IGP |
| **BGP Segment** | Prefix SID from BGP |
| **SR Policy** | Explicit path (segment list) |

## Segment Types

### IGP Segments
| Type | Description | Scope |
|---|---|---|
| **Prefix-SID** | Shortest-path to prefix (like an LDP label) | Global |
| **Adjacency-SID** | Specific link (strict path) | Local |
| **Node-SID** | Prefix-SID for router loopback | Global |

### BGP Segments
- **BGP Prefix-SID** — Label for BGP route
- Mapped to: Peering-SID (adjacency), EPE (Egress Peer Engineering)

## SR-MPLS
- Segments = MPLS labels
- **Global labels** (SRGB) — allocated per prefix, advertised via IGP
- **Adjacency labels** — per link, local significance
- **No LDP/RSVP** — IGP (OSPF/IS-IS) carries label info

### Segment List Example
```
Ingress Push [16002, 16004, 16006] → LSR1 Swap 16002→Pop → LSR2 ... → Destination
```
Each label is a prefix-SID for the destination router.

## SRv6
- Segments = **IPv6 addresses** (128-bit)
- Encoded in **SRH** (Segment Routing Header) — IPv6 extension header
- SID format: `locator:function:args` (IPv6 address structure)
- No MPLS required — native IPv6

### SRH
```
[IPv6 Header | SRH Next Header | SRH (Segment List, SL) | Payload]
```
- **SL** (Segment Left) — current position in segment list
- **Active segment** = Segments[SL]
- Update DA to next segment, decrement SL

## SR-MPLS vs LDP
| Feature | LDP | SR-MPLS |
|---|---|---|
| Label distribution | LDP protocol | IGP (OSPF/IS-IS) |
| State | Full label table | No per-flow state |
| TI-LFA | Complex | Native (anycast SID) |
| TE | Requires RSVP-TE | SR Policy (automated) |

## TI-LFA (Topology Independent Loop-Free Alternate)
- Fast-reroute using SR — post-convergence path pre-computed
- **100% coverage** (unlike regular LFA)
- Segment list protects against any single failure

## OSPF/IS-IS Extensions
- **OSPF**: OSPF Extended Prefix LSAs, SID sub-TLV
- **IS-IS**: IS-IS SR extensions (prefix-SID, adjacency-SID)

## Config Example (Cisco IOS-XR SR-MPLS)
```cisco
segment-routing mpls
  global-block 16000 23999

router isis CORE
 address-family ipv4 unicast
  metric-style wide
  segment-routing mpls
   prefix-sid-mapping 1
  !
  interface Loopback0
   address-family ipv4 unicast
    prefix-sid absolute 16001
   !
  !
!
segment-routing mpls
  sr-policy
   policy POL1
    color 100 end-point 192.168.0.1
    candidate-path
     preference 100
     explicit segment-list PATH1
    !
   !
  !
  segment-list PATH1
   index 10 mpls label 16003
   index 20 mpls label 16005
  !
```
