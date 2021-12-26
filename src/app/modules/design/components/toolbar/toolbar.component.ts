import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TemplateModel } from 'src/app/shared/models';
import { getDefaultTemplateSelector, getShapeSelector } from 'src/app/stores/selectors';
import { ConfigComponent } from '../config/config.component';
import { ExportComponent } from '../export/export.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Output() export: EventEmitter<any> = new EventEmitter();
  @Output() draw: EventEmitter<any> = new EventEmitter();

  data: any;
  template: TemplateModel;

  constructor(
    private store: Store,
    private modal: NgbModal) { }
  
  ngOnInit(): void {
    this.getTemplate();
  }

  openDialog(id: number) {
    if (this.template && this.template.id > 0) {
      let ref = this.modal.open(ConfigComponent, { size: 'lg', backdrop: 'static' });
      ref.componentInstance.data = {
        id: id
      };
    } else {
      alert('Vui lòng chọn mẫu cần thiết kế.');
    }
  }

  getTemplate() {
    const that = this;
    that.store.select(getDefaultTemplateSelector).subscribe(data => {
      that.template = data;
    });    
  }

  exportData() {
    this.modal.open(ExportComponent, { backdrop: 'static' });
  }
}
