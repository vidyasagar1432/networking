# Ethernet

## Overview
- Dominant **Layer 2** (Data Link) technology for LANs
- Defined by **IEEE 802.3**
- Originally developed by Xerox PARC (1973), later standardized by IEEE

## Ethernet Frame Format (IEEE 802.3)
| Field | Size |
|---|---|
| Preamble | 7 bytes (alternating 1/0 for sync) |
| Start Frame Delimiter (SFD) | 1 byte (10101011) |
| Destination MAC | 6 bytes |
| Source MAC | 6 bytes |
| EtherType / Length | 2 bytes (≥1536 = EtherType, ≤1500 = Length) |
| Payload (Data) | 46–1500 bytes |
| Frame Check Sequence (FCS/CRC) | 4 bytes |

**802.1Q Tag** (VLAN) — optional 4-byte field inserted between Source MAC and EtherType:
- Tag Protocol ID (TPID): 0x8100 (2 bytes)
- Tag Control Info (TCI): PCP (3 bits), DEI (1 bit), VLAN ID (12 bits)

## MAC Addresses
- **48-bit** address, usually written as hexadecimal (e.g., AA:BB:CC:DD:EE:FF)
- **OUI** (Organizationally Unique Identifier) — first 24 bits identify manufacturer
- **Unicast**: First bit = 0 — addressed to single interface
- **Multicast**: First bit = 1 — addressed to group of interfaces
- **Broadcast**: FF:FF:FF:FF:FF:FF — all devices on LAN
- **Local Administered**: Second bit = 1 — overridden by admin (vs burned-in/universal)

## Half-Duplex vs Full-Duplex
| Feature | Half-Duplex | Full-Duplex |
|---|---|---|
| Data flow | One direction at a time | Both directions simultaneously |
| Collisions | Possible | Not possible |
| CSMA/CD | Required | Not needed |
| Typical use | Hubs, legacy | Switches, modern links |

## CSMA/CD (Carrier Sense Multiple Access / Collision Detection)
- Used in **half-duplex** Ethernet (hubs, legacy)
- **Carrier Sense** — Listen before sending
- **Multiple Access** — Multiple devices share medium
- **Collision Detection** — Detect collision, send jam signal, backoff (exponential)
- Not needed in modern **switched** full-duplex networks

## Ethernet Standards & Speeds
| Standard | Speed | Cable | Max Distance |
|---|---|---|---|
| 10BASE-T | 10 Mbps | Cat3+ | 100m |
| 100BASE-TX (Fast Ethernet) | 100 Mbps | Cat5+ | 100m |
| 1000BASE-T (Gigabit) | 1 Gbps | Cat5e+ | 100m |
| 10GBASE-T | 10 Gbps | Cat6a/7 | 100m |
| 40GBASE-T | 40 Gbps | Cat8 | 30m |
| 1000BASE-LX | 1 Gbps | SMF | 5km |
| 10GBASE-SR | 10 Gbps | MMF | 300m |

## Auto-Negotiation
- Advertises capabilities (speed, duplex) between NIC and switch
- Sends **FLP** (Fast Link Pulses) bursts
- If both sides advertise, highest common speed + duplex is selected
- **Common issue**: Speed mismatch → link down; duplex mismatch → slow performance (FCS errors)

## Switching Concepts
- **MAC Address Table** — Switch learns which MAC is on which port
- **Flooding** — Unknown unicast sent to all ports (except ingress)
- **Forwarding** — Known unicast sent to specific port
- **Filtering** — Frame not forwarded out the port it came from
- **Aging** — MAC entries time out (default ~300 seconds)

## VLAN Tagging (802.1Q)
- Trunk ports carry multiple VLANs using tags
- Native VLAN (default = 1) — untagged on trunk
- **DTP** (Dynamic Trunking Protocol) — auto trunk negotiation (Cisco proprietary)
- **VTP** (VLAN Trunking Protocol) — VLAN database sync across switches

## Common Issues
- **Broadcast Storms** — Loops cause frames to replicate infinitely → STP solution
- **CRC Errors** — Damaged frames (bad cable/interface)
- **Runts (< 64 bytes)** — Collisions or bad NIC
- **Giants (> 1518 bytes)** — Bad NIC or misconfiguration

## Tools
```bash
# Linux
ip link show                      # Interface info (speed, duplex, MAC)
ethtool <interface>               # Detailed link info
brctl show                        # Bridge/MAC table (legacy)
bridge fdb show                   # MAC forwarding table

# macOS
ifconfig                          # Interface info
arp -a                            # ARP table (MAC/IP mappings)

# Windows
getmac                            # MAC address
ipconfig /all                     # MAC + IP info
```
