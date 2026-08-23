# Dynamic Routing Protocols

> **Level:** CCNA → CCNP Enterprise  
> **Topic:** Routing  
> **Purpose:** Understand how dynamic routing protocols discover neighbors, exchange routing information, calculate best paths, install routes, converge after failures, and participate in packet forwarding.

---

# 1. What Is Dynamic Routing?

**Dynamic routing** is a method where routers automatically learn, maintain, and select routes to remote networks using routing protocols.

Instead of manually configuring every route, routers exchange routing information and dynamically adapt to topology changes.

```text
Dynamic Routing
      │
      ├── Discover Neighbors
      │
      ├── Exchange Routing Information
      │
      ├── Build Routing Database
      │
      ├── Calculate Best Path
      │
      ├── Install Route
      │
      └── React to Topology Changes
```

---

# 2. Static vs Dynamic Routing

|Feature|Static Routing|Dynamic Routing|
|---|---|---|
|Route configuration|Manual|Automatic|
|Route discovery|❌|✅|
|Adapts to failures|❌|✅|
|Configuration effort|High in large networks|Lower|
|CPU usage|Very low|Higher|
|Memory usage|Very low|Higher|
|Bandwidth usage|None for routing updates|Routing-protocol traffic|
|Scalability|Limited|High|
|Example|`ip route`|OSPF, EIGRP, BGP|

---

# 3. Routing Protocol Operation

A dynamic routing protocol generally performs the following operations:

```text
Neighbor Discovery
       ↓
Routing Information Exchange
       ↓
Build Routing Database
       ↓
Calculate Best Paths
       ↓
Install Best Routes
       ↓
Monitor Topology
       ↓
Detect Changes
       ↓
Exchange Updated Information
       ↓
Recalculate
       ↓
Convergence
```

The exact process differs between protocols.

### OSPF

```text
Neighbor Discovery
       ↓
LSDB Synchronization
       ↓
SPF Calculation
       ↓
Routing Table
```

### EIGRP

```text
Neighbor Discovery
       ↓
Topology Information
       ↓
DUAL Calculation
       ↓
Routing Table
```

### BGP

```text
Neighbor Relationship
       ↓
Exchange Routing Information
       ↓
Best-Path Selection
       ↓
Routing Table
```

---

# 4. Neighbor Discovery

Before routers can exchange routing information, they generally need to discover neighboring routers running the same routing protocol.

```text
        Hello
R1 ───────────────── R2
        Hello
```

A **neighbor** is a router that has established a routing-protocol relationship with another router.

Neighbor discovery is used to:

- Discover neighboring routers
    
- Verify that the neighbor is reachable
    
- Maintain the neighbor relationship
    
- Detect failed neighbors
    
- Establish protocol adjacencies where required
    

### Examples

**OSPF** uses Hello packets.

**EIGRP** uses Hello messages.

---

# 5. Routing Protocol Messages

Different routing protocols use different message types.

## Generic Functions

Routing protocols may exchange messages for:

- Neighbor discovery
    
- Route updates
    
- Acknowledgments
    
- Topology changes
    
- Session maintenance
    

## RIP

- Request
    
- Response
    

## EIGRP

- Hello
    
- Update
    
- Query
    
- Reply
    
- ACK
    

## OSPF

Important packet types:

|Type|Purpose|
|---|---|
|Hello|Discover/maintain neighbors|
|DBD|Describe LSDB contents|
|LSR|Request specific LSAs|
|LSU|Carry LSAs|
|LSAck|Acknowledge LSAs|

## BGP

|Message|Purpose|
|---|---|
|OPEN|Establish BGP session|
|UPDATE|Advertise/withdraw routes|
|KEEPALIVE|Maintain session|
|NOTIFICATION|Report errors/terminate session|

---

# 6. Routing Updates

**Routing updates** are information exchanged between routers so they can learn about available networks and paths.

Example:

```text
R1                  R2
│                   │
│ Network A         │
│──────────────────>│
│                   │
│                   │ Network B
│<──────────────────│
```

After exchanging information:

```text
R1 knows:
Network A
Network B

R2 knows:
Network A
Network B
```

Different protocols distribute information differently.

### RIP

Uses periodic routing updates.

### EIGRP

Uses incremental/partial updates when changes occur.

### OSPF

Floods link-state information.

### BGP

Uses UPDATE messages to advertise or withdraw routes.

---

# 7. Triggered Updates

A **triggered update** is routing information sent because a routing change occurred instead of waiting for the next scheduled update.

```text
Normal:

Update ───── Update ───── Update


Topology Failure:

Link Failure
     ↓
Triggered Update
     ↓
Other Routers
```

### Periodic vs Triggered

```text
Periodic Update
= sent according to a timer

Triggered Update
= sent because a routing change occurred
```

RIP is the classic example where triggered updates are important.

---

# 8. Routing Databases

Dynamic routing protocols maintain protocol-specific information used to calculate routes.

Different protocols use different databases.

## EIGRP

```text
Neighbor Table
      ↓
Topology Table
      ↓
Routing Table
```

Useful commands:

```cisco
show ip eigrp neighbors
show ip eigrp topology
show ip route eigrp
```

---

## OSPF

```text
Neighbor Information
       ↓
Link-State Database
       ↓
SPF Calculation
       ↓
Routing Table
```

Useful commands:

```cisco
show ip ospf neighbor
show ip ospf database
show ip route ospf
```

---

# 9. LSDB vs Routing Table

The **Link-State Database (LSDB)** and routing table are not the same thing.

### LSDB

Contains topology information.

```text
R1 ─── R2 ─── R3
 \             /
  ────────────
```

### Routing Table

Contains the best routes selected for forwarding.

```text
O 10.10.20.0/24 [110/20] via 10.10.12.2
```

Conceptually:

```text
LSDB
 ↓
SPF
 ↓
Best Paths
 ↓
Routing Table
```

---

# 10. Route Calculation

Routing protocols use algorithms and metrics to calculate preferred paths.

Examples:

|Protocol|Calculation|
|---|---|
|RIP|Distance-vector calculation|
|EIGRP|DUAL|
|OSPF|SPF/Dijkstra|
|IS-IS|SPF|
|BGP|Best-path selection|

---

# 11. Route Installation

After a routing protocol calculates the best path, the route can be installed into the **Routing Information Base (RIB)**.

```text
Routing Protocol
       ↓
Best Route
       ↓
RIB
       ↓
CEF
       ↓
FIB
       ↓
Packet Forwarding
```

Example:

```text
R1# show ip route

O 10.10.20.0/24 [110/20] via 10.10.12.2
```

Meaning:

```text
O
│
└── OSPF

110
│
└── Administrative Distance

20
│
└── Metric

10.10.12.2
│
└── Next Hop
```

---

# 12. Convergence

**Convergence** is the process through which routers detect a topology change, exchange updated information, recalculate routes, and reach a consistent routing state.

Example:

```text
Before:

R1 ───── R2 ───── R3
          │
          └──── R4
```

If the R2-R3 link fails:

```text
R1 ───── R2       R3
          │
          └──── R4
```

The routing protocol must:

1. Detect the failure
    
2. Update routing information
    
3. Recalculate paths
    
4. Install new routes
    
5. Inform other routers as required
    

```text
Failure
   ↓
Detection
   ↓
Update
   ↓
Recalculation
   ↓
New Route
   ↓
Convergence
```

### Fast convergence

Generally means the network reaches a stable routing state quickly after a topology change.

---

# 13. Control Plane vs Data Plane

This is an important networking distinction.

## Control Plane

Responsible for **learning and calculating routes**.

Examples:

- OSPF
    
- EIGRP
    
- BGP
    
- Static routing
    
- Routing table construction
    

```text
Routing Protocols
       ↓
Route Calculation
       ↓
Routing Table
```

## Data Plane

Responsible for **actually forwarding packets**.

```text
Packet
  ↓
FIB
  ↓
Forwarding Decision
  ↓
Outgoing Interface
```

### Simple Model

```text
CONTROL PLANE
Routing Protocol
      ↓
     RIB
      ↓
      FIB
      ↓
DATA PLANE
      ↓
Packet Forwarding
```

---

# 14. RIB vs FIB

## RIB

**RIB = Routing Information Base**

The RIB contains routes learned from:

- Connected routes
    
- Static routes
    
- Dynamic routing protocols
    
- Other routing sources
    

The RIB determines which routes are installed for use.

```text
OSPF ───┐
EIGRP ──┤
Static ─┤──→ RIB
BGP ────┤
```

## FIB

**FIB = Forwarding Information Base**

The FIB is optimized for packet forwarding.

Cisco IOS commonly uses **CEF** to build and use the FIB.

```text
RIB
 ↓
CEF
 ↓
FIB
 ↓
Forward Packet
```

---

# 15. Detailed Protocol Classification

Dynamic routing protocols can be classified into:

```text
Dynamic Routing Protocols
│
├── Distance Vector
│
├── Advanced Distance Vector
│
├── Link-State
│
└── Path Vector
```

---

# 16. Distance Vector

A **distance-vector** protocol learns routes based on:

- Distance
    
- Direction/vector
    

Conceptually, a router learns:

> Network X is a certain distance away through a particular neighbor.

Example:

```text
R1 ───── R2 ───── R3
               │
             Network X
```

R1 may learn:

```text
Network X
Distance = 2 hops
Next Hop = R2
```

---

# 17. RIP

**RIP = Routing Information Protocol**

RIP is a traditional distance-vector protocol.

### Metric

**Hop count**

Example:

```text
R1 → R2 → R3 → Network X

3 hops
```

RIP prefers the route with fewer hops.

### Maximum Hop Count

```text
1–15 = reachable
16   = unreachable
```

### Versions

**RIPv1**

- Classful
    
- Does not support VLSM
    

**RIPv2**

- Classless
    
- Supports VLSM
    
- Supports CIDR
    
- Uses multicast `224.0.0.9`
    

---

# 18. Advanced Distance Vector

**EIGRP** is commonly classified as an advanced distance-vector routing protocol.

EIGRP uses:

**DUAL — Diffusing Update Algorithm**

EIGRP maintains:

```text
Neighbor Table
Topology Table
Routing Table
```

---

## EIGRP Metric

By default, EIGRP primarily uses:

- Bandwidth
    
- Delay
    

Other possible components:

- Reliability
    
- Load
    

Reliability and load are not used by default.

---

## EIGRP Updates

EIGRP does not periodically send its entire routing table.

It generally sends partial/incremental updates when routing information changes.

---

# 19. Link-State Routing

A **link-state routing protocol** builds a representation of network topology.

Instead of simply learning:

> Network X is three hops away.

A link-state router learns information about links and topology.

```text
       R2
      /  \
     /    \
    R1────R3
     \    /
      \  /
       R4
```

Routers exchange link-state information and build an **LSDB**.

Each router then independently calculates the shortest paths.

---

# 20. OSPF

**OSPF = Open Shortest Path First**

OSPF is a:

- Link-state protocol
    
- IGP
    
- Classless protocol
    

OSPF uses:

**SPF — Shortest Path First**

The SPF algorithm is based on **Dijkstra's algorithm**.

Basic operation:

```text
Discover Neighbors
       ↓
Exchange Link-State Information
       ↓
Build LSDB
       ↓
Run SPF
       ↓
Calculate Best Paths
       ↓
Install Routes
```

### OSPF Metric

OSPF uses:

**Cost**

Lower cost is preferred.

---

# 21. OSPF Areas

OSPF supports hierarchical design using areas.

The backbone is:

**Area 0**

Example:

```text
             Area 1
        ┌─────────────┐
        │             │
       R1 ─────────── R2
        │             │
        └──────┬──────┘
               │
             Area 0
               │
        ┌──────┴──────┐
        │             │
       R3 ─────────── R4
        │             │
        └─────────────┘
             Area 2
```

Benefits include:

- Reduced LSDB size
    
- Reduced SPF workload
    
- Better scalability
    
- Route summarization opportunities
    

---

# 22. Path Vector

**BGP** is a path-vector routing protocol.

BGP uses path attributes and routing policies to select routes.

Example:

```text
AS 65001
   ↓
AS 65002
   ↓
AS 65003
   ↓
Network X
```

BGP can learn:

```text
Network X
AS_PATH = 65003 65002
```

---

# 23. BGP Loop Prevention

One important BGP loop-prevention mechanism is **AS_PATH**.

If a BGP router receives a route containing its own AS number, it can reject that route.

```text
AS 65001
   ↓
AS 65002
   ↓
AS 65001
```

AS 65001 detects its own AS in the path.

---

# 24. IGP vs EGP

## IGP

**Interior Gateway Protocol**

Used for routing within an autonomous system.

Examples:

- RIP
    
- EIGRP
    
- OSPF
    
- IS-IS
    

```text
             AS 65001
      ┌───────────────────┐
      │                   │
     R1 ───── R2 ───── R3
      │                   │
      └───────────────────┘
```

---

## EGP

**Exterior Gateway Protocol**

Used for routing between autonomous systems.

Modern networks primarily use:

**BGP**

```text
AS 65001                 AS 65002
┌─────────┐              ┌─────────┐
│         │              │         │
R1 ───── R2 ═══════════ R3 ───── R4
             BGP
```

---

# 25. Interior vs Exterior Routing

### Interior Routing

Routing inside an autonomous system.

```text
OSPF
EIGRP
IS-IS
RIP
```

### Exterior Routing

Routing between autonomous systems.

```text
BGP
```

### Mental Model

```text
Inside AS
   ↓
 IGP

Between ASes
   ↓
 BGP
```

---

# 26. Route Selection

A router may learn multiple routes to the same destination.

Route selection involves different concepts depending on whether we are talking about:

1. Selecting a route for installation into the RIB
    
2. Selecting a forwarding entry for an incoming packet
    

These should not be confused.

---

# 27. Administrative Distance

**Administrative Distance (AD)** determines which routing source is preferred when multiple sources provide routes to the same destination prefix.

**Lower AD is preferred.**

### Common Cisco AD Values

|Route Source|AD|
|---|--:|
|Connected|0|
|Static|1|
|EIGRP|90|
|OSPF|110|
|RIP|120|
|External EIGRP|170|
|Unknown/Untrusted|255|

Example:

```text
10.10.20.0/24

EIGRP → AD 90
OSPF  → AD 110
RIP   → AD 120
```

EIGRP is preferred:

```text
90 < 110 < 120
```

---

# 28. Metric

A **metric** is a value used by a routing protocol to select the preferred path among routes learned through that protocol.

|Protocol|Main Metric|
|---|---|
|RIP|Hop count|
|EIGRP|Bandwidth + Delay|
|OSPF|Cost|
|IS-IS|Cost|
|BGP|Path attributes|

Example:

```text
OSPF:

Path A → Cost 20
Path B → Cost 40
```

OSPF chooses Path A.

---

# 29. Administrative Distance vs Metric

This distinction is critical.

### Administrative Distance

Answers:

> Which routing source should I trust?

```text
EIGRP vs OSPF
```

### Metric

Answers:

> Which path should this routing protocol prefer?

```text
OSPF Path A → Cost 10
OSPF Path B → Cost 30
```

Therefore:

```text
Different Routing Sources
        ↓
Administrative Distance

Same Routing Protocol
        ↓
Protocol Metric
```

---

# 30. Longest Prefix Match

**Longest Prefix Match (LPM)** is used during packet forwarding to select the most specific matching destination route.

Suppose the routing table contains:

```text
10.0.0.0/8
10.10.0.0/16
10.10.20.0/24
10.10.20.128/25
```

Destination:

```text
10.10.20.150
```

All four prefixes can match.

The most specific route is:

```text
10.10.20.128/25
```

because:

```text
/25 > /24 > /16 > /8
```

### Key Rule

> **The longest matching prefix wins.**

---

# 31. Route Installation vs Longest Prefix Match

These concepts are different.

### Route Installation

Determines which route gets installed into the RIB when competing routing sources exist.

Conceptually:

```text
Routes to same prefix
       ↓
Administrative Distance
       ↓
Protocol Metric
       ↓
Best Route
       ↓
RIB
```

### Packet Forwarding

When a packet arrives:

```text
Destination IP
      ↓
Longest Prefix Match
      ↓
Forwarding Entry
      ↓
Next Hop / Interface
      ↓
FIB
```

This distinction is extremely important.

---

# 32. Equal-Cost Paths

If multiple paths to the same destination have the same preferred metric, the router may install multiple paths.

This is called:

**ECMP — Equal-Cost Multipath**

Example:

```text
          R2
         /  \
        /    \
R1 ----        ---- R4
        \    /
         \  /
          R3
```

Suppose:

```text
Path 1 = Metric 20
Path 2 = Metric 20
```

Both may be installed.

Benefits:

- Load sharing
    
- Redundancy
    
- Better link utilization
    

The number of supported equal-cost paths depends on the protocol and platform.

---

# 33. Unequal-Cost Load Balancing

Some routing protocols can support unequal-cost load balancing.

EIGRP supports this using:

**variance**

Example:

```text
Path A = Metric 100
Path B = Metric 150
```

With appropriate EIGRP configuration, Path B can potentially be used for load balancing.

```cisco
router eigrp 100
 variance 2
```

> EIGRP's unequal-cost load balancing is an important distinction from normal ECMP.

---

# 34. Floating Static Routes

A **floating static route** is a backup static route configured with an Administrative Distance higher than the primary route.

Example:

```text
Primary Path:

R1 ───────── R2
      OSPF


Backup Path:

R1 ───────── R3
      Static
```

OSPF:

```text
AD = 110
```

Backup static:

```text
AD = 200
```

Configuration:

```cisco
ip route 10.10.20.0 255.255.255.0 192.168.13.2 200
```

Result:

```text
OSPF
AD 110
   ↓
Primary

Static
AD 200
   ↓
Backup
```

When the OSPF route disappears, the floating static route can become active.

---

# 35. Recursive Route Lookup

A **recursive route lookup** occurs when the router knows the next-hop IP address but must perform another lookup to determine how to reach that next hop.

Example:

```cisco
ip route 10.10.20.0 255.255.255.0 192.168.12.2
```

The router knows:

```text
Destination:
10.10.20.0/24

Next Hop:
192.168.12.2
```

It must then determine:

> How do I reach 192.168.12.2?

Suppose:

```text
192.168.12.0/24
→ GigabitEthernet0/0
```

Then:

```text
10.10.20.0/24
       ↓
Next Hop: 192.168.12.2
       ↓
Lookup 192.168.12.2
       ↓
192.168.12.0/24
       ↓
Gi0/0
```

---

# 36. Fully Specified Static Route

### Recursive Static Route

```cisco
ip route 10.10.20.0 255.255.255.0 192.168.12.2
```

The router needs to resolve the next hop.

### Fully Specified Static Route

```cisco
ip route 10.10.20.0 255.255.255.0 GigabitEthernet0/0 192.168.12.2
```

Contains:

```text
Outgoing Interface
+
Next Hop
```

This explicitly identifies both the outgoing interface and next-hop address.

---

# 37. Route Types

Cisco routers can learn routes from several sources.

## Connected Route

Created when an interface is configured with an IP address and is operational.

```text
C 10.10.10.0/24 is directly connected, Gi0/0
```

---

## Local Route

Represents the router's own interface address.

```text
L 10.10.10.1/32 is directly connected, Gi0/0
```

---

## Static Route

Manually configured.

```cisco
ip route 10.10.20.0 255.255.255.0 192.168.12.2
```

---

## Dynamic Route

Learned through a routing protocol.

```text
O 10.10.20.0/24 ...
D 10.10.30.0/24 ...
```

---

## Default Route

Used when no more specific route exists.

```text
0.0.0.0/0
```

---

## Summary Route

Represents multiple more-specific networks with a single prefix.

Example:

```text
10.10.0.0/24
10.10.1.0/24
10.10.2.0/24
10.10.3.0/24
```

Can potentially be summarized as:

```text
10.10.0.0/22
```

---

# 38. Default Routing

A default route is:

```text
0.0.0.0/0
```

It matches any IPv4 destination that does not have a more-specific route.

Example:

```text
             Internet
                |
               R2
                |
               R1
              /  \
            LAN1 LAN2
```

R1 can use:

```cisco
ip route 0.0.0.0 0.0.0.0 192.168.1.2
```

Meaning:

> Send unknown destinations toward R2.

---

# 39. Route Summarization

**Route summarization** combines multiple routes into a smaller number of prefixes.

Example:

```text
10.10.0.0/24
10.10.1.0/24
10.10.2.0/24
10.10.3.0/24
```

Can be represented as:

```text
10.10.0.0/22
```

### Benefits

- Smaller routing tables
    
- Less routing information
    
- Reduced CPU/memory requirements
    
- Reduced routing updates
    
- Improved scalability
    
- Can help contain topology changes
    

---

# 40. Routing Loops

A routing loop occurs when packets or routing information circulate incorrectly between routers.

Example:

```text
R1 → R2 → R3
↑           ↓
└───────────┘
```

Routing protocols use different mechanisms to prevent loops.

### RIP

- Split horizon
    
- Route poisoning
    
- Poison reverse
    
- Hold-down mechanisms
    
- Maximum hop count
    

### EIGRP

- DUAL
    
- Feasibility condition
    
- Feasible successor
    

### OSPF

- Link-state database
    
- SPF calculation
    
- Area hierarchy
    

### BGP

- AS_PATH
    

---

# 41. Split Horizon

**Split horizon** prevents a router from advertising a route back through the interface from which that route was learned.

Example:

```text
R1 ←──── Route ──── R2
```

R2 does not advertise the same route back to R1 through the same interface.

This is primarily associated with distance-vector routing.

---

# 42. Route Poisoning

Route poisoning advertises a failed route with an unreachable metric.

Example in RIP:

```text
Normal:
Network X = 3 hops

Failure:
Network X = 16 hops
```

RIP treats:

```text
16 = unreachable
```

This helps prevent routers from continuing to use a failed route.

---

# 43. Passive Interfaces

A **passive interface** prevents a routing protocol from forming neighbor relationships or sending routing-protocol messages on that interface while still allowing the connected network to be advertised, depending on the protocol.

Example:

```text
        R1
       /  \
      /    \
   LAN     R2
```

The LAN-facing interface does not need to form routing adjacencies.

Conceptually:

```text
LAN Interface
     ↓
Passive
     ↓
No Neighbor Adjacency
     ↓
Network Can Still Be Advertised
```

Example:

```cisco
router ospf 1
 passive-interface GigabitEthernet0/1
```

---

# 44. Routing Protocol Timers

Routing protocols use timers to control neighbor relationships and information exchange.

Common timer concepts:

- Hello interval
    
- Dead/hold timer
    
- Update timer
    
- Retransmission timer
    

### Hello

Used to discover and maintain neighbors.

### Hold/Dead

Determines how long a router waits before considering a neighbor unreachable.

### Update

Controls periodic routing information exchange where applicable.

### Retransmission

Controls when information should be retransmitted if required.

> Timer behavior is protocol-specific. Do not assume every routing protocol uses the same timers.

---

# 45. Routing Protocol Authentication

Routing protocol authentication helps prevent unauthorized devices from participating in routing relationships or injecting false routing information.

Authentication can be used with protocols such as:

- OSPF
    
- EIGRP
    
- BGP
    

Conceptually:

```text
R1                         R2
│                          │
│──── Authentication ─────>│
│<──── Authentication ─────│
│                          │
│     Routing Exchange     │
```

The exact authentication mechanism depends on the protocol and platform.

---

# 46. Route Redistribution

**Route redistribution** allows routes learned from one routing source to be injected into another routing protocol.

Example:

```text
        OSPF
         │
         │ Redistribution
         ↓
       EIGRP
```

Example environment:

```text
OSPF Domain
     │
     │
  Redistributor
     │
     │
EIGRP Domain
```

Redistribution is required when different routing domains must exchange routes.

### Important concerns

- Metric translation
    
- Administrative distance
    
- Routing loops
    
- Route filtering
    
- Route tagging
    
- Redistribution points
    

---

# 47. Route Filtering

Route filtering controls which routes are accepted, advertised, or redistributed.

Common Cisco mechanisms include:

- Prefix lists
    
- Route maps
    
- Distribute lists
    
- Policy-based filtering
    

Conceptually:

```text
Routes
  ↓
Route Filter
  ↓
Allowed Routes
  ↓
Routing Protocol
```

Filtering can be applied:

- Inbound
    
- Outbound
    
- During redistribution
    

---

# 48. Routing Protocol Scalability

As networks become larger, routing protocols need mechanisms to control the amount of routing information.

Important scalability techniques include:

- Hierarchical design
    
- OSPF areas
    
- Route summarization
    
- Route filtering
    
- Route redistribution
    
- Controlled routing updates
    

Example:

```text
Large Network
     ↓
Hierarchical Design
     ↓
Smaller Routing Domains
     ↓
Less Routing Information
     ↓
Better Scalability
```

---

# 49. Route Selection — Complete Mental Model

There are two important stages.

## Stage 1 — Route Installation

When multiple routing sources provide routes:

```text
Routes
  ↓
Compare Prefix
  ↓
Administrative Distance
  ↓
Protocol Metric
  ↓
Best Route
  ↓
RIB
```

## Stage 2 — Packet Forwarding

When a packet arrives:

```text
Destination IP
      ↓
Longest Prefix Match
      ↓
FIB Lookup
      ↓
Next-Hop Resolution
      ↓
Outgoing Interface
      ↓
Forward Packet
```

### Remember

> **Administrative Distance selects between routing sources.**

> **Metric selects between paths within a routing protocol.**

> **Longest Prefix Match selects the most specific route during forwarding.**

---

# 50. Complete Routing Architecture

```text
                    CONTROL PLANE
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
     OSPF              EIGRP              BGP
       │                 │                 │
       └─────────────────┼─────────────────┘
                         ↓
                        RIB
             Routing Information Base
                         │
                         ↓
                       CEF
                         │
                         ↓
                        FIB
                         │
                         ↓
                    DATA PLANE
                         │
                         ↓
                  Packet Forwarding
```

---

# 51. Dynamic Routing Protocol Comparison

|Protocol|Classification|Algorithm/Concept|Metric|Typical Use|
|---|---|---|---|---|
|RIP|Distance Vector|Bellman-Ford based|Hop Count|Legacy/small networks|
|EIGRP|Advanced Distance Vector|DUAL|Bandwidth + Delay|Enterprise|
|OSPF|Link-State|SPF/Dijkstra|Cost|Enterprise|
|IS-IS|Link-State|SPF|Cost|Service Providers|
|BGP|Path Vector|Best-Path Selection|Path Attributes|Internet/Inter-AS|

---

# 52. Important Cisco Verification Commands

## Routing Table

```cisco
show ip route
```

## Specific Route

```cisco
show ip route 10.10.20.0
```

## Routing Protocols

```cisco
show ip protocols
```

## CEF

```cisco
show ip cef
```

## OSPF Neighbors

```cisco
show ip ospf neighbor
```

## OSPF Database

```cisco
show ip ospf database
```

## OSPF Routes

```cisco
show ip route ospf
```

## EIGRP Neighbors

```cisco
show ip eigrp neighbors
```

## EIGRP Topology

```cisco
show ip eigrp topology
```

## EIGRP Routes

```cisco
show ip route eigrp
```

---

# 53. Key Terms

|Term|Meaning|
|---|---|
|Dynamic Routing|Automatic route learning|
|Routing Protocol|Protocol used to exchange routing information|
|Neighbor|Router participating in a routing relationship|
|Routing Update|Routing information exchanged between routers|
|Routing Database|Protocol-specific routing information|
|LSDB|OSPF link-state database|
|RIB|Routing Information Base|
|FIB|Forwarding Information Base|
|CEF|Cisco Express Forwarding|
|Metric|Value used to select a path|
|Administrative Distance|Trustworthiness of a routing source|
|Convergence|Network reaching a consistent routing state|
|IGP|Routing within an AS|
|EGP|Routing between ASes|
|Distance Vector|Routing based on distance and direction|
|Link-State|Routing based on topology information|
|Path Vector|Routing based on path attributes|
|ECMP|Equal-Cost Multipath|
|LPM|Longest Prefix Match|
|Redistribution|Injecting routes between routing domains|
|Summarization|Combining multiple routes into one prefix|
|Passive Interface|Prevents neighbor formation on an interface|
|Floating Static Route|Backup static route with higher AD|
|Recursive Lookup|Resolving a next-hop address through another route|

---

# 54. Important Exam Points

> [!important]  
> **Memorize these distinctions**

1. **Dynamic routing** automatically learns and maintains routes.
    
2. **Neighbor discovery** establishes routing relationships.
    
3. Routing protocols exchange information using protocol-specific messages.
    
4. Routing protocols maintain their own databases.
    
5. The **RIB** contains selected routing information.
    
6. The **FIB** is optimized for packet forwarding.
    
7. **CEF** is Cisco's forwarding architecture.
    
8. **Convergence** occurs after topology changes.
    
9. **Triggered updates** occur because of routing changes.
    
10. RIP is a **distance-vector** protocol.
    
11. EIGRP is an **advanced distance-vector** protocol.
    
12. OSPF and IS-IS are **link-state** protocols.
    
13. BGP is a **path-vector** protocol.
    
14. IGPs operate within an autonomous system.
    
15. BGP is primarily used between autonomous systems.
    
16. RIP uses **hop count**.
    
17. EIGRP uses **bandwidth and delay by default**.
    
18. OSPF uses **cost**.
    
19. BGP uses **path attributes**.
    
20. **Lower AD is preferred.**
    
21. **Lower metric is generally preferred within the same routing protocol.**
    
22. **Longest Prefix Match chooses the most specific route during forwarding.**
    
23. ECMP allows multiple equal-cost paths.
    
24. EIGRP can support unequal-cost load balancing using `variance`.
    
25. A floating static route uses a higher AD than the primary route.
    
26. Recursive lookup resolves a next-hop address.
    
27. A default route is `0.0.0.0/0`.
    
28. Route summarization reduces routing information.
    
29. Redistribution connects different routing domains.
    
30. Route filtering controls which routes are accepted or advertised.
    
31. Passive interfaces prevent unwanted neighbor relationships.
    
32. Routing-protocol authentication helps prevent unauthorized routing participation.
    
33. Split horizon helps prevent distance-vector routing loops.
    
34. Route poisoning advertises an unreachable route.
    
35. BGP uses AS_PATH for loop prevention.
    

---

# 55. Route Selection Cheat Sheet

```text
                ROUTE INSTALLATION
                        │
                        ▼
             Multiple Routing Sources?
                        │
                        ▼
              Administrative Distance
                        │
                        ▼
             Same Routing Protocol?
                        │
                        ▼
                     Metric
                        │
                        ▼
                  Best Route
                        │
                        ▼
                       RIB
```

Then for an incoming packet:

```text
                 PACKET ARRIVES
                       │
                       ▼
                Destination IP
                       │
                       ▼
             Longest Prefix Match
                       │
                       ▼
                      FIB
                       │
                       ▼
             Next-Hop Resolution
                       │
                       ▼
               Outgoing Interface
                       │
                       ▼
                 Forward Packet
```

---

# 56. Learning Order

For CCNA → CCNP routing studies:

```text
1. Routing Fundamentals
        ↓
2. Connected & Local Routes
        ↓
3. Static Routing
        ↓
4. Default Routing
        ↓
5. Dynamic Routing Concepts
        ↓
6. Route Selection
        ↓
7. RIP Concepts
        ↓
8. EIGRP
        ↓
9. OSPF
        ↓
10. Route Summarization
        ↓
11. Route Filtering
        ↓
12. Route Redistribution
        ↓
13. Policy-Based Routing
        ↓
14. BGP Fundamentals
        ↓
15. Routing Troubleshooting
```

### Priority

```text
★★★★★ Route Selection
★★★★★ OSPF
★★★★★ EIGRP
★★★★★ Routing Troubleshooting
★★★★☆ Static/Floating Static Routing
★★★★☆ Summarization
★★★★☆ Redistribution
★★★☆☆ BGP Fundamentals
★★☆☆☆ RIP
```

---

# 57. One-Page Mental Model

```text
                         ROUTING
                            │
             ┌──────────────┴──────────────┐
             │                             │
        CONTROL PLANE                 DATA PLANE
             │                             │
    Routing Protocols                     CEF
             │                             │
     ┌───────┼────────┐                    ↓
     │       │        │                   FIB
   OSPF   EIGRP      BGP                  │
     │       │        │                    ↓
     └───────┼────────┘              Packet Forwarding
             ↓
            RIB
             │
      Route Selection
             │
      ┌──────┴──────┐
      │             │
 Different       Same
 Sources        Protocol
      │             │
      ↓             ↓
     AD           Metric
      │             │
      └──────┬──────┘
             ↓
       Best Route
             │
             ↓
           RIB/FIB
             │
             ↓
    Longest Prefix Match
             │
             ↓
       Next-Hop Lookup
             │
             ↓
       Packet Forwarding
             │
             ↓
      Topology Changes?
          │       │
         No      Yes
          │       │
          │       ↓
          │   Recalculate
          │       │
          │       ↓
          └── Convergence
```

> [!tip]  
> **Core mental model:**  
> **Routing protocols learn routes → routing protocols calculate the best routes → the RIB stores selected routes → CEF builds the FIB → Longest Prefix Match is used during forwarding → the router forwards the packet → topology changes trigger recalculation and convergence.**