# data "azurerm_client_config" "current" {
# }

# resource "azurerm_log_analytics_workspace" "log_analytics_workspace" {
#   name = module.environment.log_analytics_workspace_name
#   location = data.azurerm_resource_group.resource_group.location
#   resource_group_name = data.azurerm_resource_group.resource_group.name
#   sku = "PerGB2018"
#   retention_in_days = 30
# }

# resource "azurerm_container_app_environment" "container_app_environment" {
#   name = module.environment.container_app_environment_name
#   location = data.azurerm_resource_group.resource_group.location
#   resource_group_name = data.azurerm_resource_group.resource_group.name
#   log_analytics_workspace_id = azurerm_log_analytics_workspace.log_analytics_workspace.id
# }

# resource "azurerm_container_app" "container_app_api" {
#   name = module.environment.container_app_api_name
#   container_app_environment_id = azurerm_container_app_environment.container_app_environment.id
#   resource_group_name = data.azurerm_resource_group.resource_group.name
#   revision_mode = "Single"

#   registry {
#     server = "index.docker.io"
#     username = var.DOCKER_IO_USERNAME
#     password_secret_name = "docker-io-password"
#   }

#   template {
#     min_replicas = 0
#     max_replicas = 2

#     container {
#       name = module.environment.container_app_api_container_name
#       image = module.environment.container_app_api_container_image
#       cpu = 0.25
#       memory = "0.5Gi"

#       env {
#         name = "AZURE_STORAGE_CONNECTION_STRING"
#         secret_name = "azure-storage-connection-string"
#       }

#       env {
#         name = "CLIENT_ID"
#         secret_name = "client-id"
#       }

#       env {
#         name = "CLIENT_SECRET"
#         secret_name = "client-secret"
#       }

#       env {
#         name = "TENANT_ID"
#         secret_name = "tenant-id"
#       }
#     }
#   }

#   ingress {
#     allow_insecure_connections = false
#     external_enabled = true
#     target_port = 3000
#     transport = "auto"

#     traffic_weight {
#       latest_revision = true
#       percentage = 100
#     }
#   }

#   secret {
#     name = "docker-io-password"
#     value = var.DOCKER_IO_PASSWORD
#   }

#   secret {
#     name = "azure-storage-connection-string"
#     value = azurerm_storage_account.storage_account.primary_connection_string
#   }

#   secret {
#     name = "client-id"
#     value = var.CLIENT_ID
#   }

#   secret {
#     name = "client-secret"
#     value = var.CLIENT_SECRET
#   }

#   secret {
#     name = "tenant-id"
#     value = var.TENANT_ID
#   }

#   lifecycle {
#     ignore_changes = [ template[0].container[0].image ]
#   }
# }

# resource "azurerm_container_app" "container_app_app" {
#   name = module.environment.container_app_app_name
#   container_app_environment_id = azurerm_container_app_environment.container_app_environment.id
#   resource_group_name = data.azurerm_resource_group.resource_group.name
#   revision_mode = "Single"

#   registry {
#     server = "index.docker.io"
#     username = var.DOCKER_IO_USERNAME
#     password_secret_name = "docker-io-password"
#   }

#   template {
#     min_replicas = 0
#     max_replicas = 2

#     container {
#       name = module.environment.container_app_app_container_name
#       image = module.environment.container_app_app_container_image
#       cpu = 0.25
#       memory = "0.5Gi"
#     }
#   }

#   ingress {
#     allow_insecure_connections = false
#     external_enabled = true
#     target_port = 8080
#     transport = "auto"

#     traffic_weight {
#       latest_revision = true
#       percentage = 100
#     }
#   }

#   secret {
#     name = "docker-io-password"
#     value = var.DOCKER_IO_PASSWORD
#   }

#   lifecycle {
#     ignore_changes = [ template[0].container[0].image ]
#   }
# }

# resource "azurerm_container_app_custom_domain" "custom_domain" {
#   count = module.environment.custom_domain_count
#   name = trimsuffix(trimprefix(azurerm_dns_txt_record.dns_txt_record[0].fqdn, "asuid."), ".")
#   container_app_id = azurerm_container_app.container_app_app.id
  
#   lifecycle {
#     ignore_changes = [ certificate_binding_type, container_app_environment_certificate_id ]
#   }
# }

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
  storage_account_name = module.environment.storage_account_name
  storage_tables = module.environment.storage_tables
  tenant_id = var.TENANT_ID
}