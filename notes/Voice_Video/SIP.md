# SIP (Session Initiation Protocol)

## Overview
- **Signaling protocol** for VoIP, video, messaging, presence
- Defined in **RFC 3261** (obsoletes RFC 2543)
- Text-based (like HTTP) — request/response model
- Uses **UDP 5060** (default), **TCP 5060**, **TLS 5061**

## SIP Components
| Component | Role |
|---|---|
| **UAC** (User Agent Client) | Initiates requests (phone, softphone) |
| **UAS** (User Agent Server) | Responds to requests |
| **Proxy Server** | Routes requests between UAs |
| **Registrar** | Accepts registration (location service) |
| **Redirect Server** | Redirects UA to alternate server |
| **B2BUA** (Back-to-Back UA) | Terminates + reoriginates calls (SBC) |

## SIP Methods
| Method | Purpose |
|---|---|
| **INVITE** | Initiate session (call) |
| **ACK** | Confirm INVITE response |
| **BYE** | Terminate session |
| **CANCEL** | Cancel pending INVITE |
| **REGISTER** | Register location (IP:port → URI) |
| **OPTIONS** | Query capabilities |
| **INFO** | Mid-call signaling (DTMF) |
| **MESSAGE** | Instant messaging |
| **SUBSCRIBE / NOTIFY** | Event notification (presence) |
| **REFER** | Transfer call |
| **UPDATE** | Modify session parameters |

## SIP Responses
| Code | Range | Examples |
|---|---|---|
| 1xx | Provisional | 100 Trying, 180 Ringing, 183 Progress |
| 2xx | Success | 200 OK |
| 3xx | Redirection | 302 Moved Temporarily |
| 4xx | Client Error | 401 Unauthorized, 403 Forbidden, 404 Not Found, 486 Busy |
| 5xx | Server Error | 500 Internal, 503 Unavailable |
| 6xx | Global Failure | 603 Decline |

## SIP URI
```
sip:alice@example.com
sips:alice@example.com   (TLS)
tel:+1234567890
```

## SDP (Session Description Protocol)
- Carried in SIP body — describes media capabilities
- Fields: media type (audio/video), codec, IP, port, bandwidth
```sdp
v=0
o=alice 2890844526 2890844526 IN IP4 192.168.1.10
s=-
c=IN IP4 192.168.1.10
m=audio 49170 RTP/AVP 0 8
a=rtpmap:0 PCMU/8000
a=rtpmap:8 PCMA/8000
```

## SIP Registration Flow
```
Phone → REGISTER → Registrar
                    ↓
        Store: alice@example.com → 192.168.1.10:5060
                    ↓
Phone ← 200 OK ← Registrar (binding expires 3600s)
```

## SIP Call Flow (Simplified)
```
Alice                    Proxy                   Bob
  |── INVITE ────────────→|── INVITE ────────────→|
  |← 100 Trying ──────────|← 180 Ringing ─────────|
  |← 180 Ringing ─────────|← 200 OK ──────────────|
  |← 200 OK ──────────────|── ACK ───────────────→|
  |── ACK ───────────────→|                       |
  |══════════ RTP (media) ════════════→           |
  |── BYE ────────────────→|── BYE ───────────────→|
  |← 200 OK ──────────────|← 200 OK ──────────────|
```

## SIP vs H.323
| Feature | SIP | H.323 |
|---|---|---|
| Architecture | Peer-to-peer (HTTP-like) | Gatekeeper-controlled |
| Message format | Text (like HTTP) | Binary (ASN.1 PER) |
| Complexity | Simple | Complex |
| Flexibility | High | Moderate |
| Dominance | Dominant (modern VoIP) | Legacy (video conferencing) |

## Topology hiding (SBC)
- **Session Border Controller** — sits at network edge
- Hides internal topology (NAT traversal)
- Enforces security, transcoding, QoS

## NAT Traversal
- SIP embeds IP in payload (SDP) — breaks with NAT
- Solutions: **STUN** (RFC 3489), **TURN**, **ICE**, **SBC**

## Troubleshooting
```bash
sngrep                                     # SIP packet capture
ngrep -d any port 5060                     # Grep SIP traffic
tcpdump -ni any port 5060 or portrange 10000-20000  # SIP + RTP
```
