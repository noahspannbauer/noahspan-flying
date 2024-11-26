variable "REGION" {
    type = string
}

variable "RESOURCE_GROUP_NAME" {
  type = string
}

variable "STATIC_WEB_APP_NAME" {
    type = string
}

variable "DOMAIN_NAME" {
    type = string
}

variable "SUBDOMAIN_NAME" {
  type = string
}

variable "CUSTOM_DOMAIN_NAME_COUNT" {
  type = number
}

variable "STORAGE_ACCOUNT_NAME" {
  type = string
}

variable "CLIENT_ID" {
  type = string
}

variable "CLIENT_SECRET" {
  type = string
  sensitive = true
}

variable "TENANT_ID" {
  type = string
}

