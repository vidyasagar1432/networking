# HTTP (Hypertext Transfer Protocol)

## Overview
- Foundation of data communication on the Web
- Defined in **RFC 2616** (HTTP/1.1), **RFC 7540** (HTTP/2), **RFC 9114** (HTTP/3)
- **Client-server** protocol — request/response
- Uses **TCP port 80** (HTTP/1.1, HTTP/2), **UDP port 443** (HTTP/3 — QUIC)
- Stateless — each request is independent

## HTTP Methods
| Method | Purpose | Idempotent | Safe |
|---|---|---|---|
| **GET** | Retrieve resource | Yes | Yes |
| **HEAD** | Same as GET but no body | Yes | Yes |
| **POST** | Create/submit data | No | No |
| **PUT** | Replace/update resource | Yes | No |
| **PATCH** | Partial update | No | No |
| **DELETE** | Delete resource | Yes | No |
| **OPTIONS** | Supported methods | Yes | Yes |
| **TRACE** | Diagnostic loopback | Yes | Yes |
| **CONNECT** | Tunnel (HTTPS proxy) | No | No |

## HTTP Status Codes
| Range | Category | Examples |
|---|---|---|
| **1xx** | Informational | 100 Continue, 101 Switching Protocols |
| **2xx** | Success | 200 OK, 201 Created, 204 No Content |
| **3xx** | Redirection | 301 Moved Permanently, 302 Found, 304 Not Modified |
| **4xx** | Client Error | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 405 Method Not Allowed |
| **5xx** | Server Error | 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout |

## HTTP/1.1 Key Features
- **Persistent connections** — Keep-Alive (reuse TCP connection)
- **Pipelining** — Multiple requests without waiting for responses (rarely used)
- **Chunked transfer encoding** — Stream data without Content-Length
- **Host header** — Required (virtual hosting)
- **Conditional requests** — If-Modified-Since, ETag

## HTTP/2 Key Features
- **Binary protocol** (vs HTTP/1.1 text)
- **Multiplexing** — Multiple streams over single TCP connection
- **Header compression** — HPACK (reduces overhead)
- **Server push** — Server sends resources proactively
- **Stream prioritization**

## HTTP/3 Key Features
- Uses **QUIC** (UDP-based transport, RFC 9000)
- Eliminates TCP head-of-line blocking
- Zero-RTT connection establishment
- Connection migration (survives IP changes)

## Headers
```http
# Request headers
Host: example.com
User-Agent: Mozilla/5.0
Accept: text/html
Authorization: Basic dXNlcjpwYXNz
Cookie: session=abc123

# Response headers
Content-Type: text/html; charset=utf-8
Content-Length: 1234
Cache-Control: max-age=3600
Set-Cookie: session=abc123; HttpOnly; Secure
Location: /new-page
```

## Common Commands
```bash
curl http://example.com
curl -X POST -d "key=value" http://example.com/api
curl -I http://example.com          # Headers only
curl -v http://example.com          # Verbose (full HTTP exchange)
curl -o file.html http://example.com

wget http://example.com/file.zip
```
