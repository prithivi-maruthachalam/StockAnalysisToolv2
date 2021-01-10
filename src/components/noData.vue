<template v-if="is_enable">
    <div id="noDataContainer">
        <div v-if="is_NoData" class="container-fluid content-center text-center">
            <div>
                <div>
                    You don't have any records yet. Click to start adding
                </div>
                <div class="mt-3">
                    <router-link to="/create_columns">
                        <b-button variant="dark" size="lg">
                            Create New Pool
                        </b-button>
                    </router-link>
                </div>
            </div>
        </div>  
        <div v-else-if="!isColumnsEmpty" class="container-fluid content-center text-center">
                <div class="mx-2">
                    <router-link to="/create_columns">
                        <b-button variant="dark" size="lg">
                            Add Columns
                        </b-button>
                    </router-link>
                </div>
                <div class="mx-2">
                    <router-link to="/manage_pool">
                        <b-button variant="info" size="lg">
                            Manage Pool
                        </b-button>
                    </router-link>
                </div>
        </div> 
        <div v-else-if="is_Loading" class="container-fluid content-center text-center">
            <div>
                <b-spinner/>
                <div class="mt-3">Loading your pool</div>
            </div>
        </div>
        <div v-else-if="is_LoadError" class="container-fluid content-center text-center">
            Error reading from pool
        </div>
    </div> 
</template>

<script>
export default {
    name: "noData",
    props:{
        is_enable: Boolean,
        is_Loading: Boolean,
        is_NoData: Boolean,
        is_LoadError: Boolean,
        isColumnsEmpty: Boolean
    },
    methods: {
    }
}
</script>

<style lang="scss" scoped>
@import "../scss/variables.scss";

#noDataContainer{
    display: flex;
    flex-direction: column;
    height: 100%;
    flex-flow: 1;
}

.content-center{
    display: flex;
    flex-grow: 1;
    justify-content: center;
    align-items: center;
    background-color: $softBgColor;
    font-size: 23px;
}
</style>