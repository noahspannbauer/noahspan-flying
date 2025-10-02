output "app_name" {
  value = local.app_name[var.environment]
}

output "container_image" {
  value = local.container_image[var.environment]
}

output "container_name" {
  value = local.container_name[var.environment]
}

output "custom_domain_count" {
  value = local.custom_domain_count[var.environment]
}

output "ingress_external_enabled" {
  value = local.ingress_external_enabled[var.environment]
}

output "ingress_target_port" {
  value = local.ingress_target_port[var.environment]
}

output "ingress_transport" {
  value = local.ingress_transport[var.environment]
}

output "traffic_weight_percentage" {
  value = local.traffic_weight_percentage[var.environment]
}

output "template_min_replicas" {
  value = local.template_min_replicas[var.environment]
}

output "template_max_replicas" {
  value = local.template_max_replicas[var.environment]
}