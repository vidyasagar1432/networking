# Cloud Connectivity (Direct Connect, ExpressRoute, Interconnect)

## Overview
- Dedicated private connections from on-premises to cloud providers
- Bypasses the public Internet — lower latency, higher reliability, consistent bandwidth

## AWS Direct Connect
- **Dedicated fiber** from on-premises to AWS
- Speeds: 50 Mbps – 100 Gbps
- **Virtual Interfaces (VIF)**:
  - **Private VIF** — VPC access (private IP)
  - **Public VIF** — AWS public services (S3, DynamoDB)
  - **Transit VIF** — AWS Transit Gateway (multi-VPC)

### Direct Connect Components
| Component | Description |
|---|---|
| **DX Connection** | Physical fiber cross-connect |
| **Virtual Interface (VIF)** | Logical VLAN over connection |
| **Virtual Gateway** | VPN endpoint for private VIF |
| **Direct Connect Gateway** | Global aggregation (multi-region) |
| **Transit Gateway** | Hub for VPCs + VPN + DX |

### Direct Connect + VPN Backup
- DX = primary, VPN over Internet = backup (BGP prepending)
- **Jumbo frames**: 1500 MTU (default), 9001 (MTU with DHCP)

## Azure ExpressRoute
- Private connection from on-premises to Azure
- Speeds: 50 Mbps – 100 Gbps
- Redundancy: **dual circuits** (active/active)

### ExpressRoute Models
| Model | Description |
|---|---|
| **CloudExchange Co-location** | Colo with Equinix, etc. |
| **Point-to-Point Ethernet** | MPLS VPN to Azure edge |
| **Any-to-Any (IPVPN)** | MPLS provider extends to Azure |
| **ExpressRoute Direct** | Direct fiber from on-prem (10/100 Gbps) |

### ExpressRoute Components
| Component | Description |
|---|---|
| **Circuit** | Physical connection (provider provisioned) |
| **Peering** — Private / Microsoft / Public (deprecated) |
| **VLAN ID** | Per circuit, per peering |
| **BGP ASN** | Public or private AS for peering |

### ExpressRoute Peering
- **Private peering** — Azure VNet access (RFC 1918 IPs)
- **Microsoft peering** — Microsoft public services (Office 365, Azure PaaS)

## Google Cloud Interconnect
- **Dedicated Interconnect** — Direct fiber (100 Mbps – 100 Gbps)
- **Partner Interconnect** — Via service provider (50 Mbps – 50 Gbps)
- **VLAN attachment** — connects to VPC

### Interconnect Types
| Type | Speed | SLA |
|---|---|---|
| **Dedicated** | 10/100 Gbps per circuit | 99.99% |
| **Partner** | 50 Mbps – 50 Gbps | Depends on partner |

## Comparison
| Feature | AWS DX | Azure ExpressRoute | GCP Interconnect |
|---|---|---|---|
| Speed | 50 Mbps – 100 Gbps | 50 Mbps – 100 Gbps | 100 Mbps – 100 Gbps |
| Private/VPC access | Private VIF | Private peering | VLAN attachment |
| Public services | Public VIF | Microsoft peering | Direct Peering |
| Redundancy | Dual connection | Dual circuit | Dual circuit |
| BGP | Required | Required | Required |
| MTU | 1500 / 9001 | 1500 | 1440 / 1500 |

## Routing (BGP)
- Cloud connects use **BGP** to exchange routes
- **MD5 authentication** on BGP sessions
- **ASN**: Private ASN (64512–65535) or public (if owned)
- **BGP communities** for route preference:
  - AWS: trigger prepending
  - Azure: regional preference
  - GCP: region-based communities

## Config Example (On-prem Cisco to Cloud)
```cisco
interface GigabitEthernet0/0.100
 description AWS Direct Connect Private VIF
 encapsulation dot1Q 100
 ip address 169.254.10.1 255.255.255.252

router bgp 65001
 neighbor 169.254.10.2 remote-as 64512
 neighbor 169.254.10.2 description AWS Direct Connect
 neighbor 169.254.10.2 password BGPKey
 neighbor 169.254.10.2 timers 10 30
 address-family ipv4 unicast
  network 192.168.0.0 mask 255.255.0.0
  neighbor 169.254.10.2 activate
```
