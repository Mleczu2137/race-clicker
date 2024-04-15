# Uruchamianie

## klienta
```
bun start
```
Albo tak, jeśli potrzebujemy innego serwera (default: `ws://localhost:25555`)
```
VITE_IP_ADDRESS="ws://192.168.0.2:25555" bun start
```

## serwera
Domyślnie serwera nasłuchuje na `0.0.0.0:25555`

```
cd server/
bun run index.ts
```
