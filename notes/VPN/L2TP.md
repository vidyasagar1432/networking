# L2TP (Layer 2 Tunneling Protocol)

## Overview
- **Tunneling protocol** — encapsulates PPP over IP networks
- Defined in **RFC 2661** (L2TPv2), **RFC 3931** (L2TPv3)
- L2TPv2: PPP over IP (VPN)
- L2TPv3: Any Layer 2 over IP (Ethernet, Frame Relay, ATM)

## L2TPv2 (PPP VPN)
- Client → LAC (L2TP Access Concentrator) → LNS (L2TP Network Server)
- Often combined with **IPSec** (L2TP/IPSec — common in Windows VPN)
- Uses **UDP 1701**

## L2TP/IPSec
- L2TP has **no encryption** — relies on IPSec for confidentiality
- **L2TP/IPsec** = L2TP tunnel inside IPSec ESP
- Common remote-access VPN (Windows, macOS, mobile)
- Ports: **UDP 4500** (NAT-T) + UDP 500 (IKE)

## L2TPv3
- Carries **raw Layer 2 frames** (Ethernet, HDLC, Frame Relay)
- Uses **UDP 1701** (or direct IP protocol 115)
- Used in service provider pseudowires (VPWS, VPLS before MPLS)

## L2TP Control Connection
- **SCCRQ/SCCRP/SCCCN** — Setup control channel
- **ICRQ/ICRP/ICCN** — Create session (call)
- **CDN** — Disconnect call
- Control: reliable (sequence + retransmission)

## L2TP Header
| Field | Size | Description |
|---|---|---|
| T/L/S/x | 4 bits | Type, Length, Sequence flags |
| Ver | 4 bits | Version (2 or 3) |
| Length | 2 bytes | (optional) |
| Tunnel ID | 2 bytes | Tunnel identifier |
| Session ID | 2 bytes | Session identifier |
| Ns/Nr | 2 bytes each | Sequence numbers (control only) |
| Payload | Variable | PPP (L2TPv2) or L2 frame (L2TPv3) |

## L2TP vs PPTP
| Feature | L2TP/IPSec | PPTP |
|---|---|---|
| Encryption | IPSec (AES, 3DES) | MPPE (RC4, weak) |
| Ports | UDP 500, 1701, 4500 | TCP 1723 + GRE 47 |
| Security | Strong | Weak (cracked) |
| Standard | IETF | Microsoft (RFC 2637) |
| NAT | Issues (NAT-T solves) | GRE issues |

## Authentication
- **PPP authentication** within L2TP tunnel (PAP/CHAP/EAP)
- **IPSec authentication** for L2TP/IPSec (certificate or PSK)

## Config Example (Cisco LNS)
```cisco
vpdn enable
vpdn-group REMOTE
 accept-dialin
  protocol l2tp
  virtual-template 1
 terminate-from hostname LAC-1
 local name LNS-1
 l2tp tunnel password L2TPKey

interface Virtual-Template1
 ip unnumbered Loopback0
 ppp authentication chap
 peer default ip address pool VPN-POOL
```
