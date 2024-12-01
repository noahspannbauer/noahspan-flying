resource "azurerm_container_app" "container_app_dev" {
  name = "flying-api-dev"
  container_app_environment_id = azurerm_container_app_environment.container_app_environment_dev.id
  resource_group_name = data.azurerm_resource_group.resource_group.name
  revision_mode = "Single"

  registry {
    server = "index.docker.io"
    username = var.DOCKER_IO_USERNAME
    password_secret_name = "docker-io-password"
  }

  template {
    min_replicas = 0
    max_replicas = 5

    container {
      name = "flying-api-dev"
      image = "noahspan/flying-api:v0.0.1"
      cpu = 0.25
      memory = "0.5Gi"

      env {
        name = "APP_CONFIG_URL"
        value = "https://noahspann-appconfig.azconfig.io"
      }

      env {
        name = "AZURE_STORAGE_ACCOUNT_KEY"
        secret_name = "azure-storage-account-key"
      }

      env {
        name = "AZURE_STORAGE_ACCOUNT_NAME"
        value = "noahspanflyingdev"
      }

      env {
        name = "AZURE_STROAGE_ACCOUNT_URL"
        value = "https://noahspanflyingdev.table.core.windows.net/"
      }

      env {
        name = "CLIENT_ID"
        secret_name = "client-id"
      }

      env {
        name = "CLIENT_SECRET"
        secret_name = "client-secret"
      }

      env {
        name = "TENANT_ID"
        value = "0f23652e-4b15-420f-991e-3d6fc769a31d"
      }
    }
  }

  ingress {
    allow_insecure_connections = false
    external_enabled = true
    target_port = 80
    transport = "auto"

    traffic_weight {
      latest_revision = true
      percentage = 100
    }
  }

  secret {
    name = "azure-storage-account-key"
    value = var.AZURE_STORAGE_ACCOUNT_KEY
  }

  secret {
    name = "client-id"
    value = var.CLIENT_ID
  }

  secret {
    name = "client-secret"
    value = var.CLIENT_SECRET
  }

  secret {
    name = "docker-io-password"
    value = var.DOCKER_IO_PASSWORD
  }
}
