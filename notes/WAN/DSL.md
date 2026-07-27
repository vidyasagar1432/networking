# DSL (Digital Subscriber Line)

## Overview
- Broadband over **telephone lines** (copper POTS)
- Simultaneous voice + data (frequency division)
- Uses existing phone infrastructure (last-mile)

## DSL Types
| Type | Speed (Down) | Speed (Up) | Description |
|---|---|---|---|
| **ADSL** | Up to 8 Mbps | Up to 1 Mbps | Asymmetric (consumer) |
| **ADSL2+** | Up to 24 Mbps | Up to 3.5 Mbps | Enhanced ADSL |
| **VDSL** | Up to 52 Mbps | Up to 16 Mbps | Very high bitrate |
| **VDSL2** | Up to 100/100 Mbps | Symmetric | Profile 35b (vectoring) |
| **G.fast** | Up to 1 Gbps | ~ | Short loop (250m) |
| **SDSL** | 1.5 Mbps | 1.5 Mbps | Symmetric (business) |
| **HDSL** | 1.5–2 Mbps | 1.5–2 Mbps | T1/E1 replacement |

## Frequency Bands
```
Voice: 0–4 kHz
Upstream: 25–138 kHz
Downstream: 138 kHz–1.1 MHz (ADSL)
```
- **Splitter** — separates voice (low) from data (high)

## Modulation
- **DMT** (Discrete Multi-Tone) — divides spectrum into 256 sub-channels (4.3125 kHz each)
- Each sub-channel modulated with QAM (Quadrature Amplitude Modulation)
- Sub-channels with noise: fewer bits; clean channels: more bits

## Key Factors
| Factor | Impact |
|---|---|
| **Distance** | Shorter loop = higher speed |
| **Wire gauge** | Thicker = better |
| **Bridge taps** | Dead branches = interference |
| **Crosstalk** | Nearby pairs = noise |
| **Load coils** | Voice-only coils = no DSL |

## Attenuation by Distance (ADSL)
| Distance | Max Speed |
|---|---|
| 0–1 km | 24 Mbps (ADSL2+) |
| 1–2 km | 12 Mbps |
| 2–3 km | 6 Mbps |
| 3–4 km | 3 Mbps |
| 4–5 km | 1.5 Mbps |
| >5 km | Unlikely to sync |

## DSL vs Cable vs Fiber
| Feature | DSL | Cable (DOCSIS) | Fiber |
|---|---|---|---|
| Medium | Copper phone | Coaxial | Optical |
| Dedicated | Yes (per line) | Shared (node) | Yes (per home) |
| Speed | 1–100 Mbps | 10–1000 Mbps | 100–10000 Mbps |
| Distance limit | ~5 km | ~100 km | ~40+ km |
| Symmetry | Mostly asymmetric | Mostly asymmetric | Symmetric |

## DSLAM (DSL Access Multiplexer)
- Located in **central office** (CO) or street cabinet
- Aggregates multiple DSL lines → uplink (fiber/Ethernet)
- Cards for ADSL, VDSL, G.fast

## PPPoE / PPPoA
- DSL often uses **PPPoE** (Ethernet) or **PPPoA** (ATM) for authentication
- ISP provides username/password → authenticated via PAP/CHAP
