![[Pasted image 20260726172521.png]] 

Here is the complete scenario description and the corresponding Cisco IOS configurations for the point-to-point topology shown in your image, combined into a single reference guide.

## Part 1: Scenario Description

### **Scenario Title: Fundamental Site-to-Site Connectivity using Standard Static Routes**

**Objective:**

This topology demonstrates the baseline configuration required to connect two separate Local Area Networks (LANs) over a single Wide Area Network (WAN) link. Because there are no backup paths, this scenario relies entirely on one **Standard Static Route** on each router to ensure end-to-end communication.

### **1. Site A: Local Network (192.168.1.0/24)**

This is the source network located on the left side of the topology.

- **End Devices:** Three PCs configured with IPs `192.168.1.2`, `192.168.1.3`, and `192.168.1.4`.
    
- **Layer 2 Switching:** The PCs connect to `Switch0` (Cisco 2960-24TT) on FastEthernet ports `Fa0/1`, `Fa0/2`, and `Fa0/3`.
    
- **Default Gateway:** `Switch0` connects to the main Site A router, **R1** (PT8200 router), via `Fa0/4` into the router's `Gig0/0/0` interface. The gateway IP configured on R1 is **`192.168.1.1`**.
    

### **2. Site B: Remote Network (192.168.2.0/24)**

This is the destination network located on the right side of the topology.

- **End Devices:** Three PCs configured with IPs `192.168.2.2`, `192.168.2.3`, and `192.168.2.4`.
    
- **Layer 2 Switching:** The PCs connect to `Switch1` (Cisco 2960-24TT) on FastEthernet ports `Fa0/2`, `Fa0/3`, and `Fa0/4`.
    
- **Default Gateway:** `Switch1` connects to the main Site B router, **R2** (PT8200 router), via `Fa0/1` into the router's `Gig0/0/1` interface. The gateway IP configured on R2 is **`192.168.2.1`**.
    

### **3. The Point-to-Point WAN Connection**

There is only one path connecting these two sites.

- **Medium:** Gigabit Ethernet routing using a crossover cable (indicated by the dashed black line).
    
- **Subnet:** `10.10.10.0/30`.
    
- **Connection Details:** The link connects **R1** (`Gig0/0/1` - IP: `10.10.10.1`) directly to **R2** (`Gig0/0/0` - IP: `10.10.10.2`).
    

### **4. Routing Logic & Traffic Flow**

To allow the PCs on Site A to communicate with the PCs on Site B, the routers must be configured with Standard Static Routes. Here is the exact path an ICMP Echo Request (Ping) takes from PC `192.168.1.2` to PC `192.168.2.2`:

1. **Outbound Traffic:** PC `192.168.1.2` sends the packet to its default gateway, **R1** (`192.168.1.1`).
    
2. **The Forward Route:** **R1** checks its routing table, finds the standard static route to `192.168.2.0`, and forwards the packet out of its `Gig0/0/1` interface to **R2**.
    
3. **Delivery to Site B:** **R2** receives the packet and forwards it down through `Switch1` to PC `192.168.2.2`.
    
4. **Return Traffic:** PC `192.168.2.2` generates the reply and sends it to its default gateway, **R2** (`192.168.2.1`).
    
5. **The Return Route:** **R2** checks its routing table, finds the return static route to `192.168.1.0`, and forwards the packet back across the Gigabit link to **R1**, which delivers it to the originating PC.
    

## Part 2: Device Configurations

Below are the complete Cisco IOS configuration commands to set up the scenario.

### **1. R1 Configuration (Site A Router)**

This brings up the local LAN, the WAN connection to R2, and adds the static route pointing traffic destined for the `192.168.2.0` network over to R2.

Plaintext

```
! Enter global configuration mode
enable
configure terminal

! Configure Local LAN Interface
interface GigabitEthernet0/0/0
 ip address 192.168.1.1 255.255.255.0
 no shutdown
 exit

! Configure WAN Link to R2
interface GigabitEthernet0/0/1
 ip address 10.10.10.1 255.255.255.252
 no shutdown
 exit

! Configure Standard Static Route to Site B
ip route 192.168.2.0 255.255.255.0 10.10.10.2

! Save configuration
end
write memory
```

### **2. R2 Configuration (Site B Router)**

This brings up the local LAN, the WAN connection back to R1, and adds the return static route pointing traffic destined for the `192.168.1.0` network over to R1.

Plaintext

```
! Enter global configuration mode
enable
configure terminal

! Configure Local LAN Interface
interface GigabitEthernet0/0/1
 ip address 192.168.2.1 255.255.255.0
 no shutdown
 exit

! Configure WAN Link to R1
interface GigabitEthernet0/0/0
 ip address 10.10.10.2 255.255.255.252
 no shutdown
 exit

! Configure Standard Static Route to Site A
ip route 192.168.1.0 255.255.255.0 10.10.10.1

! Save configuration
end
write memory
```

### **3. PC Requirements**

Ensure the end devices are configured correctly via the Packet Tracer GUI (**Desktop -> IP Configuration** tab):

- **Site A PCs (`192.168.1.2`, `.3`, `.4`):** Ensure the Default Gateway is set to **`192.168.1.1`**.
    
- **Site B PCs (`192.168.2.2`, `.3`, `.4`):** Ensure the Default Gateway is set to **`192.168.2.1`**.