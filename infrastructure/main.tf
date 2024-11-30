resource "azurerm_static_web_app" "static_web_app" {
  name = var.STATIC_WEB_APP_NAME
  resource_group_name = data.azurerm_resource_group.resource_group.name
  location = var.REGION
  sku_size = "Free"
  sku_tier = "Free"
}

resource "azurerm_dns_cname_record" "dns_cname_record_app" {
  name = var.APP_SUBDOMAIN_NAME
  zone_name = data.azurerm_dns_zone.dns_zone.name
  resource_group_name = data.azurerm_resource_group.resource_group.name
  ttl = 14400
  record = azurerm_static_web_app.static_web_app.default_host_name
}

resource "azurerm_static_web_app_custom_domain" "static_web_app_custom_domain" {
  static_web_app_id = azurerm_static_web_app.static_web_app.id
  domain_name = "${var.APP_SUBDOMAIN_NAME}.${var.DOMAIN_NAME}"
  validation_type = "cname-delegation"

  depends_on = [ azurerm_dns_cname_record.dns_cname_record_app ]
}