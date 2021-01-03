<template>
    <div>
        <Index :ruleIndex="ruleIndex"/>
        <b-button variant="success" @click="editRule" class="btn">
                Edit Rule
        </b-button>
        <b-button variant="danger" @click="deleteRule" class="btn">
                Delete
        </b-button>
        <div class="ml-3">
            <font>Between</font>
            <font class="number">{{existingRuleStart}}</font>
            <font>and</font>
            <font class="number">{{existingRuleEnd}}</font>
        </div>
    </div>
</template>

<script>
import Index from "./index"

export default {
    name: "EditNormalRule",
    components:{
        Index
    },
    props:{
        existingRuleStart: String,
        existingRuleEnd: String,
        ruleIndex: Number
    },
    methods:{
        editRule(){
            this.$emit("editNormalRule:edit",(this.ruleIndex - 1))
        },
        deleteRule(){
            this.$emit("editNormalRule:delete",this.ruleIndex - 1)
        }
    }    
}
</script>

<style lang="scss" scoped>
    @import "../scss/variables.scss";
    div{
        display: flex;
        align-items: center;
    }

    font{
        font-size: 19px;
        margin-right: 7px;
    }

    .number{
        font-size: 20px;
        color: $darkText;
        font-weight: 600;
    }

    .btn{
        font-size: 19px;
        margin-right: 20px;
    }
</style>