<template>
    <div class="columnListContainer">
        <div>
            <h2>Columns</h2>
            <b-list-group v-if="columnsList.columnsLength > 0">
                <b-list-group-item class="listItem" v-for="column of columnsList.columnsList" :key="column._id">
                    <ColumnItem
                        :column="column"
                    />
                </b-list-group-item>
            </b-list-group>
            <div v-else class="warningText">
                You haven't created any columns yet
            </div>
        </div>
    </div>
</template>

<script>
import ColumnItem from "./columnItem"

export default {
    name:"ColumnList",
    components: {
        ColumnItem
    },
    props: {
        columnsList: Object
    },
    mounted(){
        console.log("In columns")
        console.log(this.columnsList.columnsList)
        console.log(typeof(this.columnsList.columnsList))
        this.columnsList.columnsList.forEach(element => {
            console.log(element.name)  
            console.log(element._id)  
        });
    }
}   
</script>

<style lang="scss" scoped>
    @import "../scss/variables.scss";

    .columnListContainer{
        display: flex;
        justify-content: flex-end;
        padding-right: 20px;
        text-align: right;

        h2{
            color: $accentBgColor;
            font-size: 35px;
        }

        .warningText{
            font-size: 19px;
            color: $darkText;
        }
    }
</style>