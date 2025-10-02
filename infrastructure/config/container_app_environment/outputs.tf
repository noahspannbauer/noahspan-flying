output "name" {
  value = local.name[var.environment]
}

output "log_analytics_workspace_name" {
  value = local.log_analytics_workspace_name[var.environment]
}