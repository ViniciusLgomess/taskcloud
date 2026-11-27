import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

// AppSync (GraphQL) + DynamoDB. allow.owner() => cada usuário só acessa as próprias tarefas.
const schema = a.schema({
  Task: a
    .model({
      title: a.string().required(),
      description: a.string(),
      dueDate: a.date(),
      priority: a.enum(['LOW', 'MEDIUM', 'HIGH']),
      category: a.string(),
      status: a.enum(['PENDING', 'COMPLETED']),
      // id, owner, createdAt e updatedAt são criados automaticamente pelo Amplify
    })
    .authorization((allow) => [allow.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: { defaultAuthorizationMode: 'userPool' },
});
