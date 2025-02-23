locals {
  container_app_app_name = {
    test = "flying-app-test"
    prod = "flying-app-prod"
  }

  container_app_app_container_image = {
    test = "noahspan/flying-app:v1.0.0"
    prod = "noahspan/flying-app:v1.0.0"
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
    test = "noahspan/flying-api:v1.0.0"
    prod = "noahspan/flying-api:v1.0.0"
  }

  container_app_api_container_name = {
    test = "flying-api-test"
    prod = "flying-api-prod"
  }

  container_app_environment_name = {
    test = "flying-test"
    prod = "flying-prod"
  }

  custom_domain_count = {
    test = 0
    prod = 1
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

  storage_tables = {
    test = ["logs", "pilots"]
    prod = ["logs", "pilots"]
  }
}