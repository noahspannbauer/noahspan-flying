data "azurerm_dns_zone" "dns_zone" {
  name = var.DOMAIN_NAME
}

data "azurerm_resource_group" "dns_zone_resource_group" {
  name = "noahspan"
}

resource "azurerm_dns_txt_record" "dns_txt_record" {
  count = module.environment.custom_domain_count
  name = "asuid.${var.APP_SUBDOMAIN_NAME}"
  resource_group_name = data.azurerm_resource_group.dns_zone_resource_group.name
  zone_name = data.azurerm_dns_zone.dns_zone.name
  ttl = 14400

  record {
    value = azurerm_container_app.container_app_app.custom_domain_verification_id
  }
}