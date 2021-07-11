import { Injectable } from "@angular/core";
import { Observable, of } from 'rxjs';
import { ImageModel } from "../models";

@Injectable()
export class DesignService {

    private readonly DATA_INFO_KEY = 'DATA_INFO';
    private readonly DATA_IMAGE_KEY = 'IMAGE_INFO';

    loadData() : Observable<any> {
        const data = localStorage.getItem(this.DATA_INFO_KEY);
        return of(data);
    }

    saveData(item: string): Observable<any> {
        localStorage.setItem(this.DATA_INFO_KEY, item);
        return of(item);
    }

    addImage(item: ImageModel): Observable<any> {
        let data = localStorage.getItem(this.DATA_IMAGE_KEY);
        let items = JSON.parse(data);

        if (items && items.length > 0) {
            items.push(item);
        } else {
            items = [item];
        }

        localStorage.setItem(this.DATA_IMAGE_KEY, JSON.stringify(items));

        return of(item);
    }

    loadImages() : Observable<any> {
        let data = localStorage.getItem(this.DATA_IMAGE_KEY);
        let items = JSON.parse(data);
        return of(items);
    }

    removeImage(item): Observable<any> {
        let data = localStorage.getItem(this.DATA_IMAGE_KEY);
        let items = JSON.parse(data);
        if (item) {
            items = items.filter(x => x.id !== item.id);
            localStorage.setItem(this.DATA_IMAGE_KEY, JSON.stringify(items));
        }
        return of(items);
    }
}