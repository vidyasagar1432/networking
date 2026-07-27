# CAPWAP (Control and Provisioning of Wireless Access Points)

## Overview
- Protocol between **WLC** (Wireless LAN Controller) and **AP** (Access Point)
- Defined in **RFC 5415**, **RFC 5416**
- Replaces proprietary protocols (Cisco LWAPP, etc.)
- Based on **LWAPP** (Lightweight Access Point Protocol)

## Architecture
| Component | Description |
|---|---|
| **WLC** (Controller) | Centralized management, authentication, roaming |
| **AP** (Access Point) | Lightweight AP (no standalone config) |

## Modes
### Split MAC (Cisco default)
- **AP handles**: Real-time 802.11 (beacons, probes, ACKs)
- **WLC handles**: Management (auth, association, roaming, encryption)

### Local MAC
- AP handles more functions locally (less dependency on WLC)

## CAPWAP Tunnels
- Two separate UDP tunnels:
  - **Control**: UDP 5246 (encrypted — DTLS)
  - **Data**: UDP 5247 (optionally encrypted)

### Control Tunnel (UDP 5246)
- AP ↔ WLC management traffic
- Encrypted via **DTLS** (Datagram TLS)
- Configuration, firmware, security keys

### Data Tunnel (UDP 5247)
- Client traffic encapsulated from AP to WLC
- Can be encrypted (DTLS) or clear
- WLC bridges to wired network

## CAPWAP States
```
1. Discovery — AP finds WLC (broadcast, DNS, DHCP)
2. Join — AP authenticates with WLC
3. Image Data — Firmware upgrade if needed
4. Configure — WLC pushes config to AP
5. Data Check — Validate configuration
6. Run — Operational (forwarding traffic)
```

## WLC Discovery Methods
| Method | Description |
|---|---|
| **Broadcast** | AP broadcasts on local subnet |
| **DHCP Option 43** | DHCP server provides WLC IP |
| **DNS** | AP resolves CISCO-CAPWAP-CONTROLLER.localdomain |
| **Over-the-air provisioning** | AP scans for WLC on adjacent SSID |

## AP Modes (Cisco)
| Mode | Description |
|---|---|
| **Local** | Standard mode, serves clients |
| **FlexConnect** | Local switching (remote branch, no WLC needed for data) |
| **Monitor** | Passive scanning (IDS) |
| **Sniffer** | Captures 802.11 frames |
| **Bridge** | Mesh / point-to-point |
| **Rogue Detector** | Classifies rogue APs via wired traffic |

## CAPWAP vs LWAPP
| Feature | CAPWAP | LWAPP |
|---|---|---|
| Standard | IETF (RFC 5415) | Cisco proprietary |
| Transport | UDP | UDP |
| Control encryption | DTLS (mandatory) | Optional |
| Data encryption | DTLS (optional) | No |

## Config Example (WLC)
```bash
config wlan create 1 "Corporate" SSID-Corp
config wlan ssid 1 SSID-Corp
config wlan security wpa akm psk set-key 1 0 P@ssw0rd
config wlan enable 1
```
