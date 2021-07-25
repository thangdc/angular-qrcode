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

  textPicture: any;
  textControl: any;

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
      qrCode: new FormControl(model.qrCode),
      opacity: new FormControl(model.opacity),
      draggable: new FormControl(model.draggable),
      fontFamily: new FormControl(model.fontFamily),
      fontSize: new FormControl(model.fontSize),
      fontStyle: new FormControl(model.fontStyle),
      align: new FormControl(model.align),
      verticalAlign: new FormControl(model.verticalAlign),
      textColor: new FormControl(model.textColor),
      textPadding: new FormControl(model.textPadding),
      textLineHeight: new FormControl(model.textLineHeight),
      index: new FormControl(model.index)
    });

    this.formChange();
  }

  bindData() {
    this.initForm();
    this.initStage();
    this.drawShape();

    if(this.data.id === 0) {
      this.dialogTitle = MessageConsts.ADD_TITLE;
      this.configForm.patchValue({id: new Date().getTime(), opacity: 100});
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
        qrCode: data.qrCode,
        opacity: data.opacity * 100,
        draggable: data.draggable,
        fontFamily: data.fontFamily,
        fontSize: data.fontSize,
        fontStyle: data.fontStyle,
        align: data.align,
        verticalAlign: data.verticalAlign,
        textColor: data.textColor,
        textPadding: data.textPadding,
        textLineHeight: data.textLineHeight,
        index: data.index
      });
    }
  }

  formChange() {
    const that = this;
    that.configForm.valueChanges.subscribe(data => {
      data.opacity = data.opacity / 100;
      that.shape.width(data.width);
      that.shape.height(data.height);
      that.shape.fill(data.backgroundColor);
      that.shape.stroke(data.strokeColor);
      that.shape.strokeWidth(data.strokeSize);
      that.shape.cornerRadius(data.cornerRadius);
      that.shape.opacity(data.opacity);
      that.stage.width(data.width + that.extraWidth);
      that.stage.height(data.height + that.extraWidth);
      that.textControl.width(data.width);
      that.textControl.height(data.height);
      that.textControl.opacity(data.opacity);
      that.textControl.fontFamily(data.fontFamily);
      that.textControl.fontSize(data.fontSize);
      that.textControl.fontStyle(data.fontStyle);
      that.textControl.align(data.align);
      that.textControl.verticalAlign(data.verticalAlign);
      that.textControl.fill(data.textColor);
      that.textControl.padding(data.textPadding);
      that.textControl.lineHeight(data.textLineHeight);
      that.showImage(data.backgroundImage, data.width, data.height, data.opacity);
      that.generateQRCode(data);
      that.showText(data);
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
      cornerRadius: +this.configForm.controls.cornerRadius.value,
      opacity: this.configForm.controls.opacity.value
    });
    this.layer.add(rect);
    this.shape = rect;
    
    const image = new Konva.Image({
      x: 0,
      y: 0,
      image: null,
      width: +this.configForm.controls.width.value,
      opacity: this.configForm.controls.opacity.value
    });

    this.layer.add(image);
    this.textPicture = image;

    var text = new Konva.Text({
      width: this.configForm.controls.width.value,
      height: this.configForm.controls.height.value,
      text: this.configForm.controls.text.value,
      fontSize: 30,
      fontFamily: 'Calibri',
      fill: this.configForm.controls.strokeColor.value
    });

    this.layer.add(text);
    this.textControl = text;
  }

  selectImage(item) {
    if (!item) return;    
    const shapeWidth = +this.configForm.controls.width.value;
    const shapeHeight = +this.configForm.controls.height.value;
    const opacity = +this.configForm.controls.opacity.value;
    this.showImage(item.data, shapeWidth, shapeHeight, opacity);
    if (item.data !== this.configForm.controls.backgroundImage.value) {
      this.configForm.patchValue({ backgroundImage: item.data });
    }
  }

  showImage(data, shapeWidth, shapeHeight, opacity) {
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
        that.shape.opacity(opacity);
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

  generateQRCode(data) {    
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
      this.textPicture.width(data.width);
      this.textPicture.height(data.height);
      this.textPicture.opacity(data.opacity);
    } else {
      this.textPicture.image(null);
    }
  }

  showText(data) {
    this.textControl.text(data.text);
  }
}
