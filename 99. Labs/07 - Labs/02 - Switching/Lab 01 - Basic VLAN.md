---
type: lab
topic: Switching
difficulty: easy
platform: GNS3
devices: IOSvL2 x2, VPCS x2
status: not-started
---

# LAB 01 — Basic VLAN

## 🎯 Objective

Understand what a VLAN is, why it exists, and how to configure access ports on a switch — then prove that hosts in the same VLAN can communicate while hosts in different VLANs cannot.

## 🧠 Concepts

- [[VLAN]]
- [[Access Port]]
- [[Broadcast Domain]]

## 🗺️ Topology

```text
PC1          PC2          PC3          PC4
 |            |            |            |
 SW1          SW1          SW2          SW2
  (VLAN 10)   (VLAN 20)   (VLAN 10)   (VLAN 20)

 SW1 ———————————— SW2   (trunk — added in Lab 02)
```

For this lab: all four PCs connect to **SW1 only**.

## 📋 Devices

| Device | Type       | Role          |
| ------ | ---------- | ------------- |
| SW1    | Cisco IOSvL2 | Switch      |
| PC1    | VPCS       | Host (VLAN 10) |
| PC2    | VPCS       | Host (VLAN 20) |
| PC3    | VPCS       | Host (VLAN 10) |
| PC4    | VPCS       | Host (VLAN 20) |

## 🌐 IP Addressing

| Device | Interface | IP         | Mask         | VLAN | Gateway |
| ------ | --------- | ---------- | ------------ | ---- | ------- |
| PC1    | eth0      | 10.0.10.10 | 255.255.255.0 | 10   | —       |
| PC2    | eth0      | 10.0.20.20 | 255.255.255.0 | 20   | —       |
| PC3    | eth0      | 10.0.10.30 | 255.255.255.0 | 10   | —       |
| PC4    | eth0      | 10.0.20.40 | 255.255.255.0 | 20   | —       |

## 🔧 Requirements

* Create VLANs 10 (HOSTS) and 20 (SERVERS) on SW1
* Assign access ports to the correct VLANs
* Verify with `show vlan brief`
* Prove same-VLAN hosts can ping each other
* Prove different-VLAN hosts cannot ping each other

## 🛠️ Configuration

### SW1 — provided after your attempt

## 🔍 Verification

```cisco
show vlan brief
show interfaces status
```

## 🧪 Testing

* `ping 10.0.10.30` from PC1 → should succeed
* `ping 10.0.20.40` from PC2 → should succeed
* `ping 10.0.20.20` from PC1 → should FAIL
* Capture traffic in GNS3 to watch the ARP exchange

## 💥 Troubleshooting Challenge

Added by instructor after completion.

## 🧠 What I Learned

...

## ⚠️ Common Mistakes

...

## 💼 Real-World Application

...

## 🎯 Interview Questions

1. What is a VLAN and what problem does it solve?
2. What is an access port?
3. Why can't hosts in different VLANs communicate without a router?

## 📝 Key Takeaways

*
*
*

## 🔗 Related Concepts

* [[Trunk Port]]
* [[802.1Q]]
* [[Inter-VLAN Routing]]
