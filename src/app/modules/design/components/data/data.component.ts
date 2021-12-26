import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {

  items = [{ id: 1, name: 'Test 1', selected: false}, {id: 2, name: 'Test 2', selected: true}];

  constructor(private store: Store) { }

  ngOnInit(): void {
    
  }

  checkAll(evt) {
    
  }
}
