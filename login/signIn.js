

function onSignIn(googleUser) {
    var profile=googleUser.getBasicProfile();
    $('.g-signin2').css('display','none');
    $('.data').css('display', 'block');
    $('#pic').attr('src', profile.getImageUrl());
    $('#email').text(profile.getEmail());
    var id_token = googleUser.getAuthResponse().id_token;
    window.location = 'http://192.168.1.67:8001/auth/?mytoken=' + id_token;
    console.log("ID Token: " + id_token);
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
      $('.g-signin2').css('display','block');
      $('.data').css('display', 'none');
    });
  }