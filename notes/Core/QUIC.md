# QUIC (Quick UDP Internet Connections)

## Overview
- **Transport layer** protocol — developed by Google (2012), standardized in **RFC 9000** (2021)
- Runs over **UDP** (port 443)
- Used by: HTTP/3 (RFC 9114), DNS over QUIC, SMB over QUIC
- Combines: TLS 1.3, low-latency multiplexing, connection migration

## Key Features
| Feature | Description |
|---|---|
| **0-RTT** | Resumption with data in first flight |
| **1-RTT** | Full handshake (TLS 1.3) |
| **Multiplexing** | No head-of-line blocking (vs TCP) |
| **Connection migration** | Survives IP/port changes (mobile) |
| **Encryption by default** | TLS 1.3 built-in |
| **Streams** | Multiple independent streams per connection |

## QUIC vs TCP+TLS+HTTP/2
| Feature | TCP+TLS+HTTP/2 | QUIC+HTTP/3 |
|---|---|---|
| Handshake | 2–3 RTT | 0–1 RTT |
| Transport | TCP (kernel) | UDP + QUIC (userspace) |
| HOL blocking | TCP HOL + HTTP/2 HOL | No TCP HOL (streams independent) |
| Connection migration | No (TCP requires new connection) | Yes (connection ID) |
| Encryption | Separate (TLS) | Built-in (TLS 1.3) |

## QUIC Packet Types
| Type | Purpose |
|---|---|
| **Initial** | First handshake packet |
| **Handshake** | Key exchange |
| **0-RTT** | Early data (resumption) |
| **Short Header** | Data after handshake |

## Connection ID
- Unique **Connection ID** (not IP:port) identifies the connection
- Allows **connection migration** — change IP (WiFi→cellular) without reconnection
- Client can request new CID for privacy

## Streams
- Multiple **streams** within one QUIC connection
- **Unidirectional** or **bidirectional**
- Streams are independent — loss on one doesn't block others
- Lightweight state (vs TCP connection per stream)

## Loss Recovery
- **Monotonically increasing packet numbers** (no TCP retransmission ambiguity)
- **More precise RTT measurement**
- **ACK ranges** — can acknowledge non-contiguous packets (like SCTP)
- **Faster loss detection** (packet threshold, time threshold)

## Flow Control
- **Per-connection** and **per-stream** flow control
- Limits: initial max data, initial max stream data, initial max streams
- Updated via **MAX_DATA**, **MAX_STREAM_DATA**, **MAX_STREAMS** frames

## HTTP/3 (RFC 9114)
- HTTP semantics over QUIC
- **QPACK** — header compression (replaces HPACK, adapted for streams)
- No server push (removed in HTTP/3 compared to HTTP/2)
- Stream types: Control, Push, QPACK encoder/decoder

## Deployment
- **Port**: UDP 443 (default, may be negotiable)
- Widely deployed (Google, YouTube, Facebook, Cloudflare)
- ~30%+ of web traffic (growing)
