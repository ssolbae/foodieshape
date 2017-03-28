$(document).ready(function() {
  var url = '/calories';
  $.get(url, function(data) {
    console.log(data);
    // data = [{url: --, image: 00}, {..}, {..}];
    // IIF
    (function() {
      for (var i = 0; i < data.length; i++) {
        var key = ['.breakfast', '.lunch', '.dinner'];
        // IIF
        (function () {
          // Refresh scope from here -- don't want the url (line25) to be same url all the time
          var url = data[i].url;
          var image = data[i].image;
          var label = data[i].label;
          var grams = data[i].grams;
          var calories = data[i].calories;
          $(key[i]+'_image').append('<img class="image" id=' + i + ' src =' + image + '>');
          $(key[i]+'_label').append(label);
          $(key[i]+'_calories').append(calories);
          $(key[i]+'_grams').append(grams);


          console.log("WTFFFFFF: " + calories);
          console.log("HI? : " + JSON.stringify($( ".image" + "#" + i)));
          console.log("GG: " + i);
          $( ".image" + "#" + i).click(function() {
            console.log(url);
            window.open(url, '_blank');
          });
          // to here
        })();
      }
    })();

  });
  url = '/user';
  $.get(url, function(data) {
    var name = data.name;
    var cal_to_lose = parseInt(data.current_weight) - parseInt(data.goal_weight);
    var daily_cal = Math.round(data.daily_cal);
    var goaldays = data.goaldate;
    $('.name').append(name);
    $('.lbs').append(cal_to_lose);
    $('.days').append(goaldays);
    $('.cal').append(daily_cal);
  });

  $("#logout_button").click(function(){
    window.location.href='/logout';
  })

});
