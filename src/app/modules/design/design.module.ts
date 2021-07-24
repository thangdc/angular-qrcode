import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './pages/home/home.component';
import { DesignRoutingModule } from './design-routing.module';
import { BoardComponent } from './components/board/board.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { SidePanelComponent } from './components/side-panel/side-panel.component';
import { TemplateComponent } from './components/template/template.component';
import { UploadComponent } from './components/upload/upload.component';
import { ResizeComponent } from './components/resize/resize.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConfigComponent } from './components/config/config.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { CoreModule } from '../core/core.module';

@NgModule({
  declarations: [
    HomeComponent,
    BoardComponent,
    ToolbarComponent,
    SidePanelComponent,
    TemplateComponent,
    UploadComponent,
    ResizeComponent,
    ConfigComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DesignRoutingModule,
    AngularEditorModule,
    CoreModule
  ]
})
export class DesignModule { }
