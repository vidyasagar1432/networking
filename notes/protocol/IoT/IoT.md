# IoT Protocols (MQTT, AMQP, XMPP, CoAP)

## Overview
- Lightweight messaging protocols for constrained devices (IoT)
- Designed for: low bandwidth, low power, unreliable networks

## MQTT (Message Queuing Telemetry Transport)
- **Pub/Sub** model — publish/subscribe with broker
- Defined in **OASIS MQTT 3.1.1** / **5.0** (ISO 20922)
- TCP 1883 (plain), TCP 8883 (TLS)
- Minimal overhead (2-byte header minimum)

### MQTT Components
| Component | Role |
|---|---|
| **Publisher** | Sends messages to topics |
| **Subscriber** | Receives messages from topics |
| **Broker** | Routes messages (Mosquitto, HiveMQ, EMQX) |
| **Topic** | Hierarchical string (sensor/temperature/room1) |

### MQTT QoS Levels
| Level | Description |
|---|---|
| **0** | At most once (fire-and-forget) |
| **1** | At least once (ACK required, may duplicate) |
| **2** | Exactly once (4-step handshake, guaranteed) |

### MQTT Packet Types
- CONNECT, CONNACK, PUBLISH, PUBACK, SUBSCRIBE, SUBACK, PINGREQ, PINGRESP, DISCONNECT

### MQTT Features
- **Last Will & Testament** — final message on ungraceful disconnect
- **Retained Messages** — last message on topic saved for new subscribers
- **Wildcards**: `+` (single level), `#` (multi level)

## CoAP (Constrained Application Protocol)
- **UDP-based** RESTful protocol (like HTTP for IoT)
- Defined in **RFC 7252**
- Uses **DTLS** for security (CoAPs — default port 5684)
- Port: UDP 5683 (CoAP), UDP 5684 (CoAPs)

### CoAP Methods
| Method | HTTP Equivalent |
|---|---|
| GET | GET |
| POST | POST |
| PUT | PUT |
| DELETE | DELETE |

### CoAP Features
- **Observe** — Subscribe to resource changes (pub/sub over CoAP)
- **Block-wise transfer** — Large payloads in blocks
- **Resource Discovery** — `/.well-known/core`

### CoAP vs MQTT
| Feature | CoAP | MQTT |
|---|---|---|
| Transport | UDP | TCP |
| Model | Request/response (REST) | Pub/Sub |
| Header overhead | 4 bytes | 2 bytes |
| Reliability | ACK (confirmable) | QoS levels |
| Security | DTLS | TLS |
| Best for | Constrained devices | Less constrained |

## AMQP (Advanced Message Queuing Protocol)
- **Enterprise** messaging — pub/sub + message queues
- **OASIS** standard (ISO 19464)
- Port: TCP 5671 (TLS), TCP 5672 (plain)
- Reliable, transactional, routing (exchanges + bindings)
- Used in: RabbitMQ, ActiveMQ, Azure Service Bus

### AMQP vs MQTT
| Feature | AMQP | MQTT |
|---|---|---|
| Complexity | High | Low |
| Reliability | Transactions, delivery guarantees | QoS 0/1/2 |
| Routing | Exchanges + bindings | Topic hierarchy |
| Use case | Enterprise, financial | IoT, sensors |

## XMPP (Extensible Messaging and Presence Protocol)
- **XML-based** messaging protocol (originally Jabber)
- RFC 6120–6122
- Port: TCP 5222 (client), TCP 5269 (server)
- Used in: Instant messaging, IoT (pub/sub extension)
- **IoT extension**: XEP-0323 (Sensor Data), XEP-0325 (Control)

## MQTT-SN (Sensor Network)
- MQTT variant for **UDP/Zigbee/Bluetooth** (no TCP)
- Gateway translates MQTT-SN ↔ MQTT

## Tools
```bash
# MQTT
mosquitto_pub -h broker.example.com -p 1883 -t sensor/temp -m "25.5"
mosquitto_sub -h broker.example.com -t sensor/#

# CoAP
coap-client -m get coap://192.168.1.100/temperature
coap-client -m post coap://192.168.1.100/actuator -e "on"
```
