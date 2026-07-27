# DMVPN (Dynamic Multipoint VPN)

## Overview
- **Cisco** VPN technology — dynamic, scalable hub-and-spoke VPNs
- Combines: **mGRE** + **NHRP** + **IPsec** + routing protocol
- Spokes build direct tunnels to each other (on-demand)
- No full-mesh config required — spoke-to-spoke tunnels form dynamically

## Components
| Component | Role |
|---|---|
| **mGRE** (Multipoint GRE) | Single tunnel interface with multiple peers |
| **NHRP** (Next Hop Resolution Protocol) | Peer discovery, dynamic tunnel creation |
| **IPsec** | Encryption (protect GRE tunnels) |
| **Routing protocol** | EIGRP/OSPF/BGP (via mGRE tunnel) |

## DMVPN Phases
| Phase | Description |
|---|---|
| **Phase 1** | Hub-and-spoke (all traffic thru hub) |
| **Phase 2** | Spoke-to-spoke tunnels (on-demand) — no spoke-to-spoke routing |
| **Phase 3** | Spoke-to-spoke routing (NHRP redirect — full dynamic routing) |

## NHRP (Next Hop Resolution Protocol)
- Central mapping database on hub (NHS — Next Hop Server)
- Spokes register their public IP (NBMA address) with NHS
- Spokes query NHS to find other spoke's public IP
- Used to build spoke-to-spoke tunnels on-demand

## DMVPN Flow (Spoke-to-Spoke)
```
Spoke1 → traffic to Spoke2's subnet (via mGRE tunnel)
       → NHRP query: "Who has Spoke2's tunnel IP?"
       → Hub (NHS) replies with Spoke2's public IP
       → Spoke1 initiates IPsec tunnel to Spoke2
       → Both spokes exchange routing info (EIGRP/OSPF)
       → Traffic flows directly (spoke-to-spoke)
       → Tunnel times out after idle period
```

## mGRE Interface
- Single tunnel interface on hub — multiple peers
- `tunnel mode gre multipoint` — no tunnel destination
- Each spoke gets separate IPsec SA

## Config Example (Cisco Hub)
```cisco
crypto isakmp policy 10
 encryption aes 256
 authentication pre-share
 group 14

crypto ipsec transform-set TS esp-aes 256 esp-sha-hmac
 mode transport

crypto ipsec profile DMVPN-PROF
 set transform-set TS

interface Tunnel0
 ip address 10.0.0.1 255.255.255.0
 no ip redirects
 ip nhrp authentication NHRPKey
 ip nhrp map multicast dynamic
 ip nhrp network-id 100
 tunnel source GigabitEthernet0/0
 tunnel mode gre multipoint
 tunnel protection ipsec profile DMVPN-PROF
```

## Config Example (Cisco Spoke)
```cisco
interface Tunnel0
 ip address 10.0.0.2 255.255.255.0
 no ip redirects
 ip nhrp authentication NHRPKey
 ip nhrp map multicast 203.0.113.1
 ip nhrp map 10.0.0.1 203.0.113.1
 ip nhrp network-id 100
 ip nhrp nhs 10.0.0.1
 tunnel source GigabitEthernet0/0
 tunnel destination 203.0.113.1        # Phase 1/2: static, Phase 3: dynamic
 tunnel protection ipsec profile DMVPN-PROF
```

## DMVPN Benefits
- **Dynamic** — New spokes add without hub config changes
- **Scalable** — Thousands of spokes
- **Direct spoke-to-spoke** — Optimal path, no hub hairpin
- **Redundancy** — Multiple hubs (dual hub)
