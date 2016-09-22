$(document).ready(function(){
    $(".facebook").hide();
    $("#comfirm").click(function() {
        if($("#comfirm").prop('checked') == true){
          $(".facebook").toggle();
        }
        if($("#comfirm").prop('checked') == false){
          $(".facebook").hide();
        }
    });
    $(".logoutbtn").click(function() {
        fbLogoutUser();
    });
    $(function () {
      $('#datetimepicker1').datetimepicker({
        format: 'YYYY-MM-DD hh:mm'
      });
    });
    $("#service_content").load("service_content.html");
});
function subshop() {
  var _id = identity;
  var c_num = $('#c_num').val();
  var host_t = $.now();
  var start_t = Date.parse($('#start_t').val());
  var end_t = start_t-7200000;
  var cost = $('#cost').val();
  var loc_city = $('#loc_city').val();
  var loc = $('#loc').val();
  var tags = [];
  $('input:checkbox[name=tags]:checked').each(function()
    {
       tags.push($(this).val());
    });
  var phone = $('#phone').val();
  var customerid = null;
  var s_else = $('#s_else').val();
  var final = $('#final').val();
  $.ajax({
      url:"http://fedtime-ncnuim.rhcloud.com/shop",
      data:{
        'uid' : _id,
        'cnum' : c_num,
        'host_t' : host_t,
        'start_t' : start_t,
        'end_t' : end_t,
        'cost' : cost,
        'loc_city' : loc_city,
        'loc' : loc,
        'tags' : JSON.stringify(tags),
        'phone' : phone,
        'customerid' : customerid,
        's_else' : s_else,
        'final' : final
      },
      type : "POST",
      dataType:'json',
      error:function(xhr){
        console.log("post fail");
        window.history.back();
      },
      success:function(){
        console.log("post success ");
        location.replace("http://fedtime-ncnuim.rhcloud.com/profile.html");
      }
  });
}
var accessToken='';
var identity='';
function statusChangeCallback(response) {
  console.log('statusChangeCallback');
  console.log(response);
  // The response object is returned with a status field that lets the
  // app know the current login status of the person.
  // Full docs on the response object can be found in the documentation
  // for FB.getLoginStatus().
  if (response.status === 'connected') {
    // Logged into your app and Facebook.
    $('#logincontent-fb').hide();
    $('#logincontent').hide();
    $('.logout').hide();
    $('.login').show();
    identity = response.authResponse.userID;
    accessToken = response.authResponse.accessToken;
    testAPI();
  } else if (response.status === 'not_authorized') {
    // The person is logged into Facebook, but not your app.
    if (top.location.pathname == '/profile.html'){
      window.location.replace("http://fedtime-ncnuim.rhcloud.com/index.html");
    }
    if (top.location.pathname == '/newshop.html'){
      window.location.replace("http://fedtime-ncnuim.rhcloud.com/index.html");
    }
    console.log('Please log into this app.');
  } else {
    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
    if (top.location.pathname == '/profile.html'){
      window.location.replace("http://fedtime-ncnuim.rhcloud.com/index.html");
    }
    if (top.location.pathname == '/newshop.html'){
      window.location.replace("http://fedtime-ncnuim.rhcloud.com/index.html");
    }
    console.log('Please log into Facebook.');
  }
}
// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
}
window.fbAsyncInit = function() {
  FB.init({
    appId      : '155953398151066',
    cookie     : true,  // enable cookies to allow the server to access
                        // the session
    xfbml      : true,  // parse social plugins on this page
    version    : 'v2.2' // use version 2.2
  });
  // Now that we've initialized the JavaScript SDK, we call
  // FB.getLoginStatus().  This function gets the state of the
  // person visiting this page and can return one of three states to
  // the callback you provide.  They can be:
  // 1. Logged into your app ('connected')
  // 2. Logged into Facebook, but not your app ('not_authorized')
  // 3. Not logged into Facebook and can't tell if they are logged into
  //    your app or not.
  // These three cases are handled in the callback function.
  FB.getLoginStatus(function(response) {
    statusChangeCallback(response);
  });
};
// Load the SDK asynchronously
(function(d, s, id) {
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) return;
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));
// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function testAPI() {
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me', { access_token: accessToken, fields: 'id,name,gender,email' }, function(response) {
    console.log('Successful login for: ' + response.name);
    $("#fbuser").text(response.name + " 的個人資料");
    $("#fbnav").text("Hi~ " + response.name);
    document.getElementById('status').innerHTML =
      'Thanks for logging in, ' + response.name + '!';
    $.get("http://fedtime-ncnuim.rhcloud.com/u/" + response.id,
      function(data){
        if(data == null){
          console.log('check user');
          $.post("http://fedtime-ncnuim.rhcloud.com/u",
            {
              _id: response.id,
              name : response.name,
              email : response.email,
              sex : response.gender,
              token : accessToken,
              type : '0',
              agree : 'yes',
              rate : '0',
              shop_suc : '0',
              shop_fail : '0'
            }
          );
        }
        console.log('check rate');
        for (var i = 0; i < data.rate; i++) {
          $("#stars").append('<span>★</span>');
        }
        for (var i = 0; i < 5-data.rate; i++) {
          $("#stars").append('<span>☆</span>');
        }
        console.log('check token');
        if(data.token != accessToken){
          $.patch("http://fedtime-ncnuim.rhcloud.com/u"+ response.id,
            {
              token : accessToken
            }
          );
        }
    });
  });
}
function fbLogoutUser() {
  FB.logout(function(response) {
    location.href= "http://fedtime-ncnuim.rhcloud.com/";
  });
}