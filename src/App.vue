<template>
  <div id="app">
    <CustomHeader v-bind:usernickname="usernickname"/>
    <router-view
      v-bind:is_enable="is_Loading || is_LoadError || is_NoData"
      v-bind:is_Loading="is_Loading"
      v-bind:is_LoadError="is_LoadError"
      v-bind:is_NoData="is_NoData"
      :isColumnsEmpty="isColumnsEmpty"
      :columns="columnsList"
    />
  </div>
</template>

<script>
import CustomHeader from "./components/header"
const { ipcRenderer } = window.require("electron")

var usernickname = "MM"

export default {
  name: "App",
  components: {
    CustomHeader
  },
  data() { 
    return{
      usernickname: usernickname,
      is_Loading: true,
      is_LoadError: false,
      is_NoData: false,
      isColumnsEmpty: true,
      columnsList: [] 
  }},
  //lifecycle hooks
  created() {
    ipcRenderer.send("render:started")
    this.is_Loading = true
    this.is_LoadError = false
    this.is_NoData = false
    this.isColumnsEmpty = true
  },
  mounted(){
    ipcRenderer.on("main:columns-return", (event,columns) => {
      // Handing data from columns
      console.log(columns)
      if(!columns){
        // Show that there is an error
        this.is_Loading = false
        this.is_LoadError = true
      } else if(columns.columnsLength == 0){
        // There are no columns so go to create column page
        this.is_Loading = false
        this.is_NoData = true
      } else {
        // There are columns - add more columns or show pool
        this.is_Loading = false
        this.isColumnsEmpty = false
        this.columnsList = columns
      }
    })
  }
};

</script>

<style lang="scss">
@import "./scss/variables.scss";
body, html {
  height: 100%;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
}
</style>
