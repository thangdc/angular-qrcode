import { ImageModel } from "./image.model";
import { ShapeModel } from "./shape.model";

export class TemplateModel {
    id: number;
    name: string;
    description: string;
    width: number;
    height: number;
    isDefault: boolean;
    images: ImageModel[];
    shapes: ShapeModel[];

    constructor() {
        this.width = 800;
        this.height = 600;
    }
}