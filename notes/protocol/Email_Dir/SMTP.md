# SMTP (Simple Mail Transfer Protocol)

## Overview
- Email **transfer** protocol (server-to-server, client-to-server)
- Defined in **RFC 5321** (obsoletes RFC 2821, RFC 821)
- Uses **TCP 25** (SMTP), **587** (Submission), **465** (SMTPS)
- Text-based protocol — commands + response codes

## Commands
| Command | Description |
|---|---|
| **HELO** | Identify client (plain) |
| **EHLO** | Identify client (ESMTP — extended) |
| **MAIL FROM** | Sender address |
| **RCPT TO** | Recipient address |
| **DATA** | Message body (ends with .) |
| **RSET** | Reset session |
| **VRFY** | Verify address (often disabled) |
| **NOOP** | No operation |
| **QUIT** | Disconnect |
| **STARTTLS** | Upgrade to TLS |

## Response Codes
| Code | Meaning |
|---|---|
| 220 | Service ready |
| 250 | OK |
| 354 | Start mail input (after DATA) |
| 421 | Service not available |
| 450 | Mailbox unavailable |
| 550 | Mailbox not found |
| 554 | Transaction failed |

## SMTP Flow
```
Client → Server: 220 smtp.example.com ESMTP
Client → Server: EHLO client.example.com
Server → Client: 250-smtp.example.com (capabilities)
Client → Server: MAIL FROM:<alice@example.com>
Server → Client: 250 OK
Client → Server: RCPT TO:<bob@other.com>
Server → Client: 250 OK
Client → Server: DATA
Server → Client: 354 Start mail input
Client → Server: (message body, ends with .)
Server → Client: 250 OK: queued
Client → Server: QUIT
Server → Client: 221 Bye
```

## MIME (Multipurpose Internet Mail Extensions)
- Extends SMTP for: attachments, non-ASCII text, images, rich media
- Headers: `Content-Type`, `Content-Transfer-Encoding`, `MIME-Version`
- Encoding: **Base64** (binary → ASCII)

## SMTP vs POP3 vs IMAP
| Protocol | Function | Port |
|---|---|---|
| **SMTP** | Send (push) | 25/587/465 |
| **POP3** | Receive (pull, download) | 110/995 |
| **IMAP** | Receive (pull, server-based) | 143/993 |

## Mail Flow
```
MUA (Client) → SMTP (587) → MSA → MTA → SMTP (25) → MTA → MDA → POP3/IMAP → MUA
```

## Security
- **SPF** (Sender Policy Framework) — TXT record listing authorized sending servers
- **DKIM** (DomainKeys Identified Mail) — Cryptographic signature
- **DMARC** (Domain-based Message Authentication) — Policy for SPF/DKIM failure
- **STARTTLS** — Upgrade plain connection to TLS

## ESMTP (Extended SMTP)
- EHLO instead of HELO
- Server advertises capabilities (PIPELINING, SIZE, STARTTLS, 8BITMIME, DSN)

## Testing
```bash
openssl s_client -connect smtp.gmail.com:587 -starttls smtp
ncat -C 192.168.1.1 25
telnet 192.168.1.1 25
> HELO test
> MAIL FROM:<alice@example.com>
> RCPT TO:<bob@example.com>
> DATA
> Subject: Test
> Hello!
> .
> QUIT
```
