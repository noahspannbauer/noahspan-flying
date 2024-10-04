data "azurerm_dns_zone" "dns_zone" {
  name = var.DOMAIN_NAME
  resource_group_name = data.azurerm_resource_group.resource_group.name
}