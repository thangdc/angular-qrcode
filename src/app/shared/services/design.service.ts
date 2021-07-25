import { Injectable } from "@angular/core";
import { Observable, of } from 'rxjs';
import { ImageModel, ShapeModel } from "../models";

@Injectable()
export class DesignService {

    private readonly DATA_INFO_KEY = 'DATA_INFO';
    private readonly DATA_IMAGE_KEY = 'IMAGE_INFO';
    private readonly DATA_SHAPE_KEY = 'SHAPE_INFO';

    loadData() : Observable<any> {
        const data = localStorage.getItem(this.DATA_INFO_KEY);
        return of(data);
    }

    saveData(item: string): Observable<any> {
        localStorage.setItem(this.DATA_INFO_KEY, item);
        return of(item);
    }

    addImage(item: ImageModel): Observable<any> {
        const data = localStorage.getItem(this.DATA_IMAGE_KEY);
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
        const data = localStorage.getItem(this.DATA_IMAGE_KEY);
        const items = JSON.parse(data);
        return of(items);
    }

    removeImage(item): Observable<any> {
        const data = localStorage.getItem(this.DATA_IMAGE_KEY);
        let items = JSON.parse(data);
        if (item) {
            items = items.filter(x => x.id !== item.id);
            localStorage.setItem(this.DATA_IMAGE_KEY, JSON.stringify(items));
        }
        return of(items);
    }

    addShape(item: ShapeModel): Observable<any> {
        const data = localStorage.getItem(this.DATA_SHAPE_KEY);
        let items = JSON.parse(data);

        if (items && items.length > 0) {
            items.push(item);
        } else {
            items = [item];
        }

        localStorage.setItem(this.DATA_SHAPE_KEY, JSON.stringify(items));
        return of(item);
    }

    getShapes() : Observable<any> {
        const data = localStorage.getItem(this.DATA_SHAPE_KEY);
        let items = JSON.parse(data);
        if (items.length > 0) {
            items = items.sort((x, y) => x.index - y.index);
        }
        return of(items);
    }

    updateShape(item: ShapeModel) : Observable<any> {
        const data = localStorage.getItem(this.DATA_SHAPE_KEY);
        const items = JSON.parse(data);
        let result = item;
        if (items && items.length > 0) {
            const updatedArray = items.map(x => {
                if (x.id === item.id) {
                    result = {...x, ...item};
                    x = result;
                }
                return x;
            });
            localStorage.setItem(this.DATA_SHAPE_KEY, JSON.stringify(updatedArray));
        }
        return of(result);
    }

    removeShape(id): Observable<any> {
        const data = localStorage.getItem(this.DATA_SHAPE_KEY);
        let items = JSON.parse(data);
        if (id > 0) {
            items = items.filter(x => x.id !== id);
            localStorage.setItem(this.DATA_SHAPE_KEY, JSON.stringify(items));
        }
        return of(items);
    }
}