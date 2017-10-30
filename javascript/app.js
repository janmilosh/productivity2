var app = new Vue({
  el: '#app',
  data: {
    productivity: '',
    txMinutes: '',
    totalMinutes: 0,
    entries: [{
      hourIn: '',
      minIn: '',
      hourOut: '',
      minOut: '',
      minutes: ''
    }]
  },
  methods: {
    calculateTime: function() {
      var that = this;
      this.totalMinutes = 0;
      this.entries.map(function(entry, index) {
        var minutes = that.entryMinutes(entry);
        that.totalMinutes += minutes;
        return entry.minutes = minutes;
      });
      console.log(this.totalMinutes)
    },
    calculateProductivity: function() {
      for (var i = 0; i < this.entries.length; i++) {
        if (!this.completeEntry(this.entries[i])) {
          console.log("Incomplete entry")
          return false;
        }
      }
      this.calculateTime()
      this.productivity = ((this.txMinutes * 100)/this.totalMinutes).toFixed(1);       
    },
    entryMinutes: function(entry) {
      if (!this.completeEntry(entry)) {
        return 0
      }
      else {
        return this.calculatedMinutes(entry);
      }
    },
    completeEntry: function(entry) {
      return this.validHour(entry.hourIn) &&
             this.validMinute(entry.minIn) &&
             this.validHour(entry.hourOut) &&
             this.validMinute(entry.minOut)
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
    calculatedMinutes: function(entry) {
      var inTime = this.timeInMinutes(entry.hourIn, entry.minIn);
      var outTime = this.timeInMinutes(entry.hourOut, entry.minOut);
      if (outTime < inTime ) { outTime += 720; }
      return outTime - inTime;
    },
    timeInMinutes: function(hoursStr, minutesStr) {
      var hours = Number(hoursStr);
      var minutes = Number(minutesStr);
      return hours * 60 + minutes;
    },
    addEntry: function() {
      this.entries.push({
        hourIn: '',
        minIn: '',
        hourOut: '',
        minOut: '',
        minutes: ''
      });
    },
    removeEntry: function() {
      if (this.entries.length > 1) {
        this.entries.pop();
      }
      console.log(this.entries);
    }
  }
})
