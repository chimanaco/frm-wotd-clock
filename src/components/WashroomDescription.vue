<template>
  <div class="wotdDescription">
    <p>{{description}}</p>
  </div>
</template>

<script>
export default {
  name: 'WotdDescription',
  props: ['description'],
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wotdDescription {
}

p {
  width: 1020px;
  margin: 0 auto;
  line-height: 1.4;
  font-size: 40px;
  text-align: left;
}

p {
  {/*width: 980px;*/}
  {/*margin: 0 auto;*/}
  {/*text-align: left;*/}
  {/*font-size: 50px;*/}
}


</style>
