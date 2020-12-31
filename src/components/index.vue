<template>
    <div>{{ruleIndex}}</div>
</template>

<script>
export default {
    name: "Index",
    props:{
        ruleIndex: Number
    }
}
</script>

<style lang="scss" scoped>
    @import "../scss/variables.scss";
    
    div{
        background-color: $darkText;
        color: white;

        display: flex;
        opacity: 0.8;
        justify-content: center;
        align-items: center;

        border-radius: 50%;
        position: absolute;

        top: 15px;
        right: 15px;
                
        font-size: 24px;
        height: 35px;
        width: 35px;
    }
</style>