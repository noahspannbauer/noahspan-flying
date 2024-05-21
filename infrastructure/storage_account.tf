resource "azurerm_storage_account" "storage_account" {
    name = var.STORAGE_ACCOUNT_NAME
    resource_group_name = data.azurerm_resource_group.resource_group.name
    location = data.azurerm_resource_group.resource_group.location
    account_tier = "Standard"
    account_replication_type = "GRS"
}