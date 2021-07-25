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
    text: string;
    textImage: string;
    scaleX: number;
    scaleY: number;
    qrCode: string;
    rotation: number;
    draggable: boolean;
    fontFamily: string;
    fontSize: number;
    fontStyle: string;
    align: string;
    verticalAlign: string;
    textColor: string;
    textPadding: number;
    textLineHeight: number;
    index: number;

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
        this.text = '';
        this.textImage = '';
        this.scaleX = 1;
        this.scaleY = 1; 
        this.qrCode = '';
        this.rotation = 0;
        this.draggable = true;
        this.fontFamily = 'Calibri';
        this.fontSize = 12;
        this.fontStyle = 'normal';
        this.align = 'left';
        this.verticalAlign = 'top';
        this.textColor = '#000000';
        this.textPadding = 0;
        this.textLineHeight = 1;
        this.index = 1;
    }
}