# BGP (Border Gateway Protocol)

## Overview
- **EGP (Exterior Gateway Protocol)** — connects different ASes (Autonomous Systems)
- **Path-vector** protocol — carries full AS-path to detect/prevent loops
- Metric = **Path attributes** (not hop count or bandwidth)
- Used on the Internet backbone (between ISPs, enterprises, data centers)
- Defined in **RFC 4271** (BGP-4)

## AS Numbers
- **Public**: 1–64511 (globally unique, assigned by IANA/RIRs)
- **Private**: 64512–65535 (use within organization, stripped at border)
- **4-byte ASN**: 65536–4294967295 (RFC 6793)

## eBGP vs iBGP
| Feature | eBGP | iBGP |
|---|---|---|
| Peers | Different AS | Same AS |
| TTL | 1 (default) | 255 |
| Next-hop | Changes (usually) | Unchanged |
| Routes | Advertised to all peers | Must be passed through RR/confederation |
| Loop prevention | AS-path | Split-horizon (no advertise to iBGP peer learned from iBGP) |

## BGP Messages
| Type | Purpose |
|---|---|
| **OPEN** | Establish peering (ASN, hold timer, BGP ID) |
| **KEEPALIVE** | Maintain session (60s default, hold=180s) |
| **UPDATE** | Advertise/withdraw routes |
| **NOTIFICATION** | Error (session reset) |
| **ROUTE-REFRESH** | Request re-advertisement |

## BGP Neighbor States
```
Idle → Connect → Active → OpenSent → OpenConfirm → Established
```
- **Idle** — Init, refuses connections
- **Connect** — TCP connect in progress (port 179)
- **Active** — Connect failed, listening for peer
- **OpenSent** — OPEN sent, waiting for peer's OPEN
- **OpenConfirm** — KEEPALIVE sent, waiting for peer's KEEPALIVE
- **Established** — Session up, exchanging UPDATEs

## Path Attributes
| Attribute | Type | Code | Description |
|---|---|---|---|
| **ORIGIN** | Well-known mandatory | 1 | iGP (0), EGP (1), Incomplete (2) |
| **AS_PATH** | Well-known mandatory | 2 | List of ASes traversed |
| **NEXT_HOP** | Well-known mandatory | 3 | Next-hop IP to reach destination |
| **LOCAL_PREF** | Well-known discretionary | 4 | Preferred exit point (highest wins) |
| **MED** | Optional nontransitive | 5 | Multi-Exit Discriminator (lowest wins) |
| **COMMUNITY** | Optional transitive | 8 | Tag routes for policy (no-export, local-as, no-advertise) |
| **EXTENDED COMMUNITY** | Optional transitive | 16 | RT, SoO, bandwidth |
| **LARGE COMMUNITY** | Optional transitive | 32 | 96-bit (global:sub:local) |

## Path Selection (BGP Best Path)
BGP selects only **one** best path (by default). Steps (in order):

1. Highest **Weight** (Cisco proprietary, local to router)
2. Highest **Local Preference** (highest LOCAL_PREF)
3. Locally originated (network/aggregate)
4. Shortest **AS_PATH** length
5. Lowest **ORIGIN** (IGP < EGP < Incomplete)
6. Lowest **MED**
7. eBGP > iBGP
8. Lowest IGP metric to **NEXT_HOP**
9. Route age (oldest = best) — *if both eBGP*
10. Lowest **Router ID**
11. Minimum cluster list length

## Route Reflector (RR)
- Solves iBGP full-mesh requirement
- **RR** reflects routes to clients
- Avoids loops via **Cluster-ID** and **Originator-ID**
- **Non-client peers** must still be fully meshed

## Confederations
- Break AS into sub-ASes (private ASNs)
- iBGP inside sub-AS, eBGP-like between sub-ASes
- AS_PATH length includes sub-AS count

## BGP Security
- **BGP hijacking** — Attacker advertises more specific prefix or same prefix with better attributes
- **RPKI** (Resource Public Key Infrastructure) — Validates origin AS of prefix (ROA)
- **BGPsec** — Signs BGP UPDATEs to prevent path manipulation
- **TTL Security (GTSM)** — Set TTL=255, peer must match (IBGP)
- **MD5/ TCP-AO** — Authenticate TCP session
- **Prefix filtering** — Inbound/outbound prefix-list filters
- **Max-prefix** — Limit number of prefixes from peer

## Config Example (Cisco)
```cisco
router bgp 65001
 bgp router-id 1.1.1.1
 neighbor 192.168.0.1 remote-as 65002
 neighbor 192.168.0.1 description eBGP to ISP
 neighbor 192.168.0.1 update-source Loopback0
 neighbor 192.168.0.1 timers 10 30
 neighbor 192.168.0.1 password BGPPassword
 network 203.0.113.0 mask 255.255.255.0
 ! iBGP
 neighbor 10.0.0.2 remote-as 65001
 neighbor 10.0.0.2 next-hop-self
```

## Troubleshooting
```bash
show bgp summary
show bgp neighbors
show bgp
show bgp prefix-list detail
show ip bgp
show bgp unicast all
debug bgp updates
ping 192.168.0.1 source Loopback0
```
