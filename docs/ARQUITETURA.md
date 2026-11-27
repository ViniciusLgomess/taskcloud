# Arquitetura e caminho dos dados

```mermaid
flowchart LR
  U[Usuário<br/>navegador / celular] -->|HTTPS| H[Amplify Hosting<br/>React + Vite]
  H -->|1. login| C[Amazon Cognito]
  C -->|2. token JWT| H
  H -->|3. GraphQL + token| A[AWS AppSync]
  A -->|4. valida token e regra owner| A
  A -->|5. leitura/escrita| D[(Amazon DynamoDB<br/>tabela Task)]
  D -->|6. resultado| A
  A -->|7. resposta + tempo real| H
```

**Caminho de uma tarefa:** o usuário preenche o modal → o front envia a mutação GraphQL com o token do Cognito → o AppSync confirma quem é o usuário e grava o `owner` → o DynamoDB persiste o item → o AppSync devolve o resultado e notifica a assinatura em tempo real → a lista e os indicadores do painel se atualizam sozinhos.

**Provisionamento:** o código em `amplify/` é convertido pelo Amplify Gen 2 em stacks do CloudFormation (infraestrutura como código).
