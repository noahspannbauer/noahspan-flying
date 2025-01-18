variable "API_SUBDOMAIN_NAME" {
  type = string
}

variable "APP_SUBDOMAIN_NAME" {
  type = string
}

variable "CLIENT_ID" {
  type = string
}

variable "CLIENT_SECRET" {
  type = string
  sensitive = true
}

variable "DOCKER_IO_PASSWORD" {
  type = string
  sensitive = true
}

variable "DOCKER_IO_USERNAME" {
  type = string
}

variable "DOMAIN_NAME" {
    type = string
}

variable "CUSTOM_DOMAIN_NAME_COUNT" {
  type = number
}

variable "REGION" {
    type = string
}

variable "RESOURCE_GROUP_NAME" {
  type = string
}

variable "TENANT_ID" {
  type = string
}

variable "WORKSPACE" {
  type = string
}

