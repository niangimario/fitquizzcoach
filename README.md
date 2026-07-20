# Fit Quiz Coach

Aplicação React/TanStack Start para um quiz de emagrecimento com SSR e deploy em Vercel.

## Como usar

1. Instalar dependências:
   ```bash
   npm install
   ```
2. Executar localmente:
   ```bash
   npm run dev
   ```
3. Build de produção:
   ```bash
   npm run build
   ```
4. Pré-visualizar build:
   ```bash
   npx vite preview
   ```

## Deploy para Vercel

Este projeto está configurado para Vercel usando `vercel.json`.

- `buildCommand`: `npm run build`
- `outputDirectory`: `.output`
- `framework`: `null`

A aplicação usa o build do Nitro gerado por `@lovable.dev/vite-tanstack-config`.

## Notas

- As imagens de ativos estão importadas diretamente do diretório `src/assets`.
- A interface foi ajustada para ser responsiva em dispositivos móveis.
