# TCP (Transmission Control Protocol)

## Overview
- **Connection-oriented**, reliable transport protocol
- Layer 4 (Transport Layer)
- Defined in **RFC 793**
- Provides: reliability, flow control, congestion control, ordered delivery

## TCP Header
| Field | Size |
|---|---|
| Source Port | 2 bytes |
| Destination Port | 2 bytes |
| Sequence Number | 4 bytes |
| Acknowledgment Number | 4 bytes |
| Data Offset | 4 bits |
| Reserved | 3 bits |
| Flags | 9 bits |
| Window Size | 2 bytes |
| Checksum | 2 bytes |
| Urgent Pointer | 2 bytes |
| Options (variable) | 0–40 bytes |

## TCP Flags
| Flag | Name | Purpose |
|---|---|---|
| URG | Urgent | Urgent pointer valid |
| ACK | Acknowledgment | ACK number valid |
| PSH | Push | Deliver data immediately to app |
| RST | Reset | Reset connection (error/reject) |
| SYN | Synchronize | Initiate connection |
| FIN | Finish | Graceful close |
| ECE | ECN-Echo | Congestion notification |
| CWR | Congestion Window Reduced | Reduced cwnd in response |
| NS | Nonce Sum | ECN protection |

## Three-Way Handshake
```
Client → Server: SYN (Seq=x)
Server → Client: SYN+ACK (Seq=y, Ack=x+1)
Client → Server: ACK (Seq=x+1, Ack=y+1)
```
- Mutual agreement on ISN (Initial Sequence Number)
- SYN timeout (~30–120 sec), SYN flood (DoS via incomplete handshakes)

## Connection Termination
```
Client → Server: FIN
Server → Client: ACK
Server → Client: FIN
Client → Server: ACK
```
- **TIME_WAIT** — Client waits 2×MSL (~60s) to ensure ACK delivered

## Sequence & Acknowledgment
- Each byte numbered — **Sequence Number** is first byte in segment
- **Acknowledgment Number** = next expected byte
- TCP is **cumulative** — ACK 100 means "received bytes 0–99"

## Flow Control
- **Window Size** — How many bytes receiver is willing to accept
- **Sliding Window** — Sender can send up to window size without waiting for ACK
- **Window Scaling** (RFC 1323) — Scales window beyond 64KB (shift count)

## Congestion Control
| Algorithm | Purpose |
|---|---|
| **Slow Start** | Exponential growth (cwnd ×2 per RTT) until threshold |
| **Congestion Avoidance** | Linear growth (cwnd += 1 MSS per RTT) |
| **Fast Retransmit** | 3 duplicate ACKs → retransmit without timeout |
| **Fast Recovery** | After Fast Retransmit, cwnd = ssthresh |
| **ECN** (Explicit Congestion Notification) | Router marks packet, receiver echoes, sender reduces cwnd |

## Retransmission
- **RTO** (Retransmission Timeout) — dynamically calculated based on RTT
- **Exponential Backoff** — Double RTO after each timeout
- **Fast Retransmit** — 3 duplicate ACKs trigger retransmission (before timeout)

## TCP Ports
| Range | Type |
|---|---|
| 0–1023 | Well-known (privileged) |
| 1024–49151 | Registered |
| 49152–65535 | Dynamic/Private (Ephemeral) |

## Common Well-Known Ports
| Port | Service |
|---|---|
| 20, 21 | FTP |
| 22 | SSH |
| 23 | Telnet |
| 25 | SMTP |
| 53 | DNS |
| 80 | HTTP |
| 110 | POP3 |
| 143 | IMAP |
| 443 | HTTPS |
| 3389 | RDP |

## TCP vs UDP
| Feature | TCP | UDP |
|---|---|---|
| Connection | Connection-oriented | Connectionless |
| Reliability | Guaranteed delivery | Best-effort |
| Ordering | In-order | No ordering |
| Flow Control | Yes | No |
| Congestion Control | Yes | No |
| Overhead | Higher (20+ bytes) | Lower (8 bytes) |
| Use cases | Web, email, file transfer | DNS, VoIP, streaming, gaming |
