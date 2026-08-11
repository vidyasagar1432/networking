# Switching

| Term | Definition |
|---|---|
| **VLAN** | Virtual LAN — logical broadcast domain within a switch |
| **Access Port** | Switch port carrying traffic for a single VLAN (untagged) |
| **Trunk Port** | Switch port carrying multiple VLANs (tagged with 802.1Q) |
| **Native VLAN** | VLAN assigned to untagged traffic on a trunk (default = VLAN 1) |
| **Voice VLAN** | Dedicated VLAN for VoIP traffic (uses 802.1Q CoS/LLDP-MED) |
| **Inter-VLAN Routing** | Routing traffic between different VLANs (via SVI or router-on-a-stick) |
| **MAC Address Table** | Switch table mapping MAC addresses to ports |
| **CAM Table** | Content Addressable Memory — hardware MAC address table |
| **Port Security** | Limits MAC addresses per port (prevents MAC flooding) |
| **Storm Control** | Limits broadcast/multicast/unknown-unicast traffic |
| **SPAN** | Switch Port Analyzer — mirror traffic to a monitoring port |
| **RSPAN** | Remote SPAN — mirror to a destination port on a different switch |
| **ERSPAN** | Encapsulated RSPAN — mirror over Layer 3 (GRE-encapsulated) |
