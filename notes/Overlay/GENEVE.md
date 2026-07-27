# GENEVE (Generic Network Virtualization Encapsulation)

## Overview
- **Tunnel overlay** protocol — flexible encapsulation for network virtualization
- Defined in **RFC 8926**
- More flexible than VXLAN (variable-length options, arbitrary protocol payloads)

## GENEVE Header
```
[Outer IP/UDP | GENEVE header | Inner L2/L3 frame]
```

| Field | Size | Description |
|---|---|---|
| Version | 2 bits | 0 |
| Options Length | 6 bits | Option headers in 4-byte units |
| OAM | 1 bit | OAM packet |
| Critical | 1 bit | Critical options present |
| Reserved | 6 bits | |
| Protocol Type | 16 bits | Inner packet EtherType |
| VNI | 24 bits | Virtual Network Identifier |
| Reserved | 8 bits | |
| Options | Variable | TLV options |

## GENEVE vs VXLAN
| Feature | VXLAN | GENEVE |
|---|---|---|
| Options | None | Variable TLV (flexible) |
| Protocol Type | Ethernet only (0x6558) | Any EtherType (IP, ARP, MPLS) |
| Standard | RFC 7348 | RFC 8926 |
| OAM | No | Yes (OAM bit) |
| Critical options | N/A | Yes (drop if not understood) |
| Adoption | Widely deployed | Emerging (OVS, Linux) |

## Options (TLV)
- Type (16 bits), Length (8 bits), Data (variable)
- Examples: metadata, timestamps, security context
- **Critical bit**: if recipient doesn't understand → drop (vs ignore)

## Use Cases
- **Network virtualization** (multi-tenant overlays)
- **Open vSwitch (OVS)** — primary GENEVE implementor
- **Container networking** — Kubernetes CNI plugins
- **Software-defined networking** — flexible metadata pass-through

## GENEVE in Linux
```bash
# Create GENEVE tunnel
ip link add gen1 type geneve id 100 remote 10.0.0.2
ip addr add 192.168.100.1/24 dev gen1
ip link set gen1 up

# With options
ip link add gen2 type geneve id 200 remote 10.0.0.3 \
  geneve-option 0x100,2,0x0001
```

## Comparison of Overlays
| Feature | VXLAN | GENEVE | STT | NVGRE |
|---|---|---|---|---|
| Encapsulation | MAC-in-UDP | MAC-in-UDP | TCP-in-IP | MAC-in-GRE |
| Options | None | TLV | None | None |
| Standard | RFC 7348 | RFC 8926 | RFC (expired) | RFC 7637 |
| Status | Widely deployed | Growing | Experimental | Limited |
