# ARP (Address Resolution Protocol)

## Overview
- Maps **IP addresses** to **MAC addresses** on a local network
- Operates at Layer 2/3 boundary (Data Link + Network Layer)
- Defined in **RFC 826**

## How it works
1. Device needs to send IP packet to another device on same subnet but only knows its IP
2. Sender broadcasts an **ARP Request**: "Who has IP x.x.x.x?"
3. Target responds with **ARP Reply**: "I have IP x.x.x.x, my MAC is xx:xx:xx:xx:xx:xx"
4. Sender caches the mapping in its **ARP table** for future use

## ARP Packet Format
| Field | Size |
|---|---|
| Hardware Type (Ethernet = 1) | 2 bytes |
| Protocol Type (IPv4 = 0x0800) | 2 bytes |
| Hardware Size (MAC = 6) | 1 byte |
| Protocol Size (IP = 4) | 1 byte |
| Opcode (1=Request, 2=Reply) | 2 bytes |
| Sender MAC | 6 bytes |
| Sender IP | 4 bytes |
| Target MAC | 6 bytes |
| Target IP | 4 bytes |

## ARP Table
- `arp -a` (Windows/Linux/macOS) to view
- Entries timeout (typically ~2-4 minutes for incomplete, ~20 min for complete)
- Contains: IP address, MAC address, interface, entry type (static/dynamic)

## Types
- **Dynamic ARP**: Learned automatically via ARP requests/replies
- **Static ARP**: Manually configured, does not expire
- **Gratuitous ARP**: ARP reply sent without a request — used to announce IP/MAC change or check for duplicate IPs (DAD)
- **Proxy ARP**: Router answers ARP requests on behalf of another device (used for subnetting without hosts knowing)

## Security Concerns
- **ARP Spoofing/Poisoning**: Attacker sends forged ARP replies to associate their MAC with another device's IP
  - Enables MITM (Man-in-the-Middle) attacks
- Mitigations:
  - **Dynamic ARP Inspection (DAI)** — switch validates ARP packets
  - **Static ARP entries** for critical devices
  - **ARP security features** on switches (e.g., Cisco port security)

## Common Commands
```bash
arp -a                    # Show ARP table (Linux/macOS)
arp -d <ip>               # Delete ARP entry
ip neigh show             # Show neighbor table (Linux)
ip neigh delete <ip>      # Delete neighbor entry (Linux)
```

## IPv6 Equivalent
- **NDP (Neighbor Discovery Protocol)** replaces ARP in IPv6
- Uses ICMPv6 messages (Neighbor Solicitation / Neighbor Advertisement)
