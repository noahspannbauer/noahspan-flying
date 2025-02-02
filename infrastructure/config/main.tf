locals {
  container_app_app_name = {
    test = "flying-app-test"
    prod = "flying-app-prod"
  }

  container_app_app_container_image = {
    test = "noahspan/flying-app:v0.0.1"
    prod = "noahspan/flying-app:v0.0.1"
  }

  container_app_app_container_name = {
    test = "flying-app-test"
    prod = "flying-app-prod"
  }

  container_app_api_name = {
    test = "flying-api-test"
    prod = "flying-api-prod"
  }

  container_app_api_container_image = {
    test = "noahspan/flying-api:v0.0.1"
    prod = "noahspan/flying-api:v0.0.1"
  }

  container_app_api_container_name = {
    test = "flying-api-test"
    prod = "flying-api-prod"
  }

  container_app_api_dapr_app_id = {
    test = "flyingapitest"
    prod = "flyingpapiprod"
  }

  container_app_environment_name = {
    test = "flying-test"
    prod = "flying-prod"
  }

  logbook_feature_flag_active = {
    test = "true"
    prod = "true"
  }

  log_analytics_workspace_name = {
    test = "flying-log-analytics-workspace-test"
    prod = "flying-log-analytics-workspace-prod"
  }

  pilots_feature_flag_active = {
    test = "true"
    prod = "true"
  }

  storage_account_name = {
    test = "noahspanflyingtest"
    prod = "noahspanflyingprod"
  }
}