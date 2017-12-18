<template>
  <div class="imageWrapper">
    <img :src="getPic(index)" alt="Sign">
  </div>
</template>

<script>
export default {
  name: 'WashroomImage',
  props: ['index'],
  data() {
    return {
    };
  },
  methods: {
    getPic(index) {
      const images = require.context('../assets/', false, /\.jpg/);
      return images(`./00${index}.jpg`);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.wotdTitle {
}

img {
  height: 1080px;
  width: 1080px;
}

</style>
