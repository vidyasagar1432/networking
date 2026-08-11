# DNS (Domain Name System)

## Overview
- Resolves **hostnames → IP addresses** (and reverse)
- Hierarchical, distributed database
- Uses **UDP port 53** (queries), **TCP port 53** (zone transfers, >512 bytes)
- Defined in **RFC 1034, 1035**

## Hierarchy
```
Root (.)
├── TLD (.com, .org, .net, .io, .gov, .edu, .in)
│   ├── Second-level (google.com)
│   │   └── Subdomain (mail.google.com, www.google.com)
```

- **Root servers** — 13 logical root servers (a.root-servers.net – m.root-servers.net), many physical instances via Anycast

## Record Types
| Record | Purpose | Example |
|---|---|---|
| **A** | IPv4 address | google.com → 142.250.80.46 |
| **AAAA** | IPv6 address | google.com → 2607:f8b0::... |
| **CNAME** | Canonical alias | www → @ |
| **MX** | Mail server (priority) | @ → mail.google.com (pref 10) |
| **NS** | Authoritative name server | @ → ns1.google.com |
| **TXT** | Arbitrary text (SPF, DKIM, DMARC) | v=spf1 include:_spf.google.com ~all |
| **PTR** | Reverse lookup (IP → name) | 46.80.250.142.in-addr.arpa → google.com |
| **SOA** | Start of Authority (zone metadata) | Primary NS, admin email, serial, refresh, retry, expire, TTL |
| **SRV** | Service location | _sip._tcp.example.com → server:5060 |

## Query Types
- **Recursive** — DNS server does all lookups and returns final answer (client → resolver)
- **Iterative** — DNS server returns referral to next authoritative server (resolver → root/TLD/authoritative)
- **Forward** — hostname → IP
- **Reverse** — IP → hostname (using in-addr.arpa)

## Resolution Flow
```
Client → Local Resolver (stub resolver, /etc/hosts, cache)
       → ISP/Public Resolver (8.8.8.8, 1.1.1.1)
       → Root Server (iterative)
       → TLD Server (.com)
       → Authoritative Server (google.com)
       → Answer returned, cached
```

## Caching
- **TTL** (Time To Live) in seconds — how long record stays in cache
- **Negative caching** — NXDOMAIN responses also cached (short TTL)
- Local cache: `/etc/hosts`, browser DNS cache, OS DNS cache

## Zone Transfer
- **AXFR** (Full zone transfer) — entire zone copied
- **IXFR** (Incremental zone transfer) — only changes
- Typically restricted to secondary NS servers for security

## DNS Security
- **DNS Spoofing / Cache Poisoning** — Attacker injects forged DNS records
- **DNSSEC** (DNS Security Extensions) — signs DNS records with cryptographic signatures (RRSIG, DNSKEY, DS, NSEC)
- **DNS over HTTPS (DoH)** — Encrypted DNS queries over TLS (port 443)
- **DNS over TLS (DoT)** — Encrypted DNS over TLS (port 853)
- **EDNS** (Extended DNS) — adds flags, larger payloads, DNSSEC support
- **DNS Amplification Attack** — Small query → large response, source spoofed → victim DDoS

## Common Commands
```bash
nslookup google.com
nslookup -type=mx google.com

dig google.com
dig google.com A +short
dig -x 8.8.8.8                         # Reverse lookup
dig @8.8.8.8 google.com                # Query specific resolver

host google.com
host 8.8.8.8                           # Reverse lookup
```
