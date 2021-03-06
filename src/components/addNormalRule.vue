<template>
    <div>
        <Index :ruleIndex="ruleIndex"/>
        <b-form id="start_values_form" inline>
            <b-form-select class="topSelect" 
                :options="ruleOptions" 
                v-model="rule.ruleType"
            />
                <label class="inLabel d-inline">from</label>
                <label 
                    class="labelHighlight d-inline inLabel"
                    v-if="rule.ruleType == 'lessThan'"
                >negative infinity</label>
                <b-form-input class="normalNum d-inline"
                    v-if="rule.ruleType == 'range' || rule.ruleType == 'greaterThan'"
                    v-model.number="rule.start"
                    type="number"
                />

                <label class="inLabel d-inline">to</label>
                <label 
                    class="labelHighlight d-inline"
                    v-if="rule.ruleType == 'greaterThan'"
                >infinity</label>
                <b-form-input class="normalNum d-inline"
                    v-if="rule.ruleType == 'range' || rule.ruleType == 'lessThan'"
                    v-model.number="rule.end"
                    type="number"
                />
        </b-form>
        <b-form-invalid-feedback :state="startValuesCheck">Start and end values cannot be the same</b-form-invalid-feedback>
        <b-form-invalid-feedback :state="(endCheck && startCheck)">Start and end values cannot be empty</b-form-invalid-feedback>
            
        <b-form-group class="checkboxGroup">
            <b-form-checkbox
                v-model="rule.function"
                value="custom"
                unchecked-value="linear"
            >
                Custom Normalisation?
            </b-form-checkbox>
        </b-form-group>

        <b-form-group id="end_values_group"
            label="Enter the start and end values here"
            v-if="rule.ruleType"
        >
            <b-form inline>
                <label v-if="rule.ruleType == 'range'" class="inLabel">from</label>
                <b-form-input class="normalNum d-inline"
                    v-if="rule.ruleType"
                    v-model.number="rule.n_start"
                    type="number"
                />
                <label v-if="rule.ruleType == 'range'" class="inLabel">to</label>
                <b-form-input class="normalNum d-inline"
                    v-if="rule.ruleType"
                    v-model.number="rule.n_end"
                    type="number"
                />
            </b-form>
            <b-form-invalid-feedback :state="(n_startCheck && n_endCheck)">
                Values cannot be empty
            </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group id="curveCanvas_group"
            v-if="rule.ruleType && rule.function == 'custom'"
            class="normalTargetGroup"
            label="Drag the point to set the shape of your custom curve"
        >
            <CurveCanvas
                v-bind:real_vals="[ruleStartValue,ruleEndValue,rule.n_start,rule.n_end]"
                v-bind:graphSize="350"
                v-bind:ruleType="rule.ruleType"
                ref="curveCanvasRef"
            ></CurveCanvas>
        </b-form-group>


        <b-form inline id="action_buttons_form">
            <b-button 
                variant="info"
                class="mr-3" 
                :disabled="!(startValuesCheck && startCheck && endCheck && n_startCheck && n_endCheck)"
                @click="createRule"
            >
                Confirm
            </b-button>
            <b-button 
                variant="danger"
                @click="deleteRule"
            >
                Delete
            </b-button>
        </b-form>
    </div>
</template>


<script>
import CurveCanvas from "./curveCanvas"
import Index from "./index"

export default {
    name: "AddNormalRule",
    components:{
        CurveCanvas,
        Index
    },
    computed: {
        ruleStartValue(){
            return (this.rule.ruleType == "lessThan") ? "-INF" : this.rule.start
        },
        ruleEndValue(){
            return (this.rule.ruleType == "greaterThan") ? "-INF" : this.rule.end
        },

        startValuesCheck(){
            //returns false if they are equal
            if(this.rule.ruleType == "range")   return this.rule.start != this.rule.end
            else    return true
        },
        startCheck(){
            //returns false if empty
            return (this.rule.ruleType == "lessThan" || this.rule.start != null)
        },
        endCheck(){
            //returns false if empty
            return (this.rule.ruleType == "greaterThan" || this.rule.end != null)
        },
        n_startCheck(){
            //returns false if empty
            return (this.rule.n_start != null)
        },
        n_endCheck(){
            return (this.rule.n_end != null)
        }
    },
    props: {
        existingRule: Object,
        ruleIndex: Number
    },
    data(){
        return{
            rule: {
                key: null,
                ruleType: null,
                start: null, 
                end: null,
                function: "linear",
                n_start: null,
                n_end: null
            },
            ruleOptions: [
                {value: "greaterThan", text: "Greater than"},
                {value: "lessThan", text: "Less than"},
                {value: "range", text: "Between 2 values"}
            ],
        }
    },
    created(){
        Object.assign(this.rule, this.existingRule)
    },
    methods: {
        createRule(){
            if(this.rule.ruleType == "greaterThan"){
                this.rule.end = "INF"
                this.rule.n_end = this.rule.n_start
            }
            else if(this.rule.ruleType == "lessThan"){
                this.rule.start = "-INF"
                this.rule.n_start = this.rule.n_end
            }

            if(this.rule.function == "custom")
                this.rule.curveParams = this.$refs.curveCanvasRef.updateCurveVals()
            else{
                // Delete the entire curveParams field
                delete this.rule.curveParams
            }

            this.$emit("addNormalRule:create",{rule:this.rule, index:this.ruleIndex-1})
        },

        deleteRule(){
            this.$emit("addNormalRule:delete",this.ruleIndex-1)
        }
    }
}
</script>

<style lang="scss" scoped>
    @import "../scss/variables.scss";

    .topSelect{
        margin-right: 20px;
    }

    input{
        margin-right: 15px;
    }

    .inLabel{
        margin-right: 20px;
    }

    .labelHighlight{
        font-size: 17.5px;
        color: $accentBgColor;
        font-weight: 600;
    }

    .checkboxGroup{
        margin-top: 20px;
    }

    #action_buttons_form{
        margin-top: 30px;
    }
</style>