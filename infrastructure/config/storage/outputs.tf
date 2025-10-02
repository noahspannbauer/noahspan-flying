output "account_name" {
  value = local.account_name[var.environment]
}

output "containers" {
  value = local.containers[var.environment]
}

output "shares" {
  value = local.shares[var.environment]
}

output "tables" {
  value = local.tables[var.environment]
}