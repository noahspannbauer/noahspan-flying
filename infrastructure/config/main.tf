locals {
  app_name = {
    test = "flying-test"
    prod = "flying-prod"
  }

  container_image = {
    test = "noahspan/flying-app:v2.0.0-alpha"
    prod = "noahspan/flying-app:v2.0.0-alpha"
  }

  container_name = {
    test = "flying-container-test"
    prod = "flying-container-prod"
  }

  container_app_environment_name = {
    test = "noahspan-test"
    prod = "noahspan-prod"
  }
  
  storage_account_name = {
    test = "noahspanflyingtest"
    prod = "noahspanflyingprod"
  }

  storage_account_containers = {
    test = ["tracks"]
    prod = ["tracks"]
  }

  storage_account_storage_shares = {
    test = ["flying-test-database-share"]
    prod = ["flying-prod-database-share"]
  }
}
