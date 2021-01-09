<template>
    <div class="columnListContainer">
        <div>
            <h2>Columns</h2>
            <b-list-group v-if="columns.length > 0">
            </b-list-group>
            <div v-else class="warningText">
                You haven't created any columns yet
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name:"ColumnList",
    props: {
        columns: Array
    }
}   
</script>

<style lang="scss" scoped>
    @import "../scss/variables.scss";

    .columnListContainer{
        display: flex;
        justify-content: flex-end;
        padding-right: 10px;
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