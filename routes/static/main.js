

$(document).ready(function() {
  var url = '/calories';
  $.get(url, function(data) {
    console.log(data);
    // data = [{url: --, image: 00}, {..}, {..}];
    // IIF
    (function() {
      for (var i = 0; i < data.length; i++) {
        // IIF
        (function () {
          // Refresh scope from here
          var url = data[i].url;
          var image = data[i].image;
          var label = data[i].label;
          var calories = data[i].calories;
          $('body').append('<img id=' + i + ' src =' + image + '>');
          $('body').append(label);
          $('body').append(calories);

          console.log("calories here: " + calories);
          $("#" + i).click(function() {
            console.log(url);
            window.open(url, '_blank');
          });
          // to here
        })();
      }
    })();

  });
  url = '/user_info';
  $.get(url, function(data)) {
    var username = data.name;
    var cal_to_lose = parseInt(data.current_weight) - parseInt(data.goal_weight);
    console.log("calLose: "+cal_to_lose);
    var goaldays = data.goaldate;
    
  }

});
