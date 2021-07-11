import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { getShapesSelector } from 'src/app/stores/selectors';

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

  constructor(private store: Store) { }
  
  ngOnInit(): void {
    let that = this;
    this.store.select(getShapesSelector).subscribe(x => that.elements = x);
  }

  drawClick(element) {
    this.draw.emit(element);
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
