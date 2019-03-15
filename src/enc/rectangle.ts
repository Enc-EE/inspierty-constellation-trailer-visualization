export class Rectangle {
    constructor(public x: number, public y: number, public width: number, public height: number) { }

    public collidesWith(rectangle: Rectangle) {
        var hitx = false;
        var hity = false;
        if (this.x <= rectangle.x) {
            if (this.x <= rectangle.x && this.x + this.width > rectangle.x) {
                hitx = true;
            }
        } else {
            if (rectangle.x <= this.x && rectangle.x + rectangle.width > this.x) {
                hitx = true;
            }
        }
        
        if (hitx) {
            if (this.y <= rectangle.y) {
                if (this.y <= rectangle.y && this.y + this.width > rectangle.y) {
                    hity = true;
                }
            } else {
                if (rectangle.y <= this.y && rectangle.y + rectangle.width > this.y) {
                    hity = true;
                }
            }
        }

        return hitx && hity;
    }
}