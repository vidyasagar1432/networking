# RADIUS (Remote Authentication Dial-In User Service)

## Overview
- **AAA protocol** — Authentication, Authorization, Accounting
- Defined in **RFC 2865** (auth), **RFC 2866** (accounting)
- Uses **UDP ports 1812** (auth) and **1813** (accounting)
- Originally for dial-up (now used for VPN, 802.1X, WLAN)

## How It Works
```
Client (NAS) ──Access-Request──→ RADIUS Server
             ←──Access-Accept─────
             ←──Access-Reject─────
             ←──Access-Challenge── (EAP/challenge)
```

## Packet Types
| Code | Type | Description |
|---|---|---|
| 1 | Access-Request | Auth request from NAS |
| 2 | Access-Accept | Auth succeeded |
| 3 | Access-Reject | Auth denied |
| 4 | Accounting-Request | Start/stop accounting |
| 5 | Accounting-Response | Acknowledge accounting |
| 11 | Access-Challenge | Challenge (EAP, OTP) |

## RADIUS Attributes
| Attribute | Number | Description |
|---|---|---|
| **User-Name** | 1 | Username |
| **User-Password** | 2 | Password (encrypted with shared secret) |
| **NAS-IP-Address** | 4 | IP of the NAS (switch/AP/VPN) |
| **NAS-Port** | 5 | Port on the NAS |
| **Service-Type** | 6 | Framed (PPP), Login (Telnet), Authenticate-Only |
| **Framed-IP-Address** | 8 | IP to assign to user |
| **Session-Timeout** | 27 | Max session duration |
| **Idle-Timeout** | 28 | Disconnect after idle period |
| **Filter-Id** | 11 | ACL name to apply |
| **Vendor-Specific** | 26 | Vendor extensions (Cisco AV pairs) |

## Proxy & Realm Routing
- RADIUS can proxy requests to other RADIUS servers based on **realm** (user@realm)
- Proxy state is maintained (RFC 2607)

## Accounting
| Type | Description |
|---|---|
| **Start** | Session begins |
| **Interim-Update** | Periodic update (traffic stats, duration) |
| **Stop** | Session ends (final stats, reason) |

## RADIUS vs TACACS+
| Feature | RADIUS | TACACS+ |
|---|---|---|
| Transport | UDP (1812/1813) | TCP (49) |
| Encryption | Password only | Entire payload |
| AAA | Combined (auth+authz in one packet) | Separate (auth, authz, acct) |
| Command authorization | Limited (VSA) | Full support |
| Protocol | Open (RFC) | Cisco proprietary |
| Multiprotocol | Limited | Yes |

## Config Example (Cisco — switch/NAS)
```cisco
radius server SERVER-1
 address ipv4 192.168.1.100 auth-port 1812 acct-port 1813
 key RADIUSKey

aaa new-model
aaa authentication login default group radius local
aaa authorization exec default group radius local
aaa accounting exec default start-stop group radius

radius-server timeout 5
radius-server retransmit 3
```
