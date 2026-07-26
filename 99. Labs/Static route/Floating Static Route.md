![[Pasted image 20260726171030.png]]

Here is the complete, detailed scenario description for your Packet Tracer topology, incorporating all the routing logic and IP assignments, including R3's specific role on the local network.

### **Scenario Title: High Availability and Link Redundancy using Floating Static Routes**

**Objective:**

This topology demonstrates how to configure network redundancy between two remote Local Area Networks (LANs). It utilizes a primary serial link for standard traffic and a secondary Ethernet link via a backup router that automatically takes over if the primary link fails, achieved through the use of Floating Static Routes.

### **1. Site A: Local Network (192.168.1.0/24)**

This is the source network located on the left side of the topology.

- **End Devices:** Three PCs configured with IPs `192.168.1.2`, `192.168.1.3`, and `192.168.1.4`.
    
- **Layer 2 Switching:** The PCs connect to `Switch0` (Cisco 2960-24TT) on FastEthernet ports `Fa0/1`, `Fa0/2`, and `Fa0/3`.
    
- **Default Gateway:** `Switch0` connects to the main Site A router, **R1** (Cisco ISR4321), via `Fa0/4` into the router's `Gig0/0/0` interface. The gateway IP configured on R1 is **`192.168.1.1`**.
    

### **2. Site B: Remote Network (192.168.2.0/24)**

This is the destination network located on the right side of the topology.

- **End Devices:** Three PCs configured with IPs `192.168.2.2`, `192.168.2.3`, and `192.168.2.4`.
    
- **Layer 2 Switching:** The PCs connect to `Switch1` (Cisco 2960-24TT) on FastEthernet ports `Fa0/2`, `Fa0/3`, and `Fa0/4`.
    
- **Default Gateway:** `Switch1` connects to the main Site B router, **R2** (Cisco ISR4321), via `Fa0/1` into the router's `Gig0/0/1` interface. The gateway IP configured on R2 is **`192.168.2.1`**.
    

### **3. The WAN Connections**

**The Primary Path (Currently FAILED)**

- **Medium:** Direct Serial connection.
    
- **Subnet:** `10.10.10.0/30`
    
- **Connection:** Connects **R1** (`Se0/1/0` - `10.10.10.1`) directly to **R2** (`Se0/1/0` - `10.10.10.2`).
    
- **State:** The red indicators show this link is down, simulating a physical cable break or an ISP failure.
    

**The Backup Path (Currently ACTIVE)**

- **Medium:** Gigabit Ethernet routing.
    
- **Subnet (Segment 1):** `10.10.20.0/30`. A crossover cable connects **R1** (`Gig0/0/1` - `10.10.20.1`) to the intermediate router **R3 Backup** (`Gig0/0/0` - `10.10.20.2`).
    
- **Subnet (Segment 2):** `192.168.2.0/24`. A straight-through cable drops **R3 Backup** directly into the Site B LAN via `Switch1` (`Fa0/5`). R3 is assigned the IP **`192.168.2.254`** on its `Gig0/0/1` interface to participate in the local network.
    

### **4. Routing Logic & Failover Traffic Flow**

Because the primary serial link is down, the routers are relying on their floating static routes (configured with an Administrative Distance of 5) to push traffic over the backup Ethernet links. Here is the exact path an ICMP Echo Request (Ping) takes from PC `192.168.1.2` to PC `192.168.2.2`:

1. **Outbound from Site A:**
    
    - PC `192.168.1.2` sends the packet to its gateway, **R1** (`192.168.1.1`).
        
    - **R1** checks its routing table. The primary route to Site B via `10.10.10.2` is inactive. The floating static route takes over, directing the packet out `Gig0/0/1` to the next-hop IP **`10.10.20.2`** (R3 Backup).
        
2. **The Backup Handoff:**
    
    - **R3 Backup** receives the packet. It has a directly connected route to the `192.168.2.0/24` network. It forwards the packet out `Gig0/0/1` into `Switch1`, which delivers it to PC `192.168.2.2`.
        
3. **Return Traffic from Site B (The Asymmetric Handoff):**
    
    - PC `192.168.2.2` generates the reply. End devices do not know about backup routers, so it sends the reply to its default gateway, **R2** (`192.168.2.1`).
        
    - **R2** receives the packet and sees the primary serial link is down.
        
    - **R2** activates its floating static route, which dictates that traffic for `192.168.1.0/24` must be sent to **`192.168.2.254`**.
        
    - **R2** forwards the packet back out its local interface (`Gig0/0/1`), through `Switch1`, to **R3 Backup**.
        
4. **The Final Leg Home:**
    
    - **R3 Backup** receives the reply, uses its standard static route to push the traffic back across the `10.10.20.0/30` network to **R1**.
        
    - **R1** delivers the reply to the originating PC.


Here are the complete Cisco IOS configuration commands to set up the entire scenario. You can copy and paste these directly into the CLI of each router in Packet Tracer.

### **1. R1 Configuration (Site A Main Router)**

This configures the local LAN, the primary serial link (acting as the DCE to provide clocking), the backup Gigabit link, and both the primary and floating static routes.

Plaintext

```
! Enter global configuration mode
enable
configure terminal

! Configure Local LAN Interface (Site A)
interface GigabitEthernet0/0/0
 ip address 192.168.1.1 255.255.255.0
 no shutdown
 exit

! Configure Primary Serial Link to R2 (DCE side)
interface Serial0/1/0
 ip address 10.10.10.1 255.255.255.252
 clock rate 64000
 no shutdown
 exit

! Configure Backup Link to R3 Backup
interface GigabitEthernet0/0/1
 ip address 10.10.20.1 255.255.255.252
 no shutdown
 exit

! Configure Routing to Site B (192.168.2.0/24)
! Primary Route (AD 1)
ip route 192.168.2.0 255.255.255.0 10.10.10.2
! Floating Backup Route (AD 5)
ip route 192.168.2.0 255.255.255.0 10.10.20.2 5

! Save configuration
end
write memory
```

### **2. R2 Configuration (Site B Main Router)**

This configures the local LAN, the primary serial link, and the routing logic (including the specific backup route that points return traffic to R3).

Plaintext

```
! Enter global configuration mode
enable
configure terminal

! Configure Local LAN Interface (Site B)
interface GigabitEthernet0/0/1
 ip address 192.168.2.1 255.255.255.0
 no shutdown
 exit

! Configure Primary Serial Link to R1
interface Serial0/1/0
 ip address 10.10.10.2 255.255.255.252
 no shutdown
 exit

! Configure Routing to Site A (192.168.1.0/24)
! Primary Route (AD 1)
ip route 192.168.1.0 255.255.255.0 10.10.10.1
! Floating Backup Route via R3 (AD 5)
ip route 192.168.1.0 255.255.255.0 192.168.2.254 5

! Save configuration
end
write memory
```

### **3. R3 Backup Configuration (Intermediate Router)**

This configures the connection back to R1, the local connection into Site B's switch, and the static route needed to push traffic back to Site A.

Plaintext

```
! Enter global configuration mode
enable
configure terminal

! Configure Backup Link to R1
interface GigabitEthernet0/0/0
 ip address 10.10.20.2 255.255.255.252
 no shutdown
 exit

! Configure Connection to Site B Switch
interface GigabitEthernet0/0/1
 ip address 192.168.2.254 255.255.255.0
 no shutdown
 exit

! Configure Routing to Site A (192.168.1.0/24)
! Only one route is needed here pointing to R1
ip route 192.168.1.0 255.255.255.0 10.10.20.1

! Save configuration
end
write memory
```

### **4. PC Configurations (Via GUI)**

You do not use the CLI for the PCs in Packet Tracer, but you must ensure their IP configurations are set correctly in the **Desktop -> IP Configuration** tab:

**Site A PCs (192.168.1.2, .3, .4):**

- **Subnet Mask:** `255.255.255.0`
    
- **Default Gateway:** `192.168.1.1`
    

**Site B PCs (192.168.2.2, .3, .4):**

- **Subnet Mask:** `255.255.255.0`
    
- **Default Gateway:** `192.168.2.1`
    

To test the failover, open a command prompt on PC `192.168.1.2` and run `ping 192.168.2.2 -t` (the `-t` makes it ping continuously). While it is pinging, go into R1 and shut down `Serial0/1/0`. You will see a brief interruption, and then the pings will resume as the floating static route takes over!