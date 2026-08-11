# DHCP (Dynamic Host Configuration Protocol)

## Overview
- Automatically assigns IP addresses and other network parameters to hosts
- Reduces manual configuration, prevents IP conflicts
- Uses **UDP ports 67 (server)** and **68 (client)**
- Defined in **RFC 2131**

## DORA Process
1. **Discover** — Client broadcasts: "Is there a DHCP server?"
   - Source: 0.0.0.0:68 → Dest: 255.255.255.255:67
2. **Offer** — Server responds: "Here's an IP you can use"
   - Source: Server:67 → Dest: 255.255.255.255:68
3. **Request** — Client requests the offered IP
4. **Ack** — Server confirms the lease

## DHCP Message Format
| Field | Size |
|---|---|
| Opcode (1=Request, 2=Reply) | 1 byte |
| Hardware Type | 1 byte |
| Hardware Address Length | 1 byte |
| Hops | 1 byte |
| Transaction ID (XID) | 4 bytes |
| Seconds elapsed | 2 bytes |
| Flags (Broadcast flag) | 2 bytes |
| Client IP (ciaddr) | 4 bytes |
| Your IP (yiaddr) | 4 bytes |
| Server IP (siaddr) | 4 bytes |
| Gateway IP (giaddr) | 4 bytes |
| Client MAC (chaddr) | 16 bytes |
| Server hostname (sname) | 64 bytes |
| Boot filename (file) | 128 bytes |
| Options (variable) | Variable |

## DHCP Options
- **Option 1** — Subnet Mask
- **Option 3** — Router (Default Gateway)
- **Option 6** — DNS Server(s)
- **Option 15** — Domain Name
- **Option 51** — Lease Time
- **Option 53** — Message Type (1=Discover, 2=Offer, 3=Request, 4=Ack, 5=Nak, 6=Decline, 7=Release, 8=Inform)
- **Option 66** — TFTP Server (for PXE boot)
- **Option 150** — TFTP Server (Cisco specific)
- **Option 121** — Classless Static Routes

## Lease Process
```
Discover → Offer → Request → Ack  (Lease active)
                                     ↓
                              50% expired → Renew (unicast Request to server)
                                     ↓
                              87.5% expired → Rebind (broadcast to any server)
                                     ↓
                              100% expired → Release, restart DORA
```

## DHCP Relay (ip helper-address)
- Forwards DHCP broadcasts across subnets
- Router sets **giaddr** (gateway IP) field so server knows which subnet to assign from
- Command: `ip helper-address <server-ip>` (Cisco)

## Common Commands
```bash
# Linux
dhclient -v                          # Renew DHCP lease
dhclient -r                          # Release lease
cat /var/lib/dhcp/dhclient.leases    # View lease info

# Windows
ipconfig /renew
ipconfig /release
ipconfig /all                        # View DHCP info
```

## Security Concerns
- **DHCP Starvation** — Attacker floods with fake Discover messages to exhaust IP pool
- **Rogue DHCP Server** — Attacker runs unauthorized server to hand out malicious config
- Mitigations:
  - **DHCP Snooping** — Switch filters untrusted DHCP messages
  - **Port Security** — Limit MAC addresses per port
  - **DAI** — Works with DHCP snooping to validate ARP

## DHCPv6
- Uses **UDP 546 (client)** and **547 (server)**
- Two modes:
  - **SLAAC** — Stateless Address Autoconfiguration (RA messages)
  - **Stateful DHCPv6** — Similar to DHCPv4 (IA_NA for addresses, IA_PD for prefix delegation)
- DHCPv6 does **not** provide default gateway — learned via **Router Advertisement (RA)**
