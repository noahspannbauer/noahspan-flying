import { Module } from '@nestjs/common';
import { MsGraphService } from './ms-graph.service';
import { ConfigurableModuleClass } from './ms-graph.module-definition';

@Module({
    providers: [MsGraphService],
    exports: [MsGraphService]
})
export class MsGraphModule extends ConfigurableModuleClass {}