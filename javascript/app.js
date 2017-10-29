Vue.component('time-entry', {
  template:
    '<tr>' +
      '<td><input type="text" v-bind:value=hourIn>&nbsp;:&nbsp;<input type="text" v-bind:value=minIn></td>' +
      '<td><input type="text" v-bind:value=hourOut>&nbsp;:&nbsp;<input type="text" v-bind:value=minOut></td>' +
      '<td>102</td>' +
    '</tr>',
  data: function() {
    return {
      hourIn: '10',
      minIn: '01',
      hourOut: '12',
      minOut: '21'
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