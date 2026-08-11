# EAP (Extensible Authentication Protocol)

## Overview
- Authentication **framework** — not a single method
- Defined in **RFC 3748** (EAP), **RFC 5247** (EAP Keying)
- Used in: 802.1X, VPN (IKEv2), PPP, PANA

## EAP Methods
| Method | Auth Type | Security | Description |
|---|---|---|---|
| **EAP-MD5** | Password | Weak (no mutual auth, no key) | Legacy challenge-response |
| **EAP-TLS** | Certificates | Strong (mutual) | Certificate on both sides |
| **EAP-TTLS** | Tunneled | Strong | Server cert + inner PAP/CHAP/MSCHAP |
| **PEAP** | Tunneled | Strong | Server cert + inner MSCHAPv2/GTC (EAP-MSCHAPv2) |
| **EAP-FAST** | Tunneled (PAC) | Strong | Cisco — PAC-based secure tunnel |
| **LEAP** | Password | Weak (MSCHAPv2 crackable) | Cisco legacy |
| **EAP-SIM** | SIM card | Moderate | Mobile network auth |
| **EAP-AKA** | SIM/USIM | Strong | 3G/4G network auth |
| **EAP-PWD** | Password | Strong | PAKE, no cert needed |
| **EAP-IKEv2** | Various | Strong | Uses IKEv2 inside EAP |

## PEAP (Protected EAP)
- Server-side TLS certificate + inner EAP method
- Two versions:
  - **PEAPv0** — inner EAP-MSCHAPv2 (Windows default)
  - **PEAPv1** — inner EAP-GTC (generic token card)
- **Outer tunnel** — TLS (server authenticates via cert)
- **Inner method** — Client authenticates inside encrypted tunnel

## EAP-TLS (EAP Transport Layer Security)
- **Mutual certificate** authentication
- Both client and server present certificates
- Most secure EAP method
- Requires PKI (client cert deployment complexity)
- Common in: enterprise 802.1X, government

## EAP-TTLS (Tunneled TLS)
- Server certificate only (outer)
- Inner tunnel uses legacy auth: PAP, CHAP, MSCHAPv2, or EAP
- Easier deployment than EAP-TLS (no client certs)

## EAP-FAST (Flexible Authentication via Secure Tunneling)
- Cisco — uses **PAC** (Protected Access Credential)
- No certificates needed (PAC pre-provisioned or auto-provisioned)
- Tunnels inner EAP (MSCHAPv2, GTC, etc.)
- Three phases: Provision (PAC) → Tunnel → Auth

## EAP over LAN (EAPoL)
- Encapsulation for 802.1X (EtherType 0x888E)
- EAPoL-Start, EAPoL-Logoff, EAPoL-Key

## EAP in 802.1X
```
Supplicant ←EAP→ Authenticator ←RADIUS(EAP)→ Auth Server
```
- Authenticator **passes through** EAP frames (EAP over RADIUS)
- RADIUS is the most common transport for EAP in 802.1X

## EAP in IKEv2
- EAP used inside IKEv2 for authentication
- RFC 5998 — EAP-only auth (no cert/PSK for client)

## Key Hierarchy
- **MSK** (Master Session Key) — derived after successful auth
- **PMK** (Pairwise Master Key) — derived from MSK for 802.11
- Used for encryption key generation
