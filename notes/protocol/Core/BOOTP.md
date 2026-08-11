# BOOTP (Bootstrap Protocol)

## Overview
- Predecessor to DHCP — assigns IP address to diskless workstations
- Defined in **RFC 951** (1985), extended by RFC 1048 (options), RFC 1532
- Uses **UDP 67 (server)** and **UDP 68 (client)**
- Replaced by DHCP (backward compatible — DHCP servers handle BOOTP requests)

## BOOTP vs DHCP
| Feature | BOOTP | DHCP |
|---|---|---|
| Address allocation | Static (MAC → IP mapping) | Dynamic (lease) |
| Configuration | Manual per MAC | Automated (pools) |
| Options | Limited (RFC 1048) | Extensive (options) |
| Lease time | Permanent | Configurable (DHCP lease) |
| Relay | Yes (BOOTP relay = DHCP relay) | Yes (ip helper-address) |
| Final response | Always encapsulate in UDP src port 67 | Same |

## BOOTP Message Format
- Identical structure to DHCP (DHCP is an extension of BOOTP)
- Key difference: DHCP uses **Options field** to extend functionality

## BOOTP Process
```
Client (0.0.0.0:68) → BOOTREQUEST → Server (255.255.255.255:67)
Server → BOOTREPLY → Client (yiaddr contains IP)
```

## BOOTP Vend/Option Field
- First 4 bytes of options field:
  - BOOTP: Magic cookie not present (or vendor-specific data)
  - DHCP: Magic cookie `0x63825363`

## Cisco BOOTP Relay
Same as DHCP relay:
```cisco
interface Vlan10
 ip helper-address 192.168.1.100
```

## BOOTP Today
- Mostly **obsolete** — replaced by DHCP
- Still supported by DHCP servers for backward compatibility
- BOOTP clients get a **permanent lease** (no renewal)
