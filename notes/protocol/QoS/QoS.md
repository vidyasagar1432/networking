# QoS (Quality of Service)

## Overview
- Manages bandwidth, latency, jitter, and packet loss for different traffic types
- Essential for VoIP, video, real-time apps
- **QoS is not about creating bandwidth — it's about prioritizing when there's congestion**

## DiffServ (Differentiated Services — RFC 2474)
- Per-hop behavior (PHB) — each router makes independent QoS decisions
- Marked in **DSCP** (Differentiated Services Code Point) — 6 bits in IP ToS byte

### DSCP Classes
| Class | Binary | DSCP | Use |
|---|---|---|---|
| **CS0** | 000000 | 0 | Best effort |
| **EF** | 101110 | 46 | VoIP (Expedited Forwarding) |
| **AF41** | 100010 | 34 | Video (Assured Forwarding) |
| **AF31** | 011010 | 26 | Critical data |
| **AF21** | 010010 | 18 | Transactional data |
| **AF11** | 001010 | 10 | Bulk data |
| **CS5** | 101000 | 40 | Voice signaling |
| **CS3** | 011000 | 24 | Network management |

### AF (Assured Forwarding) — RFC 2597
- 4 classes × 3 drop precedence: AFxy
  - x = class (1–4), y = drop precedence (1=low, 2=medium, 3=high)
- Example: AF41 (class 4, low drop) — video
- During congestion, AF43 drops before AF42, AF42 drops before AF41

## CoS (Class of Service) — 802.1p
- **3 bits** in 802.1Q VLAN tag (PCP — Priority Code Point)
- Values: 0 (best effort) to 7 (network control)
- Mapped to DSCP at Layer 3 boundary

## IntServ (Integrated Services — RFC 2210)
- **RSVP** (Resource Reservation Protocol) — end-to-end reservation
- Per-flow state — **doesn't scale** (not widely used beyond RSVP-TE in MPLS)

## Queuing Mechanisms
### FIFO
- First-in, first-out — no differentiation

### PQ (Priority Queuing)
- Strict priority — high-priority queue empties first
- Risk: starvation of lower queues

### CQ (Custom Queuing)
- Round-robin — each queue gets a configured percentage

### WFQ (Weighted Fair Queuing)
- Flow-based — low-volume flows get priority (prevents large flows from starving small ones)

### CBWFQ (Class-Based WFQ)
- User-defined classes with guaranteed bandwidth (min bandwidth)
- Each class gets a queue with configured weight

### LLQ (Low Latency Queuing)
- CBWFQ + **strict priority queue**
- Priority queue for voice (low latency, no jitter)
- **Policing** of priority queue to prevent starvation
```cisco
class-map VOICE
 match ip dscp ef
policy-map QOS
 class VOICE
  priority 1000       # Strict priority, police at 1 Mbps
 class VIDEO
  bandwidth 2000      # Min 2 Mbps
 class DATA
  bandwidth 1000
 class class-default
  fair-queue
```

### WRED (Weighted Random Early Detection)
- **Congestion avoidance** (not queuing)
- Drops packets **before** queue fills (threshold-based)
- Different thresholds per DSCP (AF41 drops later than AF43)
- **TCP-friendly** — causes TCP senders to slow down
```cisco
random-detect
random-detect dscp based
```

## Shaping vs Policing
| Feature | Shaper | Policer |
|---|---|---|
| Action | Buffer excess (delay) | Drop or re-mark |
| Burst | Tolerated (Bc, Be) | Tolerated |
| Outbound/Inbound | Outbound | Both |
| Traffic pattern | Smooths | Sharp drops |

## Important QoS Concepts
- **Classification** — Identify traffic (ACL, NBAR, DSCP)
- **Marking** — Set DSCP/CoS bits (trust boundary)
- **Policing** — Enforce rate limit (drop/re-mark)
- **Shaping** — Smooth traffic to configured rate
- **Queuing** — Priority/bandwidth allocation during congestion

## Trust Boundary
- Mark at trust boundary: switch port for IP phone (trust CoS), access switch (trust DSCP)
- Beyond boundary: re-mark to zero (untrusted)

## Config Example (Cisco)
```cisco
class-map match-all VOICE
 match ip dscp ef
class-map match-all VIDEO
 match ip dscp af41
class-map match-all SIGNALING
 match ip dscp cs5

policy-map QOS-OUT
 class VOICE
  priority 1000
 class VIDEO
  bandwidth 5000
 class SIGNALING
  bandwidth 500
 class class-default
  fair-queue

interface GigabitEthernet0/0
 service-policy output QOS-OUT
```
