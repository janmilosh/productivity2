var app = new Vue({
  el: '#app',
  data: {
    productivity: '',
    productivityValid: true,
    txMinutes: '',
    txMinutesValid: true,
    totalMinutes: 0,
    completedMinutes: 0,
    entries: [{
      hourIn: '',
      minIn: '',
      hourOut: '',
      minOut: '',
      minutes: '',
      valid: true
    }]
  },
  methods: {
    calculateClockOut: function() {
      this.checkProductivityValidity();
      var lastIndex = this.entries.length - 1;
      var lastClockInMinutes = this.lastClockInMinutes(lastIndex);
      if (lastClockInMinutes && this.productivityValid) {
        this.calculateCompletedMinutes();
        this.totalMinutes = Math.round((Number(this.txMinutes) * 100)/Number(this.productivity));
        var neededMinutes = this.totalMinutes - this.completedMinutes;
        var lastClockOutMinutes = (neededMinutes + lastClockInMinutes) % 720;
        this.entries[lastIndex].minutes = neededMinutes;
        this.entries[lastIndex].hourOut = Math.floor(lastClockOutMinutes / 60);
        this.entries[lastIndex].minOut = this.zeroPaddedStr(lastClockOutMinutes % 60);
      } else {
        console.log( "Incomplete entry");
      }
    },
    calculateProductivity: function() {
      this.calculateTime();
      this.checkTxMinutesValidity();
      if (this.allEntryRowsValid() && this.txMinutesValid) {
        this.productivity = ((this.txMinutes * 100)/this.totalMinutes).toFixed(1);
      } else {
        console.log("Incomplete entry");
      }
    },
    lastClockInMinutes: function(index) {
      var entry = this.entries[index];
      if(this.validLastClockIn(entry)) {
        entry.valid = true;
        return 60 * Number(entry.hourIn) + Number(entry.minIn);
      } else {
        entry.valid = false;
      }
    },
    calculateCompletedMinutes: function() {
      this.calculateTime();
      this.completedMinutes = 0;
      for (var i = 0; i < this.entries.length - 1; i++) {
        if (this.validClockInAndOut(this.entries[i])) {
          this.completedMinutes += this.entries[i].minutes;
        }
      }
    },
    calculateTime: function() {
      var that = this;
      this.totalMinutes = 0;
      this.entries.map(function(entry, index) {
        var minutes = that.entryMinutes(entry);
        that.totalMinutes += minutes;
        entry.minutes = minutes;
      });
    },
    entryMinutes: function(entry) {
      if (this.validClockInAndOut(entry)) {
        entry.valid = true;
        return this.calculatedMinutes(entry);
      }
      else {
        entry.valid = false;
        return 0;
      }
    },
    allEntryRowsValid: function() {
      for (var i = 0; i < this.entries.length; i++) {
        if (!this.validClockInAndOut(this.entries[i])) {
          return false;
        }
      }
      return true;
    },
    validLastClockIn: function(entry) {
      return this.validHour(entry.hourIn) &&
             this.validMinute(entry.minIn);
    },
    validClockInAndOut: function(entry) {
      return this.validHour(entry.hourIn) &&
             this.validMinute(entry.minIn) &&
             this.validHour(entry.hourOut) &&
             this.validMinute(entry.minOut);
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
        minutes: '',
        valid: true
      });
    },
    removeEntry: function() {
      if (this.entries.length > 1) {
        this.entries.pop();
      }
      console.log(this.entries);
    },
    checkTxMinutesValidity: function() {
      if (this.isValidNumberString(this.txMinutes)) {
        this.txMinutesValid = true;
        return true;
      } else {
        this.txMinutesValid = false;
        return false;
      }
    },
    checkProductivityValidity: function() {
      var productivity = Number(this.productivity);
      if (productivity >= 0 && productivity <= 100) {
        this.productivityValid = true;
        return true;
      } else {
        this.productivityValid = false;
        return false;
      }
    },
    isValidNumberString: function(numStr) {
      var re = re=/^\d+$/
      return re.test(numStr);
    },
    zeroPaddedStr: function(num) {
      var numStr = num.toString();
      if (numStr.length === 1) {
        return '0' + numStr;
      } else {
        return numStr;
      }
    }
  }
})
