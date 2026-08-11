# IPSec (Internet Protocol Security)

## Overview
- Suite of protocols for **encrypting** and **authenticating** IP packets
- Defined in **RFC 4301–4309** (IPSecv3)
- Operates at **Layer 3** — secures entire IP payload
- Used in: VPNs, site-to-site, remote access

## Modes
### Transport Mode
- Encrypts **payload only** (original IP header intact)
- Used for **end-to-end** communication (host-to-host)
```
Original: [IP | TCP | Data]
IPSec:    [IP | AH/ESP | TCP | Data]
```

### Tunnel Mode
- Encrypts entire original packet inside new IP header
- Used for **site-to-site** VPN (gateway-to-gateway)
```
Original: [IP | TCP | Data]
IPSec:    [New IP | AH/ESP | Original IP | TCP | Data]
```

## Protocols
### AH (Authentication Header) — Protocol 51
- Provides **integrity** + **authentication** (no encryption)
- Protects entire packet (including outer IP header — except mutable fields)
- **Not commonly used** (ESP with null encryption preferred)

### ESP (Encapsulating Security Payload) — Protocol 50
- Provides **encryption** + **integrity** + **authentication**
- Encrypts payload (transport) or entire packet (tunnel)
- **Most common** IPSec protocol

## Security Associations (SA)
- Unidirectional — one SA for each direction
- Identified by: **SPI** (Security Parameter Index) + **Dest IP** + **Protocol** (AH/ESP)
- Contains: keys, algorithms, lifetime
- Stored in **SAD** (Security Association Database)

## IKE (Internet Key Exchange)
### IKEv1 (RFC 2409)
- **Main Mode** — 6 messages (identity protected)
- **Aggressive Mode** — 3 messages (identity exposed, faster)
- Phase 1: Establish ISAKMP SA (authenticated tunnel)
- Phase 2: Establish IPSec SA (quick mode)

### IKEv2 (RFC 7296)
- 4 messages (1 exchange for base SA, 1 exchange for child SA)
- Simpler, more secure, built-in DDoS protection
- MOBIKE (Mobile IKE) — connection migration

## IKE Phases (IKEv1)
### Phase 1 (ISAKMP SA)
- Authenticate peers, establish secure channel
- **Modes**: Main (6 msgs), Aggressive (3 msgs)
- **Methods**: Pre-shared key, RSA signatures, certificates

### Phase 2 (IPSec SA)
- Negotiate IPSec parameters (encryption, auth, lifetime)
- Uses Quick Mode (3 messages)
- Protected by Phase 1 SA

## Encryption & Authentication Algorithms
| Purpose | Algorithms |
|---|---|
| **Encryption** | AES (128/192/256), 3DES (deprecated), DES (deprecated) |
| **Integrity** | SHA-256, SHA-384, SHA-1 (deprecated), MD5 (deprecated) |
| **DH Groups** | Group 14 (2048-bit), Group 19 (256-bit ECDH), Group 21 (521-bit ECDH) |
| **PFS** (Perfect Forward Secrecy) | DH key exchange per session |

## NAT Traversal (NAT-T)
- IPSec + NAT = problem (AH breaks, ESP may break)
- **NAT-T** encapsulates IPSec in **UDP 4500**
- Detects NAT by checking source IP changes in IKE exchange
- Required for remote-access VPN clients behind NAT

## Config Example (Cisco Site-to-Site)
```cisco
! IKE Phase 1
crypto isakmp policy 10
 encryption aes 256
 authentication pre-share
 group 14
 lifetime 86400
crypto isakmp key VPNKey address 203.0.113.1

! IKE Phase 2
crypto ipsec transform-set AES256-SHA esp-aes 256 esp-sha-hmac
 mode tunnel

! Crypto map
crypto map CMAP 10 ipsec-isakmp
 set peer 203.0.113.1
 set transform-set AES256-SHA
 set pfs group14
 match address VPN_TRAFFIC
 interface GigabitEthernet0/0
 crypto map CMAP

! Interesting traffic ACL
ip access-list extended VPN_TRAFFIC
 permit ip 10.0.0.0 0.255.255.255 192.168.0.0 0.0.255.255
```

## Troubleshooting
```bash
show crypto isakmp sa
show crypto ipsec sa
show crypto engine connections active
debug crypto isakmp
debug crypto ipsec
```
