<template>
    <canvas ref="canvasRef" height="400" width="400"
        @mousemove="canvasMouse"
        @mousedown="(e)=>{isDragging = true;canvasMouse(e)}"
        @mouseup="(e)=>{isDragging = false}"
    >

    </canvas>
</template>

<script>
export default {
    name: "CurveCanvas",
    mounted(){
        this.canvasref = this.$refs.canvasRef
        this.context = this.canvasref.getContext("2d")

        let x = (this.canvasref.width - 340)/2
        let y = this.canvasref.height - x
        this.constants.start = [x,y]
        this.constants.end = [y,x]
        console.log(this.constants.start,this.constants.end)


        this.context.beginPath();
        this.context.rect(
            this.constants.start[0],
            this.constants.end[1],
            this.constants.start[1] - this.constants.start[0],
            this.constants.end[0] - this.constants.end[1]
        );
        this.context.stroke();

        this.context.beginPath()
        this.context.moveTo(...this.constants.start)
        this.context.quadraticCurveTo(250,250,...this.constants.end)
        this.context.stroke()

        this.context.beginPath()
        this.context.arc(250,250,this.constants.radius,0,Math.PI * 2)
        this.context.stroke()

        this.context.fillStyle = "#FF0000"
        this.context.beginPath()
        this.context.arc(250,250,3,0,Math.PI * 2)
        this.context.fill()
    },
    data(){
        return{
            context: null,
            canvasref: null,
            coords: [null,null],
            constants: {
                start: [0,0],
                end: [0, 0],
                radius: 10
            },
            isDragging: false,
            realCoords : {
                start: this.realStart,
                end: this.realEnd
            }
        }
    },
    props: {
        realStart: Number,
        realEnd: Number
    },
    methods: {
        canvasMouse(event){
            if(this.isDragging &&
                event.offsetX > this.constants.start[0] &&
                event.offsetX < this.constants.end[0] &&
                event.offsetY < this.constants.start[1] &&
                event.offsetY > this.constants.end[1]
            ){
                this.coords = [event.offsetX,event.offsetY]
                this.redraw()
            }
        },
        redraw(){
            this.context.clearRect(0,0,this.canvasref.width, this.canvasref.height)
            
            this.context.beginPath();
            this.context.rect(
                this.constants.start[0],
                this.constants.end[1],
                this.constants.start[1] - this.constants.start[0],
                this.constants.end[0] - this.constants.end[1]
            );
            this.context.stroke();

            this.context.beginPath();
            this.context.moveTo(...this.constants.start);
            this.context.quadraticCurveTo(...this.coords, ...this.constants.end)
            this.context.stroke()

            this.context.beginPath()
            this.context.arc(...this.coords,this.constants.radius,0,Math.PI * 2)
            this.context.stroke()

            this.context.fillStyle = "#FF0000"
            this.context.beginPath()
            this.context.arc(...this.coords,3,0,Math.PI * 2)
            this.context.fill()
        }
    }    
}
</script>

<style lang="scss" scoped>
canvas{
    border: 1px solid green;
}
</style>