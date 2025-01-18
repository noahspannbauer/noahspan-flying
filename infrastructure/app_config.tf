data "azurerm_app_configuration" "app_configuration" {
  name = "noahspan-appconfig"
  resource_group_name = data.azurerm_resource_group.resource_group.name
}

resource "azurerm_app_configuration_feature" "pilots_app_configuration_feature" {
    configuration_store_id = data.azurerm_app_configuration.app_configuration.id
    description = "Feature flag for pilots page"
    name = "flying-pilots"
    label = var.WORKSPACE
    enabled = false
}

resource "azurerm_app_configuration_feature" "logbook_app_configuration_feature" {
    configuration_store_id = data.azurerm_app_configuration.app_configuration.id
    description = "Feature flag for logbook page"
    name = "flying-logbook"
    label = var.WORKSPACE
    enabled = false
}