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
      var lastIndex = this.entries.length - 1;
      var lastClockInMinutes = this.lastClockInMinutes(lastIndex);
      if (this.validForCalculateClockOut()) {
        this.calculateCompletedEntryMinutes();
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
      this.processMinutes();
      if (this.validForCalculateProductivity()) {
        this.productivity = ((this.txMinutes * 100)/this.totalMinutes).toFixed(1);
        this.checkProductivityValidity();
      } else {
        console.log("Incomplete entry");
      }
    },
    lastClockInMinutes: function(index) {
      var entry = this.entries[index];
      return 60 * Number(entry.hourIn) + Number(entry.minIn);
    },
    zeroPaddedStr: function(num) {
      var numStr = num.toString();
      if (numStr.length === 1) {
        return '0' + numStr;
      } else {
        return numStr;
      }
    },
    calculateCompletedEntryMinutes: function() {
      this.processMinutes();
      this.completedMinutes = 0;
      for (var i = 0; i < this.entries.length - 1; i++) {
        this.completedMinutes += this.entries[i].minutes;
      }
    },
    processMinutes: function() {
      var that = this;
      this.totalMinutes = 0;
      this.entries.forEach(function(entry, index) {
        var minutes = that.entryMinutes(entry);
        that.totalMinutes += minutes;
        entry.minutes = minutes;
      });
    },
    entryMinutes: function(entry) {
      var inTime = this.timeEntryConvertedToMinutes(entry.hourIn, entry.minIn);
      var outTime = this.timeEntryConvertedToMinutes(entry.hourOut, entry.minOut);
      if (this.validClockInAndOut(entry)) {
        if (outTime < inTime ) { outTime += 720; }
        return outTime - inTime;;
      }
      else {
        return 0;
      }
    },
    timeEntryConvertedToMinutes: function(hoursStr, minutesStr) {
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
    },
    validForCalculateProductivity: function() {
      var that = this;
      var txMinutesValid = this.checkTxMinutesValidity();
      this.entries.forEach(function(entry) {
        return entry.valid = that.validClockInAndOut(entry);
      });
      return txMinutesValid && this.allTimeEntriesValid();
    },
    validForCalculateClockOut: function() {
      var productivityValid = this.checkProductivityValidity();
      var txMinutesValid = this.checkTxMinutesValidity();
      var lastEntry = this.entries[this.entries.length - 1];
      for (var i = 0; i < this.entries.length - 1; i++) {
        this.entries[i].valid = this.validClockInAndOut(this.entries[i]);
      };
      lastEntry.valid = this.validLastClockIn(lastEntry);
      return txMinutesValid && productivityValid && this.allTimeEntriesValid();
    },
    allTimeEntriesValid: function() {
      for (var i = 0; i < this.entries.length; i++) {
        if (!this.entries[i].valid) {
          return false;
        }
        return true;
      }
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
      if (productivity > 0 && productivity <= 100) {
        this.productivityValid = true;
        return true;
      } else {
        this.productivityValid = false;
        return false;
      }
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
    isValidNumberString: function(numStr) {
      var re = re=/^\d+$/
      return re.test(numStr);
    }
  }
})
