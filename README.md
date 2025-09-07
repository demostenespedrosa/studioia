<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Estúdio de Produto AI

Aplicação full‑stack para gerar fotos profissionais de produtos com modelos usando **Google Gemini**. Agora com **autenticação (login/cadastro)** e backend em **Node.js + Express + MySQL**.

> Link AI Studio original: https://ai.studio/apps/drive/1gdtQ14ShctcQsjm8z-l5c-o09YkDsPwa

## Funcionalidades

- Upload de foto do produto (drag & drop)
- Configuração do modelo (idade, gênero)
- Geração de 4 imagens via Gemini (`gemini-2.5-flash-image-preview`)
- Download das imagens geradas (PNG base64)
- Autenticação JWT (registro, login, sessão persistida em token local)
- Proteção de acesso: somente usuários logados acessam o estúdio

## Arquitetura

| Camada | Tecnologias | Descrição |
|--------|-------------|-----------|
| Frontend | React 19, Vite, Tailwind (CDN) | Interface SPA e fluxo de geração |
| Backend | Express, JWT, bcrypt, MySQL2 | API de autenticação e futuras rotas protegidas |
| IA | @google/genai | Chamada de geração de imagens (frontend) |
| Persistência | MySQL | Armazena usuários (tabela `users`) |

## Requisitos

- Node.js 18+
- MySQL 8+ (ou compatível)
- Chave de API Gemini

## Variáveis de Ambiente (`.env.local`)

Crie um arquivo `.env.local` na raiz (já ignorado pelo git) com:

```env
GEMINI_API_KEY=COLOQUE_SUA_CHAVE_AQUI

# Banco de Dados
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=studioia

# JWT
JWT_SECRET=altere_este_segredo
PORT=4000
```

> Ajuste `DB_PASSWORD` conforme sua instalação.

## Banco de Dados

Crie o banco (se ainda não existir):

```sql
CREATE DATABASE IF NOT EXISTS studioia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

A tabela `users` é criada automaticamente no start do servidor.

## Instalação

```bash
npm install
```

## Execução em Desenvolvimento

Abra **dois terminais**:

Terminal 1 (API):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run dev
```

Acesse: http://localhost:5173

## Fluxo de Autenticação

1. Usuário registra (POST /api/auth/register)
2. Faz login (POST /api/auth/login) → recebe `token` JWT
3. Token é salvo no `localStorage`
4. Frontend envia `Authorization: Bearer <token>` para rotas protegidas
5. `/api/auth/me` valida token e retorna o usuário

## Endpoints Principais

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | /api/auth/register | Registrar novo usuário |
| POST | /api/auth/login | Autenticar e retornar token |
| GET | /api/auth/me | Retorna usuário autenticado |
| GET | /api/protegido | Exemplo de rota protegida |

## Geração de Imagens

A chamada à Gemini hoje ocorre no frontend. Para produção recomenda‑se mover para o backend para proteger a chave e permitir auditoria / quota centralizada.

## Build de Produção

```bash
npm run build
npm run preview
```

Inicie também o backend (`npm run server`). Servir ambos atrás de um reverse proxy (ex: Nginx) / containerização é recomendável.

## Segurança & Boas Práticas Futuras

- Migrar geração de imagens para o backend
- Implementar refresh token / expiração silenciosa
- Rate limiting no Express
- Sanitização e validação com Zod ou Joi
- Logs centralizados e monitoramento (Sentry / OpenTelemetry)

## Limitações Atuais

- Sem recuperação de senha
- Sem verificação de email
- Chave Gemini exposta no bundle
- Sem testes automatizados

## Contribuição

PRs e sugestões são bem-vindos. Antes de contribuir, descreva a proposta.

## Licença

Uso educacional / prototipação (definir licença formal futuramente).

---
Made with ❤️ para pequenos empreendedores.
