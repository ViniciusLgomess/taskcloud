# TaskCloud — Gerenciador Inteligente de Tarefas

Aplicação web com **React + TypeScript + Vite** e backend **AWS Amplify Gen 2**. Todos os dados ficam no **Amazon DynamoDB**; não há localStorage, JSON local ou dados fictícios.

## Serviços AWS utilizados

| Serviço | Função |
|---|---|
| **Amazon Cognito** | Cadastro, login, logout e tokens de sessão dos usuários |
| **AWS AppSync** | API GraphQL (CRUD e atualizações em tempo real) |
| **Amazon DynamoDB** | Banco NoSQL que guarda as tarefas |
| **AWS Amplify Hosting** | Publicação do site (build + CDN + HTTPS) |
| **AWS Amplify Gen 2 / CloudFormation** | Cria toda a infraestrutura a partir do código em `amplify/` |

## Estrutura

```
taskcloud/
├── amplify/
│   ├── backend.ts            # junta auth + data
│   ├── auth/resource.ts      # Cognito (e-mail + senha)
│   └── data/resource.ts      # modelo Task + autorização por dono
├── src/
│   ├── main.tsx              # Amplify.configure + tela de login
│   ├── App.tsx               # menu, CRUD, notificações, confirmação
│   ├── types.ts              # tipos e funções auxiliares
│   ├── styles.css
│   └── components/ Dashboard.tsx · TaskList.tsx · TaskModal.tsx
├── docs/ ARQUITETURA.md · ROTEIRO.md
├── amplify.yml               # build do Amplify Hosting
└── package.json · vite.config.ts · tsconfig.json
```

## Modelo de dados (Task)

`id`, `title`, `description`, `dueDate`, `priority` (LOW/MEDIUM/HIGH), `category`, `status` (PENDING/COMPLETED), `createdAt`, `updatedAt`, `owner`.
A regra `allow.owner()` grava o ID do usuário em `owner` e bloqueia, no AppSync, qualquer acesso às tarefas de outras contas.

## 1. Preparar o Windows (uma vez)

1. Instale o **Node.js LTS** (https://nodejs.org) e o **VS Code**.
2. Confirme no PowerShell: `node -v` (v18 ou superior) e `npm -v`.
3. Crie uma conta AWS (https://aws.amazon.com). **Não use o usuário root no dia a dia.**
4. No console AWS, abra **IAM Identity Center** (recomendado) ou **IAM**, e crie um usuário com a permissão gerenciada **AdministratorAccess-Amplify**.
5. Configure as credenciais pelo método oficial, sem colar chaves em arquivos do projeto:
   - Instale o AWS CLI (https://aws.amazon.com/cli/) e rode `aws configure sso` (IAM Identity Center) ou `aws configure` (chaves de um usuário IAM; digite-as apenas no terminal).
   - Teste: `aws sts get-caller-identity`.

## 2. Executar localmente

```powershell
cd taskcloud
npm install
npx ampx sandbox
```

O `sandbox` cria um backend de teste na sua conta AWS (leva alguns minutos) e **gera o arquivo `amplify_outputs.json` real** (o que vem no ZIP é só um espaço reservado). Deixe esse terminal aberto. Em **outro** terminal:

```powershell
npm run dev
```

Abra http://localhost:5173, crie uma conta (o Cognito envia um código de confirmação ao e-mail) e use o app.

## 3. Publicar no AWS Amplify Hosting

1. Crie um repositório no GitHub e envie o projeto:
   ```powershell
   git init
   git add .
   git commit -m "TaskCloud"
   git branch -M main
   git remote add origin https://github.com/SEU_USUARIO/taskcloud.git
   git push -u origin main
   ```
2. No console AWS, escolha a região (ex.: **us-east-1**) e abra **AWS Amplify → Create new app**.
3. Selecione **GitHub**, autorize, escolha o repositório e a branch `main`.
4. Mantenha as configurações detectadas (o `amplify.yml` já está no projeto) e clique em **Save and deploy**.
5. Se pedir, crie/selecione o **service role** do Amplify.
6. Aguarde as etapas Backend → Build → Deploy. Ao final, abra o link `https://main.xxxxx.amplifyapp.com`.
7. Teste cadastro, login e criação de tarefas na URL publicada.

## 4. Verificar o banco e a autenticação (para a demonstração)

- **Cognito:** console → *Amazon Cognito → User pools* → seu pool → **Users** (aparece o e-mail cadastrado).
- **DynamoDB:** console → *DynamoDB → Tables* → tabela `Task-...` → **Explore table items** (as tarefas aparecem, com o campo `owner`).
- **Isolamento:** crie uma segunda conta e confirme que ela não vê as tarefas da primeira.

## 5. Custos e limpeza

- Amplify, Cognito, AppSync e DynamoDB têm uso gratuito/baixo para projetos pequenos, mas **confira os preços e o nível gratuito atuais** em https://aws.amazon.com/pricing.
- Ative um alerta: console → **Billing and Cost Management → Budgets → Create budget** (ex.: US$ 1).
- Acompanhe em **Billing → Cost Explorer**.
- **Ao terminar o trabalho:**
  1. Amplify → seu app → **App settings → General settings → Delete app** (remove hospedagem e backend da branch).
  2. Se usou o sandbox: `npx ampx sandbox delete`.
  3. Confira **CloudFormation** (stacks `amplify-...`), **DynamoDB** e **Cognito** para ver se sobrou algo.
  4. Remova usuários/chaves IAM que não vai mais usar.

## Problemas comuns

- *Tela em branco / erro de configuração:* o `amplify_outputs.json` ainda é o espaço reservado; rode `npx ampx sandbox`.
- *Scripts bloqueados no PowerShell:* execute `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned`.
- *Não recebi o código de e-mail:* verifique o spam e aguarde alguns minutos.
