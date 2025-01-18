locals {
  container_app_app_name = {
    dev = "flying-app-dev"
  }


  container_app_app_container_image = {
    dev = "noahspan/flying-app:v0.0.1"
  }

  container_app_app_container_name = {
    dev = "flying-app-dev"
  }
  
  container_app_api_name = {
    dev = "flying-api-dev"
  }

  container_app_api_container_image = {
    dev = "noahspan/flying-api:v0.0.1"
  }

  container_app_api_container_name = {
    dev = "flying-api-dev"
  }

  container_app_api_dapr_app_id = {
    dev = "flyingapidev"
  }

  container_app_environment_name = {
    dev = "flying-dev"
  }

  key_vault_name = {
    dev = "noahspanflyingkeyvault"
  }

  log_analytics_workspace_name = {
    dev = "flying-log-analytics-workspace-dev"
  }

  storage_account_name = {
    dev = "noahspanflyingdev"
  }

  user_assigned_identity_name = {
    dev = "noahspanflyingdevuser"
  }
}