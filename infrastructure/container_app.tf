# data "azuread_application" "app_registration" {
#   provider = azuread.external_tenant
#   display_name = module.environment.app_reg_name
# }

resource "azurerm_container_app" "container_app" {
  name = module.environment.app_name
  container_app_environment_id = data.azurerm_container_app_environment.container_app_environment.id
  resource_group_name = data.azurerm_resource_group.resource_group.name
  revision_mode = "Single"

  template {
    min_replicas = 0
    max_replicas = 2

    init_container {
      args = ["restore", "-if-db-not-exists", "-if-replica-exists", "/var/lib/data/flying.db"]
      cpu = 0.25
      image = "litestream/litestream:0.5.2"
      memory = "0.5Gi"
      name = "restore"

      volume_mounts {
        name = "data"
        path = "/var/lib/data"
      }

      volume_mounts {
        name = "backup"
        path = "/mnt/data"
        sub_path = "data"
      }

      volume_mounts {
        name = "backup"
        path = "/etc"
        sub_path = "litestream"
      }
    }

    container {
      args = ["replicate"]
      cpu = 0.25
      image = "litestream/litestream:0.5.2"
      memory = "0.5Gi"
      name = "replicate"

      volume_mounts {
        name = "data"
        path = "/var/lib/data"
      }

      volume_mounts {
        name = "backup"
        path = "/mnt/data"
        sub_path = "data"
      }

      volume_mounts {
        name = "backup"
        path = "/etc"
        sub_path = "litestream"
      }
    }

    container {
      cpu = 0.25
      image = "noahspan/flying:19615036250"
      memory = "0.5Gi"
      name = "flying"

      env {
        name = "AZURE_STORAGE_CONNECTION_STRING"
        secret_name = "azure-storage-connection-string"
      }

      env {
        name = "AUTHORITY"
        value = var.AUTHORITY
      }

      env {
        name = "AUDIENCE"
        value = var.CLIENT_ID
      }

      env {
        name = "CLIENT_ID"
        value = var.CLIENT_ID
      }

      env {
        name = "CLIENT_SECRET"
        secret_name = "client-secret"
      }

      env {
        name = "ISSUER_URL"
        value = var.ISSUER_URL
      }

      env {
        name = "JWKS_URI"
        value = var.JWKS_URI
      }

      env {
        name = "TENANT_ID"
        value = var.EXTERNAL_TENANT_ID
      }

      env {
        name = "DB_PATH"
        value = "/var/lib/data/flying.db"
      }

      env {
        name = "DB_SYNC"
        value = "false"
      }

      startup_probe {
        failure_count_threshold = 10
        initial_delay = 1
        interval_seconds = 2
        path = "/api/health"
        port = 3000
        transport = "HTTP"
      }

      volume_mounts {
        name = "data"
        path = "/var/lib/data"
      }
    }

    volume {
      name = "backup"
      storage_name = azurerm_container_app_environment_storage.container_app_environment_storage_database.name
      storage_type = "AzureFile"
    }

    volume {
      name = "data"
      storage_type = "EmptyDir"
    }
  }

  ingress {
    allow_insecure_connections = false
    external_enabled = true
    target_port = 3000
    transport = "auto"

    traffic_weight {
      latest_revision = true
      percentage = 100
    }
  }

  registry {
    server = "docker.io"
    username = var.DOCKER_IO_USERNAME
    password_secret_name = "docker-io-password"
  }

  secret {
    name = "azure-storage-connection-string"
    value = azurerm_storage_account.storage_account.primary_connection_string
  }

  secret {
    name = "client-secret"
    value = var.CLIENT_SECRET
  }

  secret {
    name = "docker-io-password"
    value = var.DOCKER_IO_PASSWORD
  }

  lifecycle {
    ignore_changes = [ template[0].container[0].image, template[0].container[0].image, template[0].init_container[0].image, registry[0].server ]
  }
}