<template>
    <div>
        {{content}}
    </div>
</template>


<script>
export default {
    name: "Badge",
    props:{
        content: String
    }    
}
</script>


<style lang="scss" scoped>
    div{
        background-color: #e75050;
        border-radius: 50px;
        padding: 3px 8px;
        text-align: center;
        color: white;
        font-size: 15px;
        position: absolute;
        bottom: 10px;
        right: 10px;
    }
</style>