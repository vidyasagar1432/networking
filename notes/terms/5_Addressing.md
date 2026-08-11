# Addressing

| Term | Definition |
|---|---|
| **MAC Address** | 48-bit hardware address burned into NIC (e.g., AA:BB:CC:DD:EE:FF) |
| **IP Address** | Logical address used for network-layer communication |
| **IPv4** | 32-bit address (e.g., 192.168.1.1) |
| **IPv6** | 128-bit address (e.g., 2001:db8::1) |
| **Public IP** | Globally routable IP address (assigned by IANA) |
| **Private IP** | Non-routable on Internet (RFC 1918: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16) |
| **Loopback Address** | 127.0.0.1 (IPv4) or ::1 (IPv6) — refers to local host |
| **Broadcast Address** | Network's last address — sends to all hosts on subnet (e.g., 192.168.1.255) |
| **Network Address** | First address in a subnet — identifies the network itself |
| **Host Address** | Any usable IP within a subnet (between network and broadcast) |
| **Gateway Address** | The router's IP on the subnet (used as default gateway) |
| **Link-local Address** | Self-assigned, no DHCP needed (169.254.0.0/16 IPv4, fe80::/10 IPv6) |
| **Multicast Address** | 224.0.0.0/4 (IPv4) or ff00::/8 (IPv6) — one-to-many |
| **Anycast Address** | One-to-nearest (multiple servers share same IP) |
| **Unicast Address** | One-to-one — unique destination for a single interface |
