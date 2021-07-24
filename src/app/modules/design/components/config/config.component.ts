import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import html2canvas from 'html2canvas';
import QRCode from 'qrcodejs2';
import Konva from 'konva';
import { MessageConsts } from 'src/app/modules/core';
import { ShapeModel } from 'src/app/shared/models';
import { addShapeAction, getShapeSelector, updateShapeAction } from 'src/app/stores';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss']
})
export class ConfigComponent implements OnInit {

  @Input() data;

  configForm: FormGroup;

  stage: Konva.Stage;
  layer: Konva.Layer;
  container: string = 'preview-container';
  shape: any;

  extraWidth: number = 20;
  timeout: any = null;
  dialogTitle: string = MessageConsts.ADD_TITLE;

  editorConfig: AngularEditorConfig = {
    editable: true,
    sanitize: false,
    toolbarHiddenButtons: [
      [
        'undo',
        'redo',
        'indent',
        'outdent',
      ],
      [
        'customClasses',
        'link',
        'unlink',
        'insertImage',
        'insertVideo',
        'insertHorizontalRule',
        'removeFormat',
        'toggleEditorMode'
      ]
    ]
  };

  textPicture: any;

  constructor(public activeModal: NgbActiveModal,
    private store: Store) { }

  ngOnInit(): void {
    this.bindData();
  }

  initForm() {
    const model = new ShapeModel();
    this.configForm = new FormGroup({
      id: new FormControl(model.id),
      left: new FormControl(model.left, [Validators.required]),
      top: new FormControl(model.top, [Validators.required]),
      width: new FormControl(model.width, [Validators.required]),
      height: new FormControl(model.height, [Validators.required]),
      strokeSize: new FormControl(model.strokeSize),
      strokeColor: new FormControl(model.strokeColor),
      backgroundColor: new FormControl(model.backgroundColor),
      backgroundImage: new FormControl(model.backgroundImage),
      cornerRadius: new FormControl(model.cornerRadius),
      text: new FormControl(model.text),
      textImage: new FormControl(model.textImage),
      qrCode: new FormControl(model.qrCode)
    });

    this.formChange();
  }

  bindData() {
    this.initForm();
    this.initStage();
    this.drawShape();

    if(this.data.id === 0) {
      this.dialogTitle = MessageConsts.ADD_TITLE;
      this.configForm.patchValue({id: new Date().getTime()});
    } else {
      this.dialogTitle = MessageConsts.EDIT_TITLE;
      this.store.select(getShapeSelector).subscribe(data => {                
        if (data) {
          this.updateForm(data);
        }
      });
    }
  }

  updateForm(data) {
    if (data) {
      this.configForm.patchValue({
        id: data.id,
        left: data.left,
        top: data.top,
        width: data.width,
        height: data.height,
        strokeSize: data.strokeSize,
        strokeColor: data.strokeColor,
        backgroundColor: data.backgroundColor,
        backgroundImage: data.backgroundImage,
        cornerRadius: data.cornerRadius,
        text: data.text,
        textImage: data.textImage,
        qrCode: data.qrCode
      });
    }
  }

  formChange() {
    const that = this;
    that.configForm.valueChanges.subscribe(data => {
      that.shape.width(data.width);
      that.shape.height(data.height);
      that.shape.fill(data.backgroundColor);
      that.shape.stroke(data.strokeColor);
      that.shape.strokeWidth(data.strokeSize);
      that.shape.cornerRadius(data.cornerRadius);
      that.stage.width(data.width + that.extraWidth);
      that.stage.height(data.height + that.extraWidth);
      that.showImage(data.backgroundImage, data.width, data.height);
      that.generateQRCode(data);
    });

    that.configForm.controls['text'].valueChanges.subscribe(text => {
      that.requestTextUpdate(text);
    });
  }

  initStage() {
    this.stage = new Konva.Stage({
      container: this.container,
      width: +this.configForm.controls.width.value + this.extraWidth,
      height: +this.configForm.controls.height.value + this.extraWidth
    });

    this.layer = new Konva.Layer();
    this.stage.add(this.layer);
  }

  drawShape() {
    const rect =  new Konva.Rect({
      x: 0,
      y: 0,
      width: +this.configForm.controls.width.value,
      height: +this.configForm.controls.height.value,
      fill: this.configForm.controls.backgroundColor.value,
      stroke: this.configForm.controls.strokeColor.value,
      strokeWidth: +this.configForm.controls.strokeSize.value,
      cornerRadius: +this.configForm.controls.cornerRadius.value
    });
    this.layer.add(rect);
    this.shape = rect;
    
    const image = new Konva.Image({
      x: 0,
      y: 0,
      image: null,
      width: +this.configForm.controls.width.value
    });

    this.layer.add(image);
    this.textPicture = image;
  }

  selectImage(item) {
    if (!item) return;    
    const shapeWidth = +this.configForm.controls.width.value;
    const shapeHeight = +this.configForm.controls.height.value;
    this.showImage(item.data, shapeWidth, shapeHeight);
    if (item.data !== this.configForm.controls.backgroundImage.value) {
      this.configForm.patchValue({ backgroundImage: item.data });
    }
  }

  showImage(data, shapeWidth, shapeHeight) {
    if (!data) return;
    const that = this;
    const image = new Image();
    image.onload = () => {
      if (image.width > 0 && image.height > 0) {
        let x = shapeWidth / image.width;
        let y = shapeHeight / image.height;
        that.shape.fill(null);
        that.shape.fillPatternImage(image);
        that.shape.fillPatternScale({x: x, y: y});
        that.layer.draw();
      }
    };
    image.src = data;
  }

  saveClick() {
    if (this.configForm.valid) {
      if (this.dialogTitle === MessageConsts.ADD_TITLE) { 
        this.store.dispatch(addShapeAction({ payload: this.configForm.value }));
      } else {
        this.store.dispatch(updateShapeAction({ payload: this.configForm.value }));
      }
      this.activeModal.close();
    }
  }

  renderText() {
    const that = this;
    if (document.querySelector('.viewhtml')) {
      html2canvas(document.querySelector('.viewhtml'), {
        backgroundColor: 'rgba(0,0,0,0)',
      }).then(result => {        
        that.textPicture.image(null);
        if (result && result.width > 0 && result.height > 0) {
          that.textPicture.image(result);
          if (result.toDataURL() !== that.configForm.controls.textImage.value) {
            that.configForm.patchValue({ textImage: result.toDataURL() });
          }
        }
      });
    }
  }

  requestTextUpdate(text) {
    if (!text) return;

    const that = this;
    if (that.timeout) {
      return;
    }
    that.timeout = setTimeout(function () {
      that.timeout = null;
      that.renderText();
    }, 500);
  }

  generateQRCode(data) {
    if (data.text) return;
    
    if (data.qrCode) {
      const div = document.createElement('div');
      new QRCode(div, {
        text: data.qrCode,
        width: data.width,
        height: data.height,
        colorDark : data.strokeColor,
        colorLight : data.backgroundColor,
        correctLevel : QRCode.CorrectLevel.H
      });        
      const img = div.getElementsByTagName('img')[0];
      this.textPicture.image(img);
    } else {
      this.textPicture.image(null);
    }
  }
}
