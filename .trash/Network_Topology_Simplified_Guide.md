
# Network Topology Architectures — Simplified Study Guide

## 1. Physical vs. Logical Topology

| Type | Definition |
|------|------------|
| **Physical** | Actual wiring layout (cables, ports, placement) |
| **Logical** | How data actually flows between devices |

> **Key Trap:** A hub network is **physically a star** but **logically a bus**.

---

## 2. Basic Topology Shapes

| Topology | Layout | Single Point of Failure? | Cost |
|----------|--------|-------------------------|------|
| **Bus** | Shared backbone cable | Yes | Very low |
| **Ring** | Each device connects to 2 neighbors | Yes (single) / No (dual) | Low–Medium |
| **Star** | All devices connect to central hub/switch | Yes — central device | Medium |
| **Full Mesh** | Every device connects to every other | No | Very high |
| **Partial Mesh** | Some devices directly connected | Reduced | Medium–High |

> **Formula:** Full mesh links = **n(n−1)/2**
> Example: 5 sites = 5×4÷2 = **10 links**

---

## 3. Two-Tier (Collapsed Core)

**Layers:**
- **Collapsed Core/Distribution** — Routing, policies, redundancy (FHRP)
- **Access** — End devices, VLANs, port security

**Use:** Small/medium campuses, branch offices
**Pros:** Lower cost, simpler
**Cons:** Less scalable than 3-tier

---

## 4. Three-Tier Hierarchical Model

| Layer | Primary Job | Key Features |
|-------|-------------|--------------|
| **Core** | Fast backbone between distribution blocks | No ACLs/QoS, max redundancy, L3 only |
| **Distribution** | Policy layer — routes between VLANs, ACLs, QoS, FHRP | L2/L3 boundary, route summarization |
| **Access** | Connects end-user devices | Port security, 802.1X, PoE, QoS **classification** |

> **Exam Trap:** 802.1X auth and QoS classification happen at **Access**, not Distribution.
> **Rule:** Access switches should **never** connect directly to each other.

---

## 5. Spine-Leaf (Data Center)

- **Leaf** = Access (servers, storage connect here)
- **Spine** = Core (interconnects all leaf switches)

**Golden Rules:**
- Every leaf connects to **every** spine
- **No** leaf-to-leaf links
- **No** spine-to-spine links

**Result:** Any two servers are always exactly **2 hops** apart (leaf→spine→leaf)

**Use:** Modern data centers with heavy east-west (server-to-server) traffic

> **Oversubscription Example:** 48×10G downlinks (480G) + 4×100G uplinks (400G) = **1.2:1 ratio**

---

## 6. WAN Topologies

| Topology | Description | Links Needed |
|----------|-------------|--------------|
| **Point-to-Point** | Dedicated link between 2 sites | 1 |
| **Hub-and-Spoke** | Central hub connects to all spokes | n−1 |
| **Full Mesh** | Every site connects to every other | n(n−1)/2 |
| **Partial Mesh** | Some sites directly connected | Between n−1 and n(n−1)/2 |

> **Trap:** Spoke-to-spoke traffic in hub-and-spoke **must traverse the hub**.

**Technologies:** MPLS, Metro Ethernet, DMVPN

---

## 7. SOHO

- Single all-in-one device (router + switch + AP + firewall)
- Flat, single-tier star
- Cost and simplicity over scalability

---

## 8. On-Premises vs. Cloud vs. Hybrid

| Model | Description |
|-------|-------------|
| **On-prem** | Owned, physically housed by organization |
| **Cloud** | Third-party hosted, accessed over internet |
| **Hybrid** | Mix of both, connected via VPN or dedicated circuits |

**Service Models:**
- **IaaS** — Provider manages hardware/virtualization (AWS EC2)
- **PaaS** — + runtime/OS/dev platform (Azure App Service)
- **SaaS** — Complete application (Gmail, Microsoft 365)

---

## 9. CDP vs. LLDP

| Feature | CDP | LLDP |
|---------|-----|------|
| Vendor | Cisco proprietary | Open (IEEE 802.1AB) |
| Default | Enabled on Cisco | Often disabled |
| Update timer | 60 sec | 30 sec |
| Hold time | 180 sec | 120 sec |
| Multicast MAC | 01:00:0c:cc:cc:cc | 01:80:c2:00:00:0e |

> **Use LLDP** for mixed-vendor environments.

---

## 10. Quick Comparison Table

| Feature | 2-Tier | 3-Tier | Spine-Leaf |
|---------|--------|--------|------------|
| Layers | 2 | 3 | 2 |
| Best for | Small campus | Large campus | Data center |
| Scalability | Moderate | High | Very high |
| Max hops | Variable | Variable | Always 2 |
| Redundancy | FHRP | FHRP | ECMP |

---

## 11. Cheat Sheet

| Item | Value |
|------|-------|
| Full mesh links | n(n−1)/2 |
| Hub-and-spoke links | n−1 |
| CDP update / hold | 60s / 180s |
| LLDP update / hold | 30s / 120s |
| Spine-leaf max hops | 2 |

---

## 12. Key Commands

```
show cdp neighbors          # Discover Cisco neighbors
show cdp neighbors detail   # + IP, IOS version
show lldp neighbors         # Vendor-neutral discovery
show ip interface brief     # Verify interfaces up/up
traceroute <ip>             # Confirm traffic path
show spanning-tree          # Check for loops
```

---

## 13. Practice Questions

**Q1.** Which layer does VLAN-to-VLAN routing and ACLs?
> **Distribution**

**Q2.** Links to fully mesh 6 sites?
> **15** (6×5÷2)

**Q3.** Which link should NOT exist in spine-leaf?
> **Spine-to-spine** (also no leaf-to-leaf)

**Q4.** Protocol for mixed-vendor topology discovery?
> **LLDP**

**Q5.** All-in-one device for 4 employees?
> **SOHO**

---

## 14. Common Mistakes

- Confusing which layer does what (Access = auth/classification, Distribution = policy, Core = speed)
- Thinking spine-leaf replaces 3-tier everywhere — it’s for **data centers**, not campuses
- Forgetting spoke-to-spoke goes through the hub in hub-and-spoke
- Mixing up CDP/LLDP timers and defaults

---

*CCNA 200-301 v1.1 | Domain 1.2 — Network Topology Architectures*
