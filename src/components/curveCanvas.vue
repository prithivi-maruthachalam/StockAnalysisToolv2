<template>
    <span>
        <canvas ref="canvasRef" height="425" width="465"
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
        // Get ref for the canvas element
        this.canvasref = this.$refs.canvasRef
        this.context = this.canvasref.getContext("2d")

        this.context.clearRect(
            0,0,
            this.canvasref.width,
            this.canvasref.height
        )

        // Compute and set start and end values for the curve
        let x = 2 * (this.canvasref.width - this.graphSize) / 3
        let y =  this.graphSize + ((this.canvasref.height - this.graphSize)/3)
        this.constants.start = [Math.round(x),Math.round(y)]
        x = x + this.graphSize
        y = y - this.graphSize
        this.constants.end = [Math.round(x),Math.round(y)]

        // Debug
        // console.log(this.constants.start, this.constants.end)

        // Draw bounding rectangle for curve
        this.context.beginPath();
        this.context.rect(
            this.constants.start[0],
            this.constants.end[1],
            this.graphSize,
            this.graphSize
        );
        this.context.stroke();

        // Draw the Bezier Curve
        this.context.beginPath()
        this.context.moveTo(...this.constants.start)
        this.context.quadraticCurveTo(...this.coords,...this.constants.end)
        this.context.stroke()

        // Draw the outer circle for the control point
        this.context.beginPath()
        this.context.arc(...this.coords,this.constants.radius,0,Math.PI * 2)
        this.context.stroke()
        // Draw the inner circle for the control point
        this.context.beginPath()
        this.context.arc(...this.coords,3,0,Math.PI * 2)
        this.context.fill()

        // Draw x-axis start value : need not move according to size
        this.context.beginPath()
        this.context.font = "15px Arial"
        this.context.fillStyle = "#435a6b";
        this.context.fillText(
            this.real_vals[0],
            this.constants.start[0],
            this.constants.start[1] + 30
        )
        // Draw x-axis end value
        this.context.fillText(
            this.real_vals[1],
            this.constants.end[0] - (8 * this.real_vals[1].length),
            this.constants.start[1] + 30
        )
        // Draw y-axis start value
        this.context.fillText(
            this.real_vals[2],
            this.constants.start[0] - (12 + (8 * this.real_vals[2].length)),
            this.constants.start[1]
        )
        // Draw y-axis end value
        this.context.fillText(
            this.real_vals[3],
            this.constants.start[0] - (12 + (8 * this.real_vals[3].length)),
            this.constants.end[1] + 8
        )
        this.context.fill()

        // Update curve params 
        this.curveParams.start = this.constants.start
        this.curveParams.control = this.coords
        this.curveParams.end = this.constants.end
    },
    updated(){
        /* Handles redrawing x-axis & y-axis values */
        //Change values to INF % -INF when required
        if(this.ruleType == 'range'){
            this.realValues = this.real_vals
        } else if(this.ruleType == 'greaterThan'){
            this.realValues = [this.real_vals[0],"INF"]
        } else if(this.ruleType == "lessThan"){
            this.realValues = ["-INF",this.real_vals[1]]
        }

        //Clears the strips where the numbers are drawn
        this.context.clearRect(
            0,
            this.constants.start[1] + 10,
            this.canvasref.width,
            this.canvasref.height - (this.constants.start[1] + 20)
        )
        this.context.clearRect(
            0,
            0,
            this.constants.start[0] - 5,
            this.canvasref.height
        )

        // Draw x-axis start value : need not move according to size
        this.context.beginPath()
        this.context.font = "15px Arial"
        this.context.fillStyle = "#435a6b";
        this.context.fillText(
            this.real_vals[0],
            this.constants.start[0],
            this.constants.start[1] + 30
        )
        // Draw x-axis end value
        this.context.fillText(
            this.real_vals[1],
            this.constants.end[0] - (8 * this.real_vals[1].length),
            this.constants.start[1] + 30
        )
        // Draw y-axis start value
        this.context.fillText(
            this.real_vals[2],
            this.constants.start[0] - (12 + (8 * this.real_vals[2].length)),
            this.constants.start[1]
        )
        // Draw y-axis end value
        this.context.fillText(
            this.real_vals[3],
            this.constants.start[0] - (12 + (8 * this.real_vals[3].length)),
            this.constants.end[1] + 8
        )
        this.context.fill()
    },
    data(){
        return{
            context: null,
            canvasref: null,
            coords: [300,300],
            constants: {
                start: [0,0],
                end: [0, 0],
                radius: 10,
                sizeOfGraph: this.graphSize
            },
            isDragging: false,
            realValues: this.real_vals,
            curveParams: {
                "start":[null,null],
                "control":[null,null],
                "end":[null,null]
            }
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
            /* Redraws curve after mouse event */

            // Clears the rectangular area over the curve
            this.context.clearRect(
                this.constants.start[0] - 10,
                0,
                this.canvasref.width, 
                this.constants.start[1] + 10
            )

            // Draws the bounding rectangle for the curve
            this.context.beginPath();
            this.context.rect(
                this.constants.start[0],
                this.constants.end[1],
                this.graphSize,
                this.graphSize
            );
            this.context.stroke();

            // Draws the Bezier curve
            this.context.beginPath();
            this.context.moveTo(...this.constants.start);
            this.context.quadraticCurveTo(...this.coords, ...this.constants.end)
            this.context.stroke()

            // Draws the outer circle for the control point
            this.context.beginPath()
            this.context.arc(...this.coords,this.constants.radius,0,Math.PI * 2)
            this.context.stroke()
            // Draws the inner circle for the control point
            this.context.fillStyle = "#FF0000"
            this.context.beginPath()
            this.context.arc(...this.coords,3,0,Math.PI * 2)
            this.context.fill()
        },
        updateCurveVals(){
            this.curveParams.start = this.constants.start
            this.curveParams.control = this.coords
            this.curveParams.end = this.constants.end

            return this.curveParams
        }
    }    
}
</script>

<style lang="scss" scoped>
canvas{
    border: 1px solid green;
}
</style>