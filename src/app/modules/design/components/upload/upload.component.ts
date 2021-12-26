import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { MessageConsts } from 'src/app/modules/core';
import { TemplateModel } from 'src/app/shared/models';
import { addImageAction, getDefaultTemplateSelector, getImagesSelector, loadImageAction, removeImageAction } from 'src/app/stores';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  @Output() selectImageEvent: EventEmitter<any> = new EventEmitter();

  @ViewChild('fileUpload') fileUpload: ElementRef;
  
  public files: any[] = [];
  public images: any[];
  
  template: TemplateModel;

  constructor(private store: Store) { }

  ngOnInit(): void {
    const that = this;
    that.store.select(getDefaultTemplateSelector).subscribe(data => {
      that.template = data;
      if (data && data.id > 0) {
        this.store.dispatch(loadImageAction({ templateId: data.id }));
        this.store.select(getImagesSelector).subscribe(data => {
          if (data) {
            this.images = data;
          }
        });
      }
    });
  }

  onFileChanged(event: any) {
    this.files = event.target.files;
  }

  saveImages() {
    if (this.files.length > 0) {
      for(let file of this.files) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (e) => {
          let image = new Image();
          image.src = e.target.result.toString();
          image.onload = () => {
            let item = {
              id: new Date().getTime(),
              name: file.name,
              data: e.target.result,
              width: image.width,
              height: image.height
            }
            this.store.dispatch(addImageAction({ templateId: this.template.id, payload: item }));  
          };          
        }
      }
      
      this.fileUpload.nativeElement.value = '';
    }
  }

  addImageData(item) {
    this.selectImageEvent.emit(item);
  }

  removeImage(item) {
    let isRemove = confirm(MessageConsts.CONFORM_DELETE);
    if (isRemove) {
      this.store.dispatch(removeImageAction({ templateId: this.template.id, payload: item }));
    }
  }
}
