<template>
  <div id="app">
    <WashroomImage v-bind:index="index"></WashroomImage>
    <div class="text">
      <WashroomTitle v-bind:title="places[0]"></WashroomTitle>
      <WashroomDescription v-bind:description="descriptions[0]"></WashroomDescription>
    </div>
    <WorldClock v-bind:city="locations[0]" v-bind:zone="zones[0]"></WorldClock>
  </div>
</template>

<script>
import WorldClock from './components/WorldClock';
import WashroomImage from './components/WashroomImage';
import WashroomTitle from './components/WashroomTitle';
import WashroomDescription from './components/WashroomDescription';

export default {
  name: 'app',
  components: {
    WorldClock,
    WashroomImage,
    WashroomTitle,
    WashroomDescription,
  },
  data() {
    return {
      index: 0,
      cities: ['VANCOUVER', 'TOKYO', 'AMSTERDAM'],
      countries: ['CANADA', 'JAPAN', 'NETHERLANDS'],
      zones: [-8, 9, 1],
      locations: [],
      places: ['Vancouver International Airport', 'TOKYO', 'AMSTERDAM'],
      descriptions: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        'TOKYO', 'AMSTERDAM'],
    };
  },
  created() {
    this.timeID = setInterval(this.updateTime, 5000);
    for (let i = 0; i < this.cities.length; i += 1) {
      this.locations[i] = `${this.cities[i]}, ${this.countries[i]}`;
    }
  },
  methods: {
    updateTime() {
      this.index += 1;

      if (this.index > 9) {
        this.index = 0;
      }
    },
  },
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background: #000;
  font-family: Arial, sans-serif;
  //font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #FFF;
}

#app {
  width: 100%;
  text-align: center;
}

img {
  height: 1080px;
  width: 1080px;
}


p {
  margin: 0;
  padding: 0;
  line-height: 1;
}

div.text {
  height: 685px;
}

</style>
