import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { addTemplateAction, getTemplatesAction, updateTemplateAction } from 'src/app/stores';

@Component({
  selector: 'app-template-dialog',
  templateUrl: './template-dialog.component.html',
  styleUrls: ['./template-dialog.component.scss']
})
export class TemplateDialogComponent implements OnInit {

  @Input() data;
  templateForm: FormGroup;
  
  constructor(public activeModal: NgbActiveModal,
    private store: Store) { }

  ngOnInit(): void {
    this.bindForm();
    this.bindData();
  }

  bindForm() {
    this.templateForm = new FormGroup({
      id: new FormControl(0),
      name: new FormControl('', Validators.required),
      description: new FormControl(''),
      width: new FormControl(800, Validators.required),
      height: new FormControl(600, Validators.required),
      isDefault: new FormControl(false)
    });
  }

  bindData() {
    if (this.data.id === 0) {
      this.templateForm.patchValue({ id: 0, width: 800, height: 600, isDefault: false });
    } else {
      this.templateForm.patchValue(this.data.template);
    }
  }

  cancel() {
    this.activeModal.dismiss();
  }

  onSubmit() {
    let template = this.templateForm.value;
    
    if (template.id === 0) {
      template.id = new Date().getTime();
      this.store.dispatch(addTemplateAction({ payload: template}));
    } else {
      this.store.dispatch(updateTemplateAction({ payload: template }));
    }
    this.store.dispatch(getTemplatesAction());
    this.activeModal.dismiss();
  }
}
