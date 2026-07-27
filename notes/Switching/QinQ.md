# QinQ (802.1ad / Provider Bridging)

## Overview
- **Double VLAN tagging** — stack two 802.1Q tags
- Defined in **IEEE 802.1ad** (originally 802.1Q-in-Q)
- Service provider pushes **outer tag** (S-Tag) on customer's inner tag (C-Tag)
- Max frame: 1522 bytes (original 802.1Q) → 1522 + 4 = 1526 bytes (QinQ)

## Frame Format
```
[DMAC | SMAC | S-Tag (0x88A8) | C-Tag (0x8100) | EtherType | Payload | FCS]
```

| Tag | Description |
|---|---|
| **S-Tag** (Service Tag) | Outer — EtherType 0x88A8, Service VLAN (SP VLAN) |
| **C-Tag** (Customer Tag) | Inner — EtherType 0x8100, Customer VLAN |

## Use Cases
- **Service Provider** — transparently carry customer VLANs across SP network
- **Data Center** — multi-tenant environments (each tenant gets own VLAN space)
- **Transparent LAN Services** — customer VLANs preserved across WAN

## Q-in-Q Types
| Type | Description |
|---|---|
| **Port-based** (untagged) | All traffic from port tagged with S-VLAN |
| **Selective** (VLAN-based) | Specific VLANs double-tagged (rest pass through) |
| **VLAN translation** | Rewrite C-Tag to another value |

## 802.1ad vs 802.1Q
| Feature | 802.1Q | 802.1ad (QinQ) |
|---|---|---|
| Tags | 1 | 2 |
| S-Tag EtherType | — | 0x88A8 |
| Max VLANs | 4094 | 4094 × 4094 (~16M) |
| Customer VLAN preserved | No | Yes (C-Tag) |
| Service provider use | Limited | Designed for |

## Cisco Config Examples
### Port-based QinQ (access port → tunnel)
```cisco
interface GigabitEthernet0/1
 switchport access vlan 100
 switchport mode dot1q-tunnel
 vlan dot1q tag native
```

### Selective QinQ (Q-in-Q with allowed VLANs)
```cisco
interface GigabitEthernet0/2
 switchport trunk encapsulation dot1q
 switchport mode trunk
 switchport vlan mapping enable
 switchport vlan mapping 10-20 110-120
```

## MTU Considerations
- QinQ adds **4 extra bytes** (second tag)
- Some switches/equipment may drop frames > 1518 bytes
- **MTU must be increased** on trunk interfaces carrying QinQ
- IP MTU may need reduction to accommodate double-tagged frames

## VLAN Translation
- Rewrites C-Tag (customer VLAN) to different value
- Useful when VLANs overlap across customers
- Both 1:1 and many:1 translation available on supported platforms

## VXLAN vs QinQ
| Feature | QinQ | VXLAN |
|---|---|---|
| Max segments | 16 million (4094²) | 16 million (2²⁴) |
| Encapsulation | Double 802.1Q tag | MAC-in-UDP |
| Transport | Layer 2 (Ethernet) | Layer 3 (IP network) |
| MTU overhead | 4 bytes | 50+ bytes |
| Use case | Metro Ethernet, SP L2VPN | Data center overlay |
