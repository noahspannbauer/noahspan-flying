module "storage" {
  source = "github.com/noahspannbauer/noahspan-terraform/modules/storage"
  resource_group_name = var.RESOURCE_GROUP_NAME
  storage_account_name = module.environment.storage.account_name
  storage_containers = module.environment.storage.containers
  storage_shares = module.environment.storage.shares
  storage_tables = module.environment.storage.tables
}

module "container_app_environment" {
  source = "github.com/noahspannbauer/noahspan-terraform/modules/container_app_environment"
  container_app_environment_name = module.environment.container_app_environment.name
  log_analytics_workspace_name = module.environment.container_app_environment.log_analytics_workspace_name
  log_analytics_workspace_retention_in_days = 30
  log_analytics_workspace_sku = "PerGB2018"
  resource_group_name = var.RESOURCE_GROUP_NAME
}

module "container_app_environment_storage" {
  source = "github.com/noahspannbauer/noahspan-terraform/modules/container_app_environment_storage"
  name = "${module.container_app_environment.name}-files"
  container_app_environment_id = module.container_app_environment.id
  account_name = module.storage.name
  share_name = module.environment.storage.shares[0]
  access_key = module.storage.primary_access_key
  access_mode = "ReadWrite"
}

module "api" {
  source = "github.com/noahspannbauer/noahspan-terraform/modules/container_app"
  containers = [
    {
      cpu = 0.25
      envs = [
        {
          name = "AZURE_STORAGE_CONNECTION_STRING"
          secret_name = "azure-storage-connection-string"
        },
        {
          name = "CLIENT_ID"
          secret_name = "client-id"
        },
        {
          name = "CLIENT_SECRET"
          secret_name = "client-secret"
        },
        {
          name = "TENANT_ID"
          secret_name = "tenant-id"
        },
        {
          name = "DB_PATH"
          secret_name = "db-path"
        },
        {
          name = "DB_SYNC"
          secret_name = "db-sync"
        }
      ]
      image = module.environment.api.container_image
      memory = "0.5Gi"
      name = module.environment.api.container_name
      startup_probe = [
        {
          failure_count_threshold = 10
          initial_delay = 1
          interval_seconds = 2
          path = "/api/health"
          port = 3000
          transport = "HTTP"
        }
      ]
      volume_mounts = [
        {
          name = "${module.container_app_environment.name}-emptydir"
          path = "/var/lib/data"
        }
      ]
    },
    {
      args = ["replicate"]
      cpu = 0.25
      image = "docker.io/litestream/litestream:0.3.13"
      memory = "0.5Gi"
      name = "replicate"
      volume_mounts = [
        {
          name = "${module.container_app_environment.name}-emptydir"
          path = "/var/lib/data"
        },
                {
          name = "${module.container_app_environment.name}-fileshare"
          path = "/mnt/data"
          sub_path = "data"
        },
        {
          name = "${module.container_app_environment.name}-fileshare"
          path = "/etc"
          sub_path = "litestream"
        }
      ]
    }
  ]
  container_app_name = module.environment.api.app_name
  container_app_environment_id = module.container_app_environment.id
  custom_domain_count = module.environment.api.custom_domain_count
  init_containers = [
    {
      args = ["restore", "-if-db-not-exists", "-if-replica-exists", "/var/lib/data/flying.db"]
      cpu = 0.25
      image = "docker.io/litestream/litestream:0.3.13"
      memory = "0.5Gi"
      name = "restore"
      volume_mounts = [
        {
          name = "${module.container_app_environment.name}-emptydir"
          path = "/var/lib/data"
        },
        {
          name = "${module.container_app_environment.name}-fileshare"
          path = "/mnt/data"
          sub_path = "data"
        },
        {
          name = "${module.container_app_environment.name}-fileshare"
          path = "/etc"
          sub_path = "litestream"
        }
      ]
    }
  ]
  ingress_external_enabled = module.environment.api.ingress_external_enabled
  ingress_target_port = module.environment.api.ingress_target_port
  ingress_transport = module.environment.api.ingress_transport
  registry_password = var.DOCKER_IO_PASSWORD
  registry_username = var.DOCKER_IO_USERNAME
  registry_password_secret_name = "docker-io-password"
  registry_server_name = "docker.io"
  resource_group_name = var.RESOURCE_GROUP_NAME
  secrets = [
    {
      name = "azure-storage-connection-string"
      value = module.storage.primary_connection_string
    },
    {
      name = "docker-io-password"
      value = var.DOCKER_IO_PASSWORD
    },
    {
      name = "client-id"
      value = var.CLIENT_ID
    },
    {
      name = "client-secret"
      value = var.CLIENT_SECRET
    },
    {
      name = "tenant-id"
      value = var.TENANT_ID
    },
    {
      name = "db-path"
      value = var.DB_PATH
    },
    {
      name = "db-sync"
      value = var.DB_SYNC
    }
  ]
  storage_account_primary_connection_string = module.storage.primary_connection_string
  traffic_weight_percentage = module.environment.api.traffic_weight_percentage
  template_min_replicas = module.environment.api.template_min_replicas
  template_max_replicas = module.environment.api.template_max_replicas
  volume = [
    {
      name = "${module.container_app_environment.name}-fileshare"
      storage_name = module.container_app_environment_storage.name
      storage_type = "AzureFile"
    },
    {
      name = "${module.container_app_environment.name}-emptydir"
      storage_type = "EmptyDir"
    }
  ]
}

module "app" {
  source = "github.com/noahspannbauer/noahspan-terraform/modules/container_app"
  containers = [
    {
      cpu = 0.25
      image = module.environment.app.container_image
      memory = "0.5Gi"
      name = module.environment.app.container_name
    }
  ]
  container_app_name = module.environment.app.app_name
  container_app_environment_id = module.container_app_environment.id
  custom_domain_count = module.environment.app.custom_domain_count
  ingress_external_enabled = module.environment.app.ingress_external_enabled
  ingress_target_port = module.environment.app.ingress_target_port
  registry_password = var.DOCKER_IO_PASSWORD
  registry_username = var.DOCKER_IO_USERNAME
  registry_password_secret_name = "docker-io-password"
  registry_server_name = "docker.io"
  resource_group_name = var.RESOURCE_GROUP_NAME
  secrets = [
    {
      name = "docker-io-password"
      value = var.DOCKER_IO_PASSWORD
    }
  ]
  traffic_weight_percentage = module.environment.app.traffic_weight_percentage
  template_max_replicas = module.environment.app.template_max_replicas
  template_min_replicas = module.environment.app.template_min_replicas
}