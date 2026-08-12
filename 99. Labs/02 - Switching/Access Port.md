---
type: concept
category: Switching
difficulty: easy
---

# Access Port

## 📌 Definition

A switch port that carries traffic for **one VLAN only** (untagged). It connects to end devices: PCs, printers, IP phones, servers.

## 🤔 Why Does It Exist?

End devices don't understand VLAN tags. The access port marks the device's VLAN membership for the switch, so the switch knows which VLAN to treat that traffic as belonging to.

## 🧠 How It Works

The port is assigned a VLAN with `switchport access vlan X`. Incoming untagged frames are assumed to belong to VLAN X. Outgoing frames are sent untagged — the PC never sees a VLAN tag.

## 📦 Packet/Frame Behavior

* PC sends untagged frame → switch assigns it to the access port's VLAN
* Switch forwards within that VLAN only
* Frame leaves the access port untagged

## 🔧 Cisco Configuration

```cisco
interface GigabitEthernet0/0
 switchport mode access
 switchport access vlan 10
```

## 🔍 Verification

```cisco
show interfaces status
show run interface GigabitEthernet0/0
```

## ⚠️ Common Mistakes

* `switchport mode access` missing → port stays dynamic/trunk-capable
* VLAN not created yet → port shows inactive

## 🐛 Troubleshooting

### Symptom

PC can't reach anything; `show vlan brief` shows port in wrong VLAN.

### Possible Causes

Wrong access VLAN assignment, interface shutdown, VLAN deleted

### Commands

```cisco
show vlan brief
show interfaces status
```

## 🔗 Related Concepts

* [[VLAN]]
* [[Trunk Port]]
* [[802.1Q]]
