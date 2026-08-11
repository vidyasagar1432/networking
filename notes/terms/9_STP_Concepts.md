# STP Concepts

| Term | Definition |
|---|---|
| **Root Bridge** | Root of the spanning tree — elected by lowest bridge ID |
| **Root Port** | Port with the best path to the root bridge (one per non-root switch) |
| **Designated Port** | Port with the best path on a segment (one per link, forwarding) |
| **Alternate Port** | Backup to root port (discarding, rapid failover) |
| **Blocking** | State where port discards traffic, listens for BPDUs |
| **Listening** | Transitional state — port listens for BPDUs, no traffic forwarding |
| **Learning** | Transitional state — learns MAC addresses, no traffic forwarding |
| **Forwarding** | Normal operation — forwards traffic and learns MAC addresses |
| **BPDU** | Bridge Protocol Data Unit — STP messages exchanged between switches |
| **Root Guard** | Prevents a port from becoming root port (ignores superior BPDUs) |
| **BPDU Guard** | Shuts down PortFast-enabled port if BPDU is received |
| **Loop Guard** | Prevents alternate/root port from transitioning to designated if BPDUs stop |
| **PortFast** | Bypasses listening/learning states — immediate forwarding on access ports |
