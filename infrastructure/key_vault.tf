resource "azurerm_key_vault" "key_vault" {
  name = module.environment.key_vault_name
  resource_group_name = data.azurerm_resource_group.resource_group.name
  location = data.azurerm_resource_group.resource_group.location
  tenant_id = data.azurerm_client_config.current.tenant_id
  soft_delete_retention_days = 7
  sku_name = "standard"
}

resource "azurerm_key_vault_access_policy" "key_vault_access_policy_cli" {
  key_vault_id = azurerm_key_vault.key_vault.id
  tenant_id = data.azurerm_client_config.current.tenant_id
  object_id = data.azurerm_client_config.current.object_id

  key_permissions = [
    "Create",
    "Get",
  ]

  secret_permissions = [
    "Set",
    "Get",
    "Delete",
    "Purge",
    "Recover"
  ]
}

resource "azurerm_key_vault_access_policy" "key_vault_access_policy_user_assigned_identity" {
  key_vault_id = azurerm_key_vault.key_vault.id
  tenant_id = data.azurerm_client_config.current.tenant_id
  object_id = azurerm_user_assigned_identity.user_assigned_identity.principal_id

  key_permissions = [
    "Create",
    "Get",
  ]

  secret_permissions = [
    "Set",
    "Get",
    "Delete",
    "Purge",
    "Recover"
  ]
}

resource "azurerm_key_vault_secret" "client_id_key_vault_secret" {
  name = "client-id"
  value = var.CLIENT_ID
  key_vault_id = azurerm_key_vault.key_vault.id

  depends_on = [ azurerm_key_vault_access_policy.key_vault_access_policy_cli ]
}

resource "azurerm_key_vault_secret" "client_secret_key_vault_secret" {
  name = "client-secret"
  value = var.CLIENT_SECRET
  key_vault_id = azurerm_key_vault.key_vault.id

  depends_on = [ azurerm_key_vault_access_policy.key_vault_access_policy_cli ]
}

resource "azurerm_key_vault_secret" "tenant_id_key_vault_secret" {
  name = "tenant-id"
  value = var.TENANT_ID
  key_vault_id = azurerm_key_vault.key_vault.id

  depends_on = [ azurerm_key_vault_access_policy.key_vault_access_policy_cli ]
}