import { AudioGraph } from "../audio/audioGraph";

export class AudioVisualizationSamples {
    constructor(private audioGraph: AudioGraph) { }

    public drawSpectrum = (ctx: CanvasRenderingContext2D, width?: number, height?: number) => {
        var data = this.audioGraph.getSpectrum();
        var bufferLength = data.length;
        const barWidth = width / bufferLength;

        for (let i = 0; i < bufferLength; i++) {
            const barHeight = data[i] / 2;
            ctx.fillStyle = 'hsl(' + (230 - barHeight / 150 * 50) + ', 100%, ' + (barHeight / 150 * 50 + 20) + '%)';
            ctx.fillRect(i * barWidth, height, barWidth * 0.5, -barHeight * 2);
        }
    }

    public drawWave = (ctx: CanvasRenderingContext2D, width?: number, height?: number) => {
        var data = this.audioGraph.getWave();
        var length = data.length;

        ctx.lineWidth = 2;
        ctx.strokeStyle = 'rgb(150, 150, 150)';
        ctx.beginPath();
        const sliceWidth = width / (length - 1);
        let x = 0;

        for (let i = 0; i < length; i++) {
            const v = data[i] / 128.0;
            const y = v * height / 2;
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
            x += sliceWidth;
        }
        ctx.stroke();
    }

    public drawSpectrumArc = (ctx: CanvasRenderingContext2D, width?: number, height?: number) => {
        var data = this.audioGraph.getSpectrum();
        var bufferLength = data.length;
        for (let i = 0; i < bufferLength; i++) {
            var piPart = Math.PI * 2 / bufferLength * i;
            const barHeight = 50 + data[i];
            var x = Math.cos(piPart) * barHeight;
            var y = Math.sin(piPart) * barHeight;
            ctx.beginPath();
            ctx.moveTo(width / 2, height / 2);
            ctx.lineTo(width / 2 + x, height / 2 + y);
            ctx.strokeStyle = 'hsl(' + (230 - barHeight / 150 * 50) + ', 100%, ' + (barHeight / 150 * 50 + 20) + '%)';
            ctx.lineWidth = 5;
            ctx.stroke();
        }
    }

    public drawSpectrumArcV2 = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
        var data = this.audioGraph.getSpectrum();
        var bufferLength = data.length;
        for (let i = 0; i < bufferLength; i++) {
            var piPart = Math.PI * 2 / bufferLength * i;
            var piPart2 = Math.PI * 2 / bufferLength * (i + 1);
            const barHeight = data[i];
            ctx.beginPath();
            ctx.moveTo(width / 2, height / 2);
            ctx.arc(width / 2, height / 2, barHeight, piPart, piPart2)

            ctx.fillStyle = 'hsl(' + (230 - (barHeight - 100) / 150 * 50) + ', 100%, ' + ((barHeight - 100) / 150 * 50 + 20) + '%)';
            ctx.fill();
        }
    }
}