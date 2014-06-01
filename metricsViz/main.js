(function() {

'use strict';

//gulp_metrics;

var ellapsedFrom = function(timeZero){

  return function(time){

    var totalSec,
        totalNano;

    totalSec = time[0] - timeZero[0];
    totalNano = (time[1] - timeZero[1]) + (totalSec * 1000000000);

    if(totalNano < 0){
      debugger;
    }
    return totalNano;
  };
};

var ellapsedFromStart = ellapsedFrom(gulp_metrics.timeZero);

var times = gulp_metrics.events.map(function(ev){

  return {
    name: ev.name,
    type: ev.type,
    startEllapsed: ellapsedFromStart(ev.start),
    stopEllapsed: ellapsedFromStart(ev.end)
  };
});
////////

var data = times;
var stopTimes = times.map(function(t){
  return t.stopEllapsed;
});

//  legend
d3.select('#legend')
  .selectAll('div')
  .data([
  {
    text: 'Zero time',
    value: gulp_metrics.timeZero
  },
  {
    text: 'Max stop time',
    value: d3.max(stopTimes)/1000000 + ' ms'
  },
  {
    text: 'total tasks/events',
    value: times.length
  },
  {
    text: 'tasks color: ',
    value: 'blue'
  },
  {
    text: 'file read color: ',
    value: 'green'
  },
  {
    text: 'file write color: ',
    value: 'red'
  }
  ])
  .enter().append("div")
  .text(function(d){
  
    return d.text + ' : ' + d.value;
  });
////////////////

// var scaleThis = d3.scale.linear()
//     .domain([0, d3.max(durations)])
//     .range([0, 700]);

////  new test
var width = 1000,
    barHeight = 20;

var x = d3.scale.linear()
    .domain([0, d3.max(stopTimes)])
    .range([0, width]);

var chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", barHeight * data.length);

var bar = chart.selectAll("g")
    .data(data)
  .enter().append("g")
    .attr("class", function(d){
    
      return d.type;
    })
    .attr("transform", function(d, i) { 
      return "translate("+ x(d.startEllapsed) +"," + i * barHeight + ")"; 
    });

bar.append("rect")
    .attr("width", function(d) { return x(d.stopEllapsed - d.startEllapsed); })
    .attr("height", barHeight - 1);

bar.append("text")
    .attr("x", function(d) { return 100; })
    .attr("y", barHeight / 2)
    .attr("dy", ".30em")
    .text(function(d) { return d.name; });


}());