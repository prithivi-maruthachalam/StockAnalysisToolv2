import "vue-router"
import VueRouter from "vue-router"
import NoData from "./components/noData.vue"
import CreatePool from "./components/createPool.vue"


const routes = [
    {
        path: "/",
        name: "NoData",
        component: NoData,
        props: true
    },
    {
        path: "/create_pool",
        name: "createPool",
        component: CreatePool,
        props: true
    }
]

const router = new VueRouter({routes})

export default router