module "storage" {
  source = "github.com/noahspannbauer/noahspan-terraform/modules/storage"
  resource_group_name = var.RESOURCE_GROUP_NAME
  storage_account_name = module.environment.storage_account_name
  storage_containers = module.environment.storage_containers
  storage_tables = module.environment.storage_tables
}

module "container_app" {
  source = "github.com/noahspannbauer/noahspan-terraform/modules/container_app"
  app_subdomain_name = var.APP_SUBDOMAIN_NAME
  client_id = var.CLIENT_ID
  client_secret = var.CLIENT_SECRET
  container_app_app_name = module.environment.container_app_app_name
  container_app_app_container_image = module.environment.container_app_api_container_image
  container_app_app_container_name = module.environment.container_app_api_container_name
  container_app_api_name = module.environment.container_app_api_name
  container_app_api_container_image = module.environment.container_app_api_container_image
  container_app_api_container_name = module.environment.container_app_api_container_name
  container_app_environment_name = module.environment.container_app_environment_name
  custom_domain_count = module.environment.custom_domain_count
  dns_zone_resource_group = var.DNS_ZONE_RESOURCE_GROUP
  docker_io_password = var.DOCKER_IO_PASSWORD
  docker_io_username = var.DOCKER_IO_USERNAME
  domain_name = var.DOMAIN_NAME
  log_analytics_workspace_name = module.environment.log_analytics_workspace_name
  resource_group_name = var.RESOURCE_GROUP_NAME
  storage_account_primary_connection_string = module.storage.storage_account_primary_connection_string
  tenant_id = var.TENANT_ID
}