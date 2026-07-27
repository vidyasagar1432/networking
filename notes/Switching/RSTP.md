# RSTP (Rapid Spanning Tree Protocol)

## Overview
- Defined in **IEEE 802.1w** — evolution of 802.1D STP
- Convergence in **~2–6 seconds** (vs 30–50s for STP)
- Backward compatible with STP (falls back per-port)

## Key Differences from STP
| Feature | STP (802.1D) | RSTP (802.1w) |
|---|---|---|
| Convergence | 30–50s | 2–6s |
| Port states | 5 (disabled, blocking, listening, learning, forwarding) | 3 (discarding, learning, forwarding) |
| Port roles | 3 (RP, DP, blocked) | 5 (RP, DP, alternate, backup, disabled) |
| BPDU handling | Relay only from root | Every switch sends BPDU every Hello (2s) |
| Topology change | TCN floods to root, root floods | Any switch can propagate change immediately |
| Edge ports | PortFast (proprietary) | Edge port (standardized) |

## Port States (3 states)
| State | Forward Traffic | Learn MAC |
|---|---|---|
| **Discarding** | No | No |
| **Learning** | No | Yes |
| **Forwarding** | Yes | Yes |

## Port Roles
| Role | Description |
|---|---|
| **Root Port (RP)** | Best path to root bridge (identical to STP) |
| **Designated Port (DP)** | Best path on segment (identical to STP) |
| **Alternate Port** | Backup to root port (discarding, rapid failover) |
| **Backup Port** | Backup to designated port (discarding) |
| **Disabled** | Administratively down |

## Convergence Mechanisms

### Proposal / Agreement (P/A)
- **Key improvement** over STP
- Handshake between two switches for rapid transition to forwarding
- Port sends **Proposal** → neighbor agrees if its port is RP → sends **Agreement**
- No need for timers (no Listening/Learning delay)
- Works only on **point-to-point links**

### Edge Ports
- Connected to end devices (like PortFast)
- Immediately forwarding
- If BPDU received → becomes normal STP port

### Point-to-Point vs Shared
- **Full-duplex** → point-to-point (P/A used)
- **Half-duplex** → shared (falls back to 802.1D timers)

### Alternate Port Fast Failover
- If root port fails → alternate port becomes RP **immediately**
- No need to go through learning phase

## BPDU Changes
- BPDU version = 2 (STP = 0)
- Every switch sends BPDU every 2s (not just root)
- BPDU aging: if 3 Hellos missed → neighbor considered dead (6s detection)
- **Type-flag** byte encodes: proposal, agreement, forwarding, learning, role, topology change

## Topology Change (RSTP vs STP)
- **STP**: Switch detects change → sends TCN to root → root sets TC bit in BPDU → floods
- **RSTP**: Switch detects change → floods BPDUs with TC bit set → all switches immediately shorten MAC aging (ForwardDelay)

## RSTP and VLANs
- **Single RSTP instance** (Cisco RSTP = RPVST+ runs RSTP per VLAN)
- **MSTP** (802.1s) extends RSTP to multiple VLAN instances

## Configuration
- RSTP is automatically enabled when using `spanning-tree mode rapid-pvst` (Cisco)
```cisco
spanning-tree mode rapid-pvst

interface GigabitEthernet0/1
 spanning-tree portfast edge           # Explicit edge port
 spanning-tree bpduguard enable
```
