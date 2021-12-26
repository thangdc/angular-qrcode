import { Injectable } from "@angular/core";
import { Observable, of } from 'rxjs';
import { ImageModel, ShapeModel, TemplateModel } from "../models";

@Injectable()
export class DesignService {

    private readonly DATA_INFO_KEY = 'DATA_INFO';
    private readonly DATA_IMAGE_KEY = 'IMAGE_INFO';
    private readonly DATA_SHAPE_KEY = 'SHAPE_INFO';
    private readonly TEMPLATE_KEY = 'TEMPLATE_INFO';

    loadData(templateId: number) : Observable<any> {
        const data = localStorage.getItem(`${this.DATA_INFO_KEY}_${templateId}`);
        return of(data);
    }

    saveData(templateId: number, item: string): Observable<any> {
        localStorage.setItem(`${this.DATA_INFO_KEY}_${templateId}`, item);
        return of(item);
    }

    addImage(templateId: number, item: ImageModel): Observable<any> {
        const key = `${this.DATA_IMAGE_KEY}_${templateId}`;
        const data = localStorage.getItem(key);
        let items = JSON.parse(data);

        if (items && items.length > 0) {
            items.push(item);
        } else {
            items = [item];
        }

        localStorage.setItem(key, JSON.stringify(items));

        return of(item);
    }

    loadImages(templateId: number) : Observable<any> {
        const data = localStorage.getItem(`${this.DATA_IMAGE_KEY}_${templateId}`);
        const items = JSON.parse(data);
        return of(items);
    }

    removeImage(templateId: number, item): Observable<any> {
        const key = `${this.DATA_IMAGE_KEY}_${templateId}`;
        const data = localStorage.getItem(key);
        let items = JSON.parse(data);
        if (item) {
            items = items.filter(x => x.id !== item.id);
            localStorage.setItem(key, JSON.stringify(items));
        }
        return of(items);
    }

    addShape(templateId: number, item: ShapeModel): Observable<any> {
        const key = `${this.DATA_SHAPE_KEY}_${templateId}`;
        const data = localStorage.getItem(key);
        let items = JSON.parse(data);

        if (items && items.length > 0) {
            items.push(item);
        } else {
            items = [item];
        }

        localStorage.setItem(key, JSON.stringify(items));
        return of(item);
    }

    getShapes(templateId: number) : Observable<any> {
        const data = localStorage.getItem(`${this.DATA_SHAPE_KEY}_${templateId}`);
        let items = JSON.parse(data);
        if (items && items.length > 0) {
            items = items.sort((x, y) => x.index - y.index);
        }
        return of(items);
    }

    updateShape(templateId: number, item: ShapeModel) : Observable<any> {
        const key = `${this.DATA_SHAPE_KEY}_${templateId}`;
        const data = localStorage.getItem(key);
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
            localStorage.setItem(key, JSON.stringify(updatedArray));
        }
        return of(result);
    }

    removeShape(templateId: number, id): Observable<any> {
        const key = `${this.DATA_SHAPE_KEY}_${templateId}`;
        const data = localStorage.getItem(key);
        let items = JSON.parse(data);
        if (id > 0) {
            items = items.filter(x => x.id !== id);
            localStorage.setItem(key, JSON.stringify(items));
        }
        return of(items);
    }

    getTemplates() : Observable<TemplateModel[]> {
        const data = localStorage.getItem(this.TEMPLATE_KEY);
        let items = JSON.parse(data);
        if (!items) items = [];
        items = items.sort((x, y) => y.id - x.id);
        return of(items);
    }

    addTemplate(item: TemplateModel): Observable<TemplateModel> {
        let result = item;
        const data = localStorage.getItem(this.TEMPLATE_KEY);
        let items = JSON.parse(data);
        if (items && items.length > 0) {
            items.push(item);
        } else {
            items = [item];
        }
        localStorage.setItem(this.TEMPLATE_KEY, JSON.stringify(items));
        localStorage.setItem(`${this.DATA_SHAPE_KEY}_${item.id}`, JSON.stringify([]));
        localStorage.setItem(`${this.DATA_INFO_KEY}_${item.id}`, JSON.stringify([]));
        localStorage.setItem(`${this.DATA_IMAGE_KEY}_${item.id}`, JSON.stringify([]));
        return of(result)
    }

    updateTemplate(item: TemplateModel): Observable<TemplateModel> {
        let result = item;

        const data = localStorage.getItem(this.TEMPLATE_KEY);
        const items = JSON.parse(data);
        
        if (items && items.length > 0) {
            const updatedArray = items.map(x => {
                if (x.id === item.id) {
                    result = {...x, ...item};
                    x = result;
                }
                return x;
            });
            localStorage.setItem(this.TEMPLATE_KEY, JSON.stringify(updatedArray));
        }

        return of(result);
    }

    removeTemplate(id: number): Observable<TemplateModel[]> {
        const data = localStorage.getItem(this.TEMPLATE_KEY);
        let items = JSON.parse(data);
        items = items.filter(x => x.id !== id);
        localStorage.setItem(this.TEMPLATE_KEY, JSON.stringify(items));
        localStorage.removeItem(`${this.DATA_SHAPE_KEY}_${id}`);
        localStorage.removeItem(`${this.DATA_INFO_KEY}_${id}`);
        localStorage.removeItem(`${this.DATA_IMAGE_KEY}_${id}`);
        return of(items);
    }

    markTemplateAsDefault(id: number): Observable<TemplateModel[]> {
        const data = localStorage.getItem(this.TEMPLATE_KEY);
        let items = JSON.parse(data);
        items = items.sort((x, y) => y.id - x.id).map(x => {
            if (x.id === id) {
                x.isDefault = true;
            } else {
                x.isDefault = false;
            }
            return x;
        });
        localStorage.setItem(this.TEMPLATE_KEY, JSON.stringify(items));
        return of(items);
    }
}