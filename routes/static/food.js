function signupRequest(body) {
  $.post(url, body, function(data) {
    console.log(data);
    var image_url = JSON.stringify(data.hits[0].recipe.image);
    $("body").html('<img id="theImg" src="' + image_url + '"/>');
  });
}
