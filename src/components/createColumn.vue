<template>
    <div>
    <b-form @submit="onSubmit">
        <b-form-group id="col_name_group" label="Enter name of column">
            <b-form-input
                id="col_name"
                v-model="form.name"
                type="text"
                placeholder="Enter column name"
            />
        </b-form-group>
        <b-form-group id="col_type_group" label="Choose a type">
            <b-form-select 
                id="col_type"
                v-model="form.type"
                :options="typeOptions"
            />
        </b-form-group>
        <b-form-group 
            id="col_is_core_group" 
            label="Should this be a core coloumn?"
            v-if="form.type != 'string'"
        >
            <b-form-checkbox
                id="col_is_core"
                v-model="form.isCore"
                value="isCore"
                unchecked-value="isNotCore"
            >Make this a core column</b-form-checkbox>
        </b-form-group>
        <b-form-group v-if="form.isCore == 'isCore'" id="col_weight_group" label="Enter weight for this coloumn">
            <b-form-input
                id="col_weight"
                type="number"
                v-model="form.weight"
            />
        </b-form-group>
        <b-form-group v-if="form.isCore == 'isCore'" id="col_isNormalise_group" label="Do you want to add normalisation rules?">
            <b-button @click="addNormal" variant="success">
                Add Normalisation rule
            </b-button>
        </b-form-group>
        <b-form-group v-if="form.normalisation_rules.length" id="col_normal_rules_group" v-bind:label="'Normalisation rules for ' + form.name">
            <b-list-group>
                <b-list-group-item class="listItem" v-for="rule of form.normalisation_rules" :key="rule.key">
                    <b-form class="normalForm">
                        <b-form-group>
                            <b-form-select class="d-inline" 
                                :options="ruleOptions" 
                                v-model="rule.ruleType"
                            />
                            <span v-if="rule.ruleType">
                                <label class="inLabel">from</label>
                                <label 
                                    class="labelHighlight inLabel"
                                    v-if="rule.ruleType == 'lessThan'"
                                >negative infinity</label>
                                <b-form-input class="normalNum d-inline"
                                    v-if="rule.ruleType == 'range' || rule.ruleType == 'greaterThan'"
                                    v-model="rule.start"
                                    type="number"
                                />
                            </span>
                            <span v-if="rule.ruleType">
                                <label class="inLabel">to</label>
                                <label 
                                    class="labelHighlight inLabel"
                                    v-if="rule.ruleType == 'greaterThan'"
                                >infinity</label>
                                <b-form-input class="normalNum d-inline"
                                    v-if="rule.ruleType == 'range' || rule.ruleType == 'lessThan'"
                                    v-model="rule.end"
                                    type="number"
                                />
                            </span>
                            <b-button class="deleteBtn"
                                @click="deleteRule(rule.key)"
                                variant="danger"
                            >
                                Delete rule
                            <b-icon-x-circle class="btnIcon"/></b-button>
                            <b-form-checkbox class="checkbox"
                                v-model="rule.function"
                                value="custom"
                                unchecked-value="linear"
                            >
                                Custom Normalisation?
                            </b-form-checkbox>
                            <b-form-group
                                v-if="rule.ruleType && rule.function == 'custom'"
                                class="normalTargetGroup"
                                label="Drag the point to set the shape of your custom curve"
                            >
                                <CurveCanvas
                                    v-bind:real_vals="[rule.start,rule.end]"
                                    v-bind:graphSize="350"
                                    v-bind:ruleType="rule.ruleType"
                                ></CurveCanvas>
                            </b-form-group>
                            <b-form-group 
                                class="normalTargetGroup" 
                                :label="(rule.ruleType == 'range') ? 'Enter the start and end values here' : 'Enter one value for this rule'"
                                v-if="rule.function == 'linear' && rule.ruleType"
                            >
                                <label v-if="rule.ruleType == 'range'" class="inLabel">from</label>
                                <b-form-input class="normalNum d-inline"
                                    v-if="rule.ruleType == 'range' || rule.ruleType == 'greaterThan'"
                                    v-model="rule.n_start"
                                    type="number"
                                />
                                <label v-if="rule.ruleType == 'range'" class="inLabel">to</label>
                                <b-form-input class="normalNum d-inline"
                                    v-if="rule.ruleType == 'range' || rule.ruleType == 'lessThan'"
                                    v-model="rule.n_end"
                                    type="number"
                                />
                            </b-form-group>
                        </b-form-group>
                    </b-form>
                </b-list-group-item>
            </b-list-group>
        </b-form-group>
        <b-form-group 
            :disabled="!(form.name && form.type && (form.isCore == 'isNotCore' || (form.isCore == 'isCore' && form.weight > 0)) && checkNormalisationRules())"
            label="Click the button after you're done">
            <b-button
                type="submit"
                variant="primary"
                size="lg"
            >
                Add Column
            </b-button>
            <b-form-text class="warning"
                v-if="!(form.name && form.type && (form.isCore == 'isNotCore' || (form.isCore == 'isCore' && form.weight > 0)))"
            >
                You haven't {{helper()}}
            </b-form-text>
        </b-form-group>
    </b-form>
    </div>    
</template>

<script>
import CurveCanvas from "./curveCanvas"

export default {
    name: "ColumnForm",
    components:{
        CurveCanvas
    },
    data(){
        return{
            form:{
                name: "",
                type: "",
                isCore: "isNotCore",
                isNormalise: "isNotNormalise",
                weight: 1,
                normalisation_rules: [
                    
                ]
            },
            typeOptions: [
                {value: "string", text: "word"},
                {value: "number", text: "number"}
            ],
            ruleOptions: [
                {value: "greaterThan", text: "Greater than"},
                {value: "lessThan", text: "Less than"},
                {value: "range", text: "Between 2 values"}
            ],
            count: 0
        }
    },
    methods:{
        onSubmit(event){
            event.preventDefault()
            this.form.normalisation_rules.forEach((rule)=>{
                if(rule.ruleType == 'greaterThan'){
                    rule.end = "INF"
                    rule.n_end = rule.n_start 
                } else if(rule.ruleType == 'lessThan'){
                    rule.start = "-INF"
                    rule.n_start = rule.n_end
                }
            })

            alert(JSON.stringify(this.form))
        },

        addNormal(){
            if(this.form.normalisation_rules.length == 0)
                this.form.isNormalise = "isNormalise"
            
            this.form.normalisation_rules.push({
                key: ++this.count,
                ruleType: "",
                function: "linear",
                start: "0",
                end: "0",
                n_start: 0,
                n_end: 0
            })
        },

        deleteRule(target){
            var index = this.form.normalisation_rules.findIndex((rule)=>rule.key == target)
            this.form.normalisation_rules.splice(index,1)
            if(this.form.normalisation_rules.length == 0)
                this.form.isNormalise = "isNotNormalise"
        },

        helper(){
            if(!this.form.name) return "entered a name for the column"
            else if(!this.form.type) return "chosen a type"
            else if(this.form.isCore == 'isCore' && this.form.weight < 1) return "entered a valid weight"
        },
        checkNormalisationRules(){
            var flag = true
            if(this.form.isNormalise == 'isNormalise'){
                this.form.normalisation_rules.forEach(rule => {
                    if(rule.ruleType == "" || rule.start == rule.end || rule.start == "" || rule.end == ""){
                        flag = false
                    }
                });
            }
            return flag
        }
    }
}
</script>

<style lang="scss" scoped>
    @import "../scss/variables.scss";

    input,select{
        max-width: 400px;
        margin-right: 10px;
    }

    .listItem{
        max-width: 800px;
    }

    .warning{
        color: $warning!important;
    }

    .normalForm{
        .normalNum{
            max-width: 70px;
        }

        .btnIcon{
            margin-left: 5px;
        }

        select{
            max-width: 170px;
        }

        .checkbox{
            margin-top: 15px;
        }

        .normalTargetGroup{
            margin-top: 16px;
            input{
                max-width: 150px;
            }
        }

        .deleteBtn{
            position: absolute;
            top: 10px;
            right: 30px;
        }

        .inLabel{
            margin-right: 10px;
        }

        .labelHighlight{
            font-family: 'Open Sans:highlight';
            color: $accentBgColor;
        }
    }
</style>