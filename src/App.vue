<template>
  <div id="app">
    <!--<div id="debugLog">-->
      <!--Total: {{totalNumber}}<br>-->
      <!--NextZone: {{nextZone}}<br>-->
      <!--Zone: {{zone}}<br>-->
    <!--</div>-->
    <div id="transitionBox" v-bind:class="{ active: isActive }"></div>
    <img id="img1" :src="img1" v-bind:height="imgHeight" v-bind:class="{ active: showImg1 }">
    <img id="img2" :src="img2" v-bind:height="imgHeight" v-bind:class="{ active: !showImg1 }">
    <div class="text">
      <WashroomTitle v-bind:title="name"></WashroomTitle>
      <WashroomTitle v-bind:title="location"></WashroomTitle>
    </div>
    <WorldClock v-bind:city="location" v-bind:zone="zone" @update="updateTime" @updatePre="prepareImage" @transition="transition"></WorldClock>
    <div id="footer">
      <p>WASHROOM OF THE DAY</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import credential from '../credential.json';
import WorldClock from './components/WorldClock';
import WashroomImage from './components/WashroomImage';
import WashroomTitle from './components/WashroomTitle';

export default {
  name: 'app',
  components: {
    WorldClock,
    WashroomImage,
    WashroomTitle,
  },
  data() {
    return {
      timestamp: 0,
      timestamp2: 0,
      timestampResponse: 0,
      img1: null,
      img2: null,
      imgHeight: 0,
      map: 'http://www.chimana.co/json/locations.json',
      json: null,
      location: null,
      nextLocation: null,
      name: null,
      nextName: null,
      zone: 0,
      nextZone: 0,
      index: 0,
      year: 0,
      cities: [],
      countries: [],
      locations: [],
      latitude: [],
      longitude: [],
      names: [],
      zones: [],
      images: [],
      years: [],
      isActive: false,
      showImg1: true,
      locationLoaded: 0,
      isLocationLoaded: false,
      totalNumber: 0,
      error: 0,
    };
  },
  created() {
    this.getImageHeight();
    const vm = this;
    axios.get(this.map)
      .then((response) => {
        const responseData = response.data.data;
        vm.error = responseData.length;
        vm.totalNumber = responseData.length;

        let i;
        for (i = 0; i < responseData.length; i += 1) {
          const obj = responseData[i];
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
          // using array extras
          Object.entries(obj).forEach(this.pushInfo);
          this.checkIfLocationComplete();
        }
      })
      .catch((error) => {
        vm.error = error;
      });
  },
  methods: {
    getImageHeight() {
      this.imgHeight = window.innerWidth;
    },
    pushInfo([key, value]) {
      if (key === 'city') {
        this.cities.push(value);
      }
      if (key === 'country') {
        this.countries.push(value);
      }
      if (key === 'latitude') {
        if (value === '') {
          this.latitude.push('35.6895');
        } else {
          this.latitude.push(value);
        }
      }
      if (key === 'longitude') {
        if (value === '') {
          this.longitude.push('139.6917');
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

      if (key === 'date') {
        const year = value.split('/')[2];
        this.years.push(year);
      }

      if (key === 'img') {
        this.images.push(value);
      }
    },
    transition() {
      this.isActive = true;
    },
    updateTime() {
      this.location = `${this.nextLocation}, ${this.nextYear}`;
      this.name = this.nextName;
      this.zone = this.nextZone;
      if (isNaN(this.zone)) {
        this.zone = 0;
      }
      this.showImg1 = !this.showImg1;
      this.isActive = false;
    },
    prepareImage() {
      this.index = Math.floor(Math.random() * this.cities.length);
      this.nextLocation = this.locations[this.index];
      this.nextName = this.names[this.index];

      const vm = this;
      const lat = this.latitude[this.index];
      const lon = this.longitude[this.index];
      const url = `https://maps.googleapis.com/maps/api/timezone/json?location=${lat},${lon}&timestamp=${this.timestamp}&sensor=false&key=${credential.gmapApiKey}`;
      let diff;
      axios.get(url)
        .then((response) => {
          vm.timestampResponse = response;
          if (response.data.rawOffset == null) {
            this.getTimeZone(this.index);
          } else {
            diff = (response.data.dstOffset + response.data.rawOffset) / 3600;
          }
          this.nextZone = diff;
        })
        .catch((error) => {
          vm.error = error;
        });

      if (this.showImg1) {
        this.img2 = this.images[this.index];
      } else {
        this.img1 = this.images[this.index];
      }

      this.nextYear = this.years[this.index];
    },
    startLoadZone() {
      this.timestamp = Math.round(new Date().getTime() / 1000);
      let j;
      for (j = 0; j < this.cities.length; j += 1) {
        this.locations[j] = `${this.cities[j]}, ${this.countries[j]}`;
      }

      this.prepareImage();
      this.updateTime();
    },
    checkIfLocationComplete() {
      this.locationLoaded += 1;
      if (this.locationLoaded > this.totalNumber - 1) {
        if (!this.isLocationLoaded) {
          // init
          this.startLoadZone();
          this.isLocationLoaded = true;
        }
      }
    },
  },
};
</script>

<style lang="scss">

$deviceHeight: 150%;
$tweenSpeed: 0.75s;

@mixin percent($pxval: 16) {
  width: ($pxval / 1080) * 1%;
}

@mixin vw($pxval: 16) {
  font-size: ($pxval / 1080) * 100vw;
}

html {
  font-size: 16px;
  overflow-x: hidden;
}

body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background: #000;
  font-family: Arial, Meiryo, sans-serif, monospace;  /* Nice to be monospace for clock */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #FFF;
}

#debugLog {
  position: absolute;
  z-index: 200;
  width: 100%;
  height: 300px;
  background: rgba(0, 0, 0, 0.4);
  text-align: left;
  font-size: 40px;
}

#app {
  position: relative;
  margin: 0 auto;
  width: 100%;
  height: auto;
  text-align: center;
}

#img1, #img2 {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;

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
  height: 46.2962963%; /* 500/1080 */
  padding-top: 103.703704%; /* 1120/1080 */
}

#footer {
  position:fixed;
  z-index: 20;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 9.25925926%; /* 100/1080 */
  text-align: center;
  vertical-align: middle;

  p {
    width: 94.4444444%; /* 1020/1080 */
    margin: 5% auto 0;
    line-height: 1;
    font-size: 7.40740741vw;  /* 80/1080 */
    font-weight: bold;
    text-justify: inter-character;
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
