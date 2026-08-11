# EtherChannel

## Overview
- **Link aggregation** — bundles multiple physical links into a single logical link
- Increases bandwidth (not strictly additive — load-balancing dependent)
- Provides redundancy: if one link fails, traffic shifts to remaining links
- IEEE standard: **802.3ad** (now **802.1AX**)

## Benefits
- **More bandwidth** — up to 8 active links per channel (LACP supports 16: 8 active + 8 standby)
- **Redundancy** — automatic failover within milliseconds
- **Load balancing** — traffic distributed across links
- **STP treats it as one link** — no blocked ports

## Load Balancing Methods
Hash-based across source/destination combinations:
- **Source MAC** — src_mac
- **Destination MAC** — dst_mac
- **Source+Dest MAC** — src-dst-mac
- **Source IP** — src_ip
- **Destination IP** — dst_ip
- **Source+Dest IP** — src-dst-ip (most common for L3)  
- **Source+Dest TCP/UDP port** — src-dst-port

Hash → selects link (typically XOR over link IDs)

## Configuration Modes
| Mode | Protocol | Description |
|---|---|---|
| **On** | — | Static, no negotiation (no LACP/PAgP) — both sides must match |
| **Active** | LACP | Initiates negotiation (sends LACPDUs) |
| **Passive** | LACP | Responds to negotiation (doesn't initiate) |
| **Auto** | PAgP | Responds but doesn't initiate |
| **Desirable** | PAgP | Initiates negotiation |

## Compatibility
```
Active ↔ Active / Passive  (LACP)
Passive ↔ Active           (LACP)
Desirable ↔ Desirable / Auto (PAgP)
Auto ↔ Desirable           (PAgP)
On ↔ On                    (Static)
```

## LACP (Link Aggregation Control Protocol)
- Open standard (IEEE 802.3ad / 802.1AX)
- Uses **LACPDUs** (multicast 01:80:c2:00:00:02)
- System priority + Port priority for election
- **Max 8 active**, 4 standby links per group
- Port-channel interface number must match on both sides (Cisco)

### LACP Configuration (Cisco)
```cisco
interface range GigabitEthernet0/1-2
 channel-group 1 mode active
interface port-channel 1
 switchport mode trunk
 switchport trunk allowed vlan 10,20,30
```

### LACP Fast vs Normal
- **Fast** — LACPDU every 1s (3s timeout)
- **Normal** — LACPDU every 30s (90s timeout)
```cisco
lacp rate fast
```

### LACP Parameters
| Parameter | Range | Default |
|---|---|---|
| System Priority | 1–65535 | 32768 |
| Port Priority | 1–65535 | 32768 |

## PAgP (Port Aggregation Protocol)
- **Cisco proprietary**
- Uses PAgP packets (multicast 01:00:0c:cc:cc:cc)
- Similar to LACP but less flexible

### PAgP Configuration
```cisco
interface range FastEthernet0/1-2
 channel-group 1 mode desirable
```

## Interface Requirements
All interfaces in an EtherChannel must match:
- Same speed and duplex
- Same VLAN mode (access/trunk)
- Same native VLAN (if trunk)
- Same allowed VLAN list (if trunk)
- Same STP parameters (portfast, guard, etc.)

## LACP vs PAgP
| Feature | LACP | PAgP |
|---|---|---|
| Standard | IEEE 802.3ad/802.1AX | Cisco proprietary |
| Max active links | 8 | 8 |
| Standby links | 4 | 0 |
| Multi-vendor | Yes | No |
| Rate control | Fast/Normal | — |

## Troubleshooting
```bash
show etherchannel summary
show etherchannel port-channel
show etherchannel load-balance
show interfaces port-channel 1
show lacp neighbor
show lacp internal
show pagp neighbor
```
