import { ECanvas } from "./enc/eCanvas";
import { EAnimation } from "./enc/eAnimation";
import { ShootingStar } from "./shootingStar";

export class ShootingStarProcessor {
    public limit = 5;
    public spawnWaiter = 0;
    public shootingStars: ShootingStar[] = [];

    constructor(private animation: EAnimation) {
        this.animation.addUpdateFunction(this.update);
    }

    public process = (relDataValue: number, angle: number, width: number, height: number) => {
        if (this.shootingStars.length <= this.limit && this.spawnWaiter <= 0) {
            if (Math.random() * relDataValue > 0.9) {
                var x = width / 2 - Math.cos(angle) * width / 1.5 + (width * Math.random() - width / 2);
                var y = height / 2 - Math.sin(angle) * width / 1.5 + (height * Math.random() - height / 2);
                console.log("shooting star");

                this.shootingStars.push({
                    x: x,
                    y: y,
                    angle: angle + Math.PI / 16 * Math.random() - Math.PI / 32,
                    speed: 600 + Math.random() * 200,
                    size: Math.round(Math.random() * 3) + 2
                });
                this.spawnWaiter = 50;
            }
        } else {
            this.spawnWaiter--;
        }
    }

    public update = (timeDiff: number) => {
        for (let i = 0; i < this.shootingStars.length; i++) {
            const shootingStar = this.shootingStars[i];
            shootingStar.x += Math.cos(shootingStar.angle) * timeDiff * shootingStar.speed;
            shootingStar.y += Math.sin(shootingStar.angle) * timeDiff * shootingStar.speed;
        }
    }

    public draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        let removeIs: number[] = [];
        ctx.fillStyle = "white";
        ctx.strokeStyle = "white";
        ctx.lineCap = "round";

        for (let i = 0; i < this.shootingStars.length; i++) {
            const shootingStar = this.shootingStars[i];

            for (let j = shootingStar.size; j > 0; j -= 0.5) {
                this.drawShootingStarPart(ctx, 0.5, shootingStar, j * j * j);
            }

            ctx.arc(shootingStar.x, shootingStar.y, 1, 0, Math.PI * 2);
            ctx.fill();

            if (shootingStar.x > width * 3 || shootingStar.x < -width * 2 || shootingStar.y > height * 3 || shootingStar.y < -height * 2) {
                removeIs.push(i);
            }
        }

        for (let i = removeIs.length - 1; i >= 0; i--) {
            const removeI = removeIs[i];
            this.shootingStars.splice(removeI, 1);
        }
    }

    private drawShootingStarPart(ctx: CanvasRenderingContext2D, lineWidth: number, shootingStar: ShootingStar, length: number) {
        ctx.beginPath();
        ctx.lineWidth = lineWidth;
        ctx.moveTo(shootingStar.x, shootingStar.y);
        ctx.lineTo(shootingStar.x - Math.cos(shootingStar.angle) * length, shootingStar.y - Math.sin(shootingStar.angle) * length);
        ctx.stroke();
    }
}