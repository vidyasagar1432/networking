# NetFlow / IPFIX / sFlow

## Overview
- Network **flow monitoring** protocols — traffic accounting and analysis
- **NetFlow** — Cisco proprietary (v5, v9, v10)
- **IPFIX** — IETF standard (RFC 7011, based on NetFlow v10)
- **sFlow** — Packet sampling (RFC 3176)

## NetFlow
- Captures **flow metadata** (not full packets)
- A flow = src IP, dst IP, src port, dst port, protocol, ToS, input interface

### NetFlow Versions
| Version | Description |
|---|---|
| **v5** | Fixed format — 7-tuple, AS, masks, timestamps, counters |
| **v9** | Template-based (flexible fields, IPv6, MPLS) |
| **v10** = IPFIX | Standardized (IETF RFC 7011) |

### NetFlow v5 Header
| Field | Size | Description |
|---|---|---|
| Version | 2 bytes | 5 |
| Count | 2 bytes | Number of flows |
| SysUptime | 4 bytes | ms since boot |
| Unix Secs | 4 bytes | Absolute time |
| Sequence | 4 bytes | Total flows seen |

### NetFlow v5 Flow Record
| Field | Size |
|---|---|
| Src IP, Dst IP | 4+4 bytes |
| Next Hop | 4 bytes |
| Input/Output SNMP | 2+2 bytes |
| Packets, Bytes | 4+4 bytes |
| First/Last Timestamp | 4+4 bytes (ms offset) |
| Src/Dst Port | 2+2 bytes |
| TCP Flags | 1 byte |
| Protocol | 1 byte |
| ToS | 1 byte |
| Src/Dst AS | 2+2 bytes |
| Src/Dst Mask | 1+1 bytes |
| Padding | 6 bytes |

## IPFIX (NetFlow v10)
- Template-based (flexible field definitions)
- Supports: IPv6, VLAN, MPLS, MAC, application ID
- Transport: SCTP (preferred), TCP, UDP
- **Enterprise fields** — vendor-specific extensions
- **Variable-length fields** — strings, lists

## sFlow
- **Packet-based** sampling (not flow aggregation)
- Samples 1 in N packets (deterministic or random)
- **sFlow agent** in switch/router → **sFlow collector**
- sFlow datagram: sample + interface counters
- Lower CPU than NetFlow (sampling vs per-flow tracking)
- **sFlow v5** — current standard

### sFlow vs NetFlow
| Feature | NetFlow/IPFIX | sFlow |
|---|---|---|
| Method | Flow cache (every packet) | Packet sampling (1:N) |
| CPU load | Higher (full flow tracking) | Lower (sampling) |
| Accuracy | Full count | Statistical |
| Detail | Per-flow counters | Sampled packet headers |
| Use case | Billing, forensics | High-speed links, monitoring |

## Cisco NetFlow Config
```cisco
! Configure flow record
flow record FLOW-RECORD-1
 match ipv4 source address
 match ipv4 destination address
 match transport source-port
 match transport destination-port
 match ip protocol
 collect interface input
 collect interface output
 collect counter bytes
 collect counter packets
 collect timestamp sys-uptime first
 collect timestamp sys-uptime last

! Configure flow exporter
flow exporter EXPORTER-1
 destination 192.168.1.100
 source Loopback0
 transport udp 9995
 template data timeout 300

! Apply to interface
interface GigabitEthernet0/0
 ip flow monitor FLOW-MONITOR-1 input
 ip flow monitor FLOW-MONITOR-1 output
```

## Flow Collectors
| Tool | Description |
|---|---|
| **nfdump** | Open-source NetFlow collection & analysis |
| **ElastiFlow** | NetFlow/IPFIX/sFlow → Elastic Stack |
| **PRTG** | All-in-one monitoring with flow support |
| **SolarWinds NTA** | NetFlow Traffic Analyzer |
| **ntopng** | Real-time flow analysis |
| **pmacct** | Accounting/IPFIX collection |

## sFlow Config (Cisco)
```cisco
sflow destination 192.168.1.100 6343
sflow source-interface Loopback0
sflow sampling-rate 4096
sflow poll-interval 30

interface GigabitEthernet0/0
 sflow enable
```
