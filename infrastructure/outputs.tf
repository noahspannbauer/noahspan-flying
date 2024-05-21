output "api_key" {
    value = module.static_web_app.api_key
    sensitive = true
}

output "default_host_name" {
    value = module.static_web_app.default_host_name
}