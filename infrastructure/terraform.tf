terraform {
  required_version = ">= 1.1.0"

  required_providers {
    azurerm = {
      source = "hashicorp/azurerm"
      version = "4.40.0"
    }

    azuread = {
      source = "hashicorp/azuread"
    }

    random = {
      source = "hashicorp/random"
    }
  }

  backend "azurerm" {
    resource_group_name = "noahspan"
    storage_account_name = "noahspanterraform"
    key = "terraform.tfstate"
  }
}