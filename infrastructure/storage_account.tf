resource "azurerm_storage_account" "storage_account" {
    name = module.environment.storage_account_name
    resource_group_name = data.azurerm_resource_group.resource_group.name
    location = data.azurerm_resource_group.resource_group.location
    account_tier = "Standard"
    account_replication_type = "LRS"
}

resource "azurerm_storage_table" "logs_table" {
  name = "logs"
  storage_account_name = azurerm_storage_account.storage_account.name
}

resource "azurerm_storage_table" "pilot_table" {
  name = "pilots"
  storage_account_name = azurerm_storage_account.storage_account.name
}

resource "azurerm_storage_table" "feature_flags_table" {
  name = "featureFlags"
  storage_account_name = azurerm_storage_account.storage_account.name
}

resource "azurerm_storage_table_entity" "logbook_feature_flag_entity" {
  storage_table_id = azurerm_storage_table.feature_flags_table.id

  partition_key = "featureFlag"
  row_key       = "logbook"

  entity = {
    active = module.environment.logbook_feature_flag_active
  }
}

resource "azurerm_storage_table_entity" "pilots_feature_flag_entity" {
  storage_table_id = azurerm_storage_table.feature_flags_table.id

  partition_key = "featureFlag"
  row_key       = "pilots"

  entity = {
    active = module.environment.pilots_feature_flag_active
  }
}