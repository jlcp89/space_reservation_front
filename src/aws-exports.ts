// Central Amplify (v6 modular) configuration. Values are injected at build time for CRA via REACT_APP_* vars.
// Fallbacks are placeholders; replace with real pool info for your AWS account.
const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID || 'us-east-1_Wn3ItnBEN',
      userPoolClientId: process.env.REACT_APP_COGNITO_APP_CLIENT_ID || '5e7j49odu6t50eruiac8t7kc7o',
      region: process.env.REACT_APP_COGNITO_REGION || 'us-east-1',
      loginWith: {
        email: true,
        username: true,
      },
    },
  },
};

export default awsConfig;