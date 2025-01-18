data "azurerm_dns_zone" "dns_zone" {
  name = var.DOMAIN_NAME
  resource_group_name = data.azurerm_resource_group.resource_group.name
}

# resource "azurerm_dns_txt_record" "dns_txt_record" {
#   name = "asuid.${var.APP_SUBDOMAIN_NAME}"
#   resource_group_name = data.azurerm_resource_group.resource_group.name
#   zone_name = data.azurerm_dns_zone.dns_zone.name
#   ttl = 14400

#   record {
#     value = azurerm_container_app.container_app_app.custom_domain_verification_id
#   }
# }