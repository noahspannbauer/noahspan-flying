output "app_name" {
  value = local.app_name[var.environment]
}

output "app_reg_name" {
  value = local.app_reg_name[var.environment]
}

output "app_reg_federated_identity_credential_subject" {
  value = local.app_reg_federated_identity_credential_subject[var.environment]
}

output "container_image" {
  value = local.container_image[var.environment]
}

output "container_name" {
  value = local.container_name[var.environment]
}

output "container_app_environment_name" {
  value = local.container_app_environment_name[var.environment]
}

output "storage_account_name" {
  value = local.storage_account_name[var.environment]
}

output "storage_account_containers" {
  value = local.storage_account_containers[var.environment]
}

output "storage_account_storage_shares" {
  value = local.storage_account_storage_shares[var.environment]
}