import "vue-router"
import VueRouter from "vue-router"
import NoData from "./components/noData.vue"
import CreateColumns from "./components/createColumns.vue"
import ManagePool from "./components/managePool.vue"


const routes = [
    {
        path: "/",
        name: "NoData",
        component: NoData,
        props: true
    },
    {
        path: "/create_columns",
        name: "createColumns",
        component: CreateColumns,
        props: true
    },
    {
        path: "/manage_pool",
        name: "managePool",
        component: ManagePool,
        props: true
    }
]

const router = new VueRouter({routes})

export default router