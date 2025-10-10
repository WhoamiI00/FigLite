# Arcjet Security Configuration for NeoLive

## Overview

NeoLive is now protected by Arcjet against bot attacks, DOS attacks, and abuse. This document outlines the security measures implemented.

## Protection Layers

### 1. Middleware Protection (`middleware.ts`)

**Global protection applied to all routes except static files:**

- **Shield Protection**: Blocks common attack patterns and malicious requests
- **Bot Detection**: Identifies and blocks suspicious automated traffic
- **Rate Limiting**:
  - General routes: 60 requests/minute per IP
  - Sensitive routes (API, homepage): 10 requests/minute per IP
- **Allowed Bots**: Search engines are permitted on general routes

### 2. API Route Protection

#### Room Creation (`/api/rooms`)

**Strictest protection for room creation:**

- **Rate Limit**: 3 room creations per minute per IP
- **Bot Policy**: No bots allowed
- **Shield**: Full protection enabled
- **Purpose**: Prevents room spam and resource exhaustion

#### Room Validation (`/api/rooms/[code]`)

**Moderate protection for room joining:**

- **Rate Limit**: 20 validations per minute per IP
- **Bot Policy**: Search engines allowed, suspicious bots blocked
- **Shield**: Full protection enabled
- **Purpose**: Allows legitimate room access while preventing abuse

#### Health Check (`/api/health`)

**Light protection for monitoring:**

- **Rate Limit**: 100 requests per minute per IP
- **Bot Policy**: Monitoring and search bots allowed
- **Shield**: Basic protection enabled
- **Purpose**: Enables monitoring while preventing abuse

## Rate Limiting Strategy

| Endpoint                  | Requests/Minute | Reasoning                           |
| ------------------------- | --------------- | ----------------------------------- |
| `/api/rooms` (POST)       | 3               | Room creation is resource-intensive |
| `/api/rooms/[code]` (GET) | 20              | Allows legitimate room joining      |
| `/api/health`             | 100             | High limit for monitoring tools     |
| General pages             | 60              | Normal browsing behavior            |
| API endpoints             | 10              | Stricter control for API access     |

## Bot Detection Policy

### Allowed Bots

- **Search Engines**: Google, Bing, etc. (on general routes)
- **Monitoring Tools**: Uptime monitors (on health endpoint)

### Blocked Bots

- **Scrapers**: Automated content extraction
- **Spam Bots**: Malicious automated requests
- **DDoS Bots**: Coordinated attack tools
- **Unknown Bots**: Unidentified automated traffic

## Security Features

### 1. Shield Protection

- **SQL Injection**: Detects and blocks SQL injection attempts
- **XSS Attacks**: Prevents cross-site scripting
- **Path Traversal**: Blocks directory traversal attempts
- **Command Injection**: Stops command injection attacks

### 2. IP-based Tracking

- **Characteristic**: `ip.src` - tracks by source IP address
- **Benefits**: Prevents single IP from overwhelming the service
- **Limitations**: Shared IPs (corporate, VPN) may hit limits faster

### 3. Error Handling

- **429 (Too Many Requests)**: Clear messaging with retry information
- **403 (Forbidden)**: Specific reasons (bot, security, etc.)
- **400 (Bad Request)**: Input validation errors
- **500 (Server Error)**: Graceful error handling

## Monitoring and Logging

### Decision Logging

Every Arcjet decision is logged with:

- **Decision ID**: Unique identifier for tracking
- **IP Address**: Source of the request
- **Conclusion**: ALLOW or DENY
- **Reason**: Specific rule that triggered (rate limit, bot, shield)
- **Timestamp**: When the decision was made
- **Endpoint**: Which route was accessed

### Log Examples

```javascript
// Successful request
{
  id: "aj_12345",
  conclusion: "ALLOW",
  reason: "ALLOWED",
  ip: "192.168.1.1",
  pathname: "/api/rooms"
}

// Blocked request
{
  id: "aj_67890",
  conclusion: "DENY",
  reason: "RATE_LIMIT",
  ip: "10.0.0.1",
  pathname: "/api/rooms"
}
```

## Configuration Management

### Environment Variables

- `ARCJET_KEY`: Your Arcjet API key (stored in `.env`)
- **Security**: Never commit API key to version control

### Mode Settings

- **LIVE**: Active protection (current setting)
- **DRY_RUN**: Logging only, no blocking (for testing)

## Testing and Monitoring

### Health Check Endpoint

**URL**: `/api/health`
**Purpose**: Monitor Arcjet status and app health
**Response**: Includes Arcjet decision info and app status

### Testing Protection

1. **Rate Limit Testing**: Make rapid requests to trigger limits
2. **Bot Testing**: Use automated tools to test bot detection
3. **Shield Testing**: Attempt injection attacks (safely)

## Performance Impact

### Minimal Overhead

- **Latency**: ~10-50ms per request
- **Memory**: Negligible impact
- **CPU**: Minimal processing overhead

### Benefits vs. Cost

- **Protection**: Prevents costly attacks and abuse
- **Uptime**: Maintains service availability
- **Resources**: Prevents resource exhaustion

## Customization Options

### Adjusting Rate Limits

Modify the `max` values in respective Arcjet configurations based on:

- **User Behavior**: Actual usage patterns
- **Server Capacity**: Available resources
- **Business Needs**: Feature requirements

### Adding New Protections

- **Email Protection**: Prevent fake email addresses
- **Signup Protection**: Additional registration security
- **Content Filtering**: Detect malicious uploads

## Emergency Procedures

### Disabling Protection

1. Change `mode: "LIVE"` to `mode: "DRY_RUN"`
2. Redeploy the application
3. Monitor logs for decision patterns

### Whitelist Important IPs

Add IP-based exceptions in Arcjet configuration for:

- **Office IPs**: Internal team access
- **Partner IPs**: Trusted external services
- **Monitor IPs**: Uptime monitoring services

## Best Practices

1. **Monitor Logs**: Regularly review blocked requests
2. **Adjust Limits**: Fine-tune based on actual usage
3. **Update Rules**: Adapt to new threat patterns
4. **Test Changes**: Use DRY_RUN mode before going live
5. **Document Changes**: Keep this config updated

## Support and Troubleshooting

### Common Issues

- **False Positives**: Legitimate users getting blocked
- **Rate Limit Tuning**: Balancing security vs. usability
- **Bot Classification**: Ensuring good bots are allowed

### Getting Help

- **Arcjet Docs**: [https://docs.arcjet.com](https://docs.arcjet.com)
- **Support**: Contact Arcjet support for complex issues
- **Community**: Arcjet Discord/GitHub for community help
