<template>
    <div class="componentContainer container-fluid">
        <div class="row">
            <div class="col-md-7">
                <font v-if="columns.length == 0" class="text-padding">Start by creating columns</font>
                <div id="formContainer">
                    <ColumnForm />
                </div>
            </div>
            <div class="col-md">
                <ColumnList
                    :columnsList="columns"
                />
            </div>
        </div>
    </div>
</template>

<script>
import ColumnForm from "./columnForm"
import ColumnList from "./columnList"

export default {
    name: "CreatePool",
    data(){
        return{
        }
    },
    props:{
        columns: Object
    },
    components:{
        ColumnForm,
        ColumnList
    }
}
</script>

<style lang="scss" scoped>
    @import "../scss/variables.scss";

    .text-padding{
        padding-left: 10px;
    }

    .componentContainer{
        padding: 20px 15px;
    }

    #formContainer{
        margin-top: 15px;
    }

    font{
        font-size: 30px;
        font-family: "Roboto";
    }
</style>