# Cisco Proprietary Protocols (DTP, VTP, Flex Links, UDLD)

## DTP (Dynamic Trunking Protocol)
- Negotiates **trunking** between Cisco switches
- **Modes**: Dynamic Auto, Dynamic Desirable, Trunk, Access
- Security risk: disable on access ports

### Modes
| Mode | Behavior |
|---|---|
| **Dynamic Auto** | Will trunk if neighbor sends DTP (passive) |
| **Dynamic Desirable** | Actively negotiates trunk |
| **Trunk** | Forces trunk unconditionally |
| **Access** | Forces access (no trunk, no DTP) |

### Compatibility Matrix
- Auto + Auto = Access (neither actively negotiates)
- Auto + Desirable = Trunk
- Desirable + Desirable = Trunk
- Trunk + any = Trunk
- Access + any = Access

### Disable DTP
```cisco
interface GigabitEthernet0/1
 switchport mode access
 switchport nonegotiate
```

## VTP (VLAN Trunking Protocol)
- Syncs **VLAN database** across switches
- **Modes**: Server, Client, Transparent
- **VTP Pruning** — reduces flooded traffic
- **VTP Password** — authenticates updates

### VTP Versions
| Version | Features |
|---|---|
| **v1** | Basic, VLANs 1–1005 |
| **v2** | Token Ring, VLAN consistency checks |
| **v3** | Extended VLANs (1006–4094), Private VLANs, database propagation |

### Modes
| Mode | Description |
|---|---|
| **Server** | Create/modify/delete VLANs, advertises (default) |
| **Client** | Receives and applies VLANs (can't create locally) |
| **Transparent** | Passes VTP messages, local VLAN management |

### Security Risk
- VTP can wipe VLAN database if higher revision server joins
- **Best practice**: Set all switches to VTP Transparent (or v3 with password)

```cisco
vtp mode transparent
vtp domain COMPANY
vtp password VTPKey
```

## Flex Links
- **Layer 2** link redundancy (alternative to STP)
- Pair: **Active** (forwarding) + **Backup** (standby, no STP)
- No STP running on Flex Links ports — faster failover
- Failover: ~1 second (sub-second with pre-configured)

```cisco
interface GigabitEthernet0/1
 switchport backup interface GigabitEthernet0/2
```

## UDLD (Unidirectional Link Detection)
- Detects **one-way fiber** connections (fiber break = TX works, RX broken)
- **Normal mode** — sends UDLD probes, detects neighbors
- **Aggressive mode** — sends probes, if no reply → errdisable port

### Modes
| Mode | Action |
|---|---|
| **Normal** | Detects, logs, no action |
| **Aggressive** | Detects + errdisables port |

```cisco
udld enable                  # Globally (aggressive)
udld aggressive              # Globally aggressive
interface GigabitEthernet0/1
 udld port aggressive        # Per-interface
```

## TWAMP (Two-Way Active Measurement Protocol)
- **RFC 5357** — measures network performance (delay, jitter, loss)
- Control-Client + Session-Sender ↔ Reflector
- Uses **UDP** (configurable ports)
- **TWAMP Light** — simplified (no control protocol, pre-configured reflectors)
- Common in service provider SLA monitoring

```bash
show twamp connection
show twamp statistics
```

## Summary Security Practices
| Protocol | Risk | Mitigation |
|---|---|---|
| **DTP** | Trunk spoofing | `switchport mode access` + `nonegotiate` |
| **VTP** | VLAN deletion | VTP Transparent or v3 + password |
| **CDP** | Information disclosure | `no cdp enable` on edge ports |
| **UDLD** | Unidirectional link | Enable aggressive mode |
