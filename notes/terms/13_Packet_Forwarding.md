# Packet Forwarding

| Term | Definition |
|---|---|
| **Packet** | Layer 3 PDU — IP header + payload |
| **Segment** | Layer 4 PDU (TCP or UDP) |
| **Datagram** | Connectionless L4 PDU (UDP) or self-contained L3 unit (IP) |
| **Frame** | Layer 2 PDU — MAC header + payload + FCS |
| **Bit** | Single binary digit (0 or 1) — the smallest unit of data |
| **Encapsulation** | Wrapping data with protocol headers at each OSI layer |
| **Decapsulation** | Removing protocol headers as data moves up the OSI stack |
| **Fragmentation** | Splitting a packet into smaller pieces to fit the MTU |
| **Reassembly** | Reconstructing fragmented packets at the destination |
| **TTL** | Time To Live — max hops a packet can traverse (decremented each hop) |
| **Hop Limit** | IPv6 equivalent of TTL |
