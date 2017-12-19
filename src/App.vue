<template>
  <div id="app">
    <img v-bind:src="imgSrc"></img>
    <div class="text">
      <WashroomTitle v-bind:title="name"></WashroomTitle>
      <WashroomDescription v-bind:description="descriptions[0]"></WashroomDescription>
    </div>
    <WorldClock v-bind:city="location" v-bind:zone="zone" @update="updateTime"></WorldClock>
  </div>
</template>

<script>
import $ from 'jquery';
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
      json: null,
      imgSrc: null,
      location: null,
      name: null,
      zone: 0,
      index: 0,
      cities: [],
      countries: [],
      locations: [],
      names: [],
      zones: [],
      images: [],
      descriptions: [
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        'TOKYO', 'AMSTERDAM'],
    };
  },
  created() {
    const vm = this;
    $.getJSON('http://www.chimana.co/json/map.json', (json) => {
      vm.json = json.data.length;
      let i;
      for (i = 0; i < json.data.length; i += 1) {
        const obj = json.data[i];
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
        // using array extras
        Object.entries(obj).forEach(this.pushInfo);
      }

      let j;
      for (j = 0; j < this.cities.length; j += 1) {
        this.locations[j] = `${this.cities[j].toUpperCase()}, ${this.countries[j].toUpperCase()}`;
        const zone = Math.floor(Math.random() * 20) + -10;
        this.zones.push(zone);
      }

      this.updateTime();
    });
  },
  methods: {
    pushInfo([key, value]) {
      if (key === 'city') {
        this.cities.push(value);
      }
      if (key === 'country') {
        this.countries.push(value);
      }
      if (key === 'name') {
        if (value === '') {
          this.names.push('Unknown');
        } else {
          this.names.push(value);
        }
      }
      if (key === 'img') {
        this.images.push(value);
      }
    },
    updateTime() {
      this.location = this.locations[this.index];
      this.name = this.names[this.index];
      this.zone = this.zones[this.index];
      this.imgSrc = this.images[this.index];

      this.index = Math.floor(Math.random() * this.cities.length);
      // this.index += 1;
      // if (this.index > this.cities.length) {
      //   this.index = 0;
      // }
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
  font-family: Arial, Meiryo, sans-serif;
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
