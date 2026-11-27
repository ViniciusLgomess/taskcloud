# Roteiro de apresentação (4 a 5 minutos)

## Demonstração prática (ordem das telas)
1. **Console Amplify** com o app publicado (10 s) e abrir a URL pública.
2. **Cadastro** de uma conta e login (30 s).
3. Painel vazio → **criar 3 tarefas** (alta, média, uma com prazo vencido) e mostrar os cartões atualizando (60 s).
4. **Editar**, **concluir** e **excluir com confirmação** (40 s).
5. **Filtros, pesquisa e ordenação** (30 s).
6. **Atualizar a página (F5):** os dados continuam (15 s).
7. **Console DynamoDB → Explore items:** mostrar as tarefas e o campo `owner` (40 s).
8. **Console Cognito → Users:** mostrar o usuário. Opcional: segunda conta sem acesso às tarefas da primeira (30 s).

## Roteiro de fala
**Abertura (20 s).** “Olá, apresento o TaskCloud, um gerenciador de tarefas que desenvolvi para demonstrar computação em nuvem na prática. Todos os dados ficam na AWS, não no meu computador.”

**Objetivo (20 s).** “O objetivo é permitir que cada pessoa organize suas atividades com prazo, prioridade e categoria, acompanhando o progresso em um painel.”

**Arquitetura (60 s).** “O front-end em React é hospedado no AWS Amplify Hosting. O Amazon Cognito cuida do cadastro e do login. Depois de autenticado, o app fala com o AWS AppSync, uma API GraphQL gerenciada, que grava e lê no Amazon DynamoDB, um banco NoSQL. A regra de autorização por dono garante que cada usuário só acesse as próprias tarefas. Toda essa infraestrutura é criada por código, com o Amplify Gen 2.”

**Demonstração (2 min 30 s).** Seguir a lista acima, narrando: “Ao criar esta tarefa, o dado percorre Cognito, AppSync e chega ao DynamoDB. Aqui está ele na tabela, com o identificador do dono.”

**Conclusão (40 s).** “O projeto mostra conceitos de computação em nuvem: serviços gerenciados e serverless, sem servidores para administrar; escalabilidade automática; pagamento por uso; alta disponibilidade; segurança com identidade e autorização; e infraestrutura como código. Obrigado!”
