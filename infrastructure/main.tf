# module "static_web_app" {
#     source = "github.com/noahspannbauer/noahspan-root/infrastructure/modules/static_web_app"
#     region = var.REGION
#     resource_group_name = data.azurerm_resource_group.resource_group.name
#     static_web_app_name = var.STATIC_WEB_APP_NAME
#     custom_domain_name_count = var.CUSTOM_DOMAIN_NAME_COUNT
#     domain_name = var.DOMAIN_NAME
#     subdomain_name = var.SUBDOMAIN_NAME
# }

resource "azurerm_static_web_app" "static_web_app" {
  name = var.STATIC_WEB_APP_NAME
  resource_group_name = data.azurerm_resource_group.resource_group.name
  location = var.REGION
}

resource "azurerm_dns_cname_record" "dns_cname_record" {
  name = var.SUBDOMAIN_NAME
  zone_name = data.azurerm_dns_zone.dns_zone.name
  resource_group_name = data.azurerm_resource_group.resource_group.name
  ttl = 14400
  record = azurerm_static_web_app.static_web_app.default_host_name
}

resource "azurerm_static_web_app_custom_domain" "static_web_app_custom_domain" {
  static_web_app_id = azurerm_static_web_app.static_web_app.id
  domain_name = "${var.SUBDOMAIN_NAME}.${var.DOMAIN_NAME}"
  validation_type = "cname-delegation"

  depends_on = [ azurerm_dns_cname_record.dns_cname_record ]
}