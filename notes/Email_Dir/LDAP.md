# LDAP (Lightweight Directory Access Protocol)

## Overview
- Protocol for accessing and maintaining **directory services** (X.500-based)
- Defined in **RFC 4511** (LDAPv3)
- Used for: authentication (users), authorization (group membership), contact info
- Uses **TCP 389** (plain) or **636** (LDAPS)

## Directory Structure (DIT)
```
dc=example,dc=com
├── ou=People
│   ├── cn=Alice Smith
│   └── cn=Bob Jones
├── ou=Groups
│   ├── cn=Admins
│   └── cn=Users
└── ou=Servers
    └── cn=Web1
```

## Key Terms
| Term | Description |
|---|---|
| **DN** (Distinguished Name) | Full path to entry (cn=Alice Smith,ou=People,dc=example,dc=com) |
| **RDN** (Relative DN) | Entry within parent (cn=Alice Smith) |
| **DC** (Domain Component) | DNS domain part (dc=example, dc=com) |
| **OU** (Organizational Unit) | Container for entries |
| **CN** (Common Name) | User/device name |
| **SN** (Surname) | Last name |
| **UID** | User ID |

## Operations
| Operation | Description |
|---|---|
| **BIND** | Authenticate (simple user/pass or SASL) |
| **SEARCH** | Query directory |
| **COMPARE** | Assertion (is value equal?) |
| **ADD** | Add new entry |
| **DELETE** | Remove entry |
| **MODIFY** | Change attributes |
| **MODDN** | Rename/move entry |
| **UNBIND** | Close connection |
| **ABANDON** | Cancel operation |

## Search
- **Base DN** — Where to start searching
- **Scope** — Base (entry only), One (immediate children), Sub (entire subtree)
- **Filter** — `(&(objectClass=person)(uid=alice))`
- **Attributes** — Which attributes to return

## Authentication
- **Simple BIND** — DN + password (plaintext — avoid without TLS)
- **SASL** (Simple Auth and Security Layer) — DIGEST-MD5, GSSAPI (Kerberos), EXTERNAL (cert)

## LDAP vs Active Directory
| Feature | LDAP | Active Directory |
|---|---|---|
| Type | Protocol | Directory service (Microsoft) |
| Schema | Flexible | Fixed (objectClass, attributes) |
| Authentication | BIND | Kerberos + LDAP |
| Replication | Varies | Multi-master (DRA) |
| Extras | Open source | GPO, DNS, Certificate Services |

## OpenLDAP vs AD
- **OpenLDAP** — Open source directory
- **Active Directory** — Microsoft directory (uses LDAP, Kerberos, DNS)

## Security
- **LDAPS** — LDAP over TLS (TCP 636)
- **STARTTLS** — Upgrade from port 389
- Always use TLS for credentials

## LDAP URLs
```
ldap://ldap.example.com:389/dc=example,dc=com?cn,mail?sub?(uid=alice)
```
Format: `ldap://host:port/base_dn?attributes?scope?filter`

## Common Commands
```bash
ldapsearch -x -H ldap://ldap.example.com -b dc=example,dc=com "(uid=alice)"
ldapadd -x -H ldap://localhost -D "cn=admin,dc=example,dc=com" -W -f user.ldif
ldapmodify -x -H ldap://localhost -D "cn=admin,dc=example,dc=com" -W -f change.ldif
```
