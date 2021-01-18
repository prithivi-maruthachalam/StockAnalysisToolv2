<template>
    <div class="container-fluid text-right columnItemContainer">
        <div class="name">{{column.name}}</div>
        <div class="content" v-if="!column.isCore && column.type == 'number'">
            not a core component
        </div>        
        <div class="content" v-else-if="!column.isCore && column.type == 'string'">
            word
        </div>
        <div class="content" v-else-if="column.isCore == true">
            <div>{{column.weight}}x weight</div>
            <div v-if="column.isNormalise == true">
                {{column.normalisation_rules.length}} 
                rule<span v-if="column.normalisation_rules.length > 1">s</span>
            </div>
        </div>
    </div>    
</template>

<script>
export default {
    name: "ColumnItem",
    props:{
        column: Object,
    }
}
</script>

<style lang="scss" scoped>
@import "../scss/variables.scss";

    .index{
        position: static;
    }

    .columnItemContainer{
        min-width: 300px;
    }

    .content{
        padding-top: 5px;
    }

    .name{
        font-size: 23px;
        font-weight: 500;
        font-family: 'Open Sans';
    }
</style>