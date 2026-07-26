# Routing Protocols: RIP, OSPF, and BGP

**A Complete Study Book Based on the CSA510 Lecture Series**

---

## About This Book

This book is a faithful adaptation of the CSA510 lecture slides *Routing Protocols (RIP, OSPF, and BGP)* into a structured, book-style format. The slide bullet points have been expanded into flowing explanations, the worked examples have been preserved and typeset, and every diagram from the original deck has been reproduced as a figure. Each chapter closes with a summary and review questions; answers, quick-reference tables, and a glossary are collected in the appendices.

**How to read this book.** Read Chapters 1 and 2 first — they establish the vocabulary (metrics, autonomous systems, interior versus exterior routing) that the three protocol chapters rely on. Chapters 3 (RIP), 4 (OSPF), and 5 (BGP) are then independent of one another, although reading them in order makes the comparison in Chapter 6 more meaningful.

---

## Table of Contents

- **Chapter 1 — Introduction to Routing**
  - 1.1 The Routing Problem
  - 1.2 Metrics: The Cost of a Route
  - 1.3 Static and Dynamic Routing Tables
- **Chapter 2 — Interior and Exterior Routing**
  - 2.1 Autonomous Systems
  - 2.2 Interior Routing
  - 2.3 Exterior Routing
- **Chapter 3 — RIP: Routing Information Protocol**
  - 3.1 Overview
  - 3.2 Distance Vector Routing
  - 3.3 Updating the Routing Table
  - 3.4 The RIP Message Format
  - 3.5 Requests and Responses
  - 3.6 Timers in RIP
  - 3.7 Problems in RIP
  - 3.8 Remedies for Instability
  - 3.9 RIP Version 2
  - 3.10 RIPng (RIP Next Generation) for IPv6
  - 3.11 Encapsulation
  - Chapter Summary & Review Questions
- **Chapter 4 — OSPF: Open Shortest Path First**
  - 4.1 Overview
  - 4.2 Areas
  - 4.3 Metrics
  - 4.4 Link State Routing
  - 4.5 Types of Links
  - 4.6 Link State Advertisements
  - 4.7 The Link State Database and the Dijkstra Algorithm
  - 4.8 The OSPF Routing Table
  - 4.9 OSPF Packets
  - 4.10 The LSA Formats
  - 4.11 OSPFv3 for IPv6
  - 4.12 Encapsulation
  - Chapter Summary & Review Questions
- **Chapter 5 — BGP: Border Gateway Protocol**
  - 5.1 Overview
  - 5.2 Why Neither Distance Vector nor Link State?
  - 5.3 Path Vector Routing
  - 5.4 Loop Prevention and Policy Routing
  - 5.5 Path Attributes
  - 5.6 BGP Messages
  - 5.7 Multiprotocol BGP (MP-BGP)
  - 5.8 Encapsulation
  - Chapter Summary & Review Questions
- **Chapter 6 — Comparing RIP, OSPF, and BGP**
- **Appendix A — Quick-Reference Tables**
- **Appendix B — Glossary**
- **Appendix C — Answers to Review Questions**

---

# Chapter 1 — Introduction to Routing

## 1.1 The Routing Problem

An **internet** is a combination of networks connected by routers. When a host on one network sends a packet to a host on another network, the packet must travel through one or more routers before it reaches its destination. This raises two fundamental questions:

1. How should a packet be passed from its source to its destination?
2. Of all the available pathways, which one is the *optimum* pathway?

The answer to the second question depends on the **metric**.

## 1.2 Metrics: The Cost of a Route

A **metric** is a cost assigned for passing through a network. A router should choose the route with the smallest metric. However, the metric assigned to each network depends on the type of protocol being used:

- **RIP (Routing Information Protocol)** treats each network as an equal. The cost of passing through each network is the same: **one hop count**.
- **OSPF (Open Shortest Path First)** allows the administrator to assign a cost for passing through a network based on the type of service required — for example, maximum throughput or minimum delay.
- **BGP (Border Gateway Protocol)** uses a different criterion altogether: the **policy**, which can be set by the administrator.

## 1.3 Static and Dynamic Routing Tables

A routing table can be **static** or **dynamic**. A static table is configured by hand and does not change as the network changes; a dynamic table updates itself automatically as routers learn about the network. An internet needs **dynamic routing tables**, and dynamic routing tables are achieved by the **routing protocols** — the subject of this book.

### Chapter 1 Summary

- An internet is a combination of networks connected by routers.
- A metric is the cost of passing through a network; routers prefer the smallest metric.
- RIP uses hop count, OSPF uses an administrator-assigned cost based on type of service, and BGP uses policy.
- Internets need dynamic routing tables, which are maintained by routing protocols.

### Review Questions

1. Define the term *metric*.
2. How does the metric used by RIP differ from the metric used by OSPF?
3. What criterion does BGP use to select a route?
4. Why does an internet need dynamic routing tables rather than static ones?

---

# Chapter 2 — Interior and Exterior Routing

## 2.1 Autonomous Systems

An internet can be so large that one routing protocol cannot handle the task of updating the routing tables of all routers. For this reason, an internet is divided into **autonomous systems (ASs)**. An autonomous system is a group of networks and routers under the authority of a single administration.

> **Note:** Since 2007, AS numbers have been expanded from 16 bits (1–65535) to **32 bits** (RFC 4893). The original private ASN range was 64512–65535 (16-bit). Modern networks use both 16-bit and 32-bit ASNs.

![Popular routing protocols](images/fig-13-01-popular-routing-protocols.png)

*Figure 2.1 — Popular routing protocols: interior protocols operate inside an AS; the exterior protocol operates between ASs.*

## 2.2 Interior Routing

**Interior routing** is routing *inside* an autonomous system. Each AS can choose its own interior routing protocol. The two interior routing protocols covered in this book are:

- **RIP** — Routing Information Protocol (Chapter 3)
- **OSPF** — Open Shortest Path First (Chapter 4)

> **Note:** In modern networks, RIP is considered **legacy/obsolete** and has been largely replaced by OSPF, IS-IS, and EIGRP. It may still appear in small or legacy deployments but is no longer recommended for new designs.

## 2.3 Exterior Routing

**Exterior routing** is routing *between* autonomous systems. Usually only one exterior routing protocol is used for exterior routing:

- **BGP** — Border Gateway Protocol (Chapter 5)

In practice, the boundary routers of an autonomous system run **both** an interior and an exterior routing protocol. In the figure below, routers R1, R2, R3, and R4 each use an interior routing protocol inside their own AS (solid thin lines) and an exterior routing protocol between autonomous systems (broken thick lines).

![Autonomous systems](images/fig-13-02-autonomous-systems.png)

*Figure 2.2 — Autonomous systems. Boundary routers run an interior protocol within the AS and an exterior protocol between ASs.*

### Chapter 2 Summary

- An internet is divided into autonomous systems: groups of networks and routers under a single administration.
- Interior routing takes place inside an AS (RIP, OSPF); each AS chooses its own interior protocol.
- Exterior routing takes place between autonomous systems (BGP); normally a single exterior protocol is used.
- Boundary routers run both kinds of protocol.
- AS numbers are now 32-bit (RFC 4893), expanding beyond the original 16-bit range.

### Review Questions

1. What is an autonomous system?
2. Why is an internet divided into autonomous systems?
3. Classify RIP, OSPF, and BGP as interior or exterior routing protocols.
4. Which routers in an AS typically run both an interior and an exterior routing protocol?
5. What is the difference between 16-bit and 32-bit AS numbers?

---

# Chapter 3 — RIP: Routing Information Protocol

## 3.1 Overview

The **Routing Information Protocol (RIP)** is an interior routing protocol based on **distance vector routing**. It uses the **Bellman–Ford algorithm** for calculating the routing tables.

> **Status Note:** RIP (both v1 and v2) is now considered **legacy/obsolete**. It is still found in legacy or very small networks, but modern networking has moved to OSPF, IS-IS, or EIGRP. RIPv1 in particular is a known security risk and has been used in DDoS reflection attacks. RIP should be considered primarily of historical interest for understanding distance vector routing concepts.

## 3.2 Distance Vector Routing

In distance vector routing, each router periodically shares its knowledge about the entire internet with its neighbors. The method rests on three keys:

1. **Sharing knowledge about the entire AS.** At the start, a router's knowledge may be sparse. But how much it knows is unimportant — it sends whatever it has.
2. **Sharing only with neighbors.** A router sends its knowledge only to its neighbors.
3. **Sharing at regular intervals.** A router sends its knowledge at fixed periodic intervals (every 30 seconds).

## 3.3 Updating the Routing Table

The routing table is updated on receipt of a RIP response message. When a router receives such a message, it first **adds one hop** to the hop count for each advertised destination, and then repeats the following steps for each advertised destination:

