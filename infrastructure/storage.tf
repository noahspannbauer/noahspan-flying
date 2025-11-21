resource "azurerm_storage_account" "storage_account" {
    name = module.environment.storage.account_name
    resource_group_name = data.azurerm_resource_group.resource_group.name
    location = data.azurerm_resource_group.resource_group.location
    account_tier = "Standard"
    account_replication_type = "LRS"
}

resource "azurerm_storage_container" "storage_container" {
  name = "tracks"
  storage_account_id = azurerm_storage_account.storage_account.id
  container_access_type = "private"
}

resource "azurerm_storage_share" "backup_storage_share" {
  name = "${module.environment.app.app_name}-backup-storage-share"
  quota = 50
  storage_account_name = azurerm_storage_account.storage_account.name
}