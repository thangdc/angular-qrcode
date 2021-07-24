import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { MessageConsts } from 'src/app/modules/core';
import { addImageAction, drawImageAction, getImagesSelector, loadImageAction, removeImageAction } from 'src/app/stores';

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

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(loadImageAction());
    this.store.select(getImagesSelector).subscribe(data => {
      if (data) {
        this.images = data;
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
            this.store.dispatch(addImageAction({ payload: item }));  
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
      this.store.dispatch(removeImageAction({ payload: item }));
    }
  }
}
