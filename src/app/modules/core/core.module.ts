import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { ApiService, AuthGuard, AuthService } from './services';
import { SafeHtmlPipe } from './pipes';

@NgModule({
  declarations: [SafeHtmlPipe],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    ApiService,
    AuthService,
    AuthGuard
  ],
  exports: [
    SafeHtmlPipe
  ]
})
export class CoreModule { }
