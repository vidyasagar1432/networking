# STP (Spanning Tree Protocol)

> **Level 08 · STP** — CCNP Enterprise (ENCOR 350-401)

---

## 1. Overview

**Spanning Tree Protocol (STP)** prevents **Layer-2 loops** in redundant switched  
networks by logically placing some ports into a non-forwarding role/state while  
maintaining redundant physical paths.

Classic STP is defined by **IEEE 802.1D**. It elects a **Root Bridge**, determines  
the best path toward the root, and assigns **Root Ports** and **Designated Ports**.  
Redundant paths that are not selected remain non-forwarding.

Without STP, redundant Layer-2 links can cause:

- Broadcast storms
    
- Unknown-unicast flooding loops
    
- MAC-address instability/flapping
    
- Duplicate frames
    
- Excessive switch CPU utilization
    

STP is primarily a **loop-prevention protocol**, not a link-redundancy protocol.  
Redundancy is provided by the physical topology; STP makes that redundancy safe.

Classic 802.1D convergence can be slow because of its timer-based state transitions.  
This limitation motivated **RSTP (802.1w)** and Cisco **Rapid PVST+**.

---

## 2. Core Concepts

### 2.1 Why loops are catastrophic

|Problem|Cause|
|---|---|
|**Broadcast storm**|Broadcast frames can circulate repeatedly|
|**Unknown-unicast flooding**|Flooded frames can circulate through the loop|
|**MAC-table instability**|The same source MAC can appear on different ports|
|**Duplicate frames**|Frames may arrive through multiple paths|
|**CPU/resource exhaustion**|Continuous frame processing consumes resources|

**Mental model:**

> **Physical redundancy + Layer-2 forwarding = potential loop → STP blocks redundant paths.**

---

### 2.2 STP decision process

STP can be understood in this order:

1. **Elect the Root Bridge**
    
    - Lowest **Bridge ID** wins.
        
2. **Select a Root Port on every non-root switch**
    
    - The Root Port provides that switch's best path toward the Root Bridge.
        
3. **Select a Designated Port on every Layer-2 segment**
    
    - The port advertising the best BPDU on that segment becomes Designated.
        
4. **Place remaining redundant ports into a non-forwarding role/state**
    
    - In classic STP these are commonly described as **non-designated ports**.
        
    - RSTP uses more specific **Alternate** and **Backup** roles.
        

### CCNP Mental Model

```text
STP
│
├── 1. Elect Root Bridge
│      └── Lowest Bridge ID
│
├── 2. Select Root Port
│      └── Best path toward Root
│
├── 3. Select Designated Port
│      └── Best BPDU on each segment
│
└── 4. Remaining redundant ports
       └── Non-forwarding
       └── Prevent the Layer-2 loop
```

---

### 2.3 Bridge ID

The **Bridge ID (BID)** identifies a switch for STP elections.

Conceptually:

```text
Bridge ID
│
├── Bridge Priority
│
├── Extended System ID
│      └── VLAN ID in PVST+/Rapid PVST+
│
└── System MAC Address
```

The Root Bridge is elected using the **lowest Bridge ID**:

1. Lowest priority
    
2. If priority ties → lowest MAC address
    

On Cisco PVST+/Rapid PVST+, the **12-bit Extended System ID** carries the VLAN ID.

Therefore, the effective bridge priority is conceptually:

```text
Effective Priority = Configured Priority + VLAN ID
```

Example:

```text
Configured priority = 4096
VLAN = 10

Effective priority = 4096 + 10
                   = 4106
```

Because the Extended System ID occupies 12 bits, configurable STP priorities  
are normally in **4096 increments**:

```text
0
4096
8192
12288
16384
20480
24576
28672
32768  ← default
36864
40960
45056
49152
53248
57344
61440
```

> **Exam trap:** `spanning-tree vlan 10 priority 4096` does not mean the complete  
> displayed bridge priority will necessarily be `4096`; the VLAN ID is included  
> in the effective priority.

---

### 2.4 Root Bridge election

The switch with the **lowest Bridge ID** becomes the Root Bridge.

```text
Lowest Priority
      ↓
If tied
      ↓
Lowest MAC Address
      ↓
Root Bridge
```

The Root Bridge has:

- The best Bridge ID
    
- No Root Port
    
- All active STP ports are normally **Designated Ports**
    
- It is the reference point for the spanning tree
    

---

### 2.5 BPDU comparison and path selection

STP uses BPDU information to determine the best path.

For selecting a Root Port, the relevant comparison is:

1. **Lowest Root Bridge ID**
    
2. **Lowest Root Path Cost**
    
3. **Lowest Sender Bridge ID**
    
4. **Lowest Sender Port ID**
    

The **Port ID** itself is composed of:

```text
Port ID = Port Priority + Port Number
```

On Cisco switches, default port priority is commonly **128**.

### Important distinction

The same general BPDU information is used throughout STP, but do not think of  
the four-way comparison as a single universal election algorithm.

- **Root Bridge election** → lowest Bridge ID
    
- **Root Port selection** → best BPDU/path toward the Root
    
- **Designated Port election** → best BPDU on a particular Layer-2 segment
    

---

### 2.6 Port roles

Port **roles** describe what a port does in the spanning tree.

#### Classic STP

|Role|Purpose|
|---|---|
|**Root Port**|Best path from a non-root switch toward the Root Bridge|
|**Designated Port**|Best port for a particular Layer-2 segment|
|**Non-designated Port**|Redundant port that does not forward traffic|

#### RSTP additions

|Role|Purpose|
|---|---|
|**Alternate Port**|Backup path toward the Root Bridge|
|**Backup Port**|Backup for a Designated Port on the same shared segment|

> **Important:** A port **role** and a port **state** are different concepts.

---

### 2.7 Port states

Classic 802.1D uses these states:

|State|Forwards Data|Learns MAC|Purpose|
|---|--:|--:|---|
|**Blocking**|No|No|Prevents loops while still monitoring BPDUs|
|**Listening**|No|No|Determines port role/topology|
|**Learning**|No|Yes|Builds MAC-address table|
|**Forwarding**|Yes|Yes|Normal forwarding|
|**Disabled**|No|No|Administratively/internally disabled|

### Critical point

A **Blocking** port does **not** mean the port is completely inactive.

A blocking port:

- Does not forward normal user traffic
    
- Does not learn MAC addresses from user traffic
    
- **Receives and processes BPDUs**
    
- Can transition to forwarding if the topology changes
    

---

### 2.8 Roles vs states

Never confuse these:

```text
PORT ROLE
│
├── Root
├── Designated
├── Non-designated
├── Alternate       ← RSTP
└── Backup          ← RSTP


PORT STATE
│
├── Blocking
├── Listening
├── Learning
├── Forwarding
└── Disabled
```

A **Root Port** can be in a forwarding state.

A **Designated Port** can be in a forwarding state.

A classic **Non-designated Port** is normally in a blocking state.

---

### 2.9 BPDUs — the STP language

A **BPDU (Bridge Protocol Data Unit)** carries STP information between switches.

Important information includes:

- Root Bridge ID
    
- Root Path Cost
    
- Sender Bridge ID
    
- Sender Port ID
    
- Hello Time
    
- Max Age
    
- Forward Delay
    

The default classic STP **Hello Time is 2 seconds**.

The Root Bridge originates Configuration BPDUs. Downstream switches use the  
information received from the Root to maintain and propagate spanning-tree  
information.

> **Exam trap:** Blocking ports still receive/process BPDUs. They are not isolated  
> from STP control traffic.

---

## 3. STP Timers and Classic Convergence

|Timer|Default|Purpose|
|---|--:|---|
|**Hello Time**|2 s|Interval between Configuration BPDUs|
|**Max Age**|20 s|Maximum time STP information is considered valid|
|**Forward Delay**|15 s|Duration of Listening and Learning|

Classic STP uses:

```text
Listening  = 15 s
Learning   = 15 s
```

A traditional worst-case failure scenario can involve:

```text
Max Age + Forward Delay + Forward Delay
20 s     + 15 s           + 15 s
≈ 50 s
```

However, **50 seconds is a traditional conceptual worst-case figure, not a  
universal convergence time**. Actual convergence depends on the topology,  
failure location, BPDU propagation, and timers.

This slow convergence was a major reason for the development of **RSTP**.

---

## 4. Topology Change Notification (TCN)

Classic 802.1D uses a **Topology Change Notification** mechanism.

A switch detecting a relevant topology change can send a **TCN BPDU toward the  
Root Bridge through its Root Port**.

The Root Bridge then signals the topology change using the **TC flag** in  
Configuration BPDUs.

During the topology-change period, switches temporarily reduce the effective  
MAC-address aging behavior so stale MAC entries are removed more quickly.

This helps switches relearn MAC locations after the topology changes.

> **Exam concept:** TCN does not change the physical topology. It tells the STP  
> domain that the forwarding topology has changed and that MAC information may  
> need to be relearned.

---

## 5. Path Cost

STP uses **Root Path Cost** to select the best path toward the Root Bridge.

### Common Cisco short path-cost values

|Link Speed|Common Short Cost|
|---|--:|
|**10 Mbps**|100|
|**100 Mbps**|19|
|**1 Gbps**|4|
|**10 Gbps**|2|
|**40 Gbps**|1|
|**100 Gbps**|1|

Lower path cost is preferred.

> These are the commonly encountered **Cisco short-method values**. Do not treat  
> them as universal values for every STP path-cost method. STP can also use  
> **long path costs**, which provide greater granularity for modern high-speed  
> interfaces.

### Per-interface cost

Cisco IOS/IOS XE allows the cost to be manually configured:

```text
interface GigabitEthernet0/1
 spanning-tree vlan 10 cost 19
```

This can influence which path becomes the preferred Root Port or Designated Port.

---

## 6. Configuration / Commands

### Manually set STP priority

```text
! Make this switch more likely to become Root for VLAN 10
spanning-tree vlan 10 priority 4096
```

Lower priority = stronger chance of becoming Root.

---

### Cisco root-primary macro

```text
spanning-tree vlan 10 root primary
```

This is a Cisco macro that adjusts the switch's priority to make it a likely  
Root Bridge.

> Do not memorize `root primary` as simply "priority 24576". Cisco determines  
> the resulting priority based on the existing STP topology and priority values;  
> 24576 is a common result.

---

### Cisco root-secondary macro

```text
spanning-tree vlan 10 root secondary
```

This positions the switch to become a likely backup Root Bridge.

> `28672` is a common resulting priority, but the macro should be understood as  
> a **root-secondary configuration mechanism**, not merely as a fixed priority  
> command.

---

### Verify STP

```text
show spanning-tree
show spanning-tree vlan 10
show spanning-tree root
show spanning-tree bridge
show spanning-tree detail
```

Useful interface-level verification:

```text
show spanning-tree interface GigabitEthernet0/1
show spanning-tree interface GigabitEthernet0/1 detail
```

Check STP mode:

```text
show spanning-tree summary
```

---

## 7. Troubleshooting

|Symptom|Likely Cause|Check|
|---|---|---|
|**Wrong Root Bridge**|Incorrect priorities or lower MAC wins|`show spanning-tree root`|
|**Unexpected Root Port**|Path cost/BPDU tie-breaker|`show spanning-tree vlan 10`|
|**Port remains blocking**|STP correctly detecting redundant path|Check role, cost and BPDUs|
|**Slow convergence**|Classic 802.1D timers|`show spanning-tree summary`|
|**Broadcast storm**|STP disabled, bypassed, or Layer-2 loop|Check STP mode and topology|
|**MAC flapping**|Layer-2 loop, redundant paths, miswiring, or topology change|Check MAC table and STP topology|
|**Unexpected VLAN path**|Different STP instance/root for that VLAN|`show spanning-tree vlan <id>`|

### Useful commands

```text
show spanning-tree vlan 10
show spanning-tree root
show spanning-tree summary
show spanning-tree interface Gi0/1 detail
show mac address-table dynamic
```

For a suspected Layer-2 loop, examine:

```text
Root Bridge
    ↓
Root Port
    ↓
Designated Ports
    ↓
Blocked / Alternate Paths
```

---

## 8. Cisco PVST+ and Per-VLAN STP

Cisco **PVST+** runs a separate STP instance for each VLAN.

Therefore:

```text
VLAN 10 → STP instance 10
VLAN 20 → STP instance 20
VLAN 30 → STP instance 30
```

Each VLAN can have a different:

- Root Bridge
    
- Root Port
    
- Designated Port
    
- Blocking/non-forwarding path
    

This allows **load balancing across VLANs**.

Example:

```text
SW1 = Root for VLAN 10
SW2 = Root for VLAN 20
```

Traffic for VLAN 10 and VLAN 20 can therefore use different Layer-2 paths.

> **Exam trap:** STP is not necessarily one tree for the entire switch. With  
> PVST+/Rapid PVST+, each VLAN has its own spanning-tree instance.

---

## 9. STP Mental Model

```text
                 STP
                  │
        ┌─────────┴─────────┐
        │                   │
   Prevent L2 Loops     Maintain Redundancy
        │                   │
        └─────────┬─────────┘
                  │
           Elect Root Bridge
                  │
          Lowest Bridge ID
                  │
        ┌─────────┴─────────┐
        │                   │
   Root Port Selection   Designated Port
        │                   │
   Best path to Root    Best port/segment
        │                   │
        └─────────┬─────────┘
                  │
       Remaining redundant
              paths
                  │
          Non-forwarding
                  │
          Loop prevented
```

---

## 10. Exam Traps

- **STP is primarily a Layer-2 loop-prevention protocol.**
    
- The **Root Bridge has the lowest Bridge ID**.
    
- Bridge ID comparison is **priority first, MAC second**.
    
- Default STP priority is **32768**.
    
- Cisco PVST+/Rapid PVST+ priority values use **4096 increments** because of the Extended System ID.
    
- A **lower priority wins** the Root election.
    
- **Blocking ports still receive/process BPDUs.**
    
- **Port roles and port states are different concepts.**
    
- Classic STP roles include **Root Port, Designated Port, and Non-designated Port**.
    
- RSTP adds **Alternate** and **Backup** roles.
    
- Root Bridge election uses **Bridge ID**; it does not use path cost.
    
- Root Port selection considers the best BPDU/path toward the Root.
    
- Designated Port election occurs **per Layer-2 segment**.
    
- Lower **Root Path Cost** is preferred.
    
- If path costs tie, STP uses additional BPDU tie-breakers.
    
- Classic STP uses **Listening → Learning → Forwarding** for a port transitioning toward forwarding.
    
- Classic STP's traditional timer-based convergence can approach **50 seconds** in certain failure scenarios.
    
- **RSTP** was designed to provide much faster convergence.
    
- PVST+ provides **one STP instance per VLAN**.
    
- Different VLANs can therefore have **different Root Bridges**.
    
- `spanning-tree vlan X root primary` is a **Cisco macro**, not simply a fixed priority value.
    
- STP does not eliminate physical redundancy; it makes redundant Layer-2 topology safe by preventing forwarding loops.
    

---

## 11. Quick Review Table

|Item|Detail|
|---|---|
|**Purpose**|Prevent Layer-2 forwarding loops|
|**Classic Standard**|IEEE 802.1D|
|**Root Bridge**|Lowest Bridge ID|
|**Bridge ID**|Priority + Extended System ID + MAC|
|**Default Priority**|32768|
|**Priority Granularity**|4096|
|**Root Port**|Best path toward Root|
|**Designated Port**|Best port for a Layer-2 segment|
|**Non-designated**|Redundant non-forwarding port in classic STP|
|**RSTP Roles**|Root / Designated / Alternate / Backup|
|**Classic States**|Blocking / Listening / Learning / Forwarding / Disabled|
|**Hello Timer**|2 s|
|**Max Age**|20 s|
|**Forward Delay**|15 s|
|**Classic Convergence**|Potentially ~50 s in traditional worst-case scenarios|
|**10 Mbps Cost**|100|
|**100 Mbps Cost**|19|
|**1 Gbps Cost**|4|
|**10 Gbps Cost**|2|
|**High-Speed Cost**|1 in common short-cost method|
|**BPDU**|STP control message|
|**TCN**|Topology Change Notification|
|**PVST+**|Separate STP instance per VLAN|
|**Modern Replacement**|RSTP / Rapid PVST+|
|**Loop Symptoms**|Broadcast storms, MAC flapping, duplicate frames|

---

## 12. One-Minute CCNP Revision

```text
STP
│
├── Goal
│   └── Prevent Layer-2 loops
│
├── Root Bridge
│   └── Lowest Bridge ID
│       ├── Lowest Priority
│       └── Lowest MAC if tied
│
├── Non-Root Switch
│   └── Select ONE Root Port
│       └── Best path toward Root
│
├── Every L2 Segment
│   └── Select ONE Designated Port
│       └── Best BPDU on that segment
│
├── Remaining Redundant Ports
│   └── Non-forwarding
│
├── BPDU
│   ├── Root ID
│   ├── Root Path Cost
│   ├── Sender Bridge ID
│   └── Sender Port ID
│
├── Classic States
│   ├── Blocking
│   ├── Listening
│   ├── Learning
│   └── Forwarding
│
├── Timers
│   ├── Hello      = 2 s
│   ├── Max Age    = 20 s
│   └── Forward    = 15 s
│
├── Cost
│   └── Lower = Better
│
├── PVST+
│   └── One STP instance per VLAN
│
└── RSTP
    └── Faster convergence
```

**Core exam rule:**

> **Lowest Bridge ID → Root Bridge → Best path to Root → Root Port → Best port per segment → Designated Port → remaining redundant paths do not forward.**