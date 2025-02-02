export default () => ({
  azureStorageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  tenantId: process.env.TENANT_ID
})