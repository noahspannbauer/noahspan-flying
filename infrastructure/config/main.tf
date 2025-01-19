locals {
  container_app_app_name = {
    dev = "flying-app-dev"
    test = "flying-app-test"
    prod = "flying-app-prod"
  }

  container_app_app_container_image = {
    dev = "noahspan/flying-app:v0.0.1"
    test = "noahspan/flying-app:v0.0.1"
  }

  container_app_app_container_name = {
    dev = "flying-app-dev"
    test = "flying-app-test"
  }
  
  container_app_api_name = {
    dev = "flying-api-dev"
    test = "flying-api-test"
  }

  container_app_api_container_image = {
    dev = "noahspan/flying-api:v0.0.1"
    test = "noahspan/flying-api:v0.0.1"
  }

  container_app_api_container_name = {
    dev = "flying-api-dev"
    test = "flying-api-test"
  }

  container_app_api_dapr_app_id = {
    dev = "flyingapidev"
    test = "flyingapitest"
  }

  container_app_environment_name = {
    dev = "flying-dev"
    test = "flying-test"
  }

  logbook_feature_flag_active = {
    dev = "true"
    test = "true"
  }

  log_analytics_workspace_name = {
    dev = "flying-log-analytics-workspace-dev"
    test = "flying-log-analytics-workspace-test"
  }

  pilots_feature_flag_active = {
    dev = "true"
    test = "true"
  }

  storage_account_name = {
    dev = "noahspanflyingdev"
    test = "noahspanflyingtest"
  }
}