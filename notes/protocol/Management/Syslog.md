# Syslog

## Overview
- Standard for **log message** generation, transmission, and storage
- Defined in **RFC 5424** (syslog protocol), **RFC 3164** (BSD syslog, legacy)
- Typically uses **UDP port 514** (some support TCP 514, TLS 6514)

## Syslog Severity Levels
| Level | Code | Keyword | Description |
|---|---|---|---|
| 0 | Emergency | emerg | System unusable |
| 1 | Alert | alert | Immediate action required |
| 2 | Critical | crit | Critical condition |
| 3 | Error | err | Error condition |
| 4 | Warning | warning | Warning condition |
| 5 | Notice | notice | Normal but significant |
| 6 | Informational | info | Informational message |
| 7 | Debug | debug | Debug-level messages |

## Syslog Facilities (RFC 5424)
| Code | Facility | Code | Facility |
|---|---|---|---|
| 0 | kern | 16 | local0 |
| 1 | user | 17 | local1 |
| 2 | mail | 18 | local2 |
| 3 | daemon | 19 | local3 |
| 4 | auth | 20 | local4 |
| 5 | syslog | 21 | local5 |
| 6 | lpr | 22 | local6 |
| 7 | news | 23 | local7 |
| 8 | uucp | — | — |

## Message Format (RFC 5424)
```
<priority>version timestamp hostname app-name proc-id msg-id structured-data msg
```
Example:
```
<14>1 2024-01-15T10:30:00Z router1 kernel - - - interface Gig0/1 up
```

## Message Format (RFC 3164 — legacy)
```
<priority>timestamp hostname message
```
- **Priority** = Facility × 8 + Severity

## Syslog on Cisco
```cisco
! Log to buffer
logging buffered 4096 warnings

! Log to console (default: debugging)
logging console warnings

! Log to monitor (SSH/Telnet)
logging monitor warnings

! Remote syslog server
logging host 192.168.1.100
logging trap warnings           # Severity level to send
logging source-interface Loopback0

! Timestamps
service timestamps log datetime msec
```

## Common Commands
```bash
show logging                    # View log buffer & config
show log                        # Also works on IOS
terminal monitor                # View debug/log on vty session
clear logging                   # Clear buffer

# Linux syslog
tail -f /var/log/syslog
tail -f /var/log/messages
journalctl -f                   # Systemd journal
logger "Test message"           # Send syslog manually
logger -p local0.info "Test"
```
