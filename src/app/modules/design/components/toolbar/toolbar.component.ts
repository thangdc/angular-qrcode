import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { ShapeModel } from 'src/app/shared/models';
import { removeShapeAction } from 'src/app/stores';
import { getShapeSelector } from 'src/app/stores/selectors';
import { ConfigComponent } from '../config/config.component';
import { ExportComponent } from '../export/export.component';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  @Output() export: EventEmitter<any> = new EventEmitter();
  @Output() draw: EventEmitter<any> = new EventEmitter();

  elements: any[];
  data: any;
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
      that.isSelected = data !== undefined && data !== null;
      this.currentShape = data;
    });
  }

  removeShape() {
    const that = this;
    if (that.currentShape) {
      that.store.dispatch(removeShapeAction({id: that.currentShape.id}));
    }
  }

  exportData() {
    this.modal.open(ExportComponent, { backdrop: 'static' });
  }
}
