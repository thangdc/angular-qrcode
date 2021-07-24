import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import jsPDF from 'jspdf';
import Konva from 'konva';
import QRCode from 'qrcodejs2';
import { MessageConsts, ShapeEnums } from 'src/app/modules/core';
import { 
  drawImageAction,
  getDrawImageSelector, 
  getImagesSelector, 
  getShapesAction, 
  getShapeSelector, 
  getShapesSelector, 
  loadImageAction,
  selectShapeAction,
  updateShapeAction
} from 'src/app/stores';

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

  template: any = {
    width: 800,
    height: 600
  };

  container: string = 'container';
  GUIDELINE_OFFSET: number = 5;

  dataItems: any[];

  constructor(private store: Store) {
    
  }

  ngOnInit(): void {
    this.initStage(this.template);   
    this.getShapes();
    this.bindSelectEvents();
    this.bindSnapGridEvent();
  }

  initStage(data: any): void {
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

    this.template = {
      width: this.stage.width(),
      height: this.stage.height()
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
          that.drawRect(item);
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
      if (data) {
        const shape = that.stage.find(`#${data.id}`);
        if (shape && shape.length > 0) {
          that.transfomer.nodes([shape[0]]);
        }
      }
    });
  }

  drawRect(item) {
    const that = this;
    if (item) {
      const rect =  new Konva.Rect({
        x: 0,
        y: 0,
        width: item.width,
        height: item.height,
        fill: item.backgroundColor,
        stroke: item.strokeColor,
        strokeWidth: item.strokeSize,
        cornerRadius: item.cornerRadius
      });

      const group = new Konva.Group({
        id: item.id.toString(),
        x: item.top,
        y: item.left,
        draggable: true,
        name: 'shape',
        scaleX: item.scaleX,
        scaleY: item.scaleY
      });

      group.add(rect);
      
      if (item.textImage) {
        const textImage = new Image();
        textImage.onload = () => {
          if (textImage.width > 0 && textImage.height > 0) {
            const picture = new Konva.Image({
              x: 0,
              y: 0,
              image: textImage,
              width: item.width              
            });
            group.add(picture);
          }
        };
        textImage.src = item.textImage;            
      } else if (item.qrCode) {
        const div = document.createElement('div');
        new QRCode(div, {
          text: item.qrCode,
          width: item.width,
          height: item.height,
          colorDark : item.strokeColor,
          colorLight : item.backgroundColor,
          correctLevel : QRCode.CorrectLevel.H
        });        
        const img = div.getElementsByTagName('img')[0];
        const picture = new Konva.Image({
          x: 0,
          y: 0,
          image: img,
          width: item.width              
        });
        group.add(picture);
      }

      that.layer.add(group);

      if (item.backgroundImage) {
        const backgroundImage = new Image();
        backgroundImage.onload = () => {
          if (backgroundImage.width > 0 && backgroundImage.height > 0) {
            let x = item.width / backgroundImage.width;
            let y = item.height / backgroundImage.height;

            rect.fill(null);
            rect.fillPatternImage(backgroundImage);
            rect.fillPatternScale({x, y});
            that.layer.draw();
          }
        };
        backgroundImage.src = item.backgroundImage;            
      }

      group.on('dragend', () => {
        const nodes = that.transfomer.nodes();
        if (nodes.length > 0) {
          for (let node of nodes) {
            that.store.dispatch(updateShapeAction({payload: {
              id: parseInt(node.id()),
              top: node.x(),
              left: node.y()
            }}));
          }
        } else {
          that.store.dispatch(updateShapeAction({payload: {
            id: parseInt(group.id()),
            top: group.x(),
            left: group.y()
          }}));
        }
      });

      group.on('transformend', () => {
        const nodes = that.transfomer.nodes();
        if (nodes.length > 0) {
          for (let node of nodes) {
            that.store.dispatch(updateShapeAction({payload: {
              id: parseInt(node.id()),
              top: node.x(),
              left: node.y(),
              scaleX: node.scaleX(),
              scaleY: node.scaleY()
            }}));
          }
        } else {
          that.store.dispatch(updateShapeAction({payload: {
            id: parseInt(group.id()),
            top: group.x(),
            left: group.y(),
            scaleX: group.scaleX(),
            scaleY: group.scaleY()
          }}));
        }        
      });
    }
  }

  drawClick(data) {
    const that = this;
    if (data) {
      that.transfomer.nodes([]);      
       if (data.shapeType === ShapeEnums.Text) {
        const text = new Konva.Text({
          x: data.x,
          y: data.y,
          text: data.text,
          fontSize: data.fontSize,
          fontFamily: data.fontFamily,
          fill: data.fill,
          name: data.name,
          width: data.width,
          padding: data.padding,
          align: data.align,
          draggable: data.draggable
        });
        that.layer.add(text);
        that.transfomer.nodes([text]);
      } else if (data.shapeType === ShapeEnums.QRCode) {
        const div = document.createElement('div');
        new QRCode(div, {
          text: data.text,
          width: data.width * 2,
          height: data.height * 2,
          colorDark : data.colorDark,
          colorLight : data.colorLight,
          correctLevel : QRCode.CorrectLevel.H
        });
        
        const img = div.getElementsByTagName('img')[0];
        const picture = new Konva.Image({
          x: data.x,
          y: data.y,
          image: img,
          name: 'shape',
          width: data.width,
          height: data.height,
          customWidth: data.width,
          customHeight: data.height,
          draggable: data.draggable,
          text: data.text
        });
        that.layer.add(picture);
        that.transfomer.nodes([picture]);
      } 
    }
  }

  selectShape(id) {
    this.store.dispatch(selectShapeAction({ id: id }));
  }

  bindHighlightEvents() {
    this.layer.on('mouseover', function (evt) {
      var shape = evt.target as any;
      document.body.style.cursor = 'pointer';
      shape.strokeEnabled(true);
    });
    this.layer.on('mouseout', function (evt) {
      var shape = evt.target as any;
      document.body.style.cursor = 'default';
      shape.strokeEnabled(false);
    });
  }

  load(): void {    

    var background = new Konva.Rect({
      x: 0,
      y: 0,
      width: this.stage.width(),
      height: this.stage.height(),
      fillLinearGradientStartPoint: { x: 0, y: 0 },
      fillLinearGradientEndPoint: { x: this.stage.width(), y: this.stage.height() },
      fillLinearGradientColorStops: [
        0,
        'yellow',
        0.5,
        'blue',
        0.6,
        'rgba(0, 0, 0, 0)',
      ],
      listening: false,
    });
    this.layer.add(background);
  }
  
  // were can we snap our objects?
  getLineGuideStops(skipShape) {
    // we can snap to stage borders and the center of the stage
    var vertical = [0, this.stage.width() / 2, this.stage.width()];
    var horizontal = [0, this.stage.height() / 2, this.stage.height()];

    // and we snap over edges and center of each object on the canvas
    this.stage.find('.shape').forEach((guideItem) => {
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

      var shapes = that.stage.find('.shape');
      var box = selectionRectangle.getClientRect();
      var selected = shapes.filter((shape) =>
        Konva.Util.haveIntersection(box, shape.getClientRect())
      );
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

      // if click on empty area - remove all selections
      if (e.target.parent === that.stage) {
        that.transfomer.nodes([]);        
        return;
      }

      // do nothing if clicked NOT on our rectangles
      if (!e.target.parent.hasName('shape')) {
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
    container.focus();
    container.addEventListener('keydown', function (e) {
      
      if (e.keyCode === 46) {
        let isRemove = confirm(MessageConsts.CONFORM_DELETE);
        if (isRemove) {
          for(let item of that.transfomer.nodes()) {
            if (item) {
              item.destroy();
            }
          }
          that.transfomer.nodes([]);
        }
      }
      
      e.preventDefault();
    });
  }

  export(event) {
    let that = this;
    if (event.type === 'pdf') {
      var pdf = new jsPDF('l', 'px', [that.stage.width(), that.stage.height()]);
        // then put image on top of texts (so texts are not visible)
        const dataURL = that.stage.toDataURL({ pixelRatio: 3 });
        pdf.addImage(
          dataURL,
          0,
          0,
          that.stage.width(),
          that.stage.height()
        );
    
        pdf.save(event.fileName);
    } else if (event.type === 'image') {
      const dataURL = that.stage.toDataURL({ pixelRatio: 1 });
      that.downloadURI(dataURL, event.fileName);
    } else if (event.type === 'template') {
      alert(event.fileName);
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

  drawImage() {
    let that = this;
    this.store.select(getDrawImageSelector).subscribe(data => {
      if (data) {
        const img = new Image();
        img.src = data.data;
        let size = this.calculateAspectRatioFit(data.width, data.height, 350, 350);
        const picture = new Konva.Image({
          id: data.id,
          x: 50,
          y: 50,
          image: img,
          name: 'shape',
          width: size.width,
          height: size.height,
          customWidth: size.width,
          customHeight: size.height,
          draggable: true
        });
        that.layer.add(picture);
        that.transfomer.nodes([picture]);

        that.store.dispatch(drawImageAction({payload: null}));
      };
    });
  }

  calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return { width: srcWidth*ratio, height: srcHeight*ratio };
  }

  bindImages(item) {
    if (item) {
      const images = item.find('Image');
      for(const img of images) {
        const text = img.attrs.text;
        if (text) {
          const div = document.createElement('div');
          new QRCode(div, {
            text: text,
            width: img.attrs.customWidth * 2,
            height: img.attrs.customHeight * 2,
            colorDark : "#000000",
            colorLight : "#ffffff",
            correctLevel : QRCode.CorrectLevel.H
          });        
          
          let qrImage = div.getElementsByTagName('img')[0];
          img.image(qrImage);
          qrImage.remove();
          div.remove();
        } else {          
          const picture = this.images.find(x => x.id === img.attrs.id);
          const currentImage = new Image();
          currentImage.src = picture.data;
          img.image(currentImage);
        }
      }
    }
  }

  loadImages() {
    this.store.dispatch(loadImageAction());
    this.store.select(getImagesSelector).subscribe(data => {
      if (data) {
        this.images = data;
      }
    });
  }

  changePosition(direction) {
    const nodes = this.transfomer.nodes();
    if (nodes && nodes.length > 0) {
      for (const node of nodes) {
        if (direction === 'up') {
          node.moveUp();
        } else if (direction === 'down') {
          node.moveDown();
        }   
      }
    }
  }
}

