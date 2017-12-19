<template>
  <div class="clockWrapper">
    <div class="clock">
      <p class="time">{{ time }} </p>
      <p class="city">{{ day }}<br>{{ date }}</p>
    </div>
  </div>
</template>

<script>
const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const month = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

export default {
  name: 'WorldClock',
  props: ['city', 'zone'],
  data() {
    return {
      INTERVAL: 5, // seconds for emitting update
      mySeconds: 0,
      day: '',
      time: '',
      date: '',
      timeID: '',
      msg: 'Welcome to Your Vue.js App',
    };
  },
  created() {
    this.timeID = setInterval(this.updateTime, 1000);
  },
  methods: {
    zeroPadding(num, digit) {
      let zero = '';
      let i;
      for (i = 0; i < digit; i += 1) {
        zero += '0';
      }
      return (zero + num).slice(-digit);
    },
    updateTime() {
      this.tzTime = this.getTimeZoneTime(this.zone);
      this.day = this.showDay(this.tzTime);
      this.date = this.showDate(this.tzTime);
      this.time = this.showTime(this.tzTime);
    },
    dateToTimeString(dt) {
      const hh = `${this.zeroPadding(dt.getUTCHours(), 2)}`;
      const mm = `${this.zeroPadding(dt.getUTCMinutes(), 2)}`;
      const ss = `${this.zeroPadding(dt.getUTCSeconds(), 2)}`;
      this.mySeconds = dt.getUTCSeconds();
      return `${hh}:${mm}:${ss}`;
    },
    dateToDayString(dt) {
      const ww = `${week[dt.getUTCDay()]}`;
      return `${ww}`;
    },
    dateToDateString(dt) {
      // const yy = `${dt.getUTCFullYear()}`;
      // const mm = `${this.zeroPadding(dt.getUTCMonth() + 1, 2)}`;
      const mm = `${month[dt.getUTCMonth()]}`;
      const dd = `${this.zeroPadding(dt.getUTCDate(), 2)}`;
      // const ww = `${week[dt.getUTCDay()]}`;
      return `${dd} ${mm}`;
    },
    getTimeZoneTime(timeZone) {
      const tzTime = new Date(Date.now() + (timeZone * 3600000));
      return tzTime;
    },
    showDay(tzTime) {
      const dayString = this.dateToDayString(tzTime);
      return dayString;
    },
    showDate(tzTime) {
      const dateString = this.dateToDateString(tzTime);
      return dateString;
    },
    showTime(tzTime) {
      const timeString = this.dateToTimeString(tzTime);
      return timeString;
    },
    send(value) {
      if (value % this.INTERVAL === 0) {
        this.$emit('update');
      }
    },
  },
  watch: {
    mySeconds: 'send',
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.clockWrapper {
  height: 180px;
  //background: blue;
}

.clock {
  margin: 0 auto;
  width: 1020px;
  text-align: left;
}

.clock p {
  display: inline-block;
  line-height: 1;
  font-weight: bold;
}

p.time {
  margin-right: 20px;
  font-size: 150px;
}

p.city {
  font-size: 60px;
}


p.date {
  font-size: 75px;
  //color: #CCC;
}

</style>
