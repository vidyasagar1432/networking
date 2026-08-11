# FTP (File Transfer Protocol)

## Overview
- Transfers files between client and server
- Defined in **RFC 959**
- Uses **TCP ports 20 (data)** and **21 (control)**
- Supports authentication (plaintext) and anonymous access

## Modes
### Active Mode
1. Client connects to server TCP 21 (control)
2. Client sends PORT command with IP + ephemeral port
3. Server connects **back** to client from TCP 20 to client's ephemeral port
- **Problem**: Client behind firewall/NAT — server can't initiate connection

### Passive Mode (PASV)
1. Client connects to server TCP 21 (control)
2. Client sends PASV → server responds with IP + ephemeral port
3. Client connects to server's ephemeral port (data)
- **Preferred** for modern networks (client-initiated)

## FTP Commands
| Command | Purpose |
|---|---|
| USER | Username |
| PASS | Password |
| PORT | Active mode address |
| PASV | Switch to passive |
| RETR | Download file |
| STOR | Upload file |
| DELE | Delete file |
| LIST | List directory |
| CWD | Change directory |
| PWD | Print working directory |
| QUIT | Disconnect |

## Response Codes
| Code | Meaning |
|---|---|
| 125 | Data connection open |
| 150 | File status OK |
| 200 | Command OK |
| 220 | Service ready |
| 230 | User logged in |
| 331 | Username OK, need password |
| 425 | Can't open data connection |
| 426 | Connection closed |
| 450 | File unavailable |
| 500 | Syntax error |

## Security
- **Plaintext** authentication (username/password in clear)
- Use **FTPS** (FTP over TLS/SSL, RFC 4217) or **SFTP** (SSH File Transfer) instead
- **Anonymous FTP** allows login as `anonymous` with email as password

## Active vs Passive
| Feature | Active | Passive |
|---|---|---|
| Data connection | Server → Client | Client → Server |
| NAT-friendly | No | Yes |
| Firewall-friendly | No | Yes |
| Default in some clients | Legacy | Modern |

## Common Commands
```bash
ftp ftp.example.com
> user username
> password
> get file.txt
> put file.txt
> passive              # Toggle passive mode
> quit

wget ftp://user:pass@example.com/file.txt
curl ftp://ftp.example.com/file.txt --user user:pass
```
