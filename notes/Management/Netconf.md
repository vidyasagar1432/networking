# NETCONF / RESTCONF

## Overview
- Network management protocols using structured data (YANG)
- **NETCONF** (RFC 6241) — XML over SSH (TCP 830)
- **RESTCONF** (RFC 8040) — JSON/XML over HTTP (TCP 443/80)

## NETCONF
- **SSH-based** — TCP 830 (default), XML payload
- **RPC model** — client sends RPC, server replies
- **Datastores**: candidate, running, startup
- Operations: get, get-config, edit-config, copy-config, delete-config, lock/unlock, close-session, kill-session

### NETCONF Layers
| Layer | Description |
|---|---|
| Content | Configuration data (YANG) |
| Operations | CRUD (get, edit-config, etc.) |
| RPC | Request/response framing |
| Transport | SSH (mandatory), TLS (optional) |

### NETCONF Operations
```xml
<rpc>
  <get-config>
    <source><running/></source>
  </get-config>
</rpc>
```

## RESTCONF
- **HTTP-based** — RESTful API
- Methods: GET (read), POST (create), PUT (replace), PATCH (merge), DELETE
- Accept: JSON (preferred) or XML
- Uses YANG modules as URL hierarchy
```
GET /restconf/data/ietf-interfaces:interfaces
PUT /restconf/data/ietf-interfaces:interfaces/interface=GigabitEthernet0/0
```

## YANG (RFC 7950)
- Data modeling language — defines config & state data
- Hierarchical, modular, reusable
- **Modules**: ietf-interfaces, ietf-ip, ietf-routing, ietf-system, etc.
```yang
module example-interfaces {
  yang-version 1.1;
  namespace "http://example.com/interfaces";
  prefix "exif";

  container interfaces {
    list interface {
      key "name";
      leaf name  { type string; }
      leaf type  { type string; }
      leaf enabled { type boolean; }
      leaf mtu { type uint32; }
    }
  }
}
```

## gNMI (gRPC Network Management Interface)
- **gRPC-based** — protobuf over HTTP/2
- Streaming telemetry + config operations
- Capabilities: Capabilities, Get, Set, Subscribe
- Efficient binary encoding (protobuf)

## gRPC
- High-performance RPC framework (HTTP/2, protobuf)
- Used by: gNMI, gNSI, gNOI (openconfig)
- Streaming, bidirectional, multiplexed

## OpenConfig
- Vendor-neutral YANG models for network configuration
- Focus on **operational state** + **intent-based** config
- Alternative to IETF YANG models

## REST API (RESTful)
- Representational State Transfer
- HTTP methods: GET, POST, PUT, PATCH, DELETE
- Stateless, cacheable, uniform interface
- Common network device REST APIs: Cisco IOS-XE, Arista eAPI, Juniper JNC

## SOAP (Simple Object Access Protocol)
- XML-based RPC protocol (HTTP/SMTP transport)
- WSDL + XML Schema for service definition
- Legacy — largely replaced by REST/gRPC

## JSON-RPC / XML-RPC
- **JSON-RPC** — lightweight RPC over HTTP (JSON)
- **XML-RPC** — precursor to SOAP (XML over HTTP)
- Supported by: Cisco (XML-RPC), some open-source tools

## OpenFlow
- **SDN** protocol — separates control plane from data plane
- Controller programs switch flow tables
- Defined by **Open Networking Foundation (ONF)**
- OpenFlow messages: PacketIn, PacketOut, FlowMod, FeaturesRequest
- Match fields: MAC, IP, port, VLAN, MPLS label
- Actions: forward, drop, modify header, output to controller

## Tools
```bash
# NETCONF
yangcli --ssh username@192.168.1.1

# RESTCONF
curl -u admin:pass -H "Accept: application/yang-data+json" \
  https://192.168.1.1/restconf/data/ietf-interfaces:interfaces

# gNMI
gnmi_client -target_addr 192.168.1.1:57400 \
  -alsologtostderr \
  -proto "path: <origin: 'openconfig', elem: <name: 'interfaces'>>"
```
