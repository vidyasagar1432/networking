# PPPoE (PPP over Ethernet)

## Overview
- Encapsulates **PPP** frames inside **Ethernet** frames
- Defined in **RFC 2516**
- Common in **DSL** broadband (ISP last-mile)
- Provides per-user authentication (PPP credentials) + IP assignment

## Stages
1. **Discovery** — Find PPPoE server (Access Concentrator)
   - PADI (PPPoE Active Discovery Initiation) — broadcast
   - PADO (Offer) — server responds
   - PADR (Request) — client selects server
   - PADS (Session-confirmation) — server assigns session ID
2. **PPP Session** — Standard PPP (LCP, auth, NCP)
3. **Termination** — PADT (Terminate)

## Packet Format
- **EtherType**: 0x8863 (discovery), 0x8864 (session)
- PPPoE header: Version (4 bits), Type (4 bits), Code (1 byte), Session ID (2 bytes), Length (2 bytes)
- Discovery uses Code field; Session uses Code=0x00

## PPPoE vs DHCP
| Feature | PPPoE | DHCP |
|---|---|---|
| Authentication | Built-in (PAP/CHAP) | Separate (802.1X or none) |
| Protocol | PPP over Ethernet | Ethernet-only |
| Session tracking | Yes (session ID) | No |
| ISP typical | DSL (PPPoE) | Cable/fiber (DHCP) |

## Config Example (Cisco)
```cisco
interface Dialer1
 mtu 1492
 ip address negotiated
 encapsulation ppp
 ppp chap hostname user@isp.com
 ppp chap password ISPpass
 dialer pool 1

interface GigabitEthernet0/0
 pppoe enable
 pppoe-client dial-pool-number 1
 no ip address
```
