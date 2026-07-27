# POP3 (Post Office Protocol v3)

## Overview
- Email **retrieval** protocol — downloads emails to client
- Defined in **RFC 1939**
- **Download-and-delete** model (by default) — emails removed from server
- Uses **TCP 110** (plain) or **995** (POP3S)

## Commands
| Command | Description |
|---|---|
| **USER** | Username |
| **PASS** | Password |
| **STAT** | Number & size of messages |
| **LIST** | Message sizes |
| **RETR** | Retrieve message by number |
| **DELE** | Delete message by number |
| **NOOP** | No operation |
| **RSET** | Undo DELE marks |
| **QUIT** | Apply changes & disconnect |
| **CAPA** | Capabilities (optional) |
| **UIDL** | Unique ID listing |
| **TOP** | Retrieve headers + N lines |

## POP3 vs IMAP
| Feature | POP3 | IMAP |
|---|---|---|
| Storage | Client (downloaded) | Server (kept) |
| Multiple devices | No (download+delete) | Yes (server-based) |
| Offline access | Yes (full download) | Partial (headers/cached) |
| Server folders | No | Yes |
| Search | Client-side | Server-side |
| Port | 110/995 | 143/993 |

## POP3 with keep
- `POP3 with keep` — downloads but leaves copy on server (configured in client)
- Not as efficient as IMAP for multi-device access

## Authentication
- **USER/PASS** — Plaintext (avoid without TLS)
- **APOP** — MD5-based challenge/response
- **AUTH** — SASL (CRAM-MD5, PLAIN, LOGIN) over TLS recommended

## Security
- **POP3S** (POP3 over TLS) — TCP 995
- **STLS** — STARTTLS-like upgrade from plain 110
- Always use TLS — passwords and emails are sent in plain otherwise

## Testing
```bash
openssl s_client -connect pop.gmail.com:995
```
