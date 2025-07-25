export default () => ({
  azureStorageConnectionString: process.env.AZURE_STORAGE_CONNECTION_STRING,
  dbPath: process.env.DB_PATH,
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  tenantId: process.env.TENANT_ID
})