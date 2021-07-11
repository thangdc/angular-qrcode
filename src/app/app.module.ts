import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonComponentsModule } from './shared/components/common-components.module';
import { LayoutModule } from './shared/layouts/layout-module';
import { reducers, metaReducers } from './stores/reducers';
import { effects } from './stores';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule, DesignModule } from './modules';
import { NotifierModule } from 'angular-notifier';
const staticModules = [
  CoreModule,
  LayoutModule,
  CommonComponentsModule,
  DesignModule
]

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    StoreModule.forRoot({}),
    StoreModule.forFeature('appFeatures', reducers, {
      metaReducers
    }),
    EffectsModule.forRoot(effects),
    NotifierModule,
    ...staticModules
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
