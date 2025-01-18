resource "azurerm_user_assigned_identity" "user_assigned_identity" {
  name = module.environment.user_assigned_identity_name
  resource_group_name = data.azurerm_resource_group.resource_group.name
  location = data.azurerm_resource_group.resource_group.location
}