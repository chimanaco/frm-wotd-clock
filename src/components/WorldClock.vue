<template>
  <div class="clockWrapper">
    <div class="clock">
      <p class="time">{{ paddedHour }}{{ time }} </p>
      <p class="date"><span id="containerDay">{{ day }}</span><br><span id="containerDate">{{ date }}</span></p>
    </div>
  </div>
</template>

<script>
import { TimelineMax } from 'gsap';
import CS from 'character-shuffling';

const week = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const month = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

export default {
  name: 'WorldClock',
  props: ['city', 'zone'],
  data() {
    return {
      INTERVAL: 10, // seconds for emitting update
      mySeconds: 0,
      day: '',
      hour: 0,
      animatedHour: 0,
      paddedHour: 0,
      time: '',
      date: '',
      timeID: '',
      preDay: '',
      msg: 'Welcome to Your Vue.js App',
    };
  },
  created() {
    this.timeID = setInterval(this.updateTime, 1000);
  },
  mounted() {
    const elementDay = document.getElementById('containerDay');
    this.descriptionDay = new CS(elementDay);
    const elementDate = document.getElementById('containerDate');
    this.descriptionDate = new CS(elementDate);
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
      this.hour = this.showHour(this.tzTime);
      this.time = this.showTime(this.tzTime);
    },
    dateToHour(dt) {
      return dt.getUTCHours();
    },
    dateToTimeString(dt) {
      // const hh = `${this.zeroPadding(dt.getUTCHours(), 2)}`;
      const mm = `${this.zeroPadding(dt.getUTCMinutes(), 2)}`;
      const ss = `${this.zeroPadding(dt.getUTCSeconds(), 2)}`;
      this.mySeconds = dt.getUTCSeconds();
      return `:${mm}:${ss}`;
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
    showHour(tzTime) {
      const hour = this.dateToHour(tzTime);
      return hour;
    },
    showTime(tzTime) {
      const timeString = this.dateToTimeString(tzTime);
      return timeString;
    },
    send(value) {
      if (value % this.INTERVAL === (this.INTERVAL - 2)) {
        this.$emit('updatePre');
      }
      if (value % this.INTERVAL === this.INTERVAL - 1) {
        this.$emit('update');
      }
      if (value % this.INTERVAL === 0) {
        this.shuffleDescription(this.day, this.date);
      }
    },
    shuffleDescription(day, date) {
      this.$log.debug('shuffleDescription', this.preDay, day);

      if (this.preDay !== day) {
        // shuffle to a new string specified by the `text` option
        this.descriptionDay.shuffle({ text: day, time: 10 });
        this.descriptionDate.shuffle({ text: date, time: 10 });

        this.preDay = day;
      }
    },
  },
  watch: {
    mySeconds: 'send',
    hour(newValue) {
      const tl = new TimelineMax();
      tl.to(this, 0.5, {
        animatedHour: newValue,
        // ease: Expo.easeInOut,
        delay: 0,
      });
      tl.restart();
    },
    animatedHour(value) {
      const newValue = Math.ceil(value);
      this.paddedHour = this.zeroPadding(newValue, 2);
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.clockWrapper {
  position: absolute;
  z-index: 20;
  width: 100%;
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

p.date {
  font-size: 58px;
}

</style>
