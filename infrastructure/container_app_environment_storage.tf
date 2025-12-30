resource "azurerm_container_app_environment_storage" "container_app_environment_storage_database" {
  name = "${module.environment.app_name}-database"
  container_app_environment_id = data.azurerm_container_app_environment.container_app_environment.id
  account_name = azurerm_storage_account.storage_account.name
  share_name = azurerm_storage_share.storage_share[0].name
  access_key = azurerm_storage_account.storage_account.primary_access_key
  access_mode = "ReadWrite"
}