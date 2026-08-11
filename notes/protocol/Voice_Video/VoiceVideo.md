# Voice & Video Protocols (SIP, H.323, MGCP, SCCP)

## Overview
- Protocols for **VoIP** (Voice over IP) and video conferencing
- Three categories: **signaling**, **media**, and **gateway control**

## SIP (Session Initiation Protocol)
- **Dominant** VoIP signaling protocol (RFC 3261)
- Text-based (HTTP-like), peer-to-peer
- **RFC 3261**, uses UDP/TCP 5060, TLS 5061
- Detailed in [SIP.md](SIP.md)

## H.323
- **ITU-T** standard for multimedia conferencing (1996)
- Comprehensive suite: signaling, registration, codec negotiation, call control
- **Binary** encoding (ASN.1 PER)

### H.323 Components
| Component | Description |
|---|---|
| **Terminal** | Endpoint (phone, softphone) |
| **Gatekeeper** | Address translation, admission control (optional) |
| **Gateway** | H.323 ↔ other networks (SIP, PSTN) |
| **MCU** (Multipoint Control Unit) | Multi-party conferencing |

### H.323 Protocols
| Protocol | Purpose |
|---|---|
| **H.225** | Call signaling (Q.931) + RAS (Registration/Admission/Status) |
| **H.245** | Capability exchange, media channel negotiation |
| **H.235** | Security |
| **H.450.x** | Supplementary services (hold, transfer) |
| **RTP/RTCP** | Media transport |

### H.323 vs SIP
| Feature | H.323 | SIP |
|---|---|---|
| Architecture | Gatekeeper-controlled | Peer-to-peer |
| Message format | Binary (ASN.1) | Text (like HTTP) |
| Complexity | High | Moderate |
| Scalability | Moderate | High |
| Status | Legacy / declining | Dominant |

## MGCP (Media Gateway Control Protocol)
- **RFC 3435** — gateway control protocol
- **Master/slave** architecture: Call Agent controls Media Gateway
- **Text-based** (commands: CRCX, MDCX, DLCX, RQNT, NTFY)

### MGCP Components
| Component | Description |
|---|---|
| **Call Agent** (Softswitch) | Central intelligence — call routing |
| **Media Gateway (MG)** | Trunking gateway (TDM ↔ IP) |
| **Signaling Gateway** | SS7 ↔ IP |
| **Residential Gateway** | Endpoint (home) |

### MGCP Commands
| Command | Description |
|---|---|
| **CRCX** | Create Connection |
| **MDCX** | Modify Connection |
| **DLCX** | Delete Connection |
| **RQNT** | Request Notification (detect DTMF) |
| **NTFY** | Notify (user dialed digits) |

## SCCP (Skinny Call Control Protocol)
- **Cisco proprietary** — CallManager ↔ Cisco IP Phones
- **Lightweight** — client/server (skinny client, call processing on server)

### SCCP Messages
| Message | Purpose |
|---|---|
| **StationRegister** | Phone registers with CallManager |
| **StationKeypadButton** | User pressed button/DTMF |
| **StationSetLamp** | Turn line lamp on/off (blinking) |
| **StationStartTone** | Play dial tone |
| **StationOpenReceiveChannel** | Prepare to receive RTP |
| **StationCloseReceiveChannel** | Stop receiving media |

### SCCP vs SIP
| Feature | SCCP | SIP |
|---|---|---|
| Architecture | Client/Server (CallManager) | Peer-to-peer |
| Vendor | Cisco proprietary | Standard (RFC 3261) |
| Features | Cisco-specific | Standards-based |
| Status | Legacy (migrating to SIP) | Modern |

## Media Transport
- **RTP** (Real-time Transport Protocol) — carries audio/video
- **RTCP** — QoS statistics
- **SRTP** — Encrypted RTP (AES)
- **Codecs**: G.711 (PCMU/PCMA), G.722 (wideband), G.729 (compressed), Opus

### Common Codecs
| Codec | Bitrate | Use |
|---|---|---|
| G.711 | 64 Kbps | Standard uncompressed voice |
| G.722 | 48–64 Kbps | Wideband (HD voice) |
| G.729 | 8 Kbps | Compressed (low bandwidth) |
| Opus | 6–510 Kbps | Modern, adaptive (WebRTC) |

## Call Flow Example (MGCP)
```
1. Phone → MG: Off-hook
2. MG → CA: NTFY (L1/hd)
3. CA → MG: RQNT (play dialtone) + CRCX (ringback)
4. MG → Phone: Dial tone
5. User dials → MG → CA: NTFY (digits)
6. CA → MG: RQNT (stop dialtone, ring) + CRCX (connect)
7. Phone rings → User answers
```
