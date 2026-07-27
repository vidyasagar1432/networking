# Kerberos

## Overview
- **Authentication protocol** — secret-key cryptography (symmetric)
- Developed at MIT (Project Athena)
- Defined in **RFC 4120**
- Default auth in: **Active Directory**, **macOS**, many Unix/Linux
- Uses **TCP/UDP 88** (KDC)

## Components
| Component | Role |
|---|---|
| **KDC** (Key Distribution Center) | Central authentication server |
| **AS** (Authentication Service) | Issues TGT |
| **TGS** (Ticket Granting Service) | Issues service tickets |
| **Principal** | User, service, or host (user@REALM) |
| **Realm** | Kerberos domain (EXAMPLE.COM) |
| **Keytab** | File with shared secrets (for services) |

## Authentication Flow
```
1. User logs in → AS-REQ (user + timestamp encrypted with user's password hash)
2. KDC → AS-REP (TGT encrypted with krbtgt key + session key encrypted with user's key)
3. User has TGT → TGS-REQ (TGT + authenticator + service principal)
4. KDC → TGS-REP (service ticket + session key)
5. User → AP-REQ (service ticket + authenticator) → Service
6. Service → AP-REP (optional mutual authentication)
```

## Tickets
| Ticket | Description |
|---|---|
| **TGT** (Ticket Granting Ticket) | Proof of identity, short-lived (8–24h) |
| **Service Ticket** | Access to specific service (short-lived) |

## Key Elements
- **Authenticator** — Client name + timestamp + session key (proves client knows key)
- **Session Key** — Temporary key for client ↔ service
- **Timestamp** — Prevents replay attacks (clock skew < 5 min default)

## Kerberos vs NTLM
| Feature | Kerberos | NTLM |
|---|---|---|
| Auth method | Ticket-based | Challenge-response |
| Mutual auth | Yes | No |
| Delegation | Yes (constrained/unconstrained) | No |
| Security | Stronger | Weaker (LM hash) |
| Non-Microsoft | Yes (open standard) | No (Windows only) |

## Kerberos in Active Directory
- AD uses Kerberos as default auth
- Domain Controller = KDC
- Service Principal Name (SPN) — maps service to account (HTTP/webserver.example.com)
- **Delegation** — Service impersonates user to another service

## Config Files
- **Linux**: `/etc/krb5.conf`
- **Windows**: Registry (tools: ktpass, setspn)
- **Keytab**: `/etc/krb5.keytab` (service credentials)

## Commands
```bash
kinit user@EXAMPLE.COM              # Get TGT
klist                                 # View tickets
kdestroy                              # Destroy tickets
kvno HTTP/webserver.example.com      # Get service ticket
ktutil                                # Manage keytab
```
