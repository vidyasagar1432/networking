# Legacy Protocols (AppleTalk, IPX/SPX, DECnet, X.25, Token Ring, etc.)

## AppleTalk
- Apple proprietary networking suite (1985–2009)
- **AppleTalk Phase 1 / Phase 2**
- Key protocols:
  - **AARP** (AppleTalk ARP)
  - **DDP** (Datagram Delivery Protocol) — Layer 3
  - **NBP** (Name Binding Protocol) — name resolution
  - **ATP** (AppleTalk Transaction Protocol)
  - **ZIP** (Zone Information Protocol)
- **Network range**: 1–65534 (node ID 1–253)
- **LocalTalk** — 230.4 Kbps (phone cable)
- Replaced by TCP/IP (Mac OS X dropped in 2009)

## IPX/SPX (Internetwork Packet Exchange / Sequenced Packet Exchange)
- **Novell NetWare** protocol suite (1980s–1990s)
- **IPX** — Connectionless (like IP), network:node format
- **SPX** — Connection-oriented (like TCP)
- **RIP** for IPX — distance-vector routing
- **NCP** (NetWare Core Protocol) — file/print services
- **SAP** (Service Advertising Protocol) — service discovery
- Replaced by TCP/IP (NetWare 5.0+ supported native IP)

## DECnet
- **Digital Equipment Corporation** networking suite
- **DECnet Phase IV** (1982): 16-bit area.node addressing
- **DECnet Phase V** (1991): OSI-based (CLNP, ES-IS, IS-IS — DECnet was IS-IS origin)
- Routing: IS-IS (used for DECnet before IP)
- Supported: Ethernet, HDLC, DDCMP
- Legacy — replaced by TCP/IP

## X.25
- **ITU-T** packet-switched WAN (1970s–1990s)
- Layer 2: LAPB (HDLC variant)
- Layer 3: X.25 PLP (Packet Layer Protocol)
- **PVC / SVC** — virtual circuits
- **Speeds**: Up to 64 Kbps (later 2 Mbps)
- Used for: banking (ATMs), retail (credit card), early Internet
- Replaced by: Frame Relay, ATM, MPLS, IP VPN

## Token Ring (IEEE 802.5)
- **IBM** LAN technology (1985) — competitor to Ethernet
- **Token passing** — deterministic access (no collisions)
- Speeds: 4 Mbps, 16 Mbps
- Topology: Physical star, logical ring (MAU — Multi-station Access Unit)
- **Active Monitor** — ring management
- **Beaconing** — fault detection
- Replaced by: Ethernet (10/100/1000 Mbps, lower cost)

## ARCNET (Attached Resource Computer NETwork)
- Datapoint Corp (1977) — LAN for office automation
- **Token passing** on bus/star topology
- Speeds: 2.5 Mbps (original), 20 Mbps (ARCnet Plus)
- Coaxial or twisted pair
- Simple, reliable — used in industrial/embedded systems (still! — ARCNET remains in some automation)

## LAT (Local Area Transport)
- **DEC** proprietary terminal server protocol (1980s)
- Connected terminals (RS-232) to DEC hosts
- Carried over Ethernet (terminal server to host)
- Replaced by: Telnet, SSH (TCP/IP)

## ISDN (Integrated Services Digital Network)
- **Digital** phone line — voice + data over single line
- **BRI** (Basic Rate): 2B+D = 2×64Kbps + 16Kbps (144 Kbps)
- **PRI** (Primary Rate): 23B+D (T1) or 30B+D (E1)
- **D channel** — signaling (Q.931), **B channels** — data
- Replaced by: DSL, cable, fiber

## Bluetooth
- **IEEE 802.15.1** — short-range wireless (10–100m)
- **PAN** (Personal Area Network)
- **Class**: 1 (100m), 2 (10m), 3 (1m)
- **BR/EDR** (Basic Rate / Enhanced Data Rate) — up to 3 Mbps
- **BLE** (Bluetooth Low Energy) — IoT, wearables, low power
- **Piconet** — master + up to 7 active slaves

## USB (Universal Serial Bus)
- Peripheral connection standard
- Versions: 1.0 (1.5 Mbps), 1.1 (12 Mbps), 2.0 (480 Mbps), 3.0 (5 Gbps), 3.1 (10 Gbps), 3.2 (20 Gbps), 4.0 (40 Gbps)
- Host ↔ Device (master/slave)
- Since USB 3.0: dual simplex (Separate TX/RX pairs)
- Type-A, Type-B, Type-C connectors (USB-C = USB4, PD, DP/Thunderbolt)

## RS-232 (Recommended Standard 232)
- **Serial communication** standard (1960)
- **DB9** connector (common), DB25 (original)
- Signals: TX, RX, RTS, CTS, DTR, DSR, DCD, RI, GND
- Speeds: 300–115200 bps (typical)
- Used: Console ports (Cisco switches/routers), modems, serial terminals
- **Full-duplex** (separate TX/RX), **asynchronous** (start/stop bits)

## SONET/SDH (Synchronous Optical Network / Synchronous Digital Hierarchy)
- **Optical** transport standard
- **SONET** (ANSI, North America), **SDH** (ITU, rest of world)
- Synchronous TDM — fixed time slots

### SONET Hierarchy
| SONET | SDH | Rate |
|---|---|---|
| OC-1 | — | 51.84 Mbps |
| OC-3 | STM-1 | 155.52 Mbps |
| OC-12 | STM-4 | 622.08 Mbps |
| OC-48 | STM-16 | 2.488 Gbps |
| OC-192 | STM-64 | 9.953 Gbps |
| OC-768 | STM-256 | 39.813 Gbps |

### SONET Structure
- **Section** → **Line** → **Path** (overhead layers)
- **BLSR** (Bi-directional Line Switched Ring) — protection
- **APS** (Automatic Protection Switching) — sub-50ms failover
- Replaced by: OTN (Optical Transport Network), DWDM, Ethernet
