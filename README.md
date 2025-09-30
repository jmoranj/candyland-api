<h1 align="center">🍬 Candyland API</h1>

<p align="center">
    <img src="https://skillicons.dev/icons?i=nodejs,typescript,nest,postgresql,prisma" />
</p>
<div>
<h1 align="center"></h1>
</div>

O **Candyland API** é o backend do sistema **Candyland**, uma vitrine online para doceria.  
Desenvolvido em **NestJS**, ele fornece a camada de serviços e gerenciamento de dados, garantindo que a vitrine e o dashboard admin funcionem corretamente.    

---

## ✨ Funcionalidades

### 👥 Usuários
- Registro e autenticação de administradores.
- Login seguro com **JWT**.
- Criptografia de senhas utilizando **bcrypt**.

### 🛍️ Produtos
- Cadastro de novos doces.
- Edição de informações (nome, descrição, preço e imagem).
- Exclusão de produtos.
- Listagem de todos os produtos disponíveis.

### ⚙️ Admin Dashboard
- Endpoints protegidos por autenticação.
- Controle total de produtos da vitrine.

---

## 🛠️ Tecnologias Utilizadas
- **NestJS** – Framework Node.js para arquitetura modular e escalável.
- **TypeScript** – Tipagem estática.
- **Prisma ORM** – Acesso e modelagem do banco de dados.
- **MySQL** – Banco de dados relacional.
- **JWT** – Autenticação baseada em tokens.

# 📖 Documentação das Rotas – CandyLand API

A API está organizada em **4 módulos principais**: `auth`, `category`, `products` e `orders`.

---

## 🔑 Auth

| Método | Rota           | Descrição                  | Auth |
|--------|----------------|----------------------------|------|
| POST   | `/auth/login`  | Autentica o usuário e gera um token JWT | ❌ |

**Body (JSON):**
```json
{
  "email": "admin@gmail.com",
  "password": "02020503"
}
```

**Resposta:**
```json
{
  "access_token": "jwt_aqui"
}
```

---

## 🗂️ Category

| Método | Rota               | Descrição                       | Auth |
|--------|--------------------|---------------------------------|------|
| POST   | `/category`        | Cria uma nova categoria         | ✅ |
| GET    | `/category`        | Lista todas as categorias       | ✅ |
| PATCH  | `/category/:id`    | Atualiza uma categoria existente| ✅ |
| DELETE | `/category/:id`    | Remove uma categoria            | ✅ |

**Exemplo Body (POST):**
```json
{
  "categoryName": "Bolos",
  "categoryIcon": "🎂"
}
```

---

## 📦 Products

| Método | Rota               | Descrição                       | Auth |
|--------|--------------------|---------------------------------|------|
| POST   | `/products`        | Cria um novo produto            | ✅ |
| GET    | `/products`        | Lista todos os produtos         | ❌ |
| GET    | `/products/:id`    | Busca um produto por ID         | ❌ |
| PUT    | `/products/:id`    | Atualiza um produto existente   | ✅ |
| DELETE | `/products/:id`    | Remove um produto               | ✅ |

**Exemplo Body (POST):**
```json
{
  "name": "Torta de Chocolate Cremosa",
  "description": "Torta intensa de chocolate meio amargo com massa crocante.",
  "price": "68.50",
  "category": "tortas",
  "imageUrl": "https://exemplo.com/torta-chocolate.jpg",
  "status": true
}
```

---

## 🧾 Orders

| Método | Rota                | Descrição                        | Auth |
|--------|---------------------|----------------------------------|------|
| POST   | `/order`            | Cria um novo pedido              | ❌ |
| GET    | `/orders`           | Lista todos os pedidos           | ✅ |
| GET    | `/orders?page&limit`| Lista pedidos com paginação      | ✅ |
| GET    | `/orders?status=`   | Lista pedidos filtrando por status | ✅ |
| GET    | `/orders?productId=`| Lista pedidos filtrando por produto | ✅ |
| GET    | `/orders/:id`       | Busca um pedido por ID           | ✅ |
| PATCH  | `/orders/:id`       | Atualiza o status de um pedido   | ✅ |

**Exemplo Body (POST):**
```json
{
  "name": "Cliente Teste",
  "phone": "+55 11 91234-5678",
  "scheduled": "2025-09-01T15:30:00.000Z",
  "orderItems": [
    {
      "productId": "cmf0hbg0v00024yf0klkazy28",
      "quantity": 10
    },
    {
      "productId": "cmf0hbg0y00034yf0vjerhbqq",
      "quantity": 12
    }
  ]
}
```

**Exemplo Body (PATCH):**
```json
{
  "status": "CONFIRMED"
}
```
---
👉 As colunas **Auth** indicam se a rota exige **JWT (✅)** ou não (❌).  
👉 Recomenda-se realizar **login primeiro** e configurar o token JWT como variável `{{JWT_Token}}` no Postman para testar as rotas protegidas. 
