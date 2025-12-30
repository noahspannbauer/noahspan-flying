variable "AUTHORITY" {
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

variable "ISSUER_URL" {
  type = string
}

variable "JWKS_URI" {
  type = string
}

variable "RESOURCE_GROUP_NAME" {
  type = string
}

variable "EXTERNAL_TENANT_ID" {
  type = string
}

variable "SESSION_SECRET" {
  sensitive = true
  type = string
}

variable "TENANT_ID" {
  type = string
}

variable "WORKSPACE" {
  type = string
}

