<template>
  
  <div class="maincontent container">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'HomeComponent',
  props: {
    msg: String
  }
}
</script>

<style scoped>

</style>
