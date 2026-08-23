# Dynamic Routing

> **Topic:** Routing Fundamentals  
> **Level:** CCNA → CCNP Enterprise  
> **Goal:** Understand what dynamic routing is, how routing protocols work, and how Distance Vector, Advanced Distance Vector, Link-State, and Path Vector protocols differ.

---

# 1. What Is Dynamic Routing?

**Dynamic routing** is a method where routers automatically learn routes to remote networks using **routing protocols**.

Instead of manually configuring every route, routers communicate with each other and automatically:

- Discover neighboring routers
    
- Exchange routing information
    
- Learn remote networks
    
- Calculate the best path
    
- Install routes into the routing table
    
- Detect network failures
    
- Recalculate routes when the topology changes
    

### Simple Example

Without dynamic routing:

```text
R1 ───── R2 ───── R3

Administrator manually configures routes
on R1, R2, and R3.
```

With dynamic routing:

```text
R1 ───── R2 ───── R3
       ↕       ↕
   Routing Information
```

The routers automatically learn about the networks behind each other.

---

# 2. Why Do We Need Dynamic Routing?

Imagine a large network:

```text
        R2 ───── R3
       /          \
      /            \
    R1              R4
      \            /
       \          /
        R5 ───── R6
```

With static routing, the administrator must manually configure routes.

If a link fails:

```text
R2 ───── X ───── R3
```

the administrator may need to manually change routes.

With dynamic routing:

```text
Link Failure
     ↓
Routers Detect Change
     ↓
Routing Information Updated
     ↓
Best Path Recalculated
     ↓
Traffic Uses New Path
```

This makes dynamic routing more suitable for medium and large networks.

---

# 3. How Dynamic Routing Works

A simplified dynamic-routing process is:

```text
        Neighbor Discovery
                ↓
      Exchange Information
                ↓
       Build Routing Database
                ↓
        Calculate Best Path
                ↓
          Install Route
                ↓
       Forward Traffic
                ↓
       Monitor Topology
                ↓
        Topology Changes?
             /       \
           No         Yes
           │           │
           │           ↓
           │      Update Information
           │           ↓
           │      Recalculate Paths
           │           ↓
           └──── Convergence
```

Different routing protocols perform these steps differently.

---

# 4. What Is a Routing Protocol?

A **routing protocol** is a set of rules that routers use to exchange routing information and determine how traffic should reach remote networks.

Examples:

|Protocol|Type|Common Use|
|---|---|---|
|RIP|Distance Vector|Legacy/small networks|
|EIGRP|Advanced Distance Vector|Enterprise|
|OSPF|Link-State|Enterprise|
|IS-IS|Link-State|Service providers|
|BGP|Path Vector|Internet/Inter-AS|

---

# 5. Types of Dynamic Routing Protocols

Dynamic routing protocols can be classified based on **how they learn and represent routing information**.

```text
Dynamic Routing Protocols
│
├── Distance Vector
│     └── RIP
│
├── Advanced Distance Vector
│     └── EIGRP
│
├── Link-State
│     ├── OSPF
│     └── IS-IS
│
└── Path Vector
      └── BGP
```

The most important concepts are:

```text
Distance Vector
      ↓
"Learn from my neighbors"

Link-State
      ↓
"Build a map of the network"

Path Vector
      ↓
"Learn the path through autonomous systems"
```

---

# 6. Distance Vector

## Definition

A **Distance Vector** routing protocol learns routes based on:

- **Distance** — how far the destination is
    
- **Vector** — the direction/next hop toward the destination
    

A router primarily learns routing information from its neighbors.

### Simple Example

```text
R1 -------- R2 -------- R3
             |
          Network X
```

R1 doesn't necessarily know the complete topology.

R1 can learn from R2:

```text
Network X
Distance = 2 hops
Next Hop = R2
```

R1 essentially asks:

> "How far is Network X, and which direction should I go?"

---

# 7. Distance Vector Mental Model

Think of asking directions from a neighbor.

```text
You → Neighbor
       |
       └── "How do I reach the airport?"

Neighbor:
"Go through me.
The airport is 3 roads away."
```

You don't have a complete map of the city.

You only know:

```text
Destination
    ↓
Distance
    ↓
Direction
```

That's the basic idea behind Distance Vector routing.

---

# 8. RIP — Distance Vector Example

**RIP** is a classic Distance Vector protocol.

RIP uses:

**Hop Count**

Example:

```text
R1 → R2 → R3 → R4
```

To reach R4:

```text
3 hops
```

If another path is:

```text
R1 → R5 → R4
```

then:

```text
2 hops
```

RIP prefers the 2-hop path.

### RIP Metric

```text
Fewer hops = Better path
```

### RIP Maximum

```text
1–15 hops = Reachable
16 hops    = Unreachable
```

---

# 9. Characteristics of Distance Vector

Traditional Distance Vector protocols generally:

- Learn routes from neighbors
    
- Advertise routes to neighbors
    
- Use a distance metric
    
- Use a direction/next hop
    
- Have mechanisms to prevent routing loops
    
- May use periodic updates
    

Examples:

```text
RIP
```

---

# 10. Advanced Distance Vector

**Advanced Distance Vector** protocols retain the basic distance-vector concept but use more sophisticated mechanisms for route calculation and information exchange.

The main Cisco example is:

**EIGRP**

EIGRP uses:

**DUAL — Diffusing Update Algorithm**

---

# 11. EIGRP

EIGRP maintains more information than traditional RIP.

```text
EIGRP
 │
 ├── Neighbor Table
 │
 ├── Topology Table
 │
 └── Routing Table
```

### Neighbor Table

Contains information about EIGRP neighbors.

```text
R1
│
├── R2
├── R3
└── R4
```

### Topology Table

Contains routes learned through EIGRP and information used by DUAL.

### Routing Table

Contains the best routes selected for forwarding.

---

# 12. EIGRP Mental Model

Traditional Distance Vector:

```text
Neighbor
   ↓
"Network X is 3 hops away."
```

EIGRP:

```text
Neighbors
    ↓
More detailed topology information
    ↓
DUAL
    ↓
Best Path
```

EIGRP can therefore make more sophisticated routing decisions than traditional RIP.

---

# 13. Link-State Routing

## Definition

A **Link-State** routing protocol learns information about the links and topology of the network.

Instead of simply asking:

> "How far away is Network X?"

the router builds a representation of the network.

### Example

```text
        R2
       /  \
      /    \
     R1────R3
      \    /
       \  /
        R4
```

Each router can learn information about:

```text
R1 connected to R2
R1 connected to R3
R1 connected to R4
R2 connected to R3
...
```

This information is stored in a:

**Link-State Database (LSDB)**

---

# 14. Link-State Mental Model

Think of a city map.

```text
Distance Vector:

"Ask your neighbor for directions."

Link-State:

"Build a map of the entire city
and calculate the best route yourself."
```

This is the key conceptual difference.

---

# 15. How Link-State Routing Works

```text
Discover Neighbors
       ↓
Learn Link Information
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

---

# 16. OSPF — Link-State Example

**OSPF = Open Shortest Path First**

OSPF is:

- Link-State
    
- IGP
    
- Classless
    
- Commonly used in enterprise networks
    

OSPF uses:

**SPF — Shortest Path First**

The SPF algorithm is based on **Dijkstra's algorithm**.

---

# 17. OSPF Mental Model

```text
Network Topology
       ↓
Link-State Information
       ↓
LSDB
       ↓
SPF / Dijkstra
       ↓
Shortest/Best Paths
       ↓
Routing Table
```

The router independently calculates its best paths from the topology information it has.

---

# 18. Distance Vector vs Link-State

|Feature|Distance Vector|Link-State|
|---|---|---|
|Basic idea|Learn from neighbors|Build topology view|
|Knowledge|Distance + direction|Network topology|
|Information source|Neighbors|Link-state information|
|Network map|Limited|More complete|
|Example|RIP|OSPF|
|Algorithm|Distance-vector calculation|SPF|
|Database|Routing information|LSDB|
|Scalability|Lower|Higher|
|Convergence|Generally slower|Generally faster|

### Simple Difference

```text
Distance Vector:

"R2 says Network X is 3 hops away."

Link-State:

"I know the topology.
I'll calculate the best path to Network X."
```

---

# 19. Path Vector

**Path Vector** is another routing-protocol category.

The main example is:

**BGP — Border Gateway Protocol**

BGP is designed primarily for routing **between Autonomous Systems (ASes)**.

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

AS_PATH:
65003 65002
```

The path through autonomous systems is important.

---

# 20. Path Vector Mental Model

Think about traveling between countries.

```text
Country A
    ↓
Country B
    ↓
Country C
    ↓
Destination
```

You care about:

- Which countries you pass through
    
- Policies
    
- Path attributes
    
- Route preferences
    

BGP uses this type of path information.

---

# 21. Distance Vector vs Link-State vs Path Vector

```text
Distance Vector
       ↓
"How far and which direction?"

Link-State
       ↓
"What does the network topology look like?"

Path Vector
       ↓
"Which path through autonomous systems
does this route take?"
```

---

# 22. IGP vs EGP

Routing protocols can also be classified based on where they operate.

## IGP

**Interior Gateway Protocol**

Used **inside an Autonomous System**.

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

              IGP
```

---

# 23. EGP

**Exterior Gateway Protocol**

Used for routing **between Autonomous Systems**.

The modern Internet uses:

**BGP**

```text
AS 65001                 AS 65002
┌─────────┐              ┌─────────┐
│         │              │         │
R1 ───── R2 ═══════════ R3 ───── R4
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

# 24. Dynamic Routing Protocol Comparison

|Protocol|Classification|Main Concept|Metric/Selection|
|---|---|---|---|
|RIP|Distance Vector|Distance + direction|Hop Count|
|EIGRP|Advanced Distance Vector|DUAL + topology information|Bandwidth + Delay|
|OSPF|Link-State|LSDB + SPF|Cost|
|IS-IS|Link-State|LSDB + SPF|Cost|
|BGP|Path Vector|AS path + attributes|Path Attributes|

---

# 25. Routing Protocol Operation

Regardless of the protocol, dynamic routing generally involves several stages.

```text
1. Neighbor Discovery
        ↓
2. Establish Relationship
        ↓
3. Exchange Routing Information
        ↓
4. Build Routing Database
        ↓
5. Calculate Best Paths
        ↓
6. Install Routes
        ↓
7. Monitor Network
        ↓
8. Detect Changes
        ↓
9. Recalculate
        ↓
10. Convergence
```

---

# 26. Neighbor Discovery

Routers need to discover other routers running the same routing protocol.

Example:

```text
R1                    R2
│                     │
│──── Hello ─────────>│
│<──── Hello ─────────│
│                     │
│   Neighbor Formed   │
│<───────────────────>│
```

Examples:

- OSPF → Hello packets
    
- EIGRP → Hello messages
    
- BGP → TCP session + OPEN messages
    

---

# 27. Routing Updates

Routers exchange information about networks and paths.

```text
R1                    R2
│                     │
│── Network A ──────>│
│                     │
│<──── Network B ─────│
```

Different protocols exchange information differently.

|Protocol|General Behavior|
|---|---|
|RIP|Periodic updates|
|EIGRP|Incremental updates|
|OSPF|Link-state flooding|
|BGP|UPDATE messages|

---

# 28. Routing Databases

Different protocols maintain different databases.

### EIGRP

```text
Neighbor Table
      ↓
Topology Table
      ↓
Routing Table
```

### OSPF

```text
Neighbor Information
      ↓
LSDB
      ↓
SPF
      ↓
Routing Table
```

The protocol database is not necessarily the same thing as the routing table.

---

# 29. Route Installation

After calculating the best route, the routing protocol attempts to install it into the RIB.

```text
Routing Protocol
       ↓
Best Route
       ↓
RIB
       ↓
CEF/FIB
       ↓
Packet Forwarding
```

Example:

```text
O 10.10.20.0/24 [110/20] via 10.10.12.2
```

Where:

```text
O       = OSPF
110     = Administrative Distance
20      = Metric
10.10.12.2 = Next Hop
```

---

# 30. Convergence

**Convergence** is the process by which routers reach a consistent routing state after a topology change.

Example:

```text
Before:

R1 ───── R2 ───── R3
```

Link failure:

```text
R1 ───── R2    X    R3
```

The routers:

```text
Detect Failure
      ↓
Exchange Information
      ↓
Recalculate
      ↓
Install New Route
      ↓
Converge
```

### Fast convergence

Means the network adapts quickly to changes.

---

# 31. Triggered Updates

A **triggered update** is sent because a routing change occurred.

```text
Normal:

Update ─── Update ─── Update


Failure:

Link Failure
     ↓
Triggered Update
     ↓
Neighbors
```

This is especially important in distance-vector protocols such as RIP.

---

# 32. Route Selection

A router can learn the same destination from multiple routing sources.

Example:

```text
10.10.20.0/24

EIGRP → AD 90
OSPF  → AD 110
RIP   → AD 120
```

The router prefers the routing source with the lowest AD.

```text
90 < 110 < 120

EIGRP wins
```

---

# 33. Administrative Distance

**Administrative Distance (AD)** measures the trustworthiness of a route source.

**Lower AD is preferred.**

|Route Source|AD|
|---|--:|
|Connected|0|
|Static|1|
|EIGRP|90|
|OSPF|110|
|RIP|120|
|External EIGRP|170|

### Important

AD compares **different routing sources**.

```text
EIGRP vs OSPF
     ↓
AD
```

---

# 34. Metric

A **metric** determines which path a routing protocol prefers.

|Protocol|Metric|
|---|---|
|RIP|Hop Count|
|EIGRP|Bandwidth + Delay|
|OSPF|Cost|
|IS-IS|Cost|
|BGP|Path Attributes|

Example:

```text
OSPF:

Path A = Cost 10
Path B = Cost 30

Path A wins
```

### Important

Metric is normally compared **within the same routing protocol**.

```text
OSPF Path A vs OSPF Path B
          ↓
        Metric
```

---

# 35. Longest Prefix Match

**Longest Prefix Match** is used when forwarding a packet.

The most specific route wins.

Example:

```text
10.0.0.0/8
10.10.0.0/16
10.10.20.0/24
```

Destination:

```text
10.10.20.50
```

The most specific match is:

```text
10.10.20.0/24
```

### Rule

```text
/24 > /16 > /8
```

The larger prefix length is more specific.

---

# 36. Route Installation vs Packet Forwarding

These are different concepts.

### Route Installation

```text
Multiple Routing Sources
          ↓
Administrative Distance
          ↓
Routing Protocol Metric
          ↓
Best Route
          ↓
RIB
```

### Packet Forwarding

```text
Destination IP
      ↓
Longest Prefix Match
      ↓
FIB
      ↓
Next-Hop Resolution
      ↓
Outgoing Interface
```

---

# 37. Equal-Cost Paths

If multiple paths have the same preferred metric, a router can install multiple paths.

This is:

**ECMP — Equal-Cost Multipath**

```text
        R2
       /  \
      /    \
R1 ──        ── R4
      \    /
       \  /
        R3
```

Example:

```text
Path A = Metric 20
Path B = Metric 20
```

Both can potentially be used.

Benefits:

- Load sharing
    
- Redundancy
    
- Better link utilization
    

---

# 38. Floating Static Routes

A **floating static route** is a backup static route with a higher AD than the primary route.

Example:

```text
Primary:
OSPF → AD 110

Backup:
Static → AD 200
```

```cisco
ip route 10.10.20.0 255.255.255.0 192.168.13.2 200
```

Normal state:

```text
OSPF route
   ↓
Primary
```

If OSPF disappears:

```text
Static route
   ↓
Backup
```

---

# 39. Recursive Route Lookup

A recursive lookup occurs when the router must perform another lookup to resolve a next-hop address.

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

It then asks:

> How do I reach 192.168.12.2?

Suppose:

```text
192.168.12.0/24
→ Gi0/0
```

Then:

```text
10.10.20.0/24
      ↓
192.168.12.2
      ↓
Lookup 192.168.12.2
      ↓
Gi0/0
```

---

# 40. Route Summarization

Route summarization combines multiple routes into one larger prefix.

Example:

```text
10.10.0.0/24
10.10.1.0/24
10.10.2.0/24
10.10.3.0/24
```

Can be summarized as:

```text
10.10.0.0/22
```

Benefits:

- Smaller routing tables
    
- Less routing information
    
- Better scalability
    
- Reduced routing updates
    
- Reduced SPF/routing calculations in some designs
    

---

# 41. Route Redistribution

Redistribution allows routes from one routing protocol to be introduced into another.

```text
        OSPF
          │
          ↓
   Redistribution
          │
          ↓
        EIGRP
```

Important considerations:

- Metric translation
    
- Administrative distance
    
- Routing loops
    
- Route filtering
    
- Route tagging
    

---

# 42. Route Filtering

Route filtering controls which routes are accepted or advertised.

Common Cisco tools:

- Prefix lists
    
- Route maps
    
- Distribute lists
    

```text
Routes
  ↓
Filter
  ↓
Allowed Routes
  ↓
Routing Protocol
```

Filtering can be performed:

- Inbound
    
- Outbound
    
- During redistribution
    

---

# 43. Passive Interfaces

A passive interface prevents a routing protocol from forming neighbor relationships on that interface.

Example:

```text
        R1
       /  \
      /    \
    LAN    R2
```

The LAN-facing interface normally does not need a routing neighbor.

```text
LAN Interface
      ↓
Passive
      ↓
No Neighbor Relationship
```

The exact advertisement behavior depends on the routing protocol.

Example:

```cisco
router ospf 1
 passive-interface GigabitEthernet0/1
```

---

# 44. Routing Loops

A routing loop occurs when routing information causes traffic to circulate incorrectly.

```text
R1 → R2 → R3
↑           ↓
└───────────┘
```

Different protocols use different loop-prevention mechanisms.

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
    
- SPF
    
- Hierarchical areas
    

### BGP

- AS_PATH
    

---

# 45. RIB vs FIB

```text
Routing Protocols
       ↓
      RIB
       ↓
      CEF
       ↓
      FIB
       ↓
Packet Forwarding
```

### RIB

**Routing Information Base**

Contains selected routing information.

### FIB

**Forwarding Information Base**

Optimized for actual packet forwarding.

### CEF

**Cisco Express Forwarding**

Cisco's high-performance forwarding architecture.

---

# 46. Control Plane vs Data Plane

### Control Plane

Determines:

> **Where should the packet go?**

Includes:

- OSPF
    
- EIGRP
    
- BGP
    
- Static routing
    
- Routing table calculation
    

### Data Plane

Performs:

> **Actually forward the packet.**

```text
Control Plane
      ↓
RIB
      ↓
FIB
      ↓
Data Plane
      ↓
Packet
```

---

# 47. Dynamic Routing Protocol Comparison

|Protocol|Type|Topology Knowledge|Algorithm/Concept|Metric|
|---|---|---|---|---|
|RIP|Distance Vector|Limited|Distance Vector|Hop Count|
|EIGRP|Advanced Distance Vector|Detailed topology information|DUAL|Bandwidth + Delay|
|OSPF|Link-State|LSDB/topology|SPF|Cost|
|IS-IS|Link-State|LSDB/topology|SPF|Cost|
|BGP|Path Vector|AS path/attributes|Best Path|Path Attributes|

---

# 48. Key Differences

## Distance Vector

> **"Learn from my neighbors."**

```text
Neighbor
   ↓
Distance + Direction
   ↓
Best Route
```

Example:

```text
RIP
```

---

## Advanced Distance Vector

> **"Learn from neighbors, but maintain more information and use more sophisticated path calculation."**

```text
Neighbors
   ↓
Topology Information
   ↓
DUAL
   ↓
Best Route
```

Example:

```text
EIGRP
```

---

## Link-State

> **"Learn the topology and calculate the best path yourself."**

```text
Link Information
      ↓
LSDB
      ↓
SPF
      ↓
Best Route
```

Examples:

```text
OSPF
IS-IS
```

---

## Path Vector

> **"Learn the path through autonomous systems and use path attributes/policies to select routes."**

```text
AS Path
   ↓
Path Attributes
   ↓
Best Path
```

Example:

```text
BGP
```

---

# 49. One-Page Mental Model

```text
                    DYNAMIC ROUTING
                           │
                           ↓
                Routing Protocols
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   Distance Vector    Link-State        Path Vector
        │                  │                  │
       RIP               OSPF               BGP
        │                  │                  │
 "Distance +          "Network          "AS Path +
  Direction"           Topology"          Attributes"
        │                  │                  │
        └──────────────────┼──────────────────┘
                           ↓
                  Best Path Calculation
                           ↓
                          RIB
                           ↓
                         CEF/FIB
                           ↓
                   Packet Forwarding
                           │
                           ↓
                  Topology Change?
                       /       \
                     No         Yes
                     │           │
                     │           ↓
                     │      Recalculate
                     │           │
                     └──── Convergence
```

---

# 50. Quick Memory Table

|Concept|Remember|
|---|---|
|Dynamic Routing|Routers automatically learn routes|
|Distance Vector|Distance + direction|
|Advanced Distance Vector|EIGRP + DUAL|
|Link-State|Build topology view|
|Path Vector|AS path + attributes|
|RIP|Hop count|
|EIGRP|Bandwidth + Delay|
|OSPF|Cost + SPF|
|BGP|Path attributes|
|IGP|Inside an AS|
|EGP|Between ASes|
|AD|Trust between routing sources|
|Metric|Best path within a protocol|
|LPM|Most specific prefix wins|
|ECMP|Multiple equal-cost paths|
|Floating Static|Backup static route|
|Recursive Lookup|Resolve next-hop address|
|Convergence|Adapt to topology changes|
|RIB|Routing information|
|FIB|Forwarding information|
|CEF|Cisco forwarding architecture|

---

# 51. Cisco Verification Commands

```cisco
show ip route
show ip protocols
show ip cef
```

### OSPF

```cisco
show ip ospf neighbor
show ip ospf database
show ip ospf interface
show ip route ospf
```

### EIGRP

```cisco
show ip eigrp neighbors
show ip eigrp topology
show ip route eigrp
```

### RIP

```cisco
show ip protocols
show ip route rip
```

---

# 52. Final Mental Model

> [!important]  
> **Remember the four major routing concepts:**

### Distance Vector

**"How far is the network and which direction should I go?"**

### Advanced Distance Vector

**"I learn from neighbors but maintain more information and use sophisticated calculations."**

### Link-State

**"What does the network topology look like, and what is the best path through it?"**

### Path Vector

**"What path does this route take through autonomous systems, and which path does policy prefer?"**

```text
Distance Vector
      ↓
Distance + Direction

Advanced Distance Vector
      ↓
Distance + Direction + Better Information

Link-State
      ↓
Topology + SPF

Path Vector
      ↓
AS Path + Attributes + Policy
```

> **Core routing flow:**  
> **Discover → Exchange → Learn → Calculate → Install → Forward → Detect Change → Recalculate → Converge**