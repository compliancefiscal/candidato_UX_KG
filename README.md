# Sistema de Gestão de Funcionários

Este repositório contém um sistema completo de Sistema de Gestão de Funcionáraios com backend em Node.js/Express e frontend em Vue.js.

## Estrutura do Projeto

O projeto está organizado em duas pastas principais:
- `back/` - API backend construída com Node.js, Express, TypeScript e Prisma ORM
- `front/` - Aplicação frontend construída com Vue 3, TypeScript e Vite

## Requisitos do Sistema

- Node.js (v16 ou superior)
- npm (v6 ou superior)
- Banco de dados PostgreSQL

## Primeiros Passos

### Clonando o Repositório

```bash
# Clone o repositório
git clone <repository-url>

# Acesse o diretório do projeto
cd <repository-name>
```

### Configuração do Backend

```bash
# Acesse o diretório do backend
cd back

# Instale as dependências
npm install

# Crie o arquivo .env
# Você pode copiar o arquivo de exemplo e modificar
cp .env.example .env
```

Edite o arquivo `.env` com os dados de conexão do banco de dados e outras configurações:

```
DATABASE_URL="postgresql://username:password@localhost:5432/database_name?schema=public"
PORT=3000
JWT_SECRET=your_jwt_secret_key
```

Variáveis de ambiente importantes:
- `DATABASE_URL`: string de conexão do PostgreSQL
- `PORT`: porta do servidor backend (padrão: 3000)
- `JWT_SECRET`: chave secreta para geração e validação do token JWT

After setting up the environment variables:

```bash
# Gere o Prisma client
npx prisma generate

# Rode as migrations do banco de dados
npx prisma migrate dev

# Popule o banco de dados com dados iniciais
npm run seed
```

### Configuração do Frontend

```bash
# Acesse o diretório do frontend
cd front

# Instale as dependências
npm install

# Crie o arquivo .env
cp .env.example .env
```

Edite o arquivo `.env`

```
VITE_API_URL=http://localhost:3000/api
```

## Executando a Aplicação

### Executando o Backend

```bash
# Acesse o diretório do backend
cd back

# Inicie o servidor de desenvolvimento
npm run dev
```

O servidor backend iniciará em http://localhost:3000 (ou na porta especificada no seu arquivo .env).

### Executando o Frontend

```bash
# Acesse o diretório do frontend
cd front

# Inicie o servidor de desenvolvimento
npm run dev
```

O servidor de desenvolvimento do frontend iniciará normalmente em http://localhost:5173.

## Testes

### Executando os Testes do Backend

```bash
# Acesse o diretório do backend
cd back

# Rode os testes
npm run test
```

Os testes utilizam Jest e Supertest para testar os endpoints da API.

## Seed do Banco de Dados

O projeto inclui um script de seed que popula o banco de dados com dados de exemplo:

```bash
# Acesse o diretório do backend
cd back

# Rode o script de seed
npm run seed
```

Isso irá criar:
- 5 usuários com e-mails de `user1@example.com` até `user5@example.com` e senhas de `password1` até `password5`
- 10 funcionários para cada usuário com dados aleatórios

## Build para Produção

### Backend

```bash
# Acesse o diretório do backend
cd back

# Build do projeto
npm run build

# Inicie o servidor em produção
npm run start
```

### Frontend

```bash
# Acesse o diretório do frontend
cd front

# Build do projeto
npm run build
```

Os arquivos construídos ficarão na pasta `dist` e podem ser servidos por qualquer servidor de arquivos estáticos.

## API Endpoints

O backend disponibiliza os seguintes endpoints da API:

- `POST /api/users/login` - Login do usuário
- `POST /api/users/register` - Registro de usuário
- `GET /api/employees` - Listar todos os funcionários
- `GET /api/employees/:id` - Buscar um funcionário específico
- `POST /api/employees` - Criar um novo funcionário
- `PUT /api/employees/:id` - Atualizar um funcionário
- `DELETE /api/employees/:id` - Excluir um funcionário

## Dicas e Troubleshooting

1. **Problemas de Conexão com o Banco de Dados**: 
   - Verifique se seu servidor PostgreSQL está rodando
   - Confirme se a string de conexão no arquivo `.env` está correta
   - Cheque se o banco de dados existe e está acessível

2. **Autenticação com JWT**:
   - Todos os endpoints da API (exceto login) exigem autenticação
   - Inclua o token JWT no header Authorization: `Bearer <token>`
   - Os tokens expiram após 24 horas

3. **Conexão do Frontend com a API**:
   - Se o frontend não conseguir conectar ao backend, verifique se:
     - O servidor backend está rodando
     - O `VITE_API_URL` no arquivo `.env` do frontend aponta para a URL correta do backend
     - O CORS está devidamente configurado no backend

4. **Executando Testes:**:
   - Os testes exigem conexão com o banco de dados
   - Os testes irão limpar o banco de dados antes de rodar, então não execute em um banco de produção

5. **Seed de Dados**:
   - O script de seed irá apagar todos os dados existentes antes de criar novos dados
   - Utilize apenas em ambientes de desenvolvimento ou testes

## License

[MIT License](LICENSE)