import { ConfigurableModuleBuilder } from '@nestjs/common';
import { MsGraphModuleOptions } from './ms-graph.interface';

export const { ConfigurableModuleClass, MODULE_OPTIONS_TOKEN } = new ConfigurableModuleBuilder<MsGraphModuleOptions>().build()