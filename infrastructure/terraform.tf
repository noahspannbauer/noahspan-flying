terraform {
  required_version = ">= 1.1.0"

  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
    }
  }

  backend "remote" {
    hostname     = "app.terraform.io"
    organization = "noahspan"

    workspaces {
      prefix = "noahspan-"
    }
  }
}