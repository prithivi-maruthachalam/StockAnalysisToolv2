<template>
    <div id="componentContainer">
        <font v-if="columns.length == 0">Start by creating columns</font>

        <div id="formContainer">
            <ColumnForm />
        </div>
    </div>
</template>

<script>
import ColumnForm from "./createColumn"

export default {
    name: "CreatePool",
    data(){
        return{
            columns: []
        }
    },
    components:{
        ColumnForm
    }
}
</script>

<style lang="scss" scoped>
    @import "../scss/variables.scss";

    #componentContainer{
        padding: 20px 25px;
    }

    #formContainer{
        margin-top: 40px;
    }

    font{
        font-size: 30px;
        font-family: "Roboto";
    }
</style>