module "api" {
  source = "./api"
  environment = var.environment
}

module "app" {
  source = "./app"
  environment = var.environment
}

module "container_app_environment" {
  source = "./container_app_environment"
  environment = var.environment
}

module "storage" {
  source = "./storage"
  environment = var.environment
}