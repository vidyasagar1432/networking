# Wi-Fi (IEEE 802.11)

## Overview
- Wireless LAN standard — IEEE 802.11
- PHY + MAC layers
- Operates in 2.4 GHz, 5 GHz, and 6 GHz bands

## 802.11 Standards
| Standard | Year | Band | Max Rate | Channel Width | MIMO |
|---|---|---|---|---|---|
| **802.11a** | 1999 | 5 GHz | 54 Mbps | 20 MHz | 1×1 |
| **802.11b** | 1999 | 2.4 GHz | 11 Mbps | 20 MHz | 1×1 |
| **802.11g** | 2003 | 2.4 GHz | 54 Mbps | 20 MHz | 1×1 |
| **802.11n** (Wi-Fi 4) | 2009 | 2.4/5 GHz | 600 Mbps | 20/40 MHz | 4×4 |
| **802.11ac** (Wi-Fi 5) | 2013 | 5 GHz | 6.9 Gbps | 20/40/80/160 MHz | 8×8 |
| **802.11ax** (Wi-Fi 6) | 2019 | 2.4/5/6 GHz | 9.6 Gbps | 20/40/80/160 MHz | 8×8 |
| **802.11be** (Wi-Fi 7) | 2024 | 2.4/5/6 GHz | 46 Gbps | 20–320 MHz | 16×16 |

## PHY Layer Technologies
| Technology | Standards | Description |
|---|---|---|
| **DSSS** | 802.11b | Direct Sequence Spread Spectrum |
| **OFDM** | 802.11a/g | Orthogonal Frequency Division Multiplexing |
| **HT-OFDM** | 802.11n | High Throughput (MIMO + wider channels) |
| **VHT-OFDM** | 802.11ac | Very High Throughput (MU-MIMO, 160MHz) |
| **OFDMA** | 802.11ax | Orthogonal Frequency Division Multiple Access |
| **EHT** | 802.11be | Extremely High Throughput (320 MHz, 4096-QAM, CMU-MIMO) |

## Security Protocols
| Protocol | Year | Description |
|---|---|---|
| **WEP** | 1997 | Weak RC4 — broken (crack in minutes) |
| **WPA** | 2003 | TKIP + RC4 — interim fix, still weak |
| **WPA2** | 2004 | AES-CCMP — mandatory (802.11i) |
| **WPA3** | 2018 | SAE handshake, GCMP-256, PMF, OWE |

### WPA2 (802.11i)
- **AES-CCMP** encryption (128-bit)
- **4-way handshake** for key exchange
- **PSK** (Pre-Shared Key) or **802.1X** (Enterprise mode)
- **KRACK** vulnerability (2017) — patched

### WPA3
- **SAE** (Simultaneous Authentication of Equals) — replaces PSK 4-way handshake
- **Forward secrecy** — captured traffic can't be decrypted later
- **OWE** (Opportunistic Wireless Encryption) — open network encryption
- **192-bit suite** for government/enterprise
- **PMF** (Protected Management Frames) — mandatory

## Wi-Fi 6 (802.11ax) Key Features
- **OFDMA** — Efficient sub-carrier allocation (multi-user)
- **MU-MIMO** — Up to 8×8 downlink + uplink
- **1024-QAM** — Higher modulation (more bits/symbol)
- **Target Wake Time (TWT)** — IoT power saving
- **BSS Coloring** — Spatial reuse (co-channel interference reduction)
- **6 GHz band** (Wi-Fi 6E)

## Wi-Fi 7 (802.11be) Key Features
- **320 MHz channels** — double Wi-Fi 6
- **4096-QAM** — 20% more throughput
- **CMU-MIMO** (Coordinated MU-MIMO) — multi-AP coordination
- **Multi-link operation (MLO)** — simultaneous bands
- **Preamble puncturing** — flexible channel use

## 802.11 Frame Types
| Type | Subtype | Examples |
|---|---|---|
| **Management** | 0–7 | Beacon, Probe Req/Resp, Assoc, Auth, Reassoc |
| **Control** | 8–15 | RTS, CTS, ACK, Block ACK, PS-Poll |
| **Data** | 0–7 | Data, Null, QoS Data |

## Wi-Fi Channels (2.4 GHz)
- Channels 1–13 (global), 1–11 (US)
- **Non-overlapping**: 1, 6, 11 (20 MHz)
- 40 MHz: 3 + 8 (HT40 in 802.11n)

## Wi-Fi Channels (5 GHz)
- UNII-1: 36–48 (low power, indoor)
- UNII-2: 52–64 (DFS — radar avoidance)
- UNII-2e: 100–144 (DFS)
- UNII-3: 149–165 (high power, outdoor)

## Troubleshooting
```bash
iw dev wlan0 scan              # Scan APs
iwconfig wlan0                 # Link quality
iw reg get                     # Regulatory domain
tcpdump -ni wlan0 port 5500    # 802.11 capture (monitor mode)
```
