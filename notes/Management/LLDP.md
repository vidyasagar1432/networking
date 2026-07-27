# LLDP (Link Layer Discovery Protocol)

## Overview
- **IEEE 802.1AB** — open standard Layer 2 discovery protocol
- Vendor-neutral (interoperable between Cisco, Juniper, Arista, etc.)
- Similar to CDP but standardized

## Operation
- Multicast to **01:80:c2:00:00:0e** (or **01:80:c2:00:00:03** for LLDP-MED)
- Sends **LLDPDU** (LLDP Data Units) every **30s** (default)
- Hold time: **120s** (default 4× interval)
- TTL = min(65535, hold × interval)

## LLDPDU TLV Types
| Type | Name | Description |
|---|---|---|
| 0 | End of LLDPDU | Marks end |
| 1 | Chassis ID | Device identifier (MAC or hostname) |
| 2 | Port ID | Interface identifier |
| 3 | TTL | Time-to-live |
| 4 | Port Description | Text description of port |
| 5 | System Name | Hostname |
| 6 | System Description | OS/version/hardware |
| 7 | System Capabilities | What device can do (bridge, router, etc.) |
| 8 | Management Address | IP address for management |

## LLDP-MED (Media Endpoint Discovery)
- **ANSI/TIA-1057** — extension for VoIP/endpoints
- Adds: Power (PoE), Location (ELIN), Network Policy (VLAN), Inventory (model/firmware)

## Cisco Configuration
```cisco
lldp run                          # Enable LLDP globally
interface GigabitEthernet0/1
 lldp transmit
 lldp receive
 no lldp transmit                 # Disable on specific interface
```

## CDP vs LLDP
| Feature | CDP | LLDP |
|---|---|---|
| Standard | Cisco proprietary | IEEE 802.1AB |
| Interoperability | Cisco only | Multi-vendor |
| Default | Enabled on Cisco | Disabled on Cisco |
| Interval | 60s | 30s |
| Hold | 180s | 120s |

## Commands
```bash
show lldp
show lldp neighbors
show lldp neighbors detail
show lldp interface
show lldp local-information
```
