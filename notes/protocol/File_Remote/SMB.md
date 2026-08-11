# SMB / CIFS / NFS / AFP

## Overview
- **File sharing** protocols for network storage access
- SMB (Windows/Samba), NFS (Unix/Linux), AFP (Apple)

## SMB (Server Message Block)
- File/print sharing protocol — dominant in Windows environments
- **SMBv1** (1980s) — legacy, insecure (WannaCry/EternalBlue)
- **SMBv2** (Vista/2008) — reduced chatter, better performance
- **SMBv3** (Win 8/2012) — encryption, SMB Direct (RDMA), Multichannel
- Port: **TCP 445** (direct), **TCP 139** (NetBIOS session)
- Also called **CIFS** (Common Internet File System) — SMBv1 dialect

### SMB Versions
| Version | OS | Features |
|---|---|---|
| SMB 1.0 | Windows NT/9x | Legacy, insecure, disable |
| SMB 2.0 | Vista/2008 | Compound requests, larger reads |
| SMB 2.1 | Win 7/2008 R2 | Large MTU, branch cache |
| SMB 3.0 | Win 8/2012 | Encryption, multichannel, RDMA |
| SMB 3.1.1 | Win 10/2016 | Pre-auth integrity, AES-128-GCM |

### SMB Security
- **SMB signing** — prevents MITM (enabled by default in SMBv3)
- **SMB encryption** — AES-128/256-GCM (SMBv3+)
- **SMB over QUIC** — SMB over UDP 443 (Windows Server 2022+)
- **Disable SMBv1** — `DisableSMB1.ps1`

## NFS (Network File System)
- File sharing protocol for **Unix/Linux**
- **NFSv2** (RFC 1094) — UDP only, stateless
- **NFSv3** (RFC 1813) — TCP, 64-bit files, async writes
- **NFSv4** (RFC 7530) — Stateful, ACLs, security (Kerberos), compound ops
- **NFSv4.1** (RFC 5661) — pNFS (parallel NFS), session trunking
- Port: **TCP 2049** (NFS), portmapper (TCP 111) for v3

### NFS Security
| Flavor | Description |
|---|---|
| **AUTH_SYS** | Unix UID/GID (no crypto, spoofable) |
| **AUTH_KRB5** | Kerberos authentication |
| **AUTH_KRB5i** | Kerberos + integrity |
| **AUTH_KRB5p** | Kerberos + privacy (encryption) |

### NFS Export Options
```bash
# /etc/exports
/data 192.168.1.0/24(rw,async,no_subtree_check)
/data2 *.example.com(ro,root_squash)
```

## AFP (Apple Filing Protocol)
- Apple's file sharing protocol (pre-SMB)
- **AFP over TCP** (port 548)
- **Legacy** — macOS now prefers SMB
- **AFP vs SMB**: AFP supports Time Machine, Spotlight, macOS-specific metadata
- Replaced by SMB in macOS 10.9+ (Server disables AFP by default)

## Comparison
| Feature | SMB | NFS | AFP |
|---|---|---|---|
| Platform | Windows (cross: Samba) | Unix/Linux | Apple (legacy) |
| Port | TCP 445 | TCP 2049 | TCP 548 |
| Stateful | SMBv3+ | NFSv4+ | Yes |
| Encryption | Native (SMBv3) | Kerberos (krb5p) | No |
| Performance | Good | Excellent (Linux) | Adequate |
