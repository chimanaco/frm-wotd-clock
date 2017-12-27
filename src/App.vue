<template>
  <div id="app">
    <div id="debugLog">
      NextZone: {{nextZone}}<br>
      Zone: {{zone}}<br>
      ZoneLoaded: {{zoneLoaded}}<br>
    </div>
    <div id="transitionBox" v-bind:class="{ active: isActive }"></div>
    <img id="img1" :src="img1" v-bind:class="{ active: showImg1 }">
    <img id="img2" :src="img2" v-bind:class="{ active: !showImg1 }">
    <div class="text">
      <WashroomTitle v-bind:title="name"></WashroomTitle>
      <WashroomTitle v-bind:title="year"></WashroomTitle>
      <WashroomTitle v-bind:title="location"></WashroomTitle>
    </div>
    <WorldClock v-bind:city="location" v-bind:zone="zone" @update="updateTime" @updatePre="prepareImage"></WorldClock>
    <div id="footer">
      <p>WASHROOM OF THE DAY</p>
    </div>
  </div>
</template>

<script>
import $ from 'jquery';
import axios from 'axios';
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
      img1: null,
      img2: null,
      map: 'http://www.chimana.co/json/locations.json',
      json: null,
      location: null,
      nextLocation: null,
      name: null,
      nextName: null,
      zone: 0,
      nextZone: 0,
      index: 0,
      year: 2016, //  TODO: Removed when it's Ready
      cities: [],
      countries: [],
      locations: [],
      latitude: [],
      longitude: [],
      names: [],
      zones: [],
      images: [],
      isActive: false,
      showImg1: true,
      zoneLoaded: 0,
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
        this.getTimeZone(j);
      }
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
      if (key === 'latitude') {
        if (value === '') {
          this.latitude.push('0');
        } else {
          this.latitude.push(value);
        }
      }
      if (key === 'longitude') {
        if (value === '') {
          this.longitude.push('0');
        } else {
          this.longitude.push(value);
        }
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
      if (isNaN(this.zone)) {
        this.zone = 0;
      }
      this.showImg1 = !this.showImg1;

      this.year = this.nextYear;
      this.isActive = false;
    },
    prepareImage() {
      this.index = Math.floor(Math.random() * this.cities.length);
      this.nextLocation = this.locations[this.index];
      this.nextName = this.names[this.index];
      this.nextZone = this.zones[this.index];

      if (this.showImg1) {
        this.img2 = this.images[this.index];
      } else {
        this.img1 = this.images[this.index];
      }

      this.nextYear = Math.floor(Math.random() * 5) + 2012; //  TODO: Removed when it's Ready
      this.isActive = true;
    },
    getTimeZone(index) {
      const vm = this;
      const lat = this.latitude[index];
      const lon = this.longitude[index];
      const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lon}&timestamp=1331161200&sensor=false`;
      axios.get(url)
      .then((response) => {
        const diff = response.data.rawOffset / 3600;
        vm.zones[index] = diff;
        vm.zoneLoaded += 1;
        vm.checkIfZoneComplete();
      })
      .catch((error) => {
        vm.error = error;
      });
    },
    checkIfZoneComplete() {
      if (this.zoneLoaded >= this.cities.length - 1) {
        // init
        this.prepareImage();
        this.updateTime();
      }
    },
  },
};
</script>

<style lang="scss">

$deviceHeight: 1920px;
$tweenSpeed: 0.75s;

body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background: #000;
  font-family: Arial, Meiryo, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #FFF;
}

#debugLog {
  position: absolute;
  z-index: 200;
  width: 400px;
  height: 200px;
  background: rgba(0, 0, 0, 0.4);
  text-align: left;
  font-size: 40px;
}

#app {
  position: relative;
  margin: 0 auto;
  width: 1080px;
  text-align: center;
}

#img1, #img2 {
  position: absolute;
  top: 0;
  left: 0;
  height: 1080px;
  width: 1080px;

  display: none;

  &.active {
    display: block;
  }
}

p {
  margin: 0;
  padding: 0;
  line-height: 1;
}

div.text {
  height: 500px;
  padding-top: 1120px;
}

#footer {
  position: absolute;
  z-index: 20;
  top: 1790px;
  width: 100%;
  height: 100px;
  text-align: center;

  p {
    width: 1020px;
    margin: 0 auto;
    font-size: 80px;
    font-weight: bold;
  }
}

div#transitionBox {
  position: absolute;
  z-index: 10;
  width: 100%;
  height: 0px;
  background: #000;
  animation: fadeOut $tweenSpeed;
}

div#transitionBox.active {
  height: $deviceHeight;
  animation: mymove $tweenSpeed;
}

@keyframes fadeOut {
  from { height: $deviceHeight;}
  to { height: 0px;}
}

@keyframes mymove {
  from { height: 0px;}
  to { height: $deviceHeight;}
}


</style>
