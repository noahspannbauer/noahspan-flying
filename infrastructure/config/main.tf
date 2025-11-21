module "app" {
  source = "./app"
  environment = var.environment
}

module "storage" {
  source = "./storage"
  environment = var.environment
}