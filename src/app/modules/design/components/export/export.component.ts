import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Store } from '@ngrx/store';
import { exportDesignAction } from 'src/app/stores';

@Component({
  selector: 'app-export',
  templateUrl: './export.component.html',
  styleUrls: ['./export.component.scss']
})
export class ExportComponent implements OnInit {

  exportForm: FormGroup;
  constructor(public activeModal: NgbActiveModal,
    public store: Store) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.exportForm = new FormGroup({
      name: new FormControl('design'),
      type: new FormControl('pdf')
    });
  }

  saveClick() {
    this.store.dispatch(exportDesignAction({ payload: this.exportForm.value }));
    this.activeModal.close();
  }
}
