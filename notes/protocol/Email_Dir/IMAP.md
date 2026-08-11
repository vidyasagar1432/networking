# IMAP (Internet Message Access Protocol)

## Overview
- Email **retrieval** protocol — messages stay on server
- Defined in **RFC 9051** (IMAP4rev2, obsoletes RFC 3501)
- **Server-based** — access from multiple devices, folders, flags
- Uses **TCP 143** (plain) or **993** (IMAPS)

## IMAP vs POP3
| Feature | IMAP | POP3 |
|---|---|---|
| Message location | Server (synced) | Client (downloaded) |
| Multiple devices | Yes | Limited |
| Folders | Yes | No (INBOX only) |
| Partial fetch | Yes (headers, parts) | No (full message) |
| Search | Server-side | Client-side |
| Flags (read, replied) | Yes (syncs) | No |
| Port | 143/993 | 110/995 |

## IMAP States
```
Not Authenticated → Authenticated → Selected → Logout
```
- **Not Authenticated** — Waiting for login
- **Authenticated** — Logged in, no mailbox selected
- **Selected** — Mailbox selected (message operations)
- **Logout** — Connection closed

## Key Commands
| Command | Description |
|---|---|
| **LOGIN** | Authenticate |
| **SELECT** | Open mailbox (INBOX) |
| **EXAMINE** | Open mailbox read-only |
| **FETCH** | Retrieve message data |
| **STORE** | Modify flags (+FLAGS, -FLAGS) |
| **SEARCH** | Search messages on server |
| **COPY** | Copy message to another mailbox |
| **MOVE** | Move message (RFC 6851) |
| **DELETE** | Flag for deletion (via EXPUNGE) |
| **EXPUNGE** | Permanently remove deleted |
| **CREATE** | Create mailbox |
| **LIST** | List mailboxes |
| **LOGOUT** | Disconnect |
| **CAPABILITY** | Server capabilities |
| **IDLE** | Push notifications (no polling) |

## IMAP IDs
- **UID** — Unique ID (persists across sessions)
- **Message Sequence Number** — 1-based, changes on expunge
- Commands use UID or sequence number

## Flags
| Flag | Description |
|---|---|
| \Seen | Read |
| \Answered | Replied |
| \Flagged | Starred |
| \Deleted | Marked for deletion |
| \Draft | Draft |
| \Recent | New since last SELECT (deprecated) |

## IDLE Command
- Server pushes new message notifications
- Client stays connected, receives real-time updates
- No polling required

## IMAP over TLS
- **IMAPS** — TCP 993 (implicit TLS)
- **STARTTLS** — Upgrade from 143

## Testing
```bash
openssl s_client -connect imap.gmail.com:993
> a1 LOGIN user password
> a2 SELECT INBOX
> a3 FETCH 1:10 BODY[HEADER]
> a4 LOGOUT
```
