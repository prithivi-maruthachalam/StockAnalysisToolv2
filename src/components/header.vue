<template>
    <div id="header" class="container-fluid">
        <div class="row">
            <div class="col-md-4"><font>{{usernickname}}'s Pool</font></div>
            <div class="col-md-8 button-group">
                <b-button variant="info" size="lg">
                    Add to Pool
                </b-button>
                <b-button variant="success" size="lg" class="ml-3">
                    New Batch
                </b-button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "CustomHeader",
    components: {

    },
    props: {
        usernickname: String
    }  
}
</script>

<style lang="scss" scoped>
    @import "../scss/variables.scss";
    #header{
        background-color: $accentBgColor;
        padding: 20px 30px;
    }

    font{
        font-size: 50px;
        color: $lightText;
        font-family: 'Roboto';
    }

    .button-group{
        display: flex;
        justify-content: flex-end;
        align-items: center;
        font-family: 'Open Sans';
    }

</style>