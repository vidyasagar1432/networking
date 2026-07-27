# Storage Networking (FCoE, iSCSI, NVMe-oF)

## Overview
- Protocols for accessing block storage over a network
- SAN (Storage Area Network) technologies

## FCoE (Fibre Channel over Ethernet)
- Encapsulates **Fibre Channel** frames over Ethernet
- Standard: **FC-BB-5** (Fibre Channel Backbone)
- Requires **lossless Ethernet** (DCB — Data Center Bridging)
- Uses **EtherType 0x8906**

### FCoE Components
| Component | Description |
|---|---|
| **FCF** (FCoE Forwarder) | Bridges FCoE ↔ Fibre Channel |
| **ENode** | FCoE-capable server (CNA) |
| **VN_Port** | Virtual FC port over Ethernet |
| **VE_Port** | Virtual expansion port |

### Lossless Ethernet (DCB)
| Feature | Function |
|---|---|
| **PFC** (Priority Flow Control) | 802.1Qbb — pause per priority class |
| **ETS** (Enhanced Transmission Selection) | 802.1Qaz — bandwidth allocation |
| **DCBX** (DCB Exchange) | 802.1Qaz — capability negotiation |

### FCoE Frame
```
[Ethernet | FCoE (EtherType 0x8906) | FC Frame | CRC]
```

## iSCSI (Internet Small Computer System Interface)
- SCSI commands over **TCP/IP**
- Defined in **RFC 7143** (RFC 3720 original)
- Initiator (client) → Target (storage)
- Port: **TCP 3260** (default)

### iSCSI Names
| Format | Example |
|---|---|
| **IQN** (iSCSI Qualified Name) | `iqn.2024-01.com.example:storage1` |
| **EUI** (Extended Unique ID) | `eui.0200001a00001234` |
| **NAA** (Network Address Authority) | `naa.52004567ba64678d` |

### iSCSI Session
1. Discovery — Find targets (SendTargets)
2. Login — Authenticate, negotiate parameters
3. Full Feature Phase — I/O commands (SCSI CDBs)
4. Logout — Close session

### Authentication
- **CHAP** (default) — mutual or one-way
- **SRP** (Secure Remote Password)
- **KRB5** (Kerberos)
- IPsec for transport encryption

## NVMe-oF (NVMe over Fabrics)
- **NVMe** commands over network (NVMe over TCP, RDMA, FC)
- Much lower latency than iSCSI (NVMe designed for SSD)
- Standard: **NVMe-of 1.0** (NVM Express Inc.)

### NVMe-oF Transports
| Transport | Description | Port |
|---|---|---|
| **NVMe/TCP** | NVMe over TCP | TCP 4420 |
| **NVMe/RDMA** | NVMe over InfiniBand/RoCE/iWARP | RDMA |
| **NVMe/FC** | NVMe over Fibre Channel (FC-NVMe) | FC |

### NVMe vs iSCSI
| Feature | NVMe/TCP | iSCSI |
|---|---|---|
| Command queues | 64K queues × 64K commands | 1 queue × 256 commands |
| Latency | Very low | Moderate |
| CPU efficiency | Low (polling, SPDK) | Higher (interrupts) |
| Protocol | Optimized for flash | Legacy (SCSI) |

## Fibre Channel (FC)
- High-speed storage networking (native SAN)
- Speeds: 1/2/4/8/16/32/128 Gbps
- **Topologies**: Point-to-Point, Arbitrated Loop (FC-AL), Switched Fabric (FC-SW)
- **WWN** (World Wide Name) — 64-bit unique identifier (like MAC for storage)
- **Port types**: N_Port (node), F_Port (fabric), E_Port (expansion), etc.
