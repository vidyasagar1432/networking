# OAuth 2.0 / OpenID Connect / SAML

## Overview
- **OAuth 2.0** (RFC 6749) — Authorization framework (delegated access)
- **OpenID Connect (OIDC)** — Authentication layer on top of OAuth 2.0
- **SAML** (Security Assertion Markup Language) — SSO for enterprise (XML-based)

## OAuth 2.0 Roles
| Role | Description |
|---|---|
| **Resource Owner** | User who authorizes access |
| **Client** | Application requesting access |
| **Authorization Server** | Issues tokens |
| **Resource Server** | API serving protected data |

## OAuth 2.0 Grant Types
| Grant | Use Case |
|---|---|
| **Authorization Code** | Web apps (server-side) — most common |
| **Implicit** | SPAs (deprecated, use PKCE) |
| **Resource Owner Password** | Legacy / trusted apps (deprecated) |
| **Client Credentials** | Machine-to-machine (no user) |
| **Device Code** | IoT, smart TVs |
| **Refresh Token** | Get new access token without re-auth |

### Authorization Code Flow
```
1. Browser → Client: Click "Login with Google"
2. Client → Auth Server: ?response_type=code&client_id=...&redirect_uri=
3. Auth Server → User: Login + consent
4. Auth Server → Browser: redirect_uri?code=AUTH_CODE
5. Browser → Client: code=AUTH_CODE
6. Client → Auth Server: POST ?code=AUTH_CODE&client_secret=...
7. Auth Server → Client: { access_token, refresh_token, id_token }
8. Client → API: Authorization: Bearer {access_token}
```

## Tokens
| Token | Format | Description |
|---|---|---|
| **Access Token** | Opaque or JWT | Authorizes API access (short-lived, ~1h) |
| **Refresh Token** | Opaque | Gets new access token (long-lived) |
| **ID Token** | JWT (OIDC) | User identity (claims: sub, name, email) |

## JWT (JSON Web Token — RFC 7519)
- Base64url-encoded JSON: header.payload.signature
```
eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.signature
```
- **Signed** (JWS) and/or **Encrypted** (JWE)
- Common claims: sub, iss, aud, exp, iat, scope

## OpenID Connect (OIDC)
- Authentication layer on top of OAuth 2.0
- **ID Token** (JWT) contains user identity
- **UserInfo endpoint** — fetch additional claims
- **Discovery** — `/.well-known/openid-configuration`

### OIDC Scopes
| Scope | Access |
|---|---|
| `openid` | Required — indicates OIDC request |
| `profile` | Name, picture, etc. |
| `email` | Email address |
| `offline_access` | Refresh token |

## SAML (Security Assertion Markup Language)
- **XML-based** SSO protocol
- **Identity Provider (IdP)** — authenticates user (Okta, ADFS, Azure AD)
- **Service Provider (SP)** — provides service (app)
- **Assertion** — XML document (user attributes, auth statement)
- **Binding**: HTTP Redirect (GET), HTTP POST, artifact

### SAML Flow
```
1. User → SP: Access app
2. SP → IdP: AuthnRequest (SAML request, redirect user)
3. IdP → User: Login
4. IdP → SP: SAML Response (POST) — signed XML assertion
5. SP → User: Allow access
```

### OAuth vs SAML
| Feature | OAuth 2.0 / OIDC | SAML |
|---|---|---|
| Message format | JSON (JWT) | XML |
| Transport | HTTP/REST | HTTP Redirect/POST/Artifact |
| Use case | API authorization, SSO | Enterprise SSO |
| Mobile-friendly | Yes | Poor |
| Token format | JWT (compact) | XML (verbose) |
