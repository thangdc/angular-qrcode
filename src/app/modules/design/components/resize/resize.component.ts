import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { NotifierService } from 'angular-notifier';
import { MessageConsts } from 'src/app/modules/core';
import { getDataSelector, updateTemplateAction } from 'src/app/stores';

@Component({
  selector: 'app-resize',
  templateUrl: './resize.component.html',
  styleUrls: ['./resize.component.scss']
})
export class ResizeComponent implements OnInit {

  resizeForm: FormGroup;
  template: any;

  constructor(private store: Store,
    private notifierService: NotifierService) { }

  ngOnInit(): void {
    this.template = {
      width: 800,
      height: 600
    };
    
    this.store.select(getDataSelector).subscribe(data => {
      if (data) {
        const items = JSON.parse(data);
        this.template = { 
          width: items.attrs.width,
          height: items.attrs.height
        }
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
