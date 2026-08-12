---
type: concept
category: Switching
difficulty: easy
---

# VLAN

## 📌 Definition

A Virtual Local Area Network — a logical segmentation of a switch into multiple separate broadcast domains.

## 🤔 Why Does It Exist?

A flat network means every broadcast (ARP, DHCP) is seen by every device. That wastes bandwidth, hurts security, and limits troubleshooting. VLANs split one physical switch into several logical networks.

## 🧠 How It Works

Each switch port is assigned to a VLAN (usually via an [[Access Port]]). Frames are only forwarded to ports in the same VLAN. Different VLANs are separate broadcast domains — traffic between them requires a router ([[Inter-VLAN Routing]]).

## 📦 Packet/Frame Behavior

* Host sends an ARP broadcast
* Switch forwards it only to ports in the same VLAN
* Frames in different VLANs never see each other (on the same switch)

## 🗺️ Example

```text
PC1 (VLAN 10)
 |
 SW1 — VLAN 10 ports: Gi0/0, Gi0/1
```

## 🔧 Cisco Configuration

```cisco
vlan 10
 name HOSTS
```

## 🔍 Verification

```cisco
show vlan brief
```

## 🧪 GNS3 Lab

* [[Lab 01 - Basic VLAN]]
* [[Lab 02 - VLAN Trunking]]

## ⚠️ Common Mistakes

* Forgetting `switchport access vlan X` (port stays in VLAN 1)
* Putting the wrong port in the wrong VLAN
* Assuming different VLANs can talk without a router

## 🐛 Troubleshooting

### Symptom

Hosts on different VLANs can't ping each other (expected) / same VLAN can't ping (not expected).

### Possible Causes

Port in wrong VLAN, interface shutdown, wrong IP/subnet, VLAN deleted

### Commands

```cisco
show vlan brief
show interfaces status
```

## 💼 Real-World Usage

Separate departments (HR, Finance, IT), isolate guest Wi-Fi, separate management traffic from user traffic.

## 🎯 CCNA Exam Notes

* VLAN 1 = default, cannot be renamed/deleted
* 1005 reserved VLANs; configurable range 2–1001 (or 1006–4094 on IOSvL2)
* VLANs must exist before access ports work properly

## 🎯 CCNP Notes

* VLANs + [[VTP]], private VLANs, switchport voice VLANs
* 802.1Q on [[Trunk Port]]s between switches

## 💬 Interview Questions

1. What is a VLAN and why use it?
2. Can two hosts in different VLANs communicate through a switch alone? Why?
3. What happens to a broadcast frame in VLAN 10?

## 🔗 Related Concepts

* [[Broadcast Domain]]
* [[Access Port]]
* [[Trunk Port]]
* [[802.1Q]]
* [[Inter-VLAN Routing]]
