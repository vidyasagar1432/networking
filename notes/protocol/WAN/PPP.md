# PPP (Point-to-Point Protocol)

## Overview
- **Layer 2** encapsulation for point-to-point links
- Defined in **RFC 1661** (replaces SLIP)
- Provides: authentication, compression, error detection, multilink
- Used on serial links (T1, E1), DSL (PPPoE), VPN (PPTP/L2TP)

## PPP Protocol Stack
1. **HDLC-like framing** — Flag, Address, Control, Protocol, Payload, FCS
2. **LCP** (Link Control Protocol) — Establish, configure, test link
3. **NCP** (Network Control Protocol) — Configure Layer 3 (IPCP, IPv6CP)
4. **Authentication** — PAP, CHAP, EAP

## LCP Phases
```
Dead → Establish → Authenticate → Network → Open → Terminate
```
- **LCP Configure-Request / Ack / Nak / Reject**
- **Magic numbers** — Loop detection
- **Echo-Request/Reply** — Keepalive (can be disabled)

## Authentication
### PAP (Password Authentication Protocol)
- Plaintext username/password sent in cleartext
- Bidirectional (optional)
- Insecure — used only if CHAP not supported

### CHAP (Challenge Handshake Authentication Protocol)
- **3-way handshake**: Challenge → Response → Accept/Reject
- MD5 hash of challenge + password
- Periodic re-authentication
- More secure than PAP

## Multi-link PPP (MLPPP)
- Bond multiple physical links into one logical link
- **Fragment** packets across links (load balancing)
- **MRRU** (Max Reconstructed Receive Unit) — fragment reassembly

## PPPoE / PPPoA
- **PPPoE** — PPP over Ethernet (DSL broadband)
- **PPPoA** — PPP over ATM (legacy DSL)

## Config Example (Cisco)
```cisco
interface Serial0/0
 encapsulation ppp
 ppp authentication chap
 ppp chap hostname RouterA
 ppp chap password SecretKey
 ppp quality 90                # Drop link if quality below 90%
 ppp multilink                 # Enable MLPPP
```
