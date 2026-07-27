# TFTP (Trivial File Transfer Protocol)

## Overview
- Simple, lightweight file transfer protocol
- Defined in **RFC 1350**
- Uses **UDP port 69**
- No authentication, no directory listing, no encryption

## Characteristics
- **Connectionless** (UDP-based)
- **No authentication** — anyone can read/write if permitted
- **No error checking** beyond UDP checksum
- **Lock-step** — send one block, wait for ACK, send next
- **Read/Write requests**: RRQ (read), WRQ (write)
- **Fixed block size**: 512 bytes (last block < 512 = end of file)
- **"Sorcerer's Apprentice" bug** — duplicate ACK causes infinite retransmission (fixed by RFC 2347)

## TFTP Packet Types
| Opcode | Type | Purpose |
|---|---|---|
| 1 | RRQ | Read request |
| 2 | WRQ | Write request |
| 3 | DATA | Data block |
| 4 | ACK | Acknowledgment |
| 5 | ERROR | Error |

## Use Cases
- **Network device boot** — Cisco switches/routers load IOS via TFTP
- **Configuration backup/restore** — `copy running-config tftp:`
- **PXE boot** — Preboot Execution Environment (firmware/bootloader)
- **Firmware upgrades** — Embedded devices

## Limitations
- Max file size: 32 MB (no, practically limited by block number field — 65535 × 512 = ~32 MB)
- No directory listing
- No authentication or encryption
- Slow over high-latency links (lock-step ACK)
- No flow control or congestion control

## Security
- **No authentication** — anyone can read/write
- Should be restricted via ACLs, firewall rules, or directory permissions
- Use only on isolated management networks

## Common Commands
```bash
tftp 10.0.0.1
> get ios-image.bin
> put config.txt
> quit

# Direct from command line
tftp 10.0.0.1 -c get ios-image.bin
tftp 10.0.0.1 -c put running-config

# Cisco
copy tftp: flash:
copy running-config tftp:
```
