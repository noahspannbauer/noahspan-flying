resource "azurerm_service_plan" "service_plan" {
  name = "noahspan-flying-api-service-plan"
  resource_group_name = data.azurerm_resource_group.resource_group.name
  location = data.azurerm_resource_group.resource_group.location
  os_type = "Linux"
  sku_name = "Y1"
}

resource "azurerm_linux_function_app" "function_app_dev" {
  name = "noahspanflyingapidev"
  resource_group_name = data.azurerm_resource_group.resource_group.name
  location = data.azurerm_resource_group.resource_group.location
  service_plan_id = azurerm_service_plan.service_plan.id
  storage_account_name = azurerm_storage_account.storage_account_dev.name
  storage_account_access_key = azurerm_storage_account.storage_account_dev.primary_access_key

  app_settings = {
    "CLIENT_ID" = "${var.CLIENT_ID}"
    "CLIENT_SECRET" = "${var.CLIENT_SECRET}"
    "TENANT_ID" = "${var.TENANT_ID}"
    "AZURE_STORAGE_ACCOUNT_NAME" = azurerm_storage_account.storage_account_dev.name
    "AZURE_STORAGE_ACCOUNT_KEY" = azurerm_storage_account.storage_account_dev.primary_access_key
    "AZURE_STORAGE_ACCOUNT_URL" = azurerm_storage_account.storage_account_dev.primary_table_host
  }
  
  auth_settings_v2 {
    active_directory_v2 {
      client_id = var.CLIENT_ID
      tenant_auth_endpoint = "https://login.microsoftonline.com/${var.TENANT_ID}/v2.0/"
      client_secret_setting_name = "CLIENT_SECRET"
    }

    login {
      
    }
  }  

  site_config {
    application_stack {
      node_version = 20
    }

    cors {
      allowed_origins = [ azurerm_static_web_app.static_web_app.default_host_name ]
    }
  }
}