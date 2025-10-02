export default () => ({
  azureStorageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  audience: process.env.AUDIENCE,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  issuer: process.env.ISSUER_URL,
  jwksUri: process.env.JWKS_URI,
  tenantId: process.env.TENANT_ID
})