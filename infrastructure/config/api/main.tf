locals {
  app_name = {
    test = "flying-api-test"
    prod = "flying-api-prod"
  }

  container_image = {
    test = "docker.io/noahspan/flying-api:v2.0.0-beta"
    prod = "docker.io/noahspan/flying-api:v2.0.0-beta"
  }

  container_name = {
    test = "flying-api-test"
    prod = "flying-api-prod"
  }

  custom_domain_count = {
    test = 0
    prod = 0
  }

  ingress_external_enabled = {
    test = true
    prod = true
  }

  ingress_target_port = {
    test = 3000
    prod = 3000
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