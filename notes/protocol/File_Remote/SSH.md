# SSH (Secure Shell)

## Overview
- Secure remote access protocol — encrypted, authenticated
- Replaces **Telnet** (unencrypted plaintext)
- Uses **TCP port 22**
- Defined in **RFC 4251–4254** (SSHv2)

## SSHv2 vs SSHv1
| Feature | SSHv1 | SSHv2 |
|---|---|---|
| Security | Weak CRC-32, known vulnerabilities | Strong HMAC, DH key exchange |
| Algorithm negotiation | Limited | Flexible |
| Protocol | Monolithic | Separated layers (transport, auth, connection) |
| Status | **Deprecated** | Current standard |

## Protocol Layers
1. **Transport Layer** — Key exchange (Diffie-Hellman), encryption, integrity
2. **User Authentication** — Password or public key
3. **Connection** — Multiplexes multiple channels (shell, exec, SFTP, port forwarding)

## Authentication Methods
| Method | Description |
|---|---|
| **Password** | Username + password (default) |
| **Public Key** | RSA/ECDSA/Ed25519 key pair (more secure) |
| **Keyboard-Interactive** | Challenge-response (PAM, OTP) |
| **Host-based** | Trust host authentication (rare) |
| **GSSAPI** | Kerberos-based SSO |

## Encryption Algorithms
- **Key exchange**: DH, ECDH, Curve25519
- **Symmetric**: AES (128/256), ChaCha20, 3DES (deprecated)
- **MAC**: HMAC-SHA2-256, HMAC-SHA2-512
- **Host keys**: RSA (2048+), ECDSA, Ed25519

## Port Forwarding
```bash
# Local: remote resource → local port
ssh -L 8080:internal-server:80 user@gateway

# Remote: local resource → remote port
ssh -R 8080:localhost:80 user@gateway

# Dynamic: SOCKS proxy
ssh -D 1080 user@gateway
```

## SCP & SFTP
- **SCP** — Copy files over SSH (older, simpler)
- **SFTP** — Secure file transfer over SSH (SSH File Transfer Protocol)

## Common Commands
```bash
ssh user@host
ssh -p 2222 user@host                # Non-default port
ssh -i ~/.ssh/id_rsa user@host       # Key-based auth
ssh -v user@host                     # Verbose debug
ssh -vvv user@host                   # More verbose

ssh-keygen -t ed25519                # Generate key pair
ssh-copy-id user@host                # Copy public key
ssh-agent bash                       # Start SSH agent
ssh-add ~/.ssh/id_ed25519            # Add key to agent
```

## Cisco Configuration
```cisco
ip domain-name example.com
crypto key generate rsa modulus 2048
ip ssh version 2
ip ssh time-out 60
ip ssh authentication-retries 3
line vty 0 15
 transport input ssh
 login local
```
