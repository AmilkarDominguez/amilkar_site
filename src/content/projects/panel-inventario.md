---
title: 'Panel de Inventario en Tiempo Real'
description: 'Dashboard web para gestión de inventario con actualizaciones en tiempo real vía WebSockets. Permite rastrear stock, movimientos y alertas de reposición desde un único panel.'
pubDate: 2026-03-15
tags: ['backend', 'fullstack', 'tiempo-real']
stack: ['TypeScript', 'Node.js', 'PostgreSQL', 'WebSockets', 'React']
repo: 'https://github.com/amilkardominguez/panel-inventario'
featured: true
draft: false
---

## El problema

El cliente manejaba su inventario con hojas de cálculo compartidas en Drive. Cuando dos personas editaban al mismo tiempo, los datos se corrompían. Con 3000 SKUs y 5 operadores simultáneos, necesitábamos algo más robusto.

## Solución

Un panel web con una única fuente de verdad (PostgreSQL) y actualizaciones en tiempo real vía WebSockets. Cada vez que un operador modifica stock, todos los paneles abiertos se actualizan instantáneamente.

## Arquitectura

```
Cliente (React) ──WebSocket──► Servidor Node.js ──► PostgreSQL
                                      │
                              Broadcast a todos
                              los clientes conectados
```

### Backend: Node.js + TypeScript

El servidor expone una API REST para operaciones CRUD y un servidor WebSocket para las actualizaciones en tiempo real:

```typescript
import { WebSocketServer } from 'ws';
import type { IncomingMessage } from 'http';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws: WebSocket, req: IncomingMessage) => {
  ws.on('message', (data: Buffer) => {
    const event = JSON.parse(data.toString()) as StockEvent;
    broadcastStockUpdate(event);
  });
});

function broadcastStockUpdate(event: StockEvent): void {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(event));
    }
  });
}
```

### Schema de base de datos

```sql
CREATE TABLE products (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku        VARCHAR(50) UNIQUE NOT NULL,
  name       VARCHAR(255) NOT NULL,
  stock      INTEGER NOT NULL DEFAULT 0,
  min_stock  INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger para broadcast via pg_notify
CREATE FUNCTION notify_stock_change() RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('stock_updates', row_to_json(NEW)::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Resultados

- Tiempo de respuesta < 100ms para actualizaciones en vivo
- Eliminación de conflictos de edición simultánea
- Alertas automáticas cuando el stock baja del mínimo configurado
