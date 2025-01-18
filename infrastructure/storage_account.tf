resource "azurerm_storage_account" "storage_account" {
    name = module.environment.storage_account_name
    resource_group_name = data.azurerm_resource_group.resource_group.name
    location = data.azurerm_resource_group.resource_group.location
    account_tier = "Standard"
    account_replication_type = "LRS"

    identity {
      type = "UserAssigned"
      identity_ids = [azurerm_user_assigned_identity.user_assigned_identity.id]
    }
}

resource "azurerm_storage_table" "logs_table" {
  name = "logs"
  storage_account_name = azurerm_storage_account.storage_account.name
}

resource "azurerm_storage_table" "pilot_table" {
  name = "pilots"
  storage_account_name = azurerm_storage_account.storage_account.name
}