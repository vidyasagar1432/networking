# mDNS / LLMNR / NetBIOS

## Overview
- **Link-local** name resolution protocols (no DNS server needed)
- Used on small networks (home, ad-hoc, peer-to-peer)

## mDNS (Multicast DNS)
- **RFC 6762** — DNS queries over **multicast** (UDP 5353)
- Query sent to **224.0.0.251** (IPv4) or **FF02::FB** (IPv6)
- Each host answers for its own names
- Names end in **`.local`** (e.g., `printer.local`)

### mDNS Operation
1. Host sends query to multicast: "Who has printer.local?"
2. Printer responds with its IP (unicast or multicast)
3. Host caches result (TTL-limited)
4. **Probing** — host checks uniqueness before claiming name

### mDNS in Apple Bonjour
- **Bonjour** = Apple's implementation of mDNS + DNS-SD
- Service Discovery: `_http._tcp.local` — browse for HTTP services
- Used by: AirPlay, AirPrint, iTunes sharing

## LLMNR (Link-Local Multicast Name Resolution)
- **RFC 4795** — Microsoft's alternative to mDNS
- Query sent via multicast to **224.0.0.252** (IPv4) or **FF02::1:3** (IPv6)
- Port: **UDP 5355**
- Names are **single-label** (e.g., `server1`)
- **No .local suffix** required
- **Windows** uses: DNS → LLMNR → NetBIOS (fallback order)

### LLMNR vs mDNS
| Feature | LLMNR | mDNS |
|---|---|---|
| Standard | RFC 4795 | RFC 6762 |
| Suffix | Single-label | .local |
| Multicast | 224.0.0.252 | 224.0.0.251 |
| Port | 5355 | 5353 |
| OS | Windows | Apple, Linux, Windows |
| Service discovery | No | Yes (DNS-SD) |

## NetBIOS (Network Basic Input/Output System)
- Legacy IBM/Microsoft name resolution (1980s)
- **NetBIOS-NS** (Name Service) — UDP 137
- **NetBIOS-DGM** (Datagram) — UDP 138
- **NetBIOS-SSN** (Session) — TCP 139
- **NetBIOS Name** — 16 bytes (15 chars + 1 type byte)
- Name types: 0x00 (Workstation), 0x20 (Server), 0x03 (Messenger)

### Name Resolution Order (Windows)
1. DNS (preferred)
2. LLMNR (link-local multicast)
3. NetBIOS (broadcast or WINS)

### NetBIOS NBT (NetBIOS over TCP/IP)
- Carries NetBIOS over TCP/IP (UDP 137/138, TCP 139)
- **WINS** (Windows Internet Name Service) — centralized NetBIOS name server
- **B-node** — broadcast (no WINS)
- **P-node** — point-to-point (WINS only)
- **M-node** — mixed (broadcast then WINS)
- **H-node** — hybrid (WINS then broadcast) — Windows default

### NetBIOS Security
- **NetBIOS over TCP/IP** should be **disabled** on external interfaces
- Legacy protocol — many vulnerabilities (name poisoning, null sessions)
- Modern Windows prefers DNS + LLMNR
- Disable: uncheck "File and Printer Sharing for Microsoft Networks" on untrusted interfaces
