# ATM (Asynchronous Transfer Mode)

## Overview
- **Cell-switched** network technology — fixed 53-byte cells (48 data + 5 header)
- Defined by **ATM Forum** / **ITU-T**
- Legacy — largely replaced by IP/Ethernet/MPLS
- Used in WAN backbones, DSL (ATM last-mile), 1990s–2000s

## Cell Format
| Field | Size | Description |
|---|---|---|
| GFC (UNI) / VPI (NNI) | 4 bits | Generic Flow Control |
| VPI | 8 bits (UNI) / 12 bits (NNI) | Virtual Path Identifier |
| VCI | 16 bits | Virtual Channel Identifier |
| PTI | 3 bits | Payload Type (user/management, congestion) |
| CLP | 1 bit | Cell Loss Priority |
| HEC | 1 byte | Header Error Control (CRC-8) |

## Connections
| Type | Description |
|---|---|
| **PVC** | Permanent Virtual Circuit (provisioned manually) |
| **SVC** | Switched Virtual Circuit (signaled via Q.2931) |
| **VP** (Virtual Path) | Bundle of VCs |
| **VC** (Virtual Channel) | Individual connection |

## Service Categories
| Category | Description | Example |
|---|---|---|
| **CBR** | Constant Bit Rate | Voice (T1/E1) |
| **VBR-rt** | Variable Bit Rate — real-time | Video |
| **VBR-nrt** | Variable Bit Rate — non-real-time | Data |
| **ABR** | Available Bit Rate | Data with flow control |
| **UBR** | Unspecified Bit Rate | Best-effort data |

## ATM Adaptation Layers (AAL)
| Layer | Purpose | Example |
|---|---|---|
| **AAL1** | CBR, circuit emulation | Voice |
| **AAL2** | VBR-rt, variable packets | Compressed voice |
| **AAL5** | Variable-length packets (most common) | IP, Ethernet (LANE) |

## DSL and ATM
- **ADSL** uses ATM as Layer 2 transport
- **PPPoA** (PPP over ATM) — broadband authentication

## ATM over DSL
```
Ethernet → PPP → AAL5 → ATM → DSL
```
- **MTU**: ATM cells are 53 bytes, so IP MTU is typically 1492 (with PPPoE/AAL5 overhead)

## Cisco Config (Legacy)
```cisco
interface ATM0/0
 no ip address
!
interface ATM0/0.1 point-to-point
 ip address 10.0.0.1 255.255.255.0
 pvc 0/100
  encapsulation aal5snap
!
```
