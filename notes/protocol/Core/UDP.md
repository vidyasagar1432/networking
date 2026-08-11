# UDP (User Datagram Protocol)

## Overview
- **Connectionless**, unreliable transport protocol
- Layer 4 (Transport Layer)
- Defined in **RFC 768**
- Minimal overhead, no delivery guarantees — **fire-and-forget**

## UDP Header
| Field | Size |
|---|---|
| Source Port | 2 bytes (optional, 0 if unused) |
| Destination Port | 2 bytes |
| Length | 2 bytes (header + data, min 8) |
| Checksum | 2 bytes (optional in IPv4, required in IPv6) |

Total header size: **8 bytes** (vs TCP's 20+)

## Characteristics
- No handshake (no SYN/SYN-ACK)
- No sequence numbers, ACKs, or retransmission
- No flow control or congestion control
- No connection state — stateless
- Preserves **message boundaries** (vs TCP stream)
- Supports **multicast** and **broadcast** (TCP does not)

## Use Cases
| Application | Why UDP |
|---|---|
| **DNS** (port 53) | Single query/response, retry on timeout |
| **DHCP** (ports 67/68) | Broadcast discovery |
| **VoIP / SIP** (ports 5060, RTP 16384–32767) | Low latency, loss tolerant |
| **Video streaming** (RTP) | Real-time, can tolerate packet loss |
| **Online gaming** | Low latency preferred over reliability |
| **SNMP** (ports 161/162) | Simple polling/traps |
| **TFTP** (port 69) | Simple file transfer (no auth) |
| **NTP** (port 123) | Time synchronization |
| **Syslog** (port 514) | Log messages |
| **RADIUS** (ports 1812/1813) | Authentication |
| **QUIC** (port 443, HTTP/3) | Uses UDP with TLS, built-in reliability at app layer |

## Reliability Mechanisms (at app layer)
Since UDP gives no guarantee, applications implement their own:
- Retransmission timers (DNS, TFTP)
- Sequence numbers + ACKs (RTP/RTCP, QUIC)
- Forward Error Correction (FEC) — streaming
- Application-level acknowledgments (TFTP)

## UDP in IPv6
- Checksum is **mandatory** (vs optional in IPv4)
- Pseudo-header includes source/dest IPv6 addresses for checksum calculation

## UDP vs TCP
| Feature | UDP | TCP |
|---|---|---|
| Connection | No | Yes |
| Reliability | None | Guaranteed |
| Ordering | No | Yes |
| State | Stateless | Stateful |
| Header | 8 bytes | 20–60 bytes |
| Broadcast/Multicast | Yes | No |
| Latency | Low | Higher (handshake, ACK) |
| Overhead | Minimal | Significant |
