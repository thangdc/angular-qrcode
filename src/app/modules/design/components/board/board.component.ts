import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import jsPDF, { ShadingPattern } from 'jspdf';
import Konva from 'konva';
import QRCode from 'qrcodejs2';
import { CommonConsts, MessageConsts } from 'src/app/modules/core/constants';
import { TemplateModel } from 'src/app/shared/models';

import { 
  exportDesignAction,
  getExportSelector,
  getShapesAction, 
  getShapeSelector, 
  getShapesSelector, 
  getTemplateSelector, 
  removeShapeAction, 
  selectShapeAction,
  updateShapeAction,
} from 'src/app/stores';
import { ConfigComponent } from '../config/config.component';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  stage: Konva.Stage;
  layer: Konva.Layer;
  transfomer: Konva.Transformer;
  shapes: any = [];
  images: any = [];

  currentShape: any;

  template: TemplateModel = new TemplateModel();

  container: string = 'container';
  GUIDELINE_OFFSET: number = 5;

  constructor(private store: Store,
    private modal: NgbModal) {
    
  }

  ngOnInit(): void {
    this.bindTemplate();
    this.getShapes();
    this.bindSelectEvents();
    this.bindSnapGridEvent();
    this.bindKeyBoardEvent();
    this.bindExportEvent();
  }

  bindTemplate() {
    const that = this;
    that.store.select(getTemplateSelector).subscribe(data => {
      that.template = new TemplateModel();
      if (data) {
        that.template = data;
      }
      that.initStage();
    });
  }

  initStage(): void {
    const data = this.template;
    if (!this.stage) {
      this.stage = new Konva.Stage({
        container: this.container,
        width: data.width,
        height: data.height
      });
      this.layer = new Konva.Layer();
      this.stage.add(this.layer);
    } else {
      this.stage.width(data.width);
      this.stage.height(data.height);
    }
  }

  getShapes() {
    const that = this;
    that.store.dispatch(getShapesAction());
    that.store.select(getShapesSelector).subscribe(data => {
      if (that.layer) {
        that.layer.destroyChildren();
        that.stage.destroyChildren();
        that.stage.add(that.layer);
      }

      if (data && data.length > 0) {
        for(let item of data) {
          that.drawItem(item);
        }
      }
      that.layer.draw();
      that.bindSelectEvents();
      that.getSelectedShape();
    });
  }

  getSelectedShape() {
    const that = this;
    that.store.select(getShapeSelector).subscribe(data => {      
      that.transfomer.nodes([]);
      that.currentShape = null;
      if (data) {
        const shape = that.stage.find(`#${data.id}`);
        if (shape && shape.length > 0) {
          that.currentShape = shape[0];
          that.transfomer.nodes([that.currentShape]);
        }
      }
    });
  }

  drawItem(item) {
    const rect = this.drawRect(item);
    const image = this.drawImage(item);
    const qr = this.drawQRCode(item);
    const text = this.drawText(item);
    const group = new Konva.Group({
      id: item.id.toString(),
      x: item.top,
      y: item.left,
      width: item.width,
      height: item.height,
      rotation: item.rotation,
      name: CommonConsts.ShapeName,
      draggable: item.draggable,
    });

    if (rect) { group.add(rect); }
    if (image) { group.add(image); }
    if (qr) { group.add(qr); }
    if (text) { group.add(text); }

    this.layer.add(group);
    this.bindTransformEvent(group);
  }

  drawRect(item) {
    if (item) {
      const rect =  new Konva.Rect({
        width: item.width,
        height: item.height,
        stroke: item.strokeColor,
        strokeWidth: item.strokeSize,
        cornerRadius: item.cornerRadius,
        opacity: item.opacity
      });
      
      if (!item.text) {
        rect.fill(item.backgroundColor);
      }

      return rect;
    }
  }

  drawText(data) {
    if (data && data.text) {
      var text = new Konva.Text({
        text: data.text,
        width: data.width,
        height: data.height,
        fontSize: data.fontSize,
        fontFamily: data.fontFamily,
        fontStyle: data.fontStyle,
        align: data.align,
        verticalAlign: data.verticalAlign,
        fill: data.textColor,
        opacity: data.opacity,
        padding: data.textPadding,
        lineHeight: data.textLineHeight
      });
      return text;
    }
  }

  drawImage(data) {
    if (data && data.backgroundImage) {
      const rect = new Konva.Rect({
        width: data.width,
        height: data.height,
        opacity: data.opacity
      });

      const img = new Image();
      img.onload = () => {
        if (img.width > 0 && img.height > 0) {
          rect.fill(null);
          rect.fillPatternImage(img);
          let x = data.width / img.width;
          let y = data.height / img.height;
          rect.fillPatternScale({ x: x, y: y });
        }
      };
      img.src = data.backgroundImage;
      return rect;         
    }
  }

  drawQRCode(data) {
    if (data && data.qrCode) {
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
      const picture = new Konva.Image({
        image: img,
        width: data.width,
        height: data.height,
        opacity: data.opacity
      });
      
      return picture;
    }
  }

  bindTransformEvent(shape) {
    const that = this;
    shape.on('dragend', (evt) => {
      const nodes = that.transfomer.nodes();
      if (nodes.length > 1) {
        for(let item of nodes) {
          that.store.dispatch(updateShapeAction({payload: {
            id: parseInt(item.id()),
            top: item.x(),
            left: item.y()
          }}));
        }
      } else {
        const node = evt.currentTarget;
        that.store.dispatch(updateShapeAction({payload: {
          id: parseInt(node.id()),
          top: node.x(),
          left: node.y()
        }}));
      }
    });

    shape.on('transformend', (evt) => {
      const nodes = that.transfomer.nodes();
      if (nodes.length > 1) {
        for (let item of nodes) {
          that.store.dispatch(updateShapeAction({payload: {
            id: parseInt(item.id()),
            top: item.x(),
            left: item.y(),
            width: item.width() * item.scaleX(),
            height: item.height() * item.scaleY(),
            rotation: item.rotation()
          }}));
        }
      } else {
        const node = evt.currentTarget;
        that.store.dispatch(updateShapeAction({payload: {
          id: parseInt(node.id()),
          top: node.x(),
          left: node.y(),
          width: node.width() * node.scaleX(),
          height: node.height() * node.scaleY(),
          rotation: node.rotation()
        }}));
      }
    });

    shape.on('dblclick dbltap', () => {
      let ref = this.modal.open(ConfigComponent, { size: 'lg', backdrop: 'static' });
      ref.componentInstance.data = {
        id: shape.id()
      };
    });

  }

  selectShape(id) {
    this.store.dispatch(selectShapeAction({ id: id }));
  }

  // were can we snap our objects?
  getLineGuideStops(skipShape) {
    // we can snap to stage borders and the center of the stage
    var vertical = [0, this.stage.width() / 2, this.stage.width()];
    var horizontal = [0, this.stage.height() / 2, this.stage.height()];

    // and we snap over edges and center of each object on the canvas
    this.stage.find(`.${CommonConsts.ShapeName}`).forEach((guideItem) => {
      if (guideItem === skipShape) {
        return;
      }
      var box = guideItem.getClientRect();
      // and we can snap to all edges of shapes
      vertical.push(box.x, box.x + box.width, box.x + box.width / 2);
      horizontal.push(box.y, box.y + box.height, box.y + box.height / 2);
    });
    return {
      vertical: vertical.flat(),
      horizontal: horizontal.flat(),
    };
  }

  // what points of the object will trigger to snapping?
  // it can be just center of the object
  // but we will enable all edges and center
  getObjectSnappingEdges(node) {
    var box = node.getClientRect();
    var absPos = node.absolutePosition();

    return {
      vertical: [
        {
          guide: Math.round(box.x),
          offset: Math.round(absPos.x - box.x),
          snap: 'start',
        },
        {
          guide: Math.round(box.x + box.width / 2),
          offset: Math.round(absPos.x - box.x - box.width / 2),
          snap: 'center',
        },
        {
          guide: Math.round(box.x + box.width),
          offset: Math.round(absPos.x - box.x - box.width),
          snap: 'end',
        },
      ],
      horizontal: [
        {
          guide: Math.round(box.y),
          offset: Math.round(absPos.y - box.y),
          snap: 'start',
        },
        {
          guide: Math.round(box.y + box.height / 2),
          offset: Math.round(absPos.y - box.y - box.height / 2),
          snap: 'center',
        },
        {
          guide: Math.round(box.y + box.height),
          offset: Math.round(absPos.y - box.y - box.height),
          snap: 'end',
        },
      ],
    };
  }

  // find all snapping possibilities
  getGuides(lineGuideStops, itemBounds) {
    var resultV = [];
    var resultH = [];

    lineGuideStops.vertical.forEach((lineGuide) => {
      itemBounds.vertical.forEach((itemBound) => {
        var diff = Math.abs(lineGuide - itemBound.guide);
        // if the distance between guild line and object snap point is close we can consider this for snapping
        if (diff < this.GUIDELINE_OFFSET) {
          resultV.push({
            lineGuide: lineGuide,
            diff: diff,
            snap: itemBound.snap,
            offset: itemBound.offset,
          });
        }
      });
    });

    lineGuideStops.horizontal.forEach((lineGuide) => {
      itemBounds.horizontal.forEach((itemBound) => {
        var diff = Math.abs(lineGuide - itemBound.guide);
        if (diff < this.GUIDELINE_OFFSET) {
          resultH.push({
            lineGuide: lineGuide,
            diff: diff,
            snap: itemBound.snap,
            offset: itemBound.offset,
          });
        }
      });
    });

    var guides = [];

    // find closest snap
    var minV = resultV.sort((a, b) => a.diff - b.diff)[0];
    var minH = resultH.sort((a, b) => a.diff - b.diff)[0];
    if (minV) {
      guides.push({
        lineGuide: minV.lineGuide,
        offset: minV.offset,
        orientation: 'V',
        snap: minV.snap,
      });
    }
    if (minH) {
      guides.push({
        lineGuide: minH.lineGuide,
        offset: minH.offset,
        orientation: 'H',
        snap: minH.snap,
      });
    }
    return guides;
  }

  drawGuides(guides) {
    guides.forEach((lg) => {
      if (lg.orientation === 'H') {
        var line = new Konva.Line({
          points: [-6000, 0, 6000, 0],
          stroke: 'rgb(0, 161, 255)',
          strokeWidth: 1,
          name: 'guid-line',
          dash: [4, 6],
        });
        this.layer.add(line);
        line.absolutePosition({
          x: 0,
          y: lg.lineGuide,
        });
      } else if (lg.orientation === 'V') {
        var line = new Konva.Line({
          points: [0, -6000, 0, 6000],
          stroke: 'rgb(0, 161, 255)',
          strokeWidth: 1,
          name: 'guid-line',
          dash: [4, 6],
        });
        this.layer.add(line);
        line.absolutePosition({
          x: lg.lineGuide,
          y: 0,
        });
      }
    });
  }

  bindSnapGridEvent() {
    let that = this;
    that.layer.on('dragmove', function (e) {
      // clear all previous lines on the screen
      that.layer.find('.guid-line').forEach((l) => l.destroy());
      
      // find possible snapping lines
      var lineGuideStops = that.getLineGuideStops(e.target);
      
      // find snapping points of current object
      var itemBounds = that.getObjectSnappingEdges(e.target);

      // now find where can we snap current object
      var guides = that.getGuides(lineGuideStops, itemBounds);

      // do nothing of no snapping
      if (!guides.length) {
        return;
      }

      that.drawGuides(guides);

      var absPos = e.target.absolutePosition();
      // now force object position
      guides.forEach((lg) => {
        switch (lg.snap) {
          case 'start': {
            switch (lg.orientation) {
              case 'V': {
                absPos.x = lg.lineGuide + lg.offset;
                break;
              }
              case 'H': {
                absPos.y = lg.lineGuide + lg.offset;
                break;
              }
            }
            break;
          }
          case 'center': {
            switch (lg.orientation) {
              case 'V': {
                absPos.x = lg.lineGuide + lg.offset;
                break;
              }
              case 'H': {
                absPos.y = lg.lineGuide + lg.offset;
                break;
              }
            }
            break;
          }
          case 'end': {
            switch (lg.orientation) {
              case 'V': {
                absPos.x = lg.lineGuide + lg.offset;
                break;
              }
              case 'H': {
                absPos.y = lg.lineGuide + lg.offset;
                break;
              }
            }
            break;
          }
        }
      });
      e.target.absolutePosition(absPos);
    });

    that.layer.on('dragend', function (e) {
      // clear all previous lines on the screen
      that.layer.find('.guid-line').forEach((l) => l.destroy());
    });
  }

  bindSelectEvents() {
    let that = this;

    that.transfomer = new Konva.Transformer({
      ignoreStroke: true
    });    
    
    that.layer.add(that.transfomer);

    // add a new feature, lets add ability to draw selection rectangle
    const selectionRectangle = new Konva.Rect({
      fill: 'rgba(0,0,255,0.5)',
      visible: false
    });
    that.layer.add(selectionRectangle);

    let x1, y1, x2, y2;
    that.stage.on('mousedown touchstart', (e) => {

      // do nothing if we mousedown on any shape
      if (e.target !== that.stage) {
        return;
      }
      //
      x1 = that.stage.getRelativePointerPosition().x;
      y1 = that.stage.getRelativePointerPosition().y;
      x2 = that.stage.getRelativePointerPosition().x;
      y2 = that.stage.getRelativePointerPosition().y;

      selectionRectangle.visible(true);
      selectionRectangle.width(0);
      selectionRectangle.height(0);
    });

    that.stage.on('mousemove touchmove', () => {
      // no nothing if we didn't start selection
      if (!selectionRectangle.visible()) {
        return;
      }
      x2 = that.stage.getRelativePointerPosition().x;
      y2 = that.stage.getRelativePointerPosition().y;

      selectionRectangle.setAttrs({
        x: Math.min(x1, x2),
        y: Math.min(y1, y2),
        width: Math.abs(x2 - x1),
        height: Math.abs(y2 - y1)
      });
    });

    that.stage.on('mouseup touchend', () => {
      // no nothing if we didn't start selection
      if (!selectionRectangle.visible()) {
        return;
      }
      // update visibility in timeout, so we can check it in click event
      setTimeout(() => {
        selectionRectangle.visible(false);
      });

      var shapes = that.stage.find(`.${CommonConsts.ShapeName}`);
      var box = selectionRectangle.getClientRect();
      var selected = shapes.filter((shape) => {
        if (shape.draggable()) {
          Konva.Util.haveIntersection(box, shape.getClientRect())
        }        
      });
      that.transfomer.nodes(selected);

      if (selected.length === 0) {
        that.selectShape(0);
      }
    });

    // clicks should select/deselect shapes
    that.stage.on('click tap', function (e) {
      // if we are selecting with rect, do nothing
      if (selectionRectangle.visible()) {
        return;
      }

      if (!e.target.parent){
        return;
      }      

      // if click on empty area - remove all selections
      if (e.target.parent === that.stage) {
        that.transfomer.nodes([]);        
        return;
      }

      // do nothing if clicked NOT on our rectangles
      if (!e.target.parent.hasName(CommonConsts.ShapeName)) {
        return;
      }
      // do we pressed shift or ctrl?
      const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
      const isSelected = that.transfomer.nodes().indexOf(e.target.parent) >= 0;

      if (!metaPressed && !isSelected) {
        // if no key pressed and the node is not selected
        // select just one
        that.transfomer.nodes([e.target.parent]);
        that.selectShape(parseInt(e.target.parent.id()));
      } else if (metaPressed && isSelected) {
        // if we pressed keys and node was selected
        // we need to remove it from selection:
        const nodes = that.transfomer.nodes().slice(); // use slice to have new copy of array
        // remove node from array
        nodes.splice(nodes.indexOf(e.target.parent), 1);
        that.transfomer.nodes(nodes);
      } else if (metaPressed && !isSelected) {
        // add the node into selection
        const nodes = that.transfomer.nodes().concat([e.target.parent]);
        that.transfomer.nodes(nodes);
      }
    });
  }

  bindZoomEvent() {
    let that = this;
    var scaleBy = 1.01;
    that.stage.on('wheel', (e) => {
      e.evt.preventDefault();
      var oldScale = that.stage.scaleX();

      var pointer = that.stage.getPointerPosition();

      var mousePointTo = {
        x: (pointer.x - that.stage.x()) / oldScale,
        y: (pointer.y - that.stage.y()) / oldScale,
      };

      var newScale =
        e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        that.stage.scale({ x: newScale, y: newScale });

      var newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      };

      that.stage.position(newPos);
    });
  }

  bindKeyBoardEvent() {
    let that = this;

    const container = that.stage.container();
    container.tabIndex = 1;
    container.addEventListener('keydown', function (e) {
      
      if (e.keyCode === 46) {
        if (that.currentShape) {
          let isRemove = confirm(MessageConsts.CONFORM_DELETE);
          if (isRemove) {
            const id = that.currentShape.id();
            that.store.dispatch(removeShapeAction({ id: parseInt(id) }));
          }
        }
      }
      
      e.preventDefault();
    });
  }

  export(item) {
    const that = this;
    let fileName = '';
    if (item.type === 'pdf') {
      const pdf = new jsPDF('l', 'px', [that.stage.width(), that.stage.height()]);
      // then put image on top of texts (so texts are not visible)
      const dataURL = that.stage.toDataURL({ pixelRatio: 3 });
      pdf.addImage(
        dataURL,
        0,
        0,
        that.stage.width(),
        that.stage.height()
      );
      fileName = `${item.name}.pdf`;
      pdf.save(fileName);
    } else if (item.type === 'image') {
      fileName = `${item.name}.png`;
      const dataURL = that.stage.toDataURL({ pixelRatio: 1 });
      that.downloadURI(dataURL, fileName);
    } else if (item.type === 'template') {
      alert(item.name);
    }
  }

  downloadURI(uri, name) {
    var link = document.createElement('a');
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  bindExportEvent() {
    const that = this;
    that.store.select(getExportSelector).subscribe(data => {
      if (data) {
        that.export(data);
        that.store.dispatch(exportDesignAction({payload: null}));
      }
    });
  }
}

