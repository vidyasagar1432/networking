# RDP / VNC

## Overview
- **Remote desktop** protocols — control a computer remotely
- **RDP** (Remote Desktop Protocol) — Microsoft (TCP 3389)
- **VNC** (Virtual Network Computing) — Open standard (TCP 5900+)

## RDP (Remote Desktop Protocol)
- **Microsoft proprietary** — Windows remote desktop
- Port: **TCP 3389** (default)
- Based on **T.128** (ITU-T) — 2D graphics, audio, USB, clipboard, printer redirection

### RDP Features
| Feature | Description |
|---|---|
| **RemoteFX** | GPU virtualization, rich graphics |
| **Network Level Authentication (NLA)** | Pre-auth before session (CredSSP) |
| **Gateway** | RDP over HTTPS (TCP 443) |
| **Multimonitor** | Up to 16 monitors |
| **Clipboard** | Shared clipboard (text, files) |
| **Audio** | Playback + recording redirection |
| **Printer** | Redirect local printer to remote |

### RDP Security
- **NLA** — authenticate before session (blocks DoS)
- **TLS** — RDP over TLS (certificate-based encryption)
- **CredSSP** — NLA protocol (vulnerable to CVE-2018-0886 before patch)
- **BlueKeep** (CVE-2019-0708) — RDP RCE, pre-auth, wormable (patch KB4499175)
- Best practice: **RDP Gateway** or **VPN** instead of exposing RDP to Internet

## VNC (Virtual Network Computing)
- **Open standard** — remote framebuffer (RFB) protocol
- Port: **TCP 5900+N** (display :0 = 5900, :1 = 5901)
- **Client → Server**: Keyboard, mouse events
- **Server → Client**: Framebuffer updates (pixels)

### VNC Security
- **Plain VNC** — no encryption (password only, limited attempts)
- **VNC over SSH tunnel** — encrypted via SSH port forwarding
- **VNC over TLS** — VeNCrypt, TigerVNC with TLS
- **UltraVNC / TightVNC** — add encryption (MSLogon, DSM plugins)

### VNC vs RDP
| Feature | RDP | VNC |
|---|---|---|
| Protocol | Proprietary (Microsoft) | Open (RFB) |
| Port | TCP 3389 | TCP 5900+ |
| Graphics | Optimized (2D/3D) | Framebuffer (all pixels) |
| Bandwidth | Lower (optimized) | Higher (full image) |
| Authentication | NLA + TLS | Password (or none) |
| Session | Per-user (switch) | Share desktop (same screen) |
| Platform | Windows native | Cross-platform |
| Encryption | TLS (built-in) | Tunnel (SSH/TLS) |

## Config
### RDP (Windows)
- System Properties → Remote → Enable Remote Desktop
- `net start TermService`
- RDP Gateway: Configure via RD Gateway Manager

### VNC
```bash
# Start VNC server
vncserver :1 -geometry 1920x1080 -depth 24

# SSH tunnel
ssh -L 5901:localhost:5901 user@remote
# Connect to localhost:5901
```

## Security Best Practices
- **Never expose RDP/VNC directly to the Internet**
- Use **VPN** (WireGuard, OpenVPN) or **RDP Gateway**
- Enable **NLA** (RDP)
- Use **strong passwords** or **certificate auth**
- Change default ports (security through obscurity)
- **Account lockout** policies to prevent brute force
