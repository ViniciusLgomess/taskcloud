import { defineAuth } from '@aws-amplify/backend';

// Amazon Cognito: login com e-mail e senha
export const auth = defineAuth({
  loginWith: { email: true },
});
