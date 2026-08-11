# HTTPS (Hypertext Transfer Protocol Secure)

## Overview
- HTTP over **TLS/SSL** — encrypted HTTP
- Uses **TCP port 443** (default)
- Defined in **RFC 2818** (HTTP over TLS)
- Provides: encryption, authentication, integrity

## TLS Handshake
1. **Client Hello** — Supported TLS versions, cipher suites, random nonce
2. **Server Hello** — Chosen TLS version, cipher suite, random nonce, certificate (chain)
3. **Certificate Verification** — Client validates server cert (CA chain, hostname, expiry, revocation)
4. **Key Exchange** — ECDHE/DHE — both sides derive shared session key
5. **Finished** — Encrypted "finished" messages confirm handshake

## TLS Versions
| Version | Year | Status |
|---|---|---|
| SSL 1.0 | — | Never released |
| SSL 2.0 | 1995 | Deprecated (insecure) |
| SSL 3.0 | 1996 | Deprecated (POODLE) |
| TLS 1.0 | 1999 | Deprecated (BEAST) |
| TLS 1.1 | 2006 | Deprecated |
| TLS 1.2 | 2008 | Current widely used |
| TLS 1.3 | 2018 | Current (faster, more secure) |

## TLS 1.3 Improvements
- 1-RTT (vs 2-RTT for TLS 1.2)
- 0-RTT (resumption — no round trip)
- Removed weak ciphers (RSA key exchange, RC4, CBC, 3DES)
- Forward secrecy mandatory (ECDHE/DHE)
- Fewer round trips, simpler handshake

## Certificate Chain
```
Root CA (self-signed, trusted by OS/browser)
├── Intermediate CA
│   └── Server Certificate (leaf, issued to domain)
```
- **X.509** certificate format
- **SAN** (Subject Alternative Name) — lists domains cert is valid for
- **Wildcard**: `*.example.com`
- **Validation**: Chain trust → hostname match → expiry → revocation (CRL/OCSP)

## Cipher Suites
Example: `TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384`

| Component | Description |
|---|---|
| Key Exchange | ECDHE, DHE, RSA (TLS 1.3: only ECDHE/DHE) |
| Auth | RSA, ECDSA |
| Encryption | AES-GCM, ChaCha20-Poly1305 |
| HMAC | SHA-384, SHA-256 |

## HSTS (HTTP Strict Transport Security)
- Tells browser: "Always use HTTPS for this domain"
- Prevents SSL stripping attacks
```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

## Common Attacks
| Attack | Description | Mitigation |
|---|---|---|
| **MITM** | Intercept traffic | Certificate validation |
| **SSL Stripping** | Downgrade to HTTP | HSTS |
| **Phishing** | Fake certificate | EV certs, CA awareness |
| **Revocation** | Bad cert still trusted | OCSP stapling, CRLsets |

## Testing
```bash
openssl s_client -connect example.com:443           # Full cert chain & handshake
openssl s_client -connect example.com:443 -tls1_3   # Force TLS 1.3
curl -v https://example.com
curl --cert client.crt --key client.key https://example.com  # Client cert
```
