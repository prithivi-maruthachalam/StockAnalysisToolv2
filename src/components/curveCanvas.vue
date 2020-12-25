<template>
    <span>
    <canvas ref="canvasRef" height="425" width="400"
        @mousemove="canvasMouse"
        @mousedown="(e)=>{isDragging = true;canvasMouse(e)}"
        @mouseup="(e)=>{isDragging = false}"
    >

    </canvas>
        <span style="display:none">
            {{real_vals[0]}}
        </span>
    </span>
</template>

<script>
export default {
    name: "CurveCanvas",
    mounted(){
        this.canvasref = this.$refs.canvasRef
        this.context = this.canvasref.getContext("2d")

        let x = (this.canvasref.width - this.graphSize)/2
        let y = this.canvasref.height - 2*x
        this.constants.start = [x,y]
        this.constants.end = [y,x]

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


        this.context.beginPath()
        this.context.font = "15px Arial"
        this.context.fillStyle = "#435a6b";
        this.context.fillText(
            this.real_vals[0],
            this.constants.start[0] - 5,
            this.constants.start[1] + 30
        )
        this.context.fillText(
            this.real_vals[1],
            this.constants.end[0] - 15,
            this.constants.start[1] + 30
        )
        this.context.fill()
    },
    updated(){
        if(this.ruleType == 'range'){
            this.realValues = this.real_vals
        } else if(this.ruleType == 'greaterThan'){
            this.realValues = [this.real_vals[0],"INF"]
        } else if(this.ruleType == "lessThan"){
            this.realValues = ["-INF",this.real_vals[1]]
        }

        this.context.clearRect(
            0,this.constants.start[1] + 20,
            this.canvasref.width,
            this.canvasref.height - (this.constants.start[1] + 20)
        )
        
        this.context.beginPath()
        this.context.font = "15px Arial"
        this.context.fillStyle = "#435a6b";
        this.context.fillText(
            this.realValues[0],
            this.constants.start[0] - 5,
            this.constants.start[1] + 30
        )
        this.context.fillText(
            this.realValues[1],
            this.constants.end[0] - 15,
            this.constants.start[1] + 30
        )
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
                radius: 10,
                sizeOfGraph: this.graphSize
            },
            isDragging: false,
            realValues: this.real_vals
        }
    },
    props: {
        real_vals: Array,
        graphSize: Number,
        ruleType: String
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
            this.context.clearRect(
                0,
                0,
                this.canvasref.width, 
                this.constants.start[1] + 20
            )
            
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