import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { NotifierModule } from "angular-notifier";
import { CommonComponentsModule } from "../components/common-components.module";
import { HomeLayoutComponent } from "./home-layout/home-layout.component";
import { LoginLayoutComponent } from "./login-layout/login-layout.component";

@NgModule({
    declarations: [
        HomeLayoutComponent,
        LoginLayoutComponent
    ],
    imports: [
      CommonModule,
      RouterModule,
      CommonComponentsModule,
      NotifierModule
    ],
    exports: [RouterModule]
  })
  export class LayoutModule { }
  