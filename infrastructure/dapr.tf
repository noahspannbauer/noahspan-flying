resource "azurerm_container_app_environment_dapr_component" "table_storage_pilots_dapr_component" {
  name = "table-storage-pilots"
  container_app_environment_id = azurerm_container_app_environment.container_app_environment.id
  component_type = "state.azure.tablestorage"
  version = "v1"
  
  metadata {
    name = "accountName"
    value = azurerm_storage_account.storage_account.name
  }

  metadata {
    name = "azureClientId"
    value = azurerm_user_assigned_identity.user_assigned_identity.id
  }

  metadata {
    name = "tableName"
    value = "Pilots"
  }

  scopes = [ azurerm_container_app.container_app_api.dapr[0].app_id ]
}

resource "azurerm_container_app_environment_dapr_component" "table_storage_logbook_dapr_component" {
  name = "table-storage-logbook"
  container_app_environment_id = azurerm_container_app_environment.container_app_environment.id
  component_type = "state.azure.tablestorage"
  version = "v1"
  
  metadata {
    name = "accountName"
    value = azurerm_storage_account.storage_account.name
  }

  metadata {
    name = "azureClientId"
    value = azurerm_user_assigned_identity.user_assigned_identity.client_id
  }

  metadata {
    name = "tableName"
    value = "Logbook"
  }

  scopes = [ azurerm_container_app.container_app_api.dapr[0].app_id ]
}

resource "azurerm_container_app_environment_dapr_component" "key_vault_dapr_component" {
  name = "key-vault"
  container_app_environment_id = azurerm_container_app_environment.container_app_environment.id
  component_type = "secretstores.azure.keyvault"
  version = "v1"

  metadata {
    name = "vaultName"
    value = azurerm_key_vault.key_vault.name
  }

  metadata {
    name = "azureClientId"
    value = azurerm_user_assigned_identity.user_assigned_identity.client_id
  }

  scopes = [ azurerm_container_app.container_app_api.dapr[0].app_id ]
}