# STP (Spanning Tree Protocol)

## Overview
- Prevents **Layer 2 loops** in redundant switched networks
- Defined in **IEEE 802.1D**
- Algorithm by **Radia Perlman** (1985)
- Creates a loop-free logical topology by blocking redundant ports

## Bridge Protocol Data Units (BPDUs)
- **Configuration BPDUs** — Sent by root bridge every 2s (Hello)
- **TCN (Topology Change Notification) BPDUs** — Sent when topology changes
- Fields: Root Bridge ID, Root Path Cost, Bridge ID, Port ID, Timer values

## Bridge ID
- **8 bytes**: Bridge Priority (2 bytes) + MAC Address (6 bytes)
- **Priority**: 0–65535 (default 32768), increments of 4096
- Lower priority = more likely to become root

## Port Roles
| Role | Description |
|---|---|
| **Root Port (RP)** | Best path to root bridge (one per non-root switch) |
| **Designated Port (DP)** | Best path on a segment (one per link) |
| **Alternate Port** | Backup to root port (blocked) |
| **Backup Port** | Backup to designated port (blocked) |
| **Disabled** | Administratively down |

## Port States (802.1D)
```
Disabled → Blocking → Listening → Learning → Forwarding
```
| State | Forward Traffic | Learn MAC | Time |
|---|---|---|---|
| **Blocking** | No | No | Up to 20s (Max Age) |
| **Listening** | No | No | 15s (Forward Delay) |
| **Learning** | No | Yes | 15s (Forward Delay) |
| **Forwarding** | Yes | Yes | — |
| **Disabled** | No | No | — |

Total convergence: ~50s (20 + 15 + 15)

## Root Bridge Election
1. Lowest **Root Bridge ID** (BID) = priority + MAC
2. All switches initially claim themselves as root
3. Lowest BID wins — sends superior BPDUs
4. **Root Guard** — port that ignores superior BPDUs (stops rogue root)

## Port Selection Logic
1. Lowest **Root Path Cost** (cumulative cost to root)
2. Lowest **Sender Bridge ID**
3. Lowest **Sender Port ID**

## Path Cost (802.1D vs 802.1t)
| Speed | 802.1D | 802.1t |
|---|---|---|
| 10 Mbps | 100 | 2,000,000 |
| 100 Mbps | 19 | 200,000 |
| 1 Gbps | 4 | 20,000 |
| 10 Gbps | 2 | 2,000 |
| 100 Gbps | — | 200 |

## STP Timers
| Timer | Default | Description |
|---|---|---|
| **Hello** | 2s | BPDU interval |
| **Forward Delay** | 15s | Listening/Learning duration |
| **Max Age** | 20s | Time storing BPDU before discarding |

## Convergence
- **Max Age** (20s) — Waiting for BPDU to expire (link down without BPDU)
- **Listening** (15s) — Port transition to DP/RP
- **Learning** (15s) — Populating MAC table
- Total: **30–50 seconds**

## STP Variants
| Protocol | Standard | Convergence |
|---|---|---|
| **STP** | 802.1D | 30–50s |
| **RSTP** | 802.1w | ~2–6s |
| **MSTP** | 802.1s | Per-instance (VLAN groups) |
| **PVST+** | Cisco | Per-VLAN spanning tree |
| **RPVST+** | Cisco | Rapid per-VLAN (RSTP per VLAN) |

## STP Protection Mechanisms
| Feature | Purpose |
|---|---|
| **PortFast** | Bypass listening/learning on access ports (immediate forwarding) |
| **BPDU Guard** | Shut down port if BPDU received on PortFast port |
| **Root Guard** | Port ignores superior BPDUs (prevents rogue root) |
| **Loop Guard** | Prevents alternate/root port from becoming DP if BPDUs stop |
| **UDLD** (Unidirectional Link Detection) | Detect one-way link (fiber) |
| **BPDU Filter** | Suppresses sending/receiving BPDUs on PortFast ports |

## Config Example (Cisco)
```cisco
spanning-tree vlan 1 priority 4096                         # Set primary root
spanning-tree vlan 1 root primary                          # Same, automated

interface GigabitEthernet0/1
 spanning-tree portfast
 spanning-tree bpduguard enable

interface GigabitEthernet0/2
 spanning-tree guard root
 spanning-tree guard loop
```
