<template>
  <div id="app">
    <div class="wrapper">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style lang="scss">
  .wrapper{
    max-width:800px;
    width:100%;
    margin:auto;
  }
</style>
