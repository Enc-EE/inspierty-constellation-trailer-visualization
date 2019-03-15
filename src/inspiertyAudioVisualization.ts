import LogoPng from "./assets/Logo.png"
import { AudioGraph } from "./enc/audio/audioGraph";
import { ECanvas } from "./enc/eCanvas";
import { EAnimation } from "./enc/eAnimation";
import { Star } from "./star";
import { ShootingStarProcessor } from "./shootingStarProcessor";
import { TextProcessor, EasingFunctions } from "./textProcessor";
import { AudioVisualizationSamples } from "./enc/samples/audioVisualizationSamples";

export class InspiertyAudioVisualization {
    private frequencyIndex = 7;

    shootingStarProcessor: ShootingStarProcessor;
    inspiertyLogoImage: HTMLImageElement;
    textProcessor: TextProcessor;
    imageWidth: number = 0;
    imageHeight: number = 0;
    lowerBorder = 0;
    upperBorder = 0.8;
    numberOfStars = 1000;
    drawRelDataValue: boolean;

    constructor(private audioGraph: AudioGraph, private canvas: ECanvas, private animation: EAnimation) {
        this.inspiertyLogoImage = new Image();
        this.inspiertyLogoImage.src = LogoPng;

        this.shootingStarProcessor = new ShootingStarProcessor(this.animation);

        var samples = new AudioVisualizationSamples(this.audioGraph);

        console.log(window.location.search);
        var keyValues = window.location.search.substr(1).split("&").map(x => {
            return x.split("=");
        });

        const methods = [
            "fi - frequencyIndex - 7",
            "lb - lowerBorder - 0",
            "ub - upperBorder - 0.8",
            "spec - spec",
            "rel - drawRelDataValue",
            "fps - fps - 30",
            "nos - numberOfStars - 1000",
        ]

        console.log("methods:");
        for (let i = 0; i < methods.length; i++) {
            const method = methods[i];
            console.log(method);
        }

        for (const item of keyValues) {
            switch (item[0]) {
                case "fi":
                    this.frequencyIndex = +item[1];
                    break;
                case "lb":
                    this.lowerBorder = +item[1];
                    break;
                case "ub":
                    this.upperBorder = +item[1];
                    break;
                case "spec":
                    this.canvas.addDrawFunction(samples.drawSpectrum);
                    break;
                case "rel":
                    this.drawRelDataValue = true;
                    break;
                case "fps":
                    this.animation.setFps(+item[1]);
                    break;
                case "nos":
                    this.numberOfStars = +item[1];
                    break;
            }
        }

        this.animation.addUpdateFunction(this.updateStars);
        this.canvas.addDrawFunction(this.inspiertyVisV3);
    }

    private inspiertyVisV3 = (ctx: CanvasRenderingContext2D, width?: number, height?: number) => {
        var data = this.audioGraph.getSpectrum();
        var relDataValue = this.calculateRelDataValue(data[this.frequencyIndex]);

        this.shootingStarProcessor.process(relDataValue, this.angle, width, height);

        this.drawStars(ctx, width, height);
        ctx.fillStyle = "rgba(0, 0, 0, " + (1 - relDataValue / 2 - 0.4) + ")"
        ctx.fillRect(0, 0, width, height);

        this.shootingStarProcessor.draw(ctx, width, height);

        if (this.drawRelDataValue) {
            ctx.fillStyle = "white";
            ctx.fillRect(0, height, 50, -height * relDataValue);
        }

        this.drawImage(width, height, ctx, relDataValue);
    }

    private drawImage(width: number, height: number, ctx: CanvasRenderingContext2D, relDataValue: number) {
        if (!this.imageWidth) {
            var imageSizing = this.inspiertyLogoImage.naturalWidth / this.inspiertyLogoImage.naturalHeight;
            var stageSizing = width / height;
            var imageWidth;
            var imageHeight;
            if (imageSizing > stageSizing) { // use width as limit
                imageWidth = width;
                imageHeight = this.inspiertyLogoImage.naturalHeight / this.inspiertyLogoImage.naturalWidth * width;
            }
            else { // use height as limit
                imageWidth = this.inspiertyLogoImage.naturalWidth / this.inspiertyLogoImage.naturalHeight * height;
                imageHeight = height;
            }
            this.imageWidth = imageWidth * 0.8;
            this.imageHeight = imageHeight * 0.8;
        }
        var y = height / 3 - this.imageHeight / 2;
        ctx.drawImage(this.inspiertyLogoImage, width / 2 - this.imageWidth / 2, y, this.imageWidth, this.imageHeight);
        ctx.beginPath();
        ctx.globalCompositeOperation = "lighter";
        const novaX = width / 2 - this.imageWidth / 2 + this.imageWidth * 0.4872;
        const novaY = y + this.imageHeight * 0.4105;
        const novaR = this.imageHeight * 0.0494 * (relDataValue / 2 + 0.7) + 0.0;
        if (novaX && novaY && novaR) {
            var grad = ctx.createRadialGradient(novaX, novaY, 0, novaX, novaY, novaR);
            grad.addColorStop(0, 'rgba(255, 255, 255, ' + (relDataValue / 2) + ')');
            grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
            ctx.fillStyle = grad;
            ctx.arc(novaX, novaY, novaR, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalCompositeOperation = "source-over";
        }
    }

    // private step = 0;

    // private processText(data: Uint8Array, relDataValue: number, width: number, height: number, ctx: CanvasRenderingContext2D) {
    //     if (data && data[0] && this.step == 0) {
    //         this.step = 1;
    //         this.textProcessor = new TextProcessor(this.animation, "Faint color", Date.now() / 1000, Date.now() / 1000 + 43);
    //     }
    //     if (this.textProcessor) {
    //         if (this.step == 1 && Date.now() / 1000 >= this.textProcessor.endTime + 20) {
    //             this.step = 2;
    //             this.textProcessor = new TextProcessor(this.animation, "Deep Field", Date.now() / 1000 + 1, Date.now() / 1000 + 22.5);
    //         }
    //         if (this.step == 2 && Date.now() / 1000 >= this.textProcessor.endTime + 4) {
    //             this.step = 3;
    //             this.textProcessor = new TextProcessor(this.animation, "Drifting into the atmosphere", Date.now() / 1000 + 1, Date.now() / 1000 + 30);
    //         }
    //         if (this.step == 3 && Date.now() / 1000 >= this.textProcessor.endTime + 4) {
    //             this.step = 4;
    //             this.textProcessor = new TextProcessor(this.animation, "From the album constellation", Date.now() / 1000 + 1, Date.now() / 1000 + 30);
    //         }
    //         this.textProcessor.process(relDataValue, width, height);
    //         this.textProcessor.draw(ctx, width, height);
    //     }
    // }

    private ease(startTime: number, currentTime: number, duration: number, startValue: number, targetValue: number) {
        var tDelta = currentTime - startTime;
        var tRel = tDelta / duration;
        tRel = tRel > 1 ? 1 : tRel;
        var scaledT = EasingFunctions.easeInOutQuad(tRel);
        var maxScaledT = EasingFunctions.easeInOutQuad(1);
        var x = startValue + (targetValue - startValue) * (scaledT / maxScaledT);
        return x;
    }

    private start: number;
    private timeToMove: number;
    private xStart: number;
    private xTarget: number;

    private angle = Math.PI * 0.3;
    private targetAngle = this.angle;
    private clockwise = 1;

    private speed = 4;
    private targetSpeed = this.speed;

    private stars: Star[] = []
    private updateStars = (timeDiff: number) => {
        this.angling(timeDiff);
        this.speeding(timeDiff);
        for (let i = 0; i < this.stars.length; i++) {
            const star = this.stars[i];
            star.x += Math.cos(this.angle) * timeDiff * 4;
            star.y += Math.sin(this.angle) * timeDiff * 4;
        }
    }

    private drawStars = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        while (this.stars.length < this.numberOfStars) {
            this.addStar(width, height);
        }

        if (Math.random() > 0.9) {
            for (let i = 0; i < Math.round(Math.random() * 5); i++) {
                this.stars.splice(0, 1);
            }
        }

        ctx.fillStyle = "white";

        for (let i = 0; i < this.stars.length; i++) {
            const star = this.stars[i];
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.size / 2, 0, Math.PI * 2);
            ctx.fill();

            if (star.x > width) {
                star.x = star.x - width;
            } else if (star.x < 0) {
                star.x = star.x + width;
            }

            if (star.y > height) {
                star.y = star.y - height;
            } else if (star.y < 0) {
                star.y = star.y + height;
            }
        }
    }

    private addStar(width: number, height: number) {
        this.stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * (width / 600) + 0.4
        });
    }

    private speeding(timeDiff: number) {
        if (this.speed == this.targetSpeed) {
            this.targetSpeed = Math.random() * 10 + 2;
        }
        else {
            if (this.speed > this.targetSpeed) {
                this.speed -= 0.1 * timeDiff;
                if (this.speed < this.targetSpeed) {
                    this.speed = this.targetSpeed;
                }
            }
            else {
                this.speed += 0.1 * timeDiff;
                if (this.speed > this.targetSpeed) {
                    this.speed = this.targetSpeed;
                }
            }
        }
    }

    private angling(timeDiff: number) {
        if (this.angle == this.targetAngle) {
            var targetDelta = Math.random() * Math.PI - Math.PI / 2;
            this.targetAngle += targetDelta;
            this.clockwise = targetDelta < 0 ? -1 : 1;
        }
        else {
            var stepDelta = timeDiff * 0.06 * this.clockwise;
            if (this.angle <= this.targetAngle && this.angle + stepDelta >= this.targetAngle
                || this.angle >= this.targetAngle && this.angle + stepDelta <= this.targetAngle) {
                this.angle = this.targetAngle;
            }
            else {
                this.angle += timeDiff * 0.06 * this.clockwise;
            }
        }
    }

    private calculateRelDataValue(dataValue: number) {
        var relDataValue = dataValue / 255;
        if (relDataValue < this.lowerBorder) {
            relDataValue = this.lowerBorder;
        }
        if (relDataValue > this.upperBorder) {
            relDataValue = this.upperBorder;
        }
        var finalRelDataValue = (relDataValue - this.lowerBorder) / (this.upperBorder - this.lowerBorder);
        return finalRelDataValue;
    }
}