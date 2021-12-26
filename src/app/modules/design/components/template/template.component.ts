import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { TemplateModel } from 'src/app/shared/models';
import { 
  deleteTemplateAction, 
  getTemplatesAction, 
  getTemplatesSelector, 
  markTemplateAsDefaultAction
} from 'src/app/stores';
import { TemplateDialogComponent } from '../template-dialog/template-dialog.component';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit {

  templates: TemplateModel[] = [];
  items: TemplateModel[] = [];

  constructor(private store: Store,
    private modal: NgbModal) { }
  
  ngOnInit(): void {
    this.bindData();
  }

  bindData() {
    const that = this;
    that.store.dispatch(getTemplatesAction());
    that.store.select(getTemplatesSelector).subscribe(items => {
      if (items) {
        that.templates = items;
      } else {
        that.templates = [];
      }
      that.items = that.templates;
    });
  }

  addNew() {
    let ref = this.modal.open(TemplateDialogComponent, { size: 'lg', backdrop: 'static' });
    ref.componentInstance.data = { id: 0 };
  }

  updateTemplate(id: number) {
    let ref = this.modal.open(TemplateDialogComponent, { size: 'lg', backdrop: 'static' });
    let template = this.templates.find(x => x.id === id);
    ref.componentInstance.data = { id: template.id, template: template };
  }

  deleteTemplate(id: number) {
    var yes = confirm('Bạn có muốn xóa mẫu này không?');
    if (yes) {
      this.store.dispatch(deleteTemplateAction({ id }));
    }
  }

  markAsDefault(id: number) {
    this.store.dispatch(markTemplateAsDefaultAction({ id }));
  }

  onSearchChange(keyword: string) {
    if (keyword) {
      this.items = this.templates.filter(x => x.name.toLocaleLowerCase().indexOf(keyword.toLocaleLowerCase()) !== -1 || x.description.indexOf(keyword.toLocaleLowerCase()) !== -1)
    } else {
      this.items = this.templates;
    }
  }
}
