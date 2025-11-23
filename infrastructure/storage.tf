resource "azurerm_storage_account" "storage_account" {
    name = module.environment.storage_account_name
    resource_group_name = data.azurerm_resource_group.resource_group.name
    location = data.azurerm_resource_group.resource_group.location
    account_tier = "Standard"
    account_replication_type = "LRS"
}

resource "azurerm_storage_container" "storage_container" {
  count = length(module.environment.storage_account_containers)
  name = module.environment.storage_account_containers[count.index]
  storage_account_id = azurerm_storage_account.storage_account.id
  container_access_type = "private"
}

resource "azurerm_storage_share" "storage_share" {
  count = length(module.environment.storage_account_storage_shares)
  name = module.environment.storage_account_storage_shares[count.index]
  quota = 50
  storage_account_name = azurerm_storage_account.storage_account.name
}