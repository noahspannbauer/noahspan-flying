data "azurerm_client_config" "current" {}

data "azurerm_resource_group" "resource_group" {
  name = var.RESOURCE_GROUP_NAME
}

data "azurerm_container_app_environment" "container_app_environment" {
  name = module.environment.container_app_environment_name
  resource_group_name = var.RESOURCE_GROUP_NAME
}
