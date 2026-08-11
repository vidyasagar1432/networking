# TACACS+ (Terminal Access Controller Access-Control System Plus)

## Overview
- **Cisco proprietary** AAA protocol
- Separates Authentication, Authorization, and Accounting
- Uses **TCP port 49**
- Encrypts **entire payload** (vs RADIUS which encrypts only password)

## Key Features
- **AAA separation** — Can use different servers for auth, authz, acct
- **Full payload encryption** — All attributes encrypted (not just password)
- **TCP-based** — Reliable transport, retransmission built-in
- **Command authorization** — Granular per-command control

## Packet Types
| Type | Description |
|---|---|
| **Authentication** | Who the user is (login, password, challenge) |
| **Authorization** | What the user can do (commands, services) |
| **Accounting** | What the user did (start, stop, update) |

## Authentication
1. Client sends `START` (username)
2. Server responds `CONTINUE` / `GETPASS` / `GETUSER` / `PASS` / `FAIL`
3. Multi-packet exchange (can include challenge-response)

## Authorization
- Independent of authentication (can use username from auth or separate)
- Checks command, arguments, privileges
- Returns: PASS (permit), FAIL (deny), ERROR

## Accounting
- **Start** — Record session start
- **Stop** — Record session end (duration, commands, traffic)
- **Update** — Interim updates

## TACACS+ vs RADIUS
| Feature | TACACS+ | RADIUS |
|---|---|---|
| Transport | TCP 49 | UDP 1812/1813 |
| Encryption | Entire payload | Password only |
| AAA | Separate | Combined (auth+authz) |
| Command auth | Yes | Limited (VSA) |
| Standard | Cisco proprietary | Open (RFC 2865) |
| Protocol support | Multiprotocol | PPP, IP only |

## Config Example (Cisco)
```cisco
tacacs server TACACS-1
 address ipv4 192.168.1.200
 key TACACSKey
 single-connection               # Reuse TCP connection

aaa new-model
aaa authentication login default group tacacs+ local
aaa authorization exec default group tacacs+ local
aaa authorization commands 15 default group tacacs+ local
aaa accounting exec default start-stop group tacacs+
aaa accounting commands 15 default start-stop group tacacs+
```
