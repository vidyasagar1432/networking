# NAT (Network Address Translation)

## Overview
- Translates **private IPs → public IPs** (and vice versa)
- Defined in **RFC 1631**, modern usage per **RFC 2663** and **RFC 3022**
- Primary purposes: conserve public IPv4 addresses, hide internal topology

## Types

### Static NAT (1:1)
- One private IP mapped to one public IP (permanent)
- Used when internal server must be reachable from outside
```cisco
ip nat inside source static 192.168.1.10 203.0.113.10
```

### Dynamic NAT (1:1 pool)
- Private IP mapped to next available public IP from a pool
- Only works if pool has enough IPs for concurrent sessions
```cisco
ip nat pool PUBLIC_POOL 203.0.113.1 203.0.113.10 netmask 255.255.255.0
ip nat inside source list ACL_NAT pool PUBLIC_POOL
```

### PAT (Port Address Translation) / NAT Overload (Many:1)
- Many private IPs → single public IP using different source ports
- Most common NAT type (home routers, enterprise)
```cisco
ip nat inside source list ACL_NAT interface GigabitEthernet0/0 overload
```

## NAT Terminology
| Term | Meaning |
|---|---|
| **Inside Local** | Private IP of internal host (as seen from inside) |
| **Inside Global** | Public IP of internal host (as seen from outside) |
| **Outside Local** | Public IP of external host (as seen from inside) |
| **Outside Global** | Public IP of external host (as seen from outside) |

## NAT Operations
### Outbound (internal → Internet)
1. Host (192.168.1.10:12345) sends to server (8.8.8.8:80)
2. Router translates source: 192.168.1.10:12345 → 203.0.113.1:54321
3. Server receives from 203.0.113.1:54321
4. Reply comes back to 203.0.113.1:54321
5. Router translates back: 203.0.113.1:54321 → 192.168.1.10:12345

### Inbound (Internet → internal server)
- Requires **Static NAT** or **Port Forwarding**
```
ip nat inside source static tcp 192.168.1.10 80 203.0.113.1 80
```

## NAT and State
- NAT maintains **translation table** (inside local → inside global + port)
- Entries timeout (typically 60s–24h depending on protocol)
- Can handle up to ~65000 concurrent sessions per public IP (16-bit port range)

## Problems & Considerations
| Issue | Description |
|---|---|
| **End-to-end broken** | External hosts can't initiate to internal without static mapping |
| **IPSec** | NAT breaks AH checksum, ESP works with NAT-T (UDP 4500) |
| **FTP** | Active FTP embeds IP in payload — needs **ALG** (Application Layer Gateway) |
| **VoIP/SIP** | Embeds IP in payload — needs ALG or disable inspection |
| **Hairpinning** | Internal host accessing internal server via public IP — needs NAT reflection |
| **Port exhaustion** | Too many sessions per public IP |

## NAT Variations
| Type | Description |
|---|---|
| **Twice NAT** | Translates both source AND destination |
| **Policy NAT** | Translates based on policy (not just inside/outside) |
| **NAT64** | Translates IPv6 ↔ IPv4 |
| **NPTv6** | Network Prefix Translation (IPv6 prefix rewrite, no port changes) |
| **CAR** (Carrier-grade NAT) | ISP-level NAT (CGNAT), uses RFC 6598 (100.64.0.0/10) |

## Common Commands
```bash
show ip nat translations
show ip nat statistics
clear ip nat translation *
debug ip nat
```

## NAT in Linux (iptables/nftables)
```bash
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE   # PAT
iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 \
  -j DNAT --to-destination 192.168.1.10:80              # Port forwarding
```

## PAT (Port Address Translation)
PAT is a subset of NAT — specifically many-to-one translation using port multiplexing. All NAT concepts above apply; PAT is simply "NAT with overload".
