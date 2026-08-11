# DCCP (Datagram Congestion Control Protocol)

## Overview
- **Transport layer** protocol — unreliable datagrams with congestion control
- Defined in **RFC 4340** (RFC 5595, 5596 updates)
- For: applications that want UDP-like semantics (timeliness) but need TCP-friendly congestion control

## DCCP vs TCP vs UDP
| Feature | TCP | UDP | DCCP |
|---|---|---|---|
| Reliable | Yes | No | No |
| Ordered | Yes | No | Configurable (partial) |
| Congestion control | Yes | No | Yes (pluggable CCIDs) |
| Connection-oriented | Yes | No | Yes |
| Stream/Message | Stream | Message | Message (with boundaries) |
| Header | 20–60 bytes | 8 bytes | 12+ bytes |

## CCIDs (Congestion Control IDs)
| CCID | Name | Description |
|---|---|---|
| **2** | TCP-like | AIMD (Additive Increase Multiplicative Decrease) |
| **3** | TFRC | TCP-Friendly Rate Control (smoother) |
| **4** | TFRC-SP | Small packets |

- CCID is negotiated during handshake (can be half-connection)

## DCCP Header
| Field | Size | Description |
|---|---|---|
| Source Port | 2 bytes | |
| Destination Port | 2 bytes | |
| Data Offset | 4 bits | Header length |
| CCval/CsCov | 4 bits | CCID-specific |
| Checksum | 4 bytes | |
| Sequence Number | 6 or 8 bytes | (variable, depends on CCID) |

## Connection Setup
3-way handshake (similar to TCP):
```
Client → Server: DCCP-Request
Server → Client: DCCP-Response
Client → Server: DCCP-Ack
```

## Connection Close
Explicit close — can include Close or CloseReq packets with Reset codes.

## Features (Negotiated Options)
- **CCIDs** — per direction
- **Sequence window** — loss detection parameters
- **Ack Ratio** — acknowledgments per data packet
- **Send Ack Vector** — detailed loss info
- **Data Checksum Length** — CS coverage

## Use Cases
- **VoIP** — real-time audio (needs CC but can tolerate loss)
- **Streaming video** — smooth rate adaptation (TFRC)
- **Online gaming** — real-time, loss-tolerant
- **Industrial automation** — real-time sensors

## DCCP in Linux
```bash
# Check DCCP support
modprobe dccp
cat /proc/net/sockstat  # Check DCCP sockets

# DCCP available as kernel module (dccp, dccp_ipv4, dccp_ipv6)
# Applications use DCCP via socket API: SOCK_DCCP

# Sample code:
# s = socket(AF_INET, SOCK_DCCP, IPPROTO_DCCP);
# setsockopt(s, SOL_DCCP, DCCP_SOCKOPT_CCID, &ccid2, sizeof(int));
```

## DCCP in Practice
- **Limited deployment** — not widely used
- Competing with: QUIC, SCTP, UDP + app-layer CC
- Linux kernel support (not commonly enabled)
- Some streaming protocols considered DCCP but most use UDP + app-layer adaptation
