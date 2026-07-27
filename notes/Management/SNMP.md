# SNMP (Simple Network Management Protocol)

## Overview
- Monitors and manages network devices
- Defined in **RFC 1157** (v1), **RFC 1901–1908** (v2c), **RFC 3411–3418** (v3)
- Uses **UDP ports 161** (queries/traps), **162** (traps/informs to manager)

## Components
| Component | Description |
|---|---|
| **NMS** (Manager) | Central monitoring system (SolarWinds, PRTG, Zabbix, LibreNMS) |
| **Agent** | Software on managed device (router, switch, server) |
| **MIB** (Management Information Base) | Hierarchical database of OIDs (Object Identifiers) |
| **OID** (Object Identifier) | Unique ID for each manageable object |

## MIB / OID Structure
- Tree structure: `.iso.org.dod.internet.mgmt.mib-2` = **1.3.6.1.2.1**
- Common subtrees:
  - **1.3.6.1.2.1.1** — system (sysName, sysDescr, sysUpTime)
  - **1.3.6.1.2.1.2** — interfaces (ifInOctets, ifOutOctets, ifOperStatus)
  - **1.3.6.1.2.1.4** — IP (ipForwarding, ipRouteTable)
  - **1.3.6.1.2.1.6** — TCP
  - **1.3.6.1.2.1.11** — SNMP statistics

## SNMP Versions
| Feature | v1 | v2c | v3 |
|---|---|---|---|
| Auth | Community string (plaintext) | Community string (plaintext) | User/pass + Encryption |
| Encryption | None | None | AES/DES (privacy) |
| Integrity | None | None | SHA/MD5 (authentication) |
| Bulk retrieval | No | **GetBulk** (efficient) | Yes |
| Security | Weak | Weak | Strong |

## Operations
| Operation | Direction | Description |
|---|---|---|
| **Get** | NMS → Agent | Read a single OID |
| **GetNext** | NMS → Agent | Walk the MIB tree |
| **GetBulk** (v2c/v3) | NMS → Agent | Retrieve large tables efficiently |
| **Set** | NMS → Agent | Write/modify configuration |
| **Trap** | Agent → NMS | Unsolicited notification (no ACK) |
| **Inform** | Agent → NMS | Confirmed notification (ACK) |
| **Response** | Agent → NMS | Reply to Get/Set/GetNext |

## Community Strings (v1/v2c)
- **Read-only (RO)** — `public` (default) — query access
- **Read-write (RW)** — `private` (default) — write access
- **Security best practice**: Change defaults, restrict by ACL

## SNMPv3 Security Levels
| Level | Auth | Priv | Description |
|---|---|---|---|
| **noAuthNoPriv** | None | None | Like v2c (no security) |
| **authNoPriv** | SHA/MD5 | None | Authenticated, not encrypted |
| **authPriv** | SHA/MD5 | AES/DES | Authenticated + encrypted |

## Common Traps
| Trap | Description |
|---|---|
| **coldStart** | Device power-cycled |
| **warmStart** | Device rebooted (config preserved) |
| **linkDown** | Interface went down |
| **linkUp** | Interface came up |
| **authenticationFailure** | Bad community string received |

## Config Example (Cisco)
```cisco
! SNMPv2c
snmp-server community public RO
snmp-server community private RW
snmp-server location "Data Center A"
snmp-server contact "admin@example.com"

! SNMPv3
snmp-server group ADMIN v3 auth
snmp-server user admin ADMIN v3 auth sha P@ssw0rd priv aes 128 P@ssw0rd

! Traps
snmp-server enable traps snmp linkdown linkup
snmp-server host 192.168.1.100 traps version 2c public
```

## Common Commands
```bash
snmpwalk -v2c -c public 192.168.1.1 1.3.6.1.2.1    # Walk MIB tree
snmpget -v2c -c public 192.168.1.1 1.3.6.1.2.1.1.5.0  # sysName
snmpset -v2c -c private 192.168.1.1 1.3.6.1.2.1.1.5.0 s NewName
snmpgetnext -v2c -c public 192.168.1.1 1.3.6.1.2.1.1.5.0
```
