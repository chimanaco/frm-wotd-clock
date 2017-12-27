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
  width: 94.4444444%; /* 1020/1080 */
  padding: 0 0 1.85185185%; /* 20/1080 */
  margin: 0 auto;
  line-height: 1;
  text-align: left;
  font-size: 7.40740741vw;  /* 80/1080 */
}

</style>
