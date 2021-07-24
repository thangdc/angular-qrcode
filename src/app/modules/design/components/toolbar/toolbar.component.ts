import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { ShapeModel } from 'src/app/shared/models';
import { removeShapeAction } from 'src/app/stores';
import { getShapeSelector } from 'src/app/stores/selectors';
import { ConfigComponent } from '../config/config.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Output() export: EventEmitter<any> = new EventEmitter();
  @Output() draw: EventEmitter<any> = new EventEmitter();
  @Output() position: EventEmitter<any> = new EventEmitter();

  elements: any[];
  data: any;
  name: string;
  isSelected: boolean = false;
  currentShape: ShapeModel;

  constructor(
    private store: Store,
    private modal: NgbModal
    ) { }
  
  ngOnInit(): void {
    this.selectedShape();
  }

  openDialog(id) {
    let ref = this.modal.open(ConfigComponent, { size: 'lg', backdrop: 'static' });
    ref.componentInstance.data = {
      id: id
    };
  }

  selectedShape() {
    const that = this;
    that.store.select(getShapeSelector).subscribe(data => {
      if (data) {
        that.isSelected = data !== undefined && data !== null;
        this.currentShape = data;
      }
    });
  }

  removeShape() {
    const that = this;
    if (that.currentShape) {
      that.store.dispatch(removeShapeAction({id: that.currentShape.id}));
    }
  }

  exportPdf() {
    this.data = {
      type: 'pdf',
      fileName: `design_${new Date().getTime()}.pdf`
    };
    //this.export.emit(this.data);
  }

  exportImage() {
    this.data = {
      type: 'image',
      fileName: `design_${new Date().getTime()}.png`
    }
    //this.export.emit(this.data);
  }

  exportTemplate() {
    this.data = {
      type: 'template',
      fileName: 'Template'
    }
    //this.export.emit(this.data);
  }

  exportData() {
    alert(this.name);
  }

  changePosition(direction) {
    this.position.emit(direction);
  }


}
