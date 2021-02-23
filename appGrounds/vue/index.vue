<template>
  <div class="vue-wrapper">
    <h2>{{message}}</h2>
    <h3>Now is {{ time }}</h3>
  </div>
</template>

<script>
export default {
  name: "app",
  data(){
    return {
      message: 'Vue App'
    }
  },
  computed:{
    time(){
      return this.$store.state.time 
    }
  }
}
</script>

<style scoped>
  .vue-wrapper {
    background:powderblue;
  }
</style>