<template>
    <div class="container-fluid">
        <b-form @submit="onSubmit">
            <b-form-group id="col_name_group" 
                class="partWidth"
                label="Enter name of column"
            >
                <b-form-input
                    id="col_name"
                    v-model="form.name"
                    type="text"
                    placeholder="Enter column name"
                    :state="name_validate"
                />
                <b-form-invalid-feedback :state="name_validate">
                    You haven't entered a name
                </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group id="col_type_group" 
                label="Choose a type"
                class="partWidth"
            >
                <b-form-select 
                    id="col_type"
                    v-model="form.type"
                    :options="typeOptions"
                    :state="type_validate"
                />
                <b-form-invalid-feedback :state="type_validate">
                    Choose a type
                </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group id="col_is_core_group" 
                label="Should this be a core coloumn?"
                class="partWidth"
                v-if="form.type != 'string'"
            >
                <b-form-checkbox
                    id="col_is_core"
                    v-model="form.isCore"
                    value="isCore"
                    unchecked-value="isNotCore"
                >Make this a core column</b-form-checkbox>
            </b-form-group>

            <b-form-group id="col_weight_group" 
                label="Enter weight for this coloumn"
                v-if="form.isCore == 'isCore'"
                class="partWidth"
            >
                <b-form-input
                    id="col_weight"
                    type="number"
                    v-model="form.weight"
                    :state="weight_validate"
                />
                <b-form-invalid-feedback :state="weight_validate">
                    Weight can't be less than one
                </b-form-invalid-feedback>
            </b-form-group>

            <b-form-group id="col_isNormalise_group" 
                label="Do you want to add normalisation rules?"
                v-if="form.isCore == 'isCore'" 
            >
                <b-button @click="addNormal" variant="success">
                    Create new normalisation rule
                </b-button>
            </b-form-group>

            <b-form-group id="col_normal_rules_group" 
                v-bind:label="'Normalisation rules for ' + form.name"
                v-if="form.normalisation_rules.length" 
            >
                <b-list-group>
                    <b-list-group-item class="listItem" v-for="(rule,index) of form.normalisation_rules" :key="rule.key">
                        <span v-if="!rule.validation">
                            <AddNormalRule
                                :existingRule="rule"
                                :ruleIndex="index + 1"
                                @addNormalRule:create="createRule($event)"
                                @addNormalRule:delete="deleteRule($event)"
                            />
                            <Badge 
                                content="unsaved"
                                v-if="!rule.validation"
                            />
                        </span>
                        <span v-else>
                            <EditNormalRule
                                :existingRuleStart="rule.start"
                                :existingRuleEnd="rule.end"
                                :ruleIndex="index + 1"
                                @editNormalRule:edit="editRule($event)"
                                @editNormalRule:delete="deleteRule($event)"
                            />
                        </span>
                    </b-list-group-item>
                </b-list-group>
            </b-form-group>

            <b-form-group id="save_button_group"
                :disabled="!(weight_validate && name_validate && type_validate && rules_validate)"
                label="Click the button after you're done"
            >
                <b-button
                    type="submit"
                    variant="primary"
                    size="lg"
                >
                    Save Column
                </b-button>
            </b-form-group>
        </b-form>
    </div>    
</template>

<script>
import AddNormalRule from "./addNormalRule"
import EditNormalRule from "./editNormalRule"  
import Badge from "./badge"
const { ipcRenderer } = window.require("electron")

export default {
    name: "ColumnForm",
    components:{
        AddNormalRule,
        Badge,
        EditNormalRule
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
            count: 0
        }
    },
    computed: {
        //false indicates an invalid input
        name_validate(){
            return this.form.name != ""
        },
        type_validate(){
            return this.form.type != ""
        },
        weight_validate(){
            return (this.form.isCore == "isNotCore" || this.form.isCore == "isCore" && (this.form.weight >= 1))
        },
        rules_validate(){
            let flag = false
            this.form.normalisation_rules.forEach(rule => {
                if(!rule.validation) flag = true
            })
            return !flag
        }
    },
    methods:{
        onSubmit(event){
            event.preventDefault()
            // Emit IPC event with form as data
            // TODO: Need way to stop column from added more than once
            ipcRenderer.send("columnForm:submit", this.form)
            //alert(JSON.stringify(this.form))
        },

        addNormal(){
            if(this.form.normalisation_rules.length == 0)
                this.form.isNormalise = "isNormalise"
            
            this.form.normalisation_rules.push({
                key: ++this.count,
                ruleType: "range",
                function: "linear",
                start: "",
                end: "",
                n_start: "",
                n_end: "",
                validation: false
            })
        },

        deleteRule(targetIndex){
            this.form.normalisation_rules.splice(targetIndex,1)
            if(this.form.normalisation_rules.length == 0)
                this.form.isNormalise = "isNotNormalise"
            // Debug
            // console.log(this.form.normalisation_rules)
        },

        createRule(event){
            if(this.form.normalisation_rules[event.index].ruleType != "custom")
                delete this.form.normalisation_rules[event.index].curveParams
            Object.assign(this.form.normalisation_rules[event.index],event.rule)
            this.form.normalisation_rules[event.index].validation = true
            // Debug
            // console.log(this.form.normalisation_rules)
        },

        editRule(targetIndex){
            this.form.normalisation_rules[targetIndex].validation = false
            // Debug
            // console.log(this.form.normalisation_rules)
        },
        resetForm(){
            this.form = {
                name: "",
                type: "",
                isCore: "isNotCore",
                isNormalise: "isNotNormalise",
                weight: 1,
                normalisation_rules: []
            }
        }
    },
    mounted(){
        ipcRenderer.on("main:submitReceived", (event,isSubmitted) => {
            if(isSubmitted){
                console.log("Submit successfull")
                this.resetForm()

            } else {
                console.error("There were errors submitting")
            }
        })
    }
}
</script>

<style lang="scss" scoped>
    @import "../scss/variables.scss";

    .warning{
        color: $warning!important;
    }

    .partWidth{
        max-width: 600px;
    }

</style>