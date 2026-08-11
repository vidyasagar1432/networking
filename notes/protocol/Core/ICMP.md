# ICMP (Internet Control Message Protocol)

## Overview
- Used for **error reporting** and **diagnostics** on IP networks
- Operates at **Layer 3** (Network Layer) — encapsulated directly in IP
- Defined in **RFC 792**
- No transport layer ports — uses **Type** and **Code** fields

## ICMP Header
| Field | Size |
|---|---|
| Type | 1 byte |
| Code | 1 byte |
| Checksum | 2 bytes |
| Rest of Header | 4 bytes (varies by type) |

## Common ICMP Types

| Type | Name | Common Codes | Use |
|---|---|---|---|
| 0 | Echo Reply | 0 | ping response |
| 3 | Destination Unreachable | 0=Net, 1=Host, 2=Protocol, 3=Port, 4=Frag-needed, 6=Net-unknown, 7=Host-unknown, 9=Net-prohibited, 10=Host-prohibited, 13=Comm-admin-prohibited | Error notification |
| 5 | Redirect | 0=Net, 1=Host | Better route exists |
| 8 | Echo Request | 0 | ping |
| 9 | Router Advertisement | 0 | Router discovery |
| 10 | Router Solicitation | 0 | Router discovery |
| 11 | Time Exceeded | 0=TTL exceeded, 1=Frag reassembly time exceeded | traceroute / TTL expiry |
| 12 | Parameter Problem | 0=Bad header, 1=Missing option | Invalid IP header |

## ping
- Sends **Echo Request (Type 8)** → expects **Echo Reply (Type 0)**
- Measures **RTT** (Round Trip Time)
- Useful for: reachability, latency, packet loss
```bash
ping 8.8.8.8
ping -c 10 192.168.1.1     # Linux/macOS: count
ping -n 10 192.168.1.1     # Windows: count
ping -s 1472 192.168.1.1   # Set payload size

# Disabled ping responses:
# Cisco: no ip icmp echo-reply (or ACL block)
# Linux: echo 1 > /proc/sys/net/ipv4/icmp_echo_ignore_all
```

## traceroute / tracert
- Uses **TTL exhaustion** (Type 11 Time Exceeded) to map path
- Each hop's router discards the packet and sends back Time Exceeded
- **Linux/Unix**: Uses UDP to high ports (by default)
- **Windows**: Uses ICMP Echo Request
- **Modern**: Can also use TCP SYN (e.g., `tcptraceroute`, `mtr`)
```bash
traceroute 8.8.8.8          # Linux
tracert 8.8.8.8             # Windows
mtr 8.8.8.8                 # Combined traceroute + ping (Live)
```

## Destination Unreachable (Type 3)
| Code | Meaning | Common Cause |
|---|---|---|
| 0 | Net Unreachable | No route to destination network |
| 1 | Host Unreachable | No ARP entry / host down |
| 2 | Protocol Unreachable | Protocol not supported on host |
| 3 | Port Unreachable | No process listening on port (e.g., TCP RST equivalent) |
| 4 | Fragmentation Needed (DF set) | PMTUD — MTU mismatch |
| 9 | Network Administratively Prohibited | ACL blocking |
| 10 | Host Administratively Prohibited | ACL blocking |

## PMTUD (Path MTU Discovery)
- **Don't Fragment (DF)** bit set in IP header
- If packet exceeds MTU along path, router sends **Type 3 Code 4** (Frag needed) with correct MTU
- Host reduces packet size — repeats until successful
- Often blocked by firewalls → connectivity issues (black hole)

## ICMP Redirect (Type 5)
- Router tells host: "Use a different gateway for this destination"
- Sent when host sends traffic to wrong next-hop
- Security risk: hosts can learn bad routes if attacker sends forged redirects
- Mitigation: `no ip redirects` on Cisco interfaces

## Security Considerations
- **Ping flood** — Type 8 flood (DoS)
- **Smurf attack** — Spoofed Echo Request to broadcast address → all hosts reply to victim
- **Ping of Death** — Oversized ping packet causes buffer overflow
- **ICMP tunneling** — Data exfiltration inside ICMP payloads (e.g., `pingtunnel`, `icmptunnel`)

## Recommended Filtering
- Allow inbound: Type 3 (unreachables), Type 11 (time exceeded), Type 12 (parameter problem)
- Allow outbound: Type 8 (echo request) for diagnostics
- Block inbound: Type 8 (echo request) unless you want to allow pings
- Block: Type 5 (redirect), Type 13/14 (timestamp), Type 17/18 (subnet mask) unless needed

## IPv6 Equivalent — ICMPv6
- **Type 128** — Echo Request (ping6)
- **Type 129** — Echo Reply
- **Type 133–137** — Neighbor Discovery (replaces ARP)
- **Type 1** — Destination Unreachable
- **Type 2** — Packet Too Big (PMTUD)
- **Type 3** — Time Exceeded
- **Type 4** — Parameter Problem
- **MLD** (Multicast Listener Discovery) — Types 130–132, 143 (replaces IGMP)
