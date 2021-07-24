export class ShapeModel {
    id: number;
    top: number;
    left: number;
    width: number;
    height: number;
    strokeColor: string;
    strokeSize: number;
    backgroundColor: string;
    backgroundImage: string;
    cornerRadius: number;
    opacity: number;
    dragable: boolean;
    text: string;
    textImage: string;
    scaleX: number;
    scaleY: number;
    qrCode: string;

    constructor() {
        this.id = 0;
        this.top = 10;
        this.left = 10;
        this.width = 200;
        this.height = 200;
        this.strokeColor = '#000000';
        this.strokeSize = 1;        
        this.backgroundColor = '#ffffff';
        this.backgroundImage = '';
        this.cornerRadius = 0;
        this.opacity = 1;
        this.dragable = true;
        this.text = '';
        this.textImage = '';
        this.scaleX = 1;
        this.scaleY = 1; 
        this.qrCode = '';
    }
}