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

output "container_app_api_dapr_app_id" {
  value = local.container_app_api_dapr_app_id[var.environment]
}

output "container_app_environment_name" {
  value = local.container_app_environment_name[var.environment]
}

output "key_vault_name" {
  value = local.key_vault_name[var.environment]
}

output "log_analytics_workspace_name" {
  value = local.log_analytics_workspace_name[var.environment]
}

output "storage_account_name" {
  value = local.storage_account_name[var.environment]
}

output "user_assigned_identity_name" {
  value = local.user_assigned_identity_name[var.environment]
}