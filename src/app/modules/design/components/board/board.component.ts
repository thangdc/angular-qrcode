import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import jsPDF from 'jspdf';
import Konva from 'konva';
import { Rect } from 'konva/lib/shapes/Rect';
import QRCode from 'qrcodejs2';
import { MessageConsts, ShapeEnums } from 'src/app/modules/core';
import { 
  drawImageAction,
  getDataSelector, 
  getDrawImageSelector, 
  getImagesSelector, 
  getTemplateSelector, 
  loadDataAction, 
  loadImageAction, 
  saveDataAction, 
  updateTemplateAction
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
    this.loadImages();
    this.getTemplateData();
    this.bindSelectEvents();
    this.bindZoomEvent();
    this.bindKeyBoardEvent();
    this.drawImage();
    this.bindchangeTemplateEvent();
  }

  getTemplateData() {
    const that = this;
    that.store.dispatch(loadDataAction());
    that.store.select(getDataSelector).subscribe(data => {
      if (data) {
        that.stage = Konva.Node.create(data, that.container); 
        const item = JSON.parse(data);
        that.layer = Konva.Layer.create(item.children[0]);
        that.stage.destroyChildren();
        that.stage.add(that.layer);
        this.initStage({ width: item.attrs.width, height: item.attrs.height });
        that.bindImages(that.stage);
        that.bindEventsAfterLoad();
      } else {
        this.initStage({ width: 800, height: 600 });
      }      
    });
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

  drawClick(data) {
    const that = this;
    if (data) {
      that.transfomer.nodes([]);        
      if (data.shapeType === ShapeEnums.Rectangle){
        const rect =  new Rect(data);
        that.layer.add(rect);
        that.transfomer.nodes([rect]);
      } else if (data.shapeType === ShapeEnums.Circle) {
        const circle = new Konva.Circle(data);
        that.layer.add(circle);
        that.transfomer.nodes([circle]);
      } else if (data.shapeType === ShapeEnums.Text) {
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
        that.bindEditTextEvent(text);
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

      that.saveTemplate();
      that.bindEventsAfterLoad();      
    }
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
      illLinearGradientStartPoint: { x: 0, y: 0 },
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
      vertical.concat([box.x, box.x + box.width, box.x + box.width / 2]);
      horizontal.concat([box.y, box.y + box.height, box.y + box.height / 2]);
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

    this.layer.on('dragend', function (e) {
      // clear all previous lines on the screen
      that.layer.find('.guid-line').forEach((l) => l.destroy());
    });
  }

  bindSelectEvents() {
    let that = this;

    that.transfomer = new Konva.Transformer({
      keepRatio: true,
      ignoreStroke: true,
      enabledAnchors: [
        'top-left',
        'top-right',
        'bottom-left',
        'bottom-right',
      ]
    });    
    that.layer.add(that.transfomer);

    // add a new feature, lets add ability to draw selection rectangle
    var selectionRectangle = new Konva.Rect({
      fill: 'rgba(0,0,255,0.5)',
      visible: false
    });
    that.layer.add(selectionRectangle);

    var x1, y1, x2, y2;
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
    });

    // clicks should select/deselect shapes
    that.stage.on('click tap', function (e) {
      // if we are selecting with rect, do nothing
      if (selectionRectangle.visible()) {
        return;
      }

      // if click on empty area - remove all selections
      if (e.target === that.stage) {
        that.transfomer.nodes([]);
        return;
      }

      // do nothing if clicked NOT on our rectangles
      if (!e.target.hasName('shape')) {
        return;
      }

      // do we pressed shift or ctrl?
      const metaPressed = e.evt.shiftKey || e.evt.ctrlKey || e.evt.metaKey;
      const isSelected = that.transfomer.nodes().indexOf(e.target) >= 0;

      if (!metaPressed && !isSelected) {
        // if no key pressed and the node is not selected
        // select just one
        that.transfomer.nodes([e.target]);
      } else if (metaPressed && isSelected) {
        // if we pressed keys and node was selected
        // we need to remove it from selection:
        const nodes = that.transfomer.nodes().slice(); // use slice to have new copy of array
        // remove node from array
        nodes.splice(nodes.indexOf(e.target), 1);
        that.transfomer.nodes(nodes);
      } else if (metaPressed && !isSelected) {
        // add the node into selection
        const nodes = that.transfomer.nodes().concat([e.target]);
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
          that.saveTemplate();
        }
      }
      
      e.preventDefault();
    });
  }

  saveTemplate() {
    const that = this;
    this.store.dispatch(saveDataAction({ payload: that.stage.toJSON()}));
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

  bindEventsAfterLoad() {
    let that = this;
    const shapes = that.stage.find('.shape');
    shapes.forEach(x => { 
      x.on('dragend', () => {
        this.saveTemplate();
      });

      x.on('transform', () => {
        this.saveTemplate();
      });

      if(x.className === 'Text') {
        that.bindEditTextEvent(x);
      }
    });
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
        this.saveTemplate();
        that.bindEventsAfterLoad();
      };
    });
  }

  calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
    return { width: srcWidth*ratio, height: srcHeight*ratio };
  }

  bindchangeTemplateEvent() {
    this.store.select(getTemplateSelector).subscribe(data => {
      if (data) {
        this.initStage(data);
        this.saveTemplate();
        this.store.dispatch(updateTemplateAction({ payload: null }));
      }
    });
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

      this.saveTemplate();
    }
  }

  bindEditTextEvent(node) {
    const that = this;
    node.on('dblclick dbltap', () => {
      // hide text node and transformer:
      node.hide();
      that.transfomer.hide();

      // create textarea over canvas with absolute position
      // first we need to find position for textarea
      // how to find it?

      // at first lets find position of text node relative to the stage:
      var textPosition = node.absolutePosition();

      // so position of textarea will be the sum of positions above:
      var areaPosition = {
        x: that.stage.container().offsetLeft + textPosition.x,
        y: that.stage.container().offsetTop + textPosition.y,
      };

      // create textarea and style it
      var textarea = document.createElement('textarea');
      document.body.appendChild(textarea);

      // apply many styles to match text on canvas as close as possible
      // remember that text rendering on canvas and on the textarea can be different
      // and sometimes it is hard to make it 100% the same. But we will try...
      textarea.value = node.text();
      textarea.style.position = 'absolute';
      textarea.style.top = areaPosition.y + 'px';
      textarea.style.left = areaPosition.x + 'px';
      textarea.style.width = node.width() - node.padding() * 2 + 'px';
      textarea.style.height =
        node.height() - node.padding() * 2 + 5 + 'px';
      textarea.style.fontSize = node.fontSize() + 'px';
      textarea.style.border = 'none';
      textarea.style.padding = '0px';
      textarea.style.margin = '0px';
      textarea.style.overflow = 'hidden';
      textarea.style.background = 'none';
      textarea.style.outline = 'none';
      textarea.style.resize = 'none';
      textarea.style.lineHeight = node.lineHeight();
      textarea.style.fontFamily = node.fontFamily();
      textarea.style.transformOrigin = 'left top';
      textarea.style.textAlign = node.align();
      textarea.style.color = node.fill();
      let rotation = node.rotation();
      var transform = '';
      if (rotation) {
        transform += 'rotateZ(' + rotation + 'deg)';
      }

      var px = 0;
      // also we need to slightly move textarea on firefox
      // because it jumps a bit
      var isFirefox =
        navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
      if (isFirefox) {
        px += 2 + Math.round(node.fontSize() / 20);
      }
      transform += 'translateY(-' + px + 'px)';

      textarea.style.transform = transform;

      // reset height
      textarea.style.height = 'auto';
      // after browsers resized it we can set actual value
      textarea.style.height = textarea.scrollHeight + 3 + 'px';

      textarea.focus();

      function removeTextarea() {
        textarea.parentNode.removeChild(textarea);
        window.removeEventListener('click', handleOutsideClick);
        node.show();
        that.transfomer.show();
        that.transfomer.forceUpdate();
      }

      function setTextareaWidth(newWidth) {
        if (!newWidth) {
          // set width for placeholder
          newWidth = node.placeholder.length * node.fontSize();
        }
        // some extra fixes on different browsers
        var isSafari = /^((?!chrome|android).)*safari/i.test(
          navigator.userAgent
        );
        var isFirefox =
          navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
        if (isSafari || isFirefox) {
          newWidth = Math.ceil(newWidth);
        }

        textarea.style.width = newWidth + 'px';
      }

      textarea.addEventListener('keydown', function (e) {
        // hide on enter
        // but don't hide on shift + enter
        if (e.keyCode === 13 && !e.shiftKey) {
          node.text(textarea.value);
          removeTextarea();
          that.saveTemplate();
        }
        // on esc do not set value back to node
        if (e.keyCode === 27) {
          removeTextarea();
        }
      });

      textarea.addEventListener('keydown', function (e) {
        let scale = node.getAbsoluteScale().x;
        setTextareaWidth(node.width() * scale);
        textarea.style.height = 'auto';
        textarea.style.height =
          textarea.scrollHeight + node.fontSize() + 'px';
      });

      function handleOutsideClick(e) {
        if (e.target !== textarea) {
          node.text(textarea.value);
          removeTextarea();
          that.saveTemplate();
        }
      }
      setTimeout(() => {
        window.addEventListener('click', handleOutsideClick);
      });
    });
  }
}

