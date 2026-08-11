# PTP (Precision Time Protocol)

## Overview
- **IEEE 1588** — high-precision time synchronization
- Sub-microsecond accuracy (vs NTP millisecond)
- Used in: financial trading, telecom (5G), industrial automation, power grids
- Hardware timestamping required for best accuracy

## PTP vs NTP
| Feature | NTP | PTP (IEEE 1588) |
|---|---|---|
| Precision | 1–50 ms (LAN) | < 1 µs (hardware timestamp) |
| Transport | UDP 123 | UDP 319/320 |
| Architecture | Client/Server | Master/Slave (BC, TC, OC) |
| Hardware support | Software only | Hardware timestamp (PHC) |
| Complexity | Simple | Moderate |

## PTP Architecture
| Component | Description |
|---|---|
| **OC** (Ordinary Clock) | Single port — master or slave endpoint |
| **BC** (Boundary Clock) | Multiple ports — one slave, one+ master (re-times) |
| **TC** (Transparent Clock) | Forwards PTP, corrects residence time |
| **GM** (Grandmaster) | Root time source (GPS, atomic clock) |

## PTP Version 1 (IEEE 1588-2002)
- **Sync/FollowUp** — two-step mode only
- Limited to Ethernet

## PTP Version 2 (IEEE 1588-2008)
- **One-step** — timestamp in Sync message (no FollowUp)
- **Two-step** — Sync + FollowUp (legacy)
- **Peer delay** — measures link delay per port (vs end-to-end)
- **Announce message** — Best Master Clock Algorithm (BMCA)
- **Transparent clock** support

## PTP Profiles
| Profile | Domain | Description |
|---|---|---|
| **Default** | General | 1588v2 default parameters |
| **Telecom** (G.8265.1) | Frequency sync | Frequency only (no phase) |
| **Telecom** (G.8275.1) | Phase/time | Full phase sync, BC only |
| **Telecom** (G.8275.2) | Phase/time | Partial support (TC allowed) |
| **Power** (C37.238) | Substation | IEC 61850 |
| **AVB** (802.1AS) | Audio/Video | gPTP (generalized PTP) |
| **SMPTE ST 2059** | Broadcast | Video/audio sync |

## PTP Messages
| Message | Type | Description |
|---|---|---|
| **Sync** | Event | Master sends timestamp |
| **Follow_Up** | General | Precise timestamp (two-step) |
| **Delay_Req** | Event | Slave requests round-trip |
| **Delay_Resp** | General | Master responds to Delay_Req |
| **PDelay_Req** | Event | Peer delay request (TC) |
| **PDelay_Resp** | General | Peer delay response |
| **Announce** | General | Grandmaster attributes (BMCA) |
| **Signaling** | General | Negotiation |

## PTP Timing Flow
```
Master → Sync (t1)
Master → Follow_Up (t1)        # Only in two-step
Slave → Delay_Req
Master → Delay_Resp (t4)

Offset = (t2 - t1) - (t4 - t3) / 2
```

## PTP in Linux
```bash
# Check PHC (PTP Hardware Clock)
ethtool -T eth0                # Check hardware timestamping

# ptp4l (Linux PTP project)
ptp4l -i eth0 -m --step_threshold=1

# phc2sys (sync system clock to PHC)
phc2sys -s eth0 -c CLOCK_REALTIME -m

# Configure /etc/linuxptp/ptp4l.conf
[global]
domainNumber 24
network_transport L2
```

## SNTP (Simple Network Time Protocol)
- **RFC 4330** — simplified NTP (subset of NTPv4)
- **No error estimation** — just sets clock (no filtering, no jitter calculation)
- Less accurate than full NTP
- Some IoT devices use SNTP for simplicity
