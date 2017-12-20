<template>
  <div id="app">
    <div id="transitionBox" v-bind:class="{ active: isActive }"></div>
    <div id="mainImg"></div>
    <div class="text">
      <WashroomTitle v-bind:title="name"></WashroomTitle>
      <WashroomTitle v-bind:title="location"></WashroomTitle>
      <WashroomTitle v-bind:title="year"></WashroomTitle>
    </div>
    <WorldClock v-bind:city="location" v-bind:zone="zone" @update="updateTime" @updatePre="prepareImage"></WorldClock>
    <div id="footer">
      <p>WASHROOM OF THE DAY</p>
    </div>
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
      map: 'http://www.chimana.co/json/map.json',
      json: null,
      imgSrc: null,
      location: null,
      name: null,
      zone: 0,
      index: 0,
      year: 2016,
      nextLocation: null,
      nextName: null,
      nextZone: null,
      nextImgSrc: null,
      cities: [],
      countries: [],
      locations: [],
      names: [],
      zones: [],
      images: [],
      loadedImages: [],
      isActive: false,
      imgLoadedCounter: 0,
    };
  },
  created() {
    const vm = this;
    $.getJSON(this.map, (json) => {
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
        this.locations[j] = `${this.cities[j]}, ${this.countries[j]}`;
        const zone = Math.floor(Math.random() * 20) + -10;
        this.zones.push(zone);

        // load iamge from Tumblr
        this.loadImage(j);
      }
    });
  },
  methods: {
    loadImage(index) {
      // correct way:
      const image = new Image();
      const count = index;
      image.onload = () => {
        this.loadedImages[count] = image;
        // this.$log.debug('test', count, image);
        this.loadCompleted();
      };
      // handle failure
      image.onerror = () => {
      };
      image.src = this.images[index];
    },
    loadCompleted() {
      this.imgLoadedCounter += 1;
      if (this.imgLoadedCounter > this.cities.length - 1) {
        this.prepareImage();
        this.updateTime();
      }
    },
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
      this.location = this.nextLocation;
      this.name = this.nextName;
      this.zone = this.nextZone;
      this.imgSrc = this.nextImgSrc;

      this.mainImg = document.getElementById('mainImg');
      if (this.mainImg.hasChildNodes()) {
        this.mainImg.removeChild(this.mainImg.childNodes[0]);
      }
      if (this.imgSrc) {
        this.mainImg.appendChild(this.imgSrc);
      }

      this.year = this.nextYear;
      this.isActive = false;
    },
    prepareImage() {
      this.index = Math.floor(Math.random() * this.cities.length);
      this.nextLocation = this.locations[this.index];
      this.nextName = this.names[this.index];
      this.nextZone = this.zones[this.index];
      this.nextImgSrc = this.loadedImages[this.index];
      this.$log.debug('prepare', this.nextImgSrc);

      this.nextYear = Math.floor(Math.random() * 5) + 2012;
      this.isActive = true;
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
  font-family: Helvetica, Arial, Meiryo, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #FFF;
}

#app {
  position: relative;
  width: 100%;
  text-align: center;
}

img {
  height: 1080px;
  width: 1080px;
}

#img2 {
  position: absolute;
  top: 0;
  left: 540px;
}

p {
  margin: 0;
  padding: 0;
  line-height: 1;
}

div.text {
  height: 500px;
  padding-top: 40px;
}

#footer {
  position: absolute;
  z-index: 20;
  top: 1790px;
  width: 100%;
  height: 100px;
  text-align: center;
}

#footer p {
  width: 1020px;
  margin: 0 auto;
  font-size: 80px;
  font-weight: bold;
}

div#transitionBox {
  position: absolute;
  z-index: 10;
  width: 100%;
  height: 0px;
  background: #000;
  animation: fadeOut 0.75s;
  //opacity: 0;
}

div#transitionBox.active {
  height: 1920px;
  animation: mymove 0.75s;
  //opacity: 1;
}

@keyframes fadeOut {
  //from { opacity: 1.0;}
  //to { opacity: 0;}
  from { height: 1920px;}
  to { height: 0px;}
}

@keyframes mymove {
  from { height: 0px;}
  to { height: 1920px;}
}


</style>
