# Cuidar ERP

Aplicação Next.js para organização de residentes, informações gerais, necessidades específicas e rotina de medicamentos.

## Executar

Em um terminal Linux/WSL com Node.js e npm nativos:

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`. O banco SQLite é criado automaticamente em `data/cuidado.db`, já com dados de demonstração.

## Rotas

- `/` — listagem com busca de residentes.
- `/idosos/:id` — perfil individual e cronograma semanal de medicamentos.
- `GET/POST /api/idosos` — leitura e criação de residentes.
- `GET/PATCH/DELETE /api/idosos/:id` — leitura, edição e exclusão de residentes.
