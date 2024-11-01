# BFF Framework

## Nonfunctional requirements

- Performance
- Security
- Scalability
- Observability

## Functional requirements

- Request orchestration
  - Parallelism
  - Cache
  - Rate limit
  - Circuit Breaker
- Data transformation
- Authentication / Authorization
- Standard payload
  - Error payload
  - Data envelope
- HTTP/2
- Health Monitoring

## TODO

- [-] Create a HTTP server
- [ ] Route system (file based)
  - [ ] Understand the `createDefine` in routes, it's necessary
  - [x] Create GET /v1/home dirty way
  - [ ] Create GET /v1/home works as BFF
- [ ] Middlewares
- [ ] Auth0 support
- [ ] JWT support
- [ ] Docker image default
- [ ] K8S
- [ ] Stress Test
- [ ] opentelemetry support
- [ ] Memory cache
- [ ] RFC 9457
- [ ] Cache Strategy
- [ ] Dev
