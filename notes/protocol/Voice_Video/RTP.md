# RTP (Real-time Transport Protocol)

## Overview
- Carries real-time media (audio, video) over IP
- Defined in **RFC 3550**
- Typically runs over **UDP** (ephemeral ports, commonly 16384–32767)
- Used with **RTCP** for QoS feedback

## RTP Header
| Field | Bits | Description |
|---|---|---|
| V | 2 | Version (2) |
| P | 1 | Padding |
| X | 1 | Extension header |
| CC | 4 | CSRC count |
| M | 1 | Marker (frame boundary) |
| PT | 7 | Payload Type (codec) |
| Sequence Number | 16 | Packet order |
| Timestamp | 32 | Sampling instant |
| SSRC | 32 | Synchronization source |
| CSRC | 0–60 | Contributing sources |

## Payload Types (PT)
| PT | Codec | Rate |
|---|---|---|
| 0 | PCMU (u-law) | 8000 Hz |
| 3 | GSM | 8000 Hz |
| 8 | PCMA (A-law) | 8000 Hz |
| 9 | G.722 | 16000 Hz |
| 97–127 | Dynamic (Opus, H.264, VP8) | Varies |

## RTCP (RTP Control Protocol)
- Port: RTP port + 1
- **SR** (Sender Report) — stats from active sender
- **RR** (Receiver Report) — stats from receiver
- **SDES** — Source description (CNAME)
- **BYE** — End of participation
- Reports: fraction lost, cumulative lost, jitter, delay

## SRTP (Secure RTP)
- Encryption: AES-CM (counter mode)
- Authentication: HMAC-SHA1
- Key negotiation: DTLS-SRTP, ZRTP, MIKEY

## RTP Issues
- **Jitter** — Variance in arrival time (buffer)
- **Packet loss** — Concealment (PLC) or retransmission
- **Delay** — Codec, jitter buffer, network latency

## Troubleshooting
```bash
tcpdump -ni eth0 port 5004
tcpdump -ni eth0 -T rtp
```
