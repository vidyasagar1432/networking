# TCP Concepts

| Term | Definition |
|---|---|
| **Three-Way Handshake** | SYN → SYN-ACK → ACK — establishes a TCP connection |
| **SYN** | Synchronize flag — initiates a TCP connection |
| **ACK** | Acknowledgment flag — confirms receipt of data |
| **FIN** | Finish flag — gracefully closes a TCP connection |
| **RST** | Reset flag — forcefully terminates a connection |
| **Sequence Number** | Byte offset of data in a TCP stream |
| **Acknowledgment Number** | Next expected byte (cumulative ACK) |
| **Window Size** | Buffer space available for incoming data (flow control) |
| **Sliding Window** | Dynamic window adjustment as data is acknowledged |
| **MSS** | Maximum Segment Size — largest TCP payload (MTU - IP/TCP headers) |
| **Flow Control** | Prevents sender from overwhelming receiver (window size) |
| **Congestion Control** | Prevents sender from overwhelming the network (cwnd, slow start, AIMD) |
