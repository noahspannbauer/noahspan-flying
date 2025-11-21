locals {
  app_name = {
    test = "flying-test"
    prod = "flying-prod"
  }

  container_app_environment_name = {
    test = "noahspan-test"
    prod = "noahspan-prod"
  }

  container_image = {
    test = "noahspan/flying-app:v2.0.0-alpha"
    prod = "noahspan/flying-app:v2.0.0-alpha"
  }

  container_name = {
    test = "flying-app-test"
    prod = "flying-app-prod"
  }

  custom_domain_count = {
    test = 0
    prod = 1
  }

  ingress_external_enabled = {
    test = true
    prod = true
  }

  ingress_target_port = {
    test = 8080
    prod = 8080
  }

  ingress_transport = {
    test = "auto"
    prod = "auto"
  }

  traffic_weight_percentage = {
    test = 100
    prod = 100
  }

  template_min_replicas = {
    test = 0
    prod = 0
  }

  template_max_replicas = {
    test = 2
    prod = 2
  }
}