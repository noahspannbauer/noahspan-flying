output "container_app_app_name" {
  value = local.container_app_app_name[var.environment]
}

output "container_app_app_container_image" {
  value = local.container_app_app_container_image[var.environment]
}

output "container_app_app_container_name" {
  value = local.container_app_app_container_name[var.environment]
}

output "container_app_api_name" {
  value = local.container_app_api_name[var.environment]
}

output "container_app_api_container_image" {
  value = local.container_app_api_container_image[var.environment]
}

output "container_app_api_container_name" {
  value = local.container_app_api_container_name[var.environment]
}

output "container_app_environment_name" {
  value = local.container_app_environment_name[var.environment]
}

output "custom_domain_count" {
  value = local.custom_domain_count[var.environment]
}

output "logbook_feature_flag_active" {
  value = local.logbook_feature_flag_active[var.environment]
}

output "log_analytics_workspace_name" {
  value = local.log_analytics_workspace_name[var.environment]
}

output "pilots_feature_flag_active" {
  value = local.pilots_feature_flag_active[var.environment]
}

output "storage_account_name" {
  value = local.storage_account_name[var.environment]
}

output "storage_tables" {
  value = local.storage_tables[var.environment]
}