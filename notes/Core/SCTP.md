# SCTP (Stream Control Transmission Protocol)

## Overview
- **Transport layer** protocol — combines TCP reliability with UDP message boundaries
- Defined in **RFC 4960** (originally RFC 2960)
- Supports **multi-homing** and **multi-streaming**
- Used in: **SS7/SIGTRAN** (telecom signaling), WebRTC (DTLS over SCTP)

## Key Features
| Feature | SCTP | TCP | UDP |
|---|---|---|---|
| Connection | Yes | Yes | No |
| Reliable | Yes | Yes | No |
| Ordered delivery | Yes (configurable) | Yes | No |
| Message boundaries | Yes (preserved) | No (stream) | Yes |
| Multi-streaming | Yes | No | No |
| Multi-homing | Yes | No | No |
| HEAD-OF-LINE blocking | No (per stream) | Yes | No |

## Multi-Homing
- SCTP can bind to **multiple IP addresses** on one endpoint
- **Primary path** used for data; **secondary** acts as failover
- Heartbeats monitor alternate paths
- Fast failover if primary fails (no routing convergence needed)

## Multi-Streaming
- Multiple independent streams within one association
- Loss in Stream 1 does **not** block Stream 2 (avoids TCP HOL blocking)
- Each stream has its own sequence number

## SCTP Association (vs TCP connection)
- **4-way handshake** (TCP = 3-way):
  1. INIT → 2. INIT-ACK → 3. COOKIE-ECHO → 4. COOKIE-ACK
- **Cookie** mechanism — anti-DDoS (server doesn't allocate state until COOKIE-ECHO)

## Chunks
SCTP uses **chunks** (not segments):
| Chunk Type | Purpose |
|---|---|
| DATA | Payload data |
| INIT | Association setup |
| INIT-ACK | Acknowledge INIT |
| SACK | Selective ACK |
| HEARTBEAT | Path monitoring |
| COOKIE-ECHO/ACK | Cookie exchange |
| SHUTDOWN | Graceful close |
| ABORT | Abort association |

## Partial Reliability (PR-SCTP)
- **RFC 3758** — SCTP can be partially reliable
- Sender can abandon retransmission after a configured time/retries
- Useful for real-time applications (some loss OK)

## SCTP vs TCP Head-of-Line Blocking
```
TCP:  [Stream1 Byte1] missing → Stream1 Byte2, Stream2 Byte1 ALL blocked
SCTP: Stream1 Byte1 missing → only Stream1 blocked; Stream2 flows freely
```

## Use Cases
- **SIGTRAN** — SS7 signaling over IP (telecom)
- **WebRTC** — Data channels (DTLS over SCTP over UDP)
- **Diameter** — AAA protocol (optional transport)
- **MPTCP-adjacent** — Multi-homed mobile devices

## Config (Linux)
```bash
# SCTP is built-in or loadable (modprobe sctp)
sysctl net.sctp.*

# Tools
sctp_test -H 192.168.1.1 -P 5000 -h 192.168.1.2 -p 5000 -s -x 10
```
