Vue.component('time-entry', {
  template:
    '<tr>' +
      '<td><input type="text" v-model:value=hourIn>&nbsp;:&nbsp;<input type="text" v-model:value=minIn></td>' +
      '<td><input type="text" v-model:value=hourOut>&nbsp;:&nbsp;<input type="text" v-model:value=minOut></td>' +
      '<td class="minutes">{{ entryMinutes }}</td>' +
    '</tr>',
  data: function() {
    return {
      hourIn: '10',
      minIn: '01',
      hourOut: '12',
      minOut: '80'
    }
  },
  computed: {
    entryMinutes: function() {
      if (!this.completeEntry()) {
        return '---'
      }
      else {
        return this.calculatedMinutes();
      }
    }
  },
  methods: {
    completeEntry: function() {
      return this.validHour(this.hourIn) &&
             this.validHour(this.hourOut) &&
             this.validMinute(this.minIn) &&
             this.validMinute(this.minOut)
    },
    validHour: function(numStr) {
      if (numStr.length === 0) {
        return false;
      }
      var num = Number(numStr);
      return num >= 0 && num <= 12;
    },
    validMinute: function(numStr) {
      if (numStr.length < 2) {
        return false;
      }
      var num = Number(numStr);
      return num >= 0 && num <= 59;
    },
    calculatedMinutes: function() {
      var inTime = this.timeInMinutes(this.hourIn, this.minIn);
      var outTime = this.timeInMinutes(this.hourOut, this.minOut);
      if (outTime < inTime ) { outTime += 720; }
      return outTime - inTime;
    },
    timeInMinutes: function(hoursStr, minutesStr) {
      var hours = Number(hoursStr);
      var minutes = Number(minutesStr);
      return hours * 60 + minutes;
    }
  }
})


var app = new Vue({
  el: '#app',
  data: {
    
    productivity: '',
    txMinutes: ''
  }
})
