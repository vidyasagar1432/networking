# CDP (Cisco Discovery Protocol)

## Overview
- **Cisco proprietary** Layer 2 discovery protocol
- Enabled by default on Cisco devices (IOS, IOS-XE, NX-OS)
- Discovers directly connected Cisco devices (hardware, software, IP)

## Operation
- Multicast to **01:00:0c:cc:cc:cc**
- Sends **CDP advertisements** (frames) every **60s** (default)
- Hold time: **180s** (default)
- Contains: Device ID, Platform, Software version, Capabilities, Interface, VTP domain, Native VLAN, Duplex, MTU

## Information Shared
- Device ID (hostname)
- Platform (e.g., Cisco 4321, Catalyst 9300)
- Software version (e.g., IOS-XE 17.3)
- Capabilities (Router, Switch, Trans-Bridge, IGMP, Host, etc.)
- Interface (local/remote port IDs)
- VTP domain
- Native VLAN
- Duplex mode
- MTU
- System object ID (OID)

## Security Considerations
- **Information disclosure** — Reveals device details to attackers
- **Best practice**: Disable on untrusted interfaces (edge, internet-facing)
```cisco
no cdp run                    # Disable globally
no cdp enable                 # Disable per interface
cdp timer 30                  # Change advertisement interval
cdp holdtime 90               # Change hold time
```

## Commands
```bash
show cdp neighbors
show cdp neighbors detail
show cdp interface
show cdp entry *
show cdp                     # Global status
```
