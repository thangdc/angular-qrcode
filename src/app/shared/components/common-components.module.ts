import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { commonComponents } from './index';
import { CoreModule } from '../../modules/core/core.module';
import { DesignService } from "../services";

@NgModule({
  declarations: [...commonComponents],
  imports: [
    CommonModule,
    RouterModule,
    CoreModule
  ],
  exports: [...commonComponents],
  providers: [
    DesignService
  ]
})
export class CommonComponentsModule {}
