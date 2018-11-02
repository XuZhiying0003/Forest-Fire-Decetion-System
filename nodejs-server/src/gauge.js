var opts_temp = {
  lines: 12, 
  angle: 0, 
  lineWidth: 0.30, 
  pointer: {
    length: 0.78, 
    strokeWidth: 0.050, 
    color: '#000000'
  },
	percentColors: [[0.0, "#ffbaba" ], [0.50, "#ff6868"], [1.0, "#fc0000"]],
  limitMax: 'true',   
  colorStart: '#6FADCF',   
  colorStop: '#db2525',    
  strokeColor: '#E0E0E0',   
  generateGradient: true
};
var target_canvas_temp = document.getElementById('gauge-temp'); 
var gauge_temp = new Gauge(target_canvas_temp).setOptions(opts_temp); 
gauge_temp.maxValue = 50; 
gauge_temp.minValue = -15;
gauge_temp.animationSpeed = 1; 
gauge_temp.set(0); 


var socket = io.connect();
socket.on('accelData', function(accelData) {
	
   var temp = accelData.data.temp
    
	
  document.getElementById("txt-gauge-temp").innerHTML = temp+"°C";
  console.log(temp);
	// set gauge value
	
	gauge_temp.set(temp);
});

