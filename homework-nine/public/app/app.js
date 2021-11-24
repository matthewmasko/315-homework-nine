var userExists = false;
var userFullName = "";

function initListeners() {
    $(".bars").click(function(e){
      $(".bars").toggleClass("active");
      $(".links").toggleClass("active");
    });

    $(".links a").click(function(e){
        $(".bars").toggleClass("active");
        $(".links").toggleClass("active");
      });

      $("button").click(function(e){
console.log("click");
      });

    }

    function initFirebase() {
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            console.log("auth change logged in");
            if (user.displayName) {
              $(".name").html("Welcome, " + user.displayName);
            }
            $(".load").prop("disabled", false);
            userExists = true;
          } else {
            console.log("auth change logged out");
            $(".name").html("");
            $(".load").prop("disabled", true);
            userExists = false;
            userFullName = "";
          }
        });
      }

      function signOut() {
        firebase
          .auth()
          .signOut()
          .then(() => {
            console.log("signed out");
          })
          .catch((error) => {
            console.log("error signing out");
          });
      }
      
      function login() {
        let email = $("#log-email").val();
        let password = $("#log-pw").val();
      
        firebase
          .auth()
          .signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            console.log("logged in");
            $("#log-email").val("");
            $("#log-pw").val("");
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("logged in error " + errorMessage);
          });
      }
      
      function createAccount() {
        let fName = $("#fName").val();
        let lName = $("#lName").val();
        let email = $("#email").val();
        let password = $("#pw").val();
        let fullName = fName + " " + lName;
        console.log("create " + fName + " " + lName + " " + email + " " + password);
      
        firebase
          .auth()
          .createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            // Signed in
            var user = userCredential.user;
            console.log("created");
            firebase.auth().currentUser.updateProfile({
              displayName: fullName,
            });
            userFullName = fullName;
            $(".name").html(userFullName);
            $("#fName").val("");
            $("#lName").val("");
            $("#email").val("");
            $("#pw").val("");
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("create error " + errorMessage);
            // ..
          });
      }
      
      function signIn() {
        firebase
          .auth()
          .signInAnonymously()
          .then(() => {
            console.log("signed in");
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Error signing in " + errorMessage);
            // ...
          });
      }

function changeRoute() {
    let hashTag = window.location.hash;
    let pageID = hashTag.replace("#", "");
        // console.log(hashTag + " " + pageID);
        
if(pageID !="") {
        $.get(`pages/${pageID}/${pageID}.html`, function (data) {
            // console.log("data " + data);
            $("#app").html(data);
                });
    }else {$.get(`pages/home/home.html`, function (data) {
        // console.log("data " + data);
        $("#app").html(data);
            });

    }
}

function initURLListener(){
    $(window).on("hashchange", changeRoute);
    changeRoute();
}

$(document).ready(function(){
    initURLListener();
})

$(document).ready(function () {
    try {
      let app = firebase.app();
      initFirebase();
      initListeners();
    } catch (error) {
      console.log("error ", error);
    }
  });