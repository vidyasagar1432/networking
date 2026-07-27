# OpenVPN

## Overview
- **Open-source** VPN solution (SSL VPN)
- Uses **TLS** for key exchange — runs over **UDP** (default) or **TCP**
- Port: **UDP 1194** (default, configurable)
- Flexible: tun (Layer 3) or tap (Layer 2) mode

## Modes
| Mode | Description |
|---|---|
| **TUN** (Layer 3) | IP tunnel — routed, most common |
| **TAP** (Layer 2) | Ethernet bridge — bridged (Layer 2 broadcast) |

## Authentication
- **Static key** — Pre-shared key (simple, no scalability)
- **TLS** — Certificate-based (server + optional client certs)
- **User/pass** — username + password (with or without TLS)
- **MFA** — plugin-based (OTP, LDAP, PAM)

## OpenVPN Protocol
1. **TCP/UDP handshake** — Establish transport
2. **TLS handshake** — Authenticate, exchange keys
3. **Push config** — Server pushes routes, DNS, etc.
4. **Tunnel** — Encrypted traffic (TLS or AEAD)

## Cipher Options
```
# Server config
cipher AES-256-GCM
auth SHA-256
tls-version-min 1.2
tls-cipher TLS-ECDHE-RSA-WITH-AES-256-GCM-SHA384
```

## Config Example (Server)
```
port 1194
proto udp
dev tun
ca ca.crt
cert server.crt
key server.key
dh dh2048.pem
server 10.8.0.0 255.255.255.0
push "route 192.168.1.0 255.255.255.0"
keepalive 10 120
cipher AES-256-GCM
auth SHA256
tls-version-min 1.2
status openvpn-status.log
verb 3
```

## Config Example (Client)
```
client
dev tun
proto udp
remote vpn.example.com 1194
ca ca.crt
cert client.crt
key client.key
remote-cert-tls server
cipher AES-256-GCM
auth SHA256
verb 3
```

## OpenVPN vs WireGuard
| Feature | OpenVPN | WireGuard |
|---|---|---|
| Codebase | Large (600k+ lines) | Small (~4k lines) |
| Crypto | OpenSSL (flexible) | Noise protocol (fixed) |
| Performance | Moderate | High (kernel-native) |
| Config complexity | High | Low |
| Roaming | IP changes break | Connection migration |
| UDP/TCP | Both | UDP only |
| Protocol | TLS tunnel | Simple UDP packets |

## WireGuard
- **Kernel-level** VPN (in Linux 5.6+)
- **Noise protocol** — modern, audited crypto
- **UDP only** — listening port, single public key per peer
- **Roaming** — connection identified by public key (not IP)
```ini
[Interface]
PrivateKey = <base64>
Address = 10.0.0.1/24
ListenPort = 51820

[Peer]
PublicKey = <peer_base64>
AllowedIPs = 10.0.0.2/32, 192.168.1.0/24
Endpoint = remote.example.com:51820
```

## SSL VPN
- VPN over **TLS** (HTTPS) — no client software needed (browser-based)
- **Clientless** — access internal web apps via browser
- **Thin client** — installable Java/ActiveX component
- Example: Cisco AnyConnect, Palo Alto GlobalProtect, OpenVPN

## PPTP (Point-to-Point Tunneling Protocol)
- **RFC 2637** — legacy Microsoft VPN
- GRE (protocol 47) + PPP + MPPE (RC4)
- **Insecure** — broken (MS-CHAPv2 cracked, RC4 weak)
- Port: TCP 1723 + GRE 47
- Do not use in production

## Config (Linux WireGuard Quick Start)
```bash
umask 077
wg genkey | tee privatekey | wg pubkey > publickey

# /etc/wireguard/wg0.conf
[Interface]
PrivateKey = <private>
Address = 10.0.0.1/24
ListenPort = 51820

[Peer]
PublicKey = <peer_public>
AllowedIPs = 10.0.0.2/32

# Start
wg-quick up wg0
```
