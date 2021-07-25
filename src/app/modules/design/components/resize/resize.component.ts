import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { NotifierService } from 'angular-notifier';
import { MessageConsts } from 'src/app/modules/core';
import { TemplateModel } from 'src/app/shared/models';
import { getDataSelector, getTemplateSelector, updateTemplateAction } from 'src/app/stores';

@Component({
  selector: 'app-resize',
  templateUrl: './resize.component.html',
  styleUrls: ['./resize.component.scss']
})
export class ResizeComponent implements OnInit {

  resizeForm: FormGroup;
  template: TemplateModel = new TemplateModel();

  constructor(private store: Store,
    private notifierService: NotifierService) { }

  ngOnInit(): void {
    
    this.store.select(getTemplateSelector).subscribe(data => {
      this.template = new TemplateModel();
      if (data) {
        this.template = data;
      }
      this.initForm();
    });
  }

  updateTemplate() {
    if (this.resizeForm.valid) {
      this.store.dispatch(updateTemplateAction({payload: this.resizeForm.value}));
      this.notifierService.notify('success', MessageConsts.SAVE_SUCCEED);
    }    
  }

  initForm() {
    this.resizeForm = new FormGroup({
      width: new FormControl(this.template.width, [Validators.required]),
      height: new FormControl(this.template.height, [Validators.required])
    });
  }
}
