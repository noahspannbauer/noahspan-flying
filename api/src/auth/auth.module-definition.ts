import { ConfigurableModuleBuilder } from '@nestjs/common';
import { AuthModuleOptions } from './auth.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } = new ConfigurableModuleBuilder<AuthModuleOptions>().build()