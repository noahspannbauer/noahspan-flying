locals {
  container_app_app_name = {
    dev = "flying-app-dev"
    test = "flying-app-test"
    prod = "flying-app-prod"
  }

  container_app_app_container_image = {
    dev = "noahspan/flying-app:v0.0.1"
    test = "noahspan/flying-app:v0.0.1"
    prod = "noahspan/flying-app:v0.0.1"
  }

  container_app_app_container_name = {
    dev = "flying-app-dev"
    test = "flying-app-test"
    prod = "flying-app-prod"
  }

  container_app_app_redirect_url = {
    dev = "https://flying-app-dev.greensea-e83e7646.centralus.azurecontainerapps.io"
  }
  
  container_app_api_name = {
    dev = "flying-api-dev"
    test = "flying-api-test"
    prod = "flying-api-prod"
  }

  container_app_api_container_image = {
    dev = "noahspan/flying-api:v0.0.1"
    test = "noahspan/flying-api:v0.0.1"
    prod = "noahspan/flying-api:v0.0.1"
  }

  container_app_api_container_name = {
    dev = "flying-api-dev"
    test = "flying-api-test"
    prod = "flying-api-prod"
  }

  container_app_api_dapr_app_id = {
    dev = "flyingapidev"
    test = "flyingapitest"
    prod = "flyingpapiprod"
  }

  container_app_environment_name = {
    dev = "flying-dev"
    test = "flying-test"
    prod = "flying-prod"
  }

  logbook_feature_flag_active = {
    dev = "true"
    test = "true"
    prod = "true"
  }

  log_analytics_workspace_name = {
    dev = "flying-log-analytics-workspace-dev"
    test = "flying-log-analytics-workspace-test"
    prod = "flying-log-analytics-workspace-prod"
  }

  pilots_feature_flag_active = {
    dev = "true"
    test = "true"
    prod = "true"
  }

  storage_account_name = {
    dev = "noahspanflyingdev"
    test = "noahspanflyingtest"
    prod = "noahspanflyingprod"
  }
}