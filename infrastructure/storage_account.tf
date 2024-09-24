resource "azurerm_storage_account" "storage_account_dev" {
    name = "${var.STORAGE_ACCOUNT_NAME}dev"
    resource_group_name = data.azurerm_resource_group.resource_group.name
    location = data.azurerm_resource_group.resource_group.location
    account_tier = "Standard"
    account_replication_type = "LRS"
}

resource "azurerm_storage_account" "storage_account_staging" {
    name = "${var.STORAGE_ACCOUNT_NAME}staging"
    resource_group_name = data.azurerm_resource_group.resource_group.name
    location = data.azurerm_resource_group.resource_group.location
    account_tier = "Standard"
    account_replication_type = "LRS"
}

resource "azurerm_storage_account" "storage_account_prod" {
    name = "${var.STORAGE_ACCOUNT_NAME}prod"
    resource_group_name = data.azurerm_resource_group.resource_group.name
    location = data.azurerm_resource_group.resource_group.location
    account_tier = "Standard"
    account_replication_type = "LRS"
}