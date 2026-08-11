# NTP (Network Time Protocol)

## Overview
- Synchronizes clocks across devices
- Defined in **RFC 5905** (NTPv4)
- Uses **UDP port 123**
- Hierarchical — **Stratum** levels
- Accuracy: milliseconds (LAN), tens of ms (WAN)

## Stratum Levels
| Stratum | Description |
|---|---|
| **0** | Reference clock (atomic, GPS, radio) — not on network |
| **1** | Directly connected to Stratum 0 (primary time server) |
| **2** | Syncs from Stratum 1 |
| **3** | Syncs from Stratum 2 |
| ... | ... |
| **15** | Max |
| **16** | Unsynchronized |

- **Lower stratum = more accurate**
- A device can be a **client** (syncs to higher stratum) and **server** (serves lower stratum)

## NTP Packet
- Uses **UDP port 123**
- Key fields: Leap Indicator, Version, Mode, Stratum, Poll Interval, Precision, Root Delay, Root Dispersion, Reference ID, Reference Timestamp, Originate/Receive/Transmit Timestamps

## NTP Modes
| Mode | Value | Description |
|---|---|---|
| **Client** | 3 | Polls server |
| **Server** | 4 | Responds to client |
| **Broadcast** | 5 | Server broadcasts time periodically |
| **Symmetric Active** | 1 | Peer-to-peer synchronization |
| **Symmetric Passive** | 2 | Auto-respond to symmetric peer |

## Clock Hierarchy
- **Server mode** — device serves time to others
- **Client mode** — device syncs from higher stratum
- **Symmetric mode** — peers cross-check (for redundancy)
- **Broadcast mode** — efficient for LANs (one-way)

## Association Modes
- **Client/Server** — Unidirectional (client polls server)
- **Symmetric** — Bidirectional cross-checking
- **Broadcast/Multicast** — One-to-many

## Authentication
- **Symmetric key** — Shared key (MD5/SHA1)
- **Autokey** — Public key infrastructure (PKI) — deprecated
- **NTS** (Network Time Security) — RFC 8915 — modern replacement

## Cisco Configuration
```cisco
! Client
ntp server 132.163.96.1
ntp server 132.163.97.1 prefer

! Server
ntp master 5                    # Serve time as Stratum 5

! Authentication
ntp authenticate
ntp authentication-key 1 md5 NTPKey
ntp trusted-key 1
ntp server 132.163.96.1 key 1

! Source interface
ntp source Loopback0
```

## Stratum Configuration
- `ntp master <stratum>` — Device acts as NTP server (e.g., `ntp master 5`)
- Without external reference, it's the stratum specified

## Common Commands
```bash
show ntp status
show ntp associations
show ntp associations detail
debug ntp packets
debug ntp sync

# Linux
timedatectl status                  # System time info
chronyc sources -v                  # Chrony sources
ntpq -p                            # Standard NTP peers
```
