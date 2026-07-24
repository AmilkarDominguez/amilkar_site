---
title: 'API de Autenticación Multi-Tenant'
description: 'API REST para sistemas SaaS con aislamiento de datos por tenant. Maneja registro, login, refresh tokens y scopes de permisos por organización.'
pubDate: 2025-11-20
tags: ['backend', 'api', 'seguridad']
stack: ['TypeScript', 'Fastify', 'Drizzle ORM', 'PostgreSQL', 'Redis']
repo: 'https://github.com/amilkardominguez/api-auth-multitenant'
featured: true
draft: false
---

## Contexto

Muchos proyectos SaaS arrancan con un sistema de auth monolítico y después necesitan soporte multi-tenant cuando consiguen sus primeros clientes B2B. Este proyecto resuelve ese caso desde el inicio, con aislamiento por schema en PostgreSQL.

## Diseño

Cada tenant tiene su propio schema en PostgreSQL. Las queries filtran por `tenant_id` extraído del JWT, sin posibilidad de acceder a datos de otro tenant.

```
POST /auth/register   → crea usuario + tenant
POST /auth/login      → devuelve access_token + refresh_token
POST /auth/refresh    → rota el refresh_token
POST /auth/logout     → revoca refresh_token en Redis
GET  /auth/me         → perfil del usuario autenticado
```

## Implementación

### Fastify + TypeScript estricto

```typescript
import Fastify from 'fastify';
import type { FastifyRequest, FastifyReply } from 'fastify';

interface LoginBody {
  email: string;
  password: string;
}

const loginSchema = {
  body: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 },
    },
    additionalProperties: false,
  },
} as const;

app.post<{ Body: LoginBody }>(
  '/auth/login',
  { schema: loginSchema },
  async (req: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
    const { email, password } = req.body;
    const user = await authService.validateCredentials(email, password);
    const tokens = await authService.issueTokens(user);
    return reply.send(tokens);
  }
);
```

### Drizzle ORM con schemas tipados

```typescript
import { pgSchema, uuid, varchar, timestamp } from 'drizzle-orm/pg-core';

export function tenantSchema(tenantId: string) {
  const schema = pgSchema(tenantId);

  const users = schema.table('users', {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  });

  return { users };
}
```

### Rotación de refresh tokens (Redis)

Los refresh tokens se almacenan en Redis con TTL de 30 días. Al rotar, el token anterior se invalida inmediatamente:

```typescript
async function rotateRefreshToken(oldToken: string): Promise<TokenPair> {
  const payload = await verifyRefreshToken(oldToken);
  
  // Invalidar el token anterior antes de emitir uno nuevo
  await redis.del(`rt:${payload.jti}`);
  
  return issueTokens(payload.sub, payload.tenantId);
}
```

## Características de seguridad

- PKCE para flows OAuth2
- Rate limiting por IP y por tenant (100 req/min por defecto)
- Audit log inmutable de todos los eventos de auth
- Rotación automática de secrets cada 90 días
