# TLS (Transport Layer Security)

## Overview
- Cryptographic protocol for secure communication over a network
- Successor to **SSL** (SSLv3 → TLS 1.0 → 1.1 → 1.2 → 1.3)
- Defined in **RFC 8446** (TLS 1.3), **RFC 5246** (TLS 1.2)
- Provides: encryption, authentication, integrity

## TLS Handshake (1.2)
1. **ClientHello** — Supported versions, cipher suites, random nonce
2. **ServerHello** — Chosen version, cipher suite, random nonce, certificate
3. **Certificate** — Server sends cert chain
4. **Key Exchange** — Client sends PreMasterSecret (encrypted with server public key)
5. **ChangeCipherSpec** — Both sides switch to negotiated cipher
6. **Finished** — Encrypted verification

## TLS Handshake (1.3)
1. **ClientHello** — Supported versions, cipher suites, key share (ECDHE)
2. **ServerHello** — Chosen version/cipher, cert, key share, signature
3. **Finished** — Done (1-RTT)
- **0-RTT** — Resumption: data sent with ClientHello

## Cipher Suites
TLS 1.2: `TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384`
TLS 1.3: `TLS_AES_256_GCM_SHA384` (key exchange is implicit)

Components: Key exchange (ECDHE/DHE), Auth (RSA/ECDSA), Encryption (AES-GCM/ChaCha20), HMAC (SHA384/SHA256)

## TLS 1.3 Improvements
- 1-RTT handshake (vs 2-RTT for 1.2)
- 0-RTT resumption
- Removed weak ciphers (RSA key exchange, RC4, CBC, 3DES, MD5, SHA-1)
- Perfect Forward Secrecy mandatory (ECDHE/DHE)
- Encrypted handshake (certificate encrypted after handshake)

## TLS in Networking
| Context | Port | Protocol |
|---|---|---|
| HTTPS | 443 | HTTP over TLS |
| SMTPS | 465/587 | SMTP over TLS |
| IMAPS | 993 | IMAP over TLS |
| POP3S | 995 | POP3 over TLS |
| LDAPS | 636 | LDAP over TLS |
| DTLS | UDP | Datagram TLS (for VoIP, VPN) |

## DTLS (Datagram TLS)
- TLS over **UDP** (RFC 6347)
- Handles packet loss, reordering, small MTU
- Used in: VoIP (SRTP keying), CAPWAP control, VPN (OpenVPN, WireGuard alternatives)

## SSL (Secure Sockets Layer)
| Version | Status | Issues |
|---|---|---|
| SSL 2.0 | Deprecated | Multiple flaws |
| SSL 3.0 | Deprecated | POODLE attack |
| TLS 1.0 | Deprecated | BEAST, POODLE (TLS) |
| TLS 1.1 | Deprecated | PCI DSS prohibits |
| TLS 1.2 | Current | Widely used |
| TLS 1.3 | Current | Fastest, most secure |

## Certificate Validation
1. **Chain trust** — Leaf → Intermediate → Root (trusted CA)
2. **Hostname match** — SAN or CN matches domain
3. **Expiry** — Not before/after dates
4. **Revocation** — CRL or OCSP

## Common Attacks
| Attack | Mitigation |
|---|---|
| POODLE | Disable SSL 3.0 |
| BEAST | Use TLS 1.2+ |
| Heartbleed | Patch OpenSSL |
| FREAK | Disable export ciphers |
| Logjam | Use DH 2048+ |
| CRIME/BREACH | Disable compression |

## Testing
```bash
openssl s_client -connect example.com:443 -tls1_2
openssl s_client -connect example.com:443 -tls1_3
nmap --script ssl-enum-ciphers -p 443 example.com
```
