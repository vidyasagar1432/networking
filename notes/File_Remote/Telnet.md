# Telnet

## Overview
- Remote access protocol — **unencrypted** (plaintext)
- Uses **TCP port 23**
- Defined in **RFC 854**
- Legacy protocol — replaced by **SSH** for security

## How It Works
- Client connects to server on TCP 23
- All data (including passwords) sent in **plaintext**
- Uses **NVT** (Network Virtual Terminal) — ASCII-based encoding
- Supports option negotiation (echo, window size, terminal type)

## Security Issues
- **No encryption** — full packet capture reveals everything
- **No authentication** beyond username/password
- **Susceptible to**: sniffing, MITM, session hijacking
- **Should not be used** on production/internet-facing devices

## Telnet vs SSH
| Feature | Telnet | SSH |
|---|---|---|
| Encryption | None | Yes |
| Port | 23 | 22 |
| Authentication | Plaintext password | Password or public key |
| Integrity | None | HMAC |
| Standards | RFC 854 | RFC 4251–4254 |
| Use today | Legacy/ lab only | Everywhere |

## Cisco Configuration
```cisco
line vty 0 15
 transport input telnet ssh     # Allow both
 password P@ssw0rd
 login
```

## Common Commands
```bash
telnet 192.168.1.1
telnet 192.168.1.1 80          # Test TCP port connectivity
Ctrl+]                        # Escape to telnet prompt
```
