# Routing

| Term | Definition |
|---|---|
| **Static Route** | Manually configured route (no discovery, no overhead) |
| **Dynamic Route** | Route learned automatically by a routing protocol (OSPF, BGP, EIGRP) |
| **Administrative Distance** | Trustworthiness of a routing source (lower = more trusted) |
| **Metric** | Value used by routing protocol to determine best path (cost, hop count) |
| **Cost** | OSPF metric — sum of interface costs along the path |
| **Hop Count** | RIP metric — number of routers between source and destination |
| **Feasible Successor** | Backup route in EIGRP that meets feasibility condition (loop-free) |
| **Successor** | Primary route in EIGRP (next-hop with lowest feasible distance) |
| **Neighbor** | Directly connected router running the same routing protocol |
| **Adjacency** | Established neighbor relationship with synchronized databases |
| **Route Redistribution** | Importing routes from one routing protocol into another |
| **Summarization** | Aggregating multiple routes into a single prefix (reduces table size) |
| **ECMP** | Equal Cost Multi-Path — load balancing across multiple equal-cost routes |
| **Default Gateway** | Router IP that forwards traffic for unknown destinations (0.0.0.0/0) |
