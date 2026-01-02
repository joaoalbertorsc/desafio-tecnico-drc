# Desafio Técnico - Loja de Variedades

## 📋 Sobre o Projeto

Este repositório contém a solução desenvolvida para o **Desafio Técnico da DRC - Consultoria em TI**.

O objetivo é apresentar uma aplicação Full Stack completa para o gerenciamento de estoque de uma **Loja de Variedades**. O sistema permite o controle de produtos (papelaria, utilidades, brinquedos, etc.) através de operações de CRUD.

[Link do repositório do desafio](https://github.com/DRC-Consultoria-em-TI/desafio-vaga-bosista-2026)

---

## 🚀 Como Executar o Projeto (Via Docker)

### Pré-requisitos

*   [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados na sua máquina.
*   [Git](https://git-scm.com/) instalado.

### Passo a Passo

1.  **Clone o repositório** para a sua máquina local:

    ```bash
    git clone https://github.com/joaoalbertorsc/desafio-tecnico-drc.git
    cd /desafio-tecnico-drc
    ```

2.  **Execute a aplicação** utilizando o Docker Compose.
    ```bash
    docker compose up --build
    ```

    *Aguarde alguns instantes até que todos os serviços estejam iniciados e o build seja concluído.*

3.  **Acesse a aplicação**:

    *   **Frontend (Aplicação Web):** Acesse `http://localhost:4200` (ou a porta configurada no seu docker-compose).
    *   **Backend (API):** A API estará rodando em `http://localhost:8080`.

---

## 🧩 Contexto e Funcionalidades

A aplicação foi desenhada para atender às necessidades de uma loja que vende itens diversos. A entidade principal é o **Produto**, e o sistema garante a integridade dos dados e facilita a gestão do dia a dia.

### Funcionalidades Implementadas

*   **Listagem de Produtos:** Visualização de todos os itens cadastrados com nome, categoria, preço, estoque e status.
*   **Cadastro:** Adição de novos produtos com validação de campos obrigatórios.
*   **Edição:** Atualização de informações de produtos existentes.
*   **Exclusão:** Remoção de produtos do sistema.
*   **Filtros:** Busca de produtos por nome / categoria.
*   **Ordenação de colunas:** Por nome / categoria / preço / estoque / status.

### Estrutura de Dados (Produto)

Cada produto no sistema possui as seguintes características:
*   **ID:** Gerado automaticamente.
*   **Nome:** Ex: Caneca, Lápis, Brinquedo.
*   **Categoria:** Ex: Papelaria, Cozinha, Decoração.
*   **Descrição:** Detalhes sobre o item.
*   **Preço:** Valor monetário.
*   **Quantidade em Estoque:** Controle de inventário.
*   **Ativo:** Status do produto (Disponível para venda ou não).

---

## 🛠️ Tecnologias Utilizadas

O projeto foi desenvolvido seguindo boas práticas de engenharia de software, separação de responsabilidades e arquitetura limpa.

### Back-end
*   **Linguagem:** Java 17
*   **Framework:** Spring Boot 3.4.1 (Web / REST)
*   **Persistência:** Spring Data JPA
*   **Banco de Dados:** H2 Database (Em memória)
*   **Documentação:** Swagger / OpenAPI (SpringDoc)
*   **Ferramentas:** Lombok, Validation API
*   **Build:** Gradle

### Front-end
*   **Framework:** Angular 19 (Standalone Components)
*   **Linguagem:** TypeScript
*   **Estilização:** CSS Moderno (Variáveis CSS, Flexbox, Grid)
*   **Comunicação:** HttpClient (Consumo de API REST)
*   **Layout:** Responsivo e customizado

### Infraestrutura
*   **Docker:** Containerização da aplicação (Imagens Multi-stage build).
*   **Docker Compose:** Orquestração dos serviços e redes.
*   **Servidor Web:** Nginx (Proxy reverso e servidor de arquivos estáticos).

---