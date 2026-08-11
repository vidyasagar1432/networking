# VLAN (Virtual Local Area Network)

## Overview
- Logically segments a physical switch into multiple isolated broadcast domains
- Defined in **IEEE 802.1Q**
- Allows grouping devices by function/department regardless of physical location

## Why Use VLANs?
- **Broadcast control** — Reduces broadcast domain size
- **Security** — Isolate sensitive traffic (e.g., VoIP, management, guests)
- **Performance** — Less unnecessary flooding
- **Flexibility** — Devices move without re-cabling

## VLAN Types
| Type | Description |
|---|---|
| **Default VLAN** (VLAN 1) | Present by default on all ports, cannot be deleted |
| **Data VLAN** | User traffic |
| **Voice VLAN** | Dedicated VLAN for VoIP traffic (LLDP-MED or CDP) |
| **Management VLAN** | For switch admin access (SSH/HTTP) |
| **Native VLAN** | Untagged traffic on a trunk (default = VLAN 1) |
| **Black Hole VLAN** | Unused VLAN — ports assigned to it are effectively disabled |

## 802.1Q Tagging
- 4-byte tag inserted between Source MAC and EtherType/Length:
  - **TPID** (0x8100) — 2 bytes
  - **PCP** (Priority Code Point) — 3 bits (CoS, 0–7)
  - **DEI** (Drop Eligible Indicator) — 1 bit
  - **VID** (VLAN ID) — 12 bits (1–4094, 0 & 4095 reserved)

**VLAN Ranges:**
- 1–1005: Normal (standard, ISL supports 1–1001)
- 1006–4094: Extended (VTP transparent mode required on Cisco)

## Trunk Port vs Access Port
| Feature | Access Port | Trunk Port |
|---|---|---|
| Traffic | Single VLAN (untagged) | Multiple VLANs (tagged) |
| Use | End devices (PCs, printers) | Switch-to-switch, switch-to-router |
| Tagging | No | Yes (except native VLAN) |

## VTP (VLAN Trunking Protocol)
- Cisco proprietary — syncs VLAN database across switches
- **Modes:**
  - **Server** — Creates/modifies/deletes VLANs, advertises
  - **Client** — Receives and applies VLANs (can't create locally)
  - **Transparent** — Passes VTP messages but manages VLANs locally
- **VTP Pruning** — Prevents flooding of unknown VLAN traffic down trunks where it isn't needed
- VTP Password — authenticates VTP domain members
- VTP version 1, 2, 3 (v3 adds private VLAN support, extended VLANs)

## DTP (Dynamic Trunking Protocol)
- Cisco proprietary — negotiates trunking between switches
- **Modes:**
  - **Dynamic Auto** — Will become trunk if neighbor is trunk/desirable
  - **Dynamic Desirable** — Actively tries to form trunk
  - **Trunk** — Puts port in trunking mode unconditionally
  - **Access** — Puts port in access mode
- Security risk: disable DTP on access ports (`switchport nonegotiate`)

## Private VLAN (PVLAN)
- Further isolates devices within the same VLAN
- **Port types:**
  - **Promiscuous** — Can communicate with all ports (typically uplink)
  - **Isolated** — Can only communicate with promiscuous port
  - **Community** — Can communicate with same community + promiscuous
- Use case: ISP/cloud environments where tenants must be isolated

## Voice VLAN
- Separates voice traffic from data on a single switch port
- Port configured with:
  - `switchport mode access`
  - `switchport access vlan 10` (data VLAN)
  - `switchport voice vlan 20`  (voice VLAN)
- Phone uses CDP/LLDP-MED to learn voice VLAN, tags its traffic with 802.1Q

## Configuration Examples (Cisco)
```cisco
! Access port
interface GigabitEthernet0/1
 switchport mode access
 switchport access vlan 10

! Trunk port
interface GigabitEthernet0/24
 switchport mode trunk
 switchport trunk native vlan 99
 switchport trunk allowed vlan 10,20,30

! Voice VLAN
interface GigabitEthernet0/2
 switchport mode access
 switchport access vlan 10
 switchport voice vlan 20

! Management VLAN
interface vlan 99
 ip address 192.168.99.1 255.255.255.0
 no shutdown
```

## Troubleshooting
```bash
show vlan brief                # VLAN membership summary
show vlan id <vlan-id>        # Detailed VLAN info
show interfaces trunk         # Trunk port status
show interfaces switchport    # Detailed port config (mode, native, allowed)
show interfaces <int> switchport
show dtp                      # DTP status
show vtp status               # VTP domain info
```

## VLAN Hopping (Security)
- **Switch Spoofing** — Attacker mimics DTP to become trunk
  - Mitigation: `switchport mode access` + `switchport nonegotiate`
- **Double Tagging** — Attacker sends frame with two 802.1Q tags
  - Mitigation: set native VLAN to unused VLAN on all trunks

## Router-on-a-Stick (ROAS)
- Router with single physical trunk to switch — handles inter-VLAN routing
- Subinterfaces: `interface Gig0/0.10` with `encapsulation dot1Q 10`
- Downside: bandwidth bottleneck, single point of failure

## Layer 3 Switch (SVI)
- Switch Virtual Interface — VLAN interface with IP for routing
- More performant than ROAS (hardware switching)
- Config: `interface vlan 10` → `ip address 192.168.10.1 255.255.255.0`
