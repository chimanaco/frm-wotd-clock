<template>
  <div class="wotdTitle">
    <h1>{{title}}</h1>
  </div>
</template>

<script>
export default {
  name: 'WotdTitle',
  props: ['title'],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wotdTitle {
}

h1 {
  //background: blue;
  width: 1020px;
  margin: 0 auto;
  padding: 0 0 20px;
  line-height: 1;
  font-size: 80px;
  text-align: left;
}

</style>
