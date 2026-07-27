# HDLC (High-Level Data Link Control)

## Overview
- **Layer 2** framing protocol (ISO 3309)
- Derived from SDLC (IBM)
- Used on **serial links** (T1/E1, leased lines)
- **Cisco HDLC** — proprietary extension with protocol type field (standard HDLC lacks this)

## Frame Format
| Field | Size | Description |
|---|---|---|
| Flag | 8 bits | 01111110 (frame delimiter) |
| Address | 8+ bits | Destination (usually broadcast 0xFF) |
| Control | 8/16 bits | Frame type (I, S, U) |
| Protocol (Cisco) | 16 bits | Protocol type (0x0800=IP, 0x0806=ARP) |
| Payload | Variable | Upper-layer data |
| FCS | 16/32 bits | CRC |

**Bit stuffing**: After five consecutive 1s, a 0 is inserted (to avoid flag confusion).

## Frame Types
| Type | Description |
|---|---|
| **I-frame** (Information) | Data transfer, sequence numbered |
| **S-frame** (Supervisory) | Flow control & error control (RR, RNR, REJ) |
| **U-frame** (Unnumbered) | Link management (SABM, DISC, UA, DM, FRMR) |

## Standard HDLC vs Cisco HDLC
| Feature | Standard HDLC | Cisco HDLC |
|---|---|---|
| Multiprotocol | No (single protocol) | Yes (Protocol field) |
| Proprietary | ISO standard | Cisco proprietary |
| Use | Rare (X.25, LAPB) | Cisco serial links (default) |

## Common Uses
- **T1/E1** serial interfaces (Cisco default encapsulation)
- **PPP** is preferred today (standard, features, auth)

## Config (Cisco)
```cisco
interface Serial0/0
 encapsulation hdlc           # Default on Cisco serial
```
