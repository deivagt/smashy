setInterval(() => {
    var startTime = new Date(); 
    var endTime = new Date();
    var difference = endTime.getTime() - startTime.getTime(); // This will give difference in milliseconds
    var resultInMinutes = Math.round(difference / 60000);
    
    console.log(Date.now())
}, 50000);