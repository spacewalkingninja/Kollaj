/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');

//        admob.initAdmob("ca-app-pub-5520633259009545/7928666319","ca-app-pub-5520633259009545/7928666319");


        // first of all we set this plugin
        jQuery(document).ready(function() {
          jQuery("time.timeago").timeago();
        });

        var vTimeOut;

        // the we put some vars in localStorage
        //roffset is not used anymore
        // iAlreadyGotMyPermission is used to check if the user is logged. We set to 0, then, later, we check if the user has a tracker or logs in
        // modal is to remind kollaj that there's no modal window opened at this momment
        window.localStorage.setItem("roffset", 0);
        window.localStorage.setItem("iAlreadyGotMyPermission", 0);
        window.localStorage.setItem("modal",0);
        // email second pass, just another check that we'll be doing with the email
        var emailSecondPass = 0;

        // f identify(arr)
        // POSTs an array to kollaj.net
        // in json format
        function identify(arr)
        {
            //actionCall within identify responds altering the Client view&DOM according to the server answer
          function actionCall(obj)
          {
              //the server answers with an obj.objectName
              //we then have to see what the object's value is.
              //and tweak the client answer to it.
            //register email
            if (obj.email == "gotTheSame")
            {
              window.localStorage.setItem("emailPass", "gotTheSame");
            } else if (obj.email == "pass")
            {
              window.localStorage.setItem("emailPass", "pass");
            }
            //register username
            if (obj.uname == "gotTheSame")
            {
              window.localStorage.setItem("unamePass", "gotTheSame");
            } else if (obj.uname == "pass")
            {
              window.localStorage.setItem("unamePass", "pass");
            }
              //for the above email & username checks,
              //gotTheSame = BAD
              //pass = good

              // registration query

              // if = sameUname
              // server verified that there's another user with this username
            if (obj.registrationQuery == "sameUname")
            {
              window.localStorage.setItem("registrationQuery", "nah")
              window.localStorage.setItem("unamePass", "gotTheSame");
            } else if (obj.registrationQuery == "sameEmail")
            {
               //server verified that there's another user with this email
              window.localStorage.setItem("registrationQuery", "nah")
              window.localStorage.setItem("emailPass", "gotTheSame");
            } else if (obj.registrationQuery == "success")
            {
                //or we have success, we ALERT joyfully the user that they're registered
                // we set loggedAs=USERNAME and a md5(tracker) generated in the server
                //kollajDistance NOT IN USE ANYMORE, but gotta remove all refs to it from the client (& maybe some on the serverSide), or kollaj will crash!
              alert("you regged <3");
              window.localStorage.setItem("registrationQuery", "pass");
              window.localStorage.setItem("loggedAs", obj.newUsername);
              window.localStorage.setItem("tracker", obj.tracker);
              window.localStorage.setItem("kollajDistance", obj.kollajDistance);
                // once we have everything set, we reload the whole thing... Not a good method, as it's a bit slow-ish...
                // we might wanna change this?
              location.reload();
            }
            //loginQuery
            if (obj.loginQuery == "noCookiesForYou")
            {
                // kollaj doesnt use cookies, but saying noCookiesForYou = not logged in!
              $("#loginContainer").css({"display":"block"});

              window.localStorage.setItem("loginQuery", "nah");
              window.localStorage.setItem("loggedAs", "");
              window.localStorage.setItem("tracker", "trackingYou");

              document.getElementById("loginText").innerHTML = "<span style='color:red'>Hey, something's wrong!</span>";
                // and we also let the user know there's something wrong.
            }
            else if (obj.loginQuery == "imLettingYa")
            {
                // if the server says imLettingYa, the client happily obeys its master
              window.localStorage.setItem("loginQuery", "pass" )
              window.localStorage.setItem("loggedAs", obj.loginUser);
              window.localStorage.setItem("tracker", obj.tracker);
              window.localStorage.setItem("kollajDistance", obj.kollajDistance);
                // sets loggedAs and a Tracker
              $("#loginContainer").css({ "display": "none" });
                //removes the login container from view
              if(window.localStorage.getItem("iAlreadyGotMyPermission") == 0)
              {
                  //and if this is the first logIn of the user
                var arr1 = {canYou:"giveMeMyStats", myName:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform}
                identify(arr1);
                  // requests the stats
                var arr = {canYou:"showMeMyFeed", myName:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform, roffset:0};
                identify(arr);
                  // requests a feed
                window.localStorage.setItem("iAlreadyGotMyPermission", 1);
                  // and we let it know it's got a permission to enjoy kollaj
              }
            }
            else if (obj.loginQuery == "imLettingYaOnLogin")
            {
                //imLettingYaOnLogin only is given by the server if we ask the server canYou:makeSureMeIsNotMiniMe
                // used on automated login with loggedAs and a tracker in localStorage
                // doesnt work perfectly so we still gotta ask the server to deliver us a feed & stats though.

              window.localStorage.setItem("loginQuery", "pass" )
              window.localStorage.setItem("loggedAs", obj.loginUser);
              window.localStorage.setItem("tracker", obj.tracker);
              window.localStorage.setItem("kollajDistance", obj.kollajDistance);
              var arr1 = {canYou:"giveMeMyStats", myName:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform}
              identify (arr1);
              $("#loginContainer").css({"display":"none"});
              var arr = {canYou:"showMeMyFeed", myName:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform, roffset:0};
              identify(arr);
              window.localStorage.setItem("iAlreadyGotMyPermission", 1);
                // same as above
            }

              //logout is made if we request the server with a canYou:sayBye
              // the server sends an obj.bye="bye"
              // and the rest of the logout is done on serverside

            if (typeof obj.bye != "undefined" )
            {
              localStorage.clear();
              location.reload();
            }

              //if we request a passChange and it runs good
              // server says> obj.urPassChange = "done"

            if (typeof obj.urPassChange != "undefined" )
            {
              $("#deepMenuChooser").css({"display":"block"});
              $("#myPassSet").css({"display":"none"});
              $("#deepMenu").css({ "display": "none" });
              //update views
              $modal = $('.modal-frame');
              $overlay = $('.modal-overlay');
              window.localStorage.setItem("modal", 0);
              $overlay.removeClass('state-show');
              $modal.removeClass('state-appear').addClass('state-leave');
                //remove the modal (not sure if we'll be removing it in the future though)
            }

              // server sends urNameMate=realName
              // on realName change request (canYou:setMyName)
              // or on canYou:giveMeMyName request
            if (typeof obj.urNameMate != "undefined")
            {
              window.localStorage.setItem("realName", obj.urNameMate);
              $("#myNameIs").val(obj.urNameMate);
                // we set it to localStorage, and set it as the value of the name change input
            }

            if (typeof obj.urBioMate != "undefined")
            {
                // same as realName, delivered on canYou:setMyBio or canYou:giveMeMyBio 
              window.localStorage.setItem("myBio", obj.urBioMate);
              $("#currentBio").html(obj.urBioMate);
            }

            if (obj.urEmailSearch == "gotTheSame")
            {
                // if we wanna change the email, but our new mail miraculously is in use
              $("#myEmailIs").css({background:"rgba(255,0,0,0.4)"})
              window.localStorage.setItem("emailCheck", "no");
            }

            if (obj.urEmailSearch == "isValidMate")
            {
                //changing the mail to a valid one
                $("#myEmailIs").css({ background: "rgba(0,255,0,0.4)" });
              window.localStorage.setItem("emailCheck", "yes");
            }

            if (typeof obj.urEmailMate != "undefined" )
            {
                // we requested to change the email and the server
                //ACCEPTED & CHANGED THE EMAIL!
              window.localStorage.setItem("myEmail", obj.urEmailMate);
              $("#myEmailIs").val(obj.urEmailMate);
            }

            if(typeof obj.client != "undefined")
            {
                // here we advise users they should update, and try to block them off kollaj.
                // I don't like buggy outdated clients
                // especialmente nesta altura do ano XD
                // grande feature that we'll be using 

              alert("It is imperative ou update Kollaj so you can continue using it. \n Thanks for da understanding yo!");
              $abt = $("#abt");
              $abt.html("");
              $abt.append('<br/><br/><br/><br/><br/><br/><br/><br/><br/><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 468.228 117.552" overflow="visible" zoomAndPan="disable"><path fill="none" d="M0 0h468.23v117H0z"/><path fill="#02343F" d="M113.1 94.24H101L68.7 51.32l-9.27 8.23v34.7h-10.3V5.75h10.3V49.6L99.6 5.72h12.17L76.17 44.2l36.94 50.06zm82.78-44.4c0 14.16-3.58 25.3-10.74 33.42S168 95.43 155.26 95.43c-13.04 0-23.1-4-30.18-11.96-7.08-7.97-10.63-19.23-10.63-33.76 0-14.4 3.56-25.55 10.66-33.5s17.2-11.9 30.3-11.9c12.7 0 22.65 4.05 29.8 12.1 7.14 8.1 10.7 19.24 10.7 33.44zm-70.53 0c0 12 2.56 21.1 7.66 27.3s12.55 9.3 22.28 9.3c9.8 0 17.2-3.1 22.22-9.28 5-6.18 7.5-15.3 7.5-27.32 0-11.92-2.5-20.95-7.48-27.1-4.98-6.17-12.35-9.25-22.12-9.25-9.8 0-17.26 3.1-22.37 9.3s-7.65 15.2-7.65 27.02zm84.08 44.4V5.74h10.3v79.2h39.06v9.3h-49.4zm58.17 0V5.74h10.3v79.2h39.05v9.3H267.6zm119.9 0l-11.02-28.2h-35.5l-10.9 28.2h-10.42l35-88.88h8.67l34.83 88.88H387.5zM373.27 56.8l-10.3-27.4c-1.34-3.48-2.7-7.74-4.12-12.78-.9 3.87-2.16 8.13-3.82 12.77L344.6 56.8h28.67z"/><path fill="#02343F" d="M397.4 117.55c-3.8 0-6.78-.54-8.96-1.63v-8.77c2.87.8 5.86 1.2 8.96 1.2 4 0 7.04-1.2 9.12-3.62 2.07-2.42 3.1-5.9 3.1-10.47V5.74h10.3V93.4c0 7.67-1.93 13.6-5.8 17.82-3.88 4.22-9.45 6.33-16.72 6.33z"/><path fill="#FFF" d="M316.95 94.25h-6.44l3.7-9.38h2.8"/><path fill="#FFF" d="M315.23 81.2s-2.97 14.24-3.97 14.93 4.4 7.5 6.72-.75 5.97-13.16 2.84-13.66-5.6-.53-5.6-.53z"/></svg> <br/> <br/> <br/><br/><h1> PLEASE UPDATE </h1> <br/><br/><h2> So you can use all of them new features. <br/> To do this, please go to Google </h2><br/><br/><br/><br/> ');
              $("#loginContainer").css({"display":"none"});
              $("#mainNav").css({"display":"none"});
                $abt.css({"display":"block"});
            }

            if (typeof obj.urKollajDistance != "undefined" )
            {
                // birdPoop on this
              window.localStorage.setItem("kollajDistance", obj.urKollajDistance);
              var myNewHeight = window.localStorage.getItem("originalHeight") * obj.urKollajDistance;
              //$("#profile").css({"height":myNewHeight+"px"});
              //$("#profileSVG").css({"height":myNewHeight+"px"});
              //console.log("refreshed kdistance, "+window.localStorage.getItem('kollajDistance'))
            }

            if (typeof obj.urFollowersAtm != "undefined" )
            {
                // answer on canYou:giveMeMyStats
                // there are two obj's but checking if one is present is enough
                // obj.urFollowersAtm = INT
                // obj.uFollowingAtm = INT
              window.localStorage.setItem("myProfileFollowing",obj.uFollowingAtm);
              window.localStorage.setItem("myProfileFollowers",obj.urFollowersAtm);

              $("#profileFollowing").html(obj.uFollowingAtm);
              $("#profileFollowers").html(obj.urFollowersAtm);
                // we also set it to be the default val in the profile menu header
                // although we continue requesting it when we visit our profile
                // later on we should really consider storing some things in a localDB
                // to make fewer overall requests to the server

            }

            if(typeof obj.urCalibration != "undefined")
            {
                //the calibration...
                // sad story
                // we know it though   
              window.localStorage.setItem("myCalibration", obj.urCalibration);
              $(".calibrationValue").html(obj.urCalibration);
              $("#calibrationRanger").val(obj.urCalibration);
            }

            if(typeof obj.thanksForTheWarning != "undefined")
            {
                // if user clicks on the triangle to alert us about an image that they think its bad
                // the server returns an non empty thanksForTheWarning object
              bringInTheAlertWindow();
            }

            if(obj.urCalibration == "hateToMakeYouSadButUrOnUrOwn")
            {
            // if the phone is on its own as its the first used on Kollaj and hasnt been calibrated ever before.
              window.localStorage.setItem("myCalibration", "hateToMakeYouSadButUrOnUrOwn");
              $(".calibrationValue").html("0.0");
              $("#calibrationRanger").val("0.00");
              $("#calibrateMsg").text(" - The good news is that you'll have to calibrate manually, \n your phone is new to Kollaj! \n (CLICK THE ICON ON THE LEFT CORNER TO HIDE THIS)");
            }


            if(obj.yourVibe == "hasBeenVibed")
            {
                // once user sends viber request & the server accepts it
                // the server answers simply with obj.yourVibe = hasBeenVibed
              //console.log("BAM");
            }


            if (typeof obj.thePpzDatReFollingU != "undefined")
            {
                // canYou:tellMeWhoFollowsMe
                // answer: json array containing various sub arrays each contains:
                // userUrFollowing : username
                // uVeBinAccepted : 0/1 -- preparing for private accounts
                // usrAvatar: usrAvatarPath use as : //kollaj.net/uploads/[usrAvatarPath]
              window.localStorage.setItem("modal",0);

              $whoAreMyFollowers = $("#whoAreMyFollowers");
              $whoAreMyFollowers.html("");
              arr = obj.thePpzDatReFollingU;
              for (i in arr)
              {
                flwState = " follows you!"
                if(arr[i].uVeBinAccepted != 1)
                {
                  flwState = "- pending approval!"
                }
                  //above: preparing for private accs
                  // below: ALMOST a mess.
                $whoAreMyFollowers.append(""+
                "<div class='notifHolder' id='usrFollowRes"+i+"' data-openuser='"+arr[i].userUrFollowing+"'>"+
                "  <div class='notifPPHolder'>"+
                "    <div class='cropSRes' id='usrFollowResImg"+i+"' > </div>"+
                "  </div>"+
                "  <p>@"+arr[i].userUrFollowing+" "+flwState+"</p>"+
                "</div>");
                  //then, after creating the div, we set the user avatar 
                $("#usrFollowResImg"+i).css({"background-image":"url('https://kollaj.net/uploads/"+arr[i].usrAvatar+"')"});

                 // child: If user clicks on the profile item
                 $("#usrFollowRes"+i).click(function(){
                   var seekProfile = $(this).data("openuser");
                   //console.log(seekProfile);
                   $("#profileName").html("<div id='callProfAction' class='arrow' data-seeProf='"+seekProfile+"'>@"+seekProfile+"</div>");
                   $("#callProfAction").click (function()
                   {
                    //see the profile menu for this user
                     seeProf = seekProfile;
                     callDaProfileMenu(seeProf);
                     window.localStorage.setItem("history", "smProfile");
                   });
                    // we request server to show us the profile of the user
                   var arr = {canYou:"showMeSomeProfile", myName:window.localStorage.getItem("loggedAs"), seeProfile: seekProfile, tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform, proffset:0};
                   identify(arr);
                     //we set the views
                   $("#profile").css({"display":"block"});
                   $("#whoAmIFollowing").css({"display":"none"});
                     // set the views
                     // and hide the modal
                   $modal = $('.modal-frame');
                   $overlay = $('.modal-overlay');
                   window.localStorage.setItem("modal", 0);
                   $overlay.removeClass('state-show');
                   $modal.removeClass('state-appear').addClass('state-leave');

                 });

              }
            }


              // pretty much the same, but about who YOU are following:
            if (typeof obj.thePpzUrFollowingAre != "undefined")
            {

              window.localStorage.setItem("modal",0);

              $whoAmIFollowing = $("#whoAmIFollowing");
              $whoAmIFollowing.html("");
              arr = obj.thePpzUrFollowingAre;
              for (i in arr)
              {
                flwState = "Following "
                if(arr[i].uVeBinAccepted != 1)
                {
                  flwState = "Pending approval - "
                }
                $whoAmIFollowing.append(""+
                "<div class='notifHolder' id='usrFollowRes"+i+"' data-openuser='"+arr[i].userUrFollowing+"'>"+
                "  <div class='notifPPHolder'>"+
                "    <div class='cropSRes' id='usrFollowResImg"+i+"' > </div>"+
                "  </div>"+
                "  <p>"+flwState+"@"+arr[i].userUrFollowing+"</p>"+
                "</div>");

                $("#usrFollowResImg"+i).css({"background-image":"url('https://kollaj.net/uploads/"+arr[i].usrAvatar+"')"});

                 // child: searchResCLICK
                 $("#usrFollowRes"+i).click(function(){
                   var seekProfile = $(this).data("openuser");
                   //console.log(seekProfile);
                   $("#profileName").html("<div id='callProfAction' class='arrow' data-seeProf='"+seekProfile+"'>@"+seekProfile+"</div>");
                   $("#callProfAction").click (function()
                   {
                     seeProf = seekProfile;
                     callDaProfileMenu(seeProf);
                   });
                   var arr = {canYou:"showMeSomeProfile", myName:window.localStorage.getItem("loggedAs"), seeProfile: seekProfile, tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform, proffset:0};
                   identify(arr);
                   $("#profile").css({"display":"block"});
                   $("#whoAmIFollowing").css({"display":"none"});
                   $modal = $('.modal-frame');
                   $overlay = $('.modal-overlay');
                   window.localStorage.setItem("modal", 0);
                   $overlay.removeClass('state-show');
                   $modal.removeClass('state-appear').addClass('state-leave');

                 });

              }
            }
              // I think we can shit on this, we don't use it.
              // there might be dependency issues though
              // a good clean is recommended
            if(typeof obj.urDescMate != "undefined")
            {

              function getMessage(messages) {
                 return messages[Math.floor(Math.random() * messages.length)];
              }
              var stngsStrng = ["Settings", "%SystemDrive%", "class.[usrDesc]", "::SettsKollaj", "Control Panel", "::RootConfigs", "root/memes/"];
              var sepStrng = [" :: ", " / ", " > ", " <> ", " >> ", " blah ", " // ", " ", " -----> ", " idk, " ];
              var descStrng = ["Profile Description", "[changeProfDescription]", "{settingDesc}", "your description", "description", "editDescription"];
              var nDescStrng = ["42", "A brand new description", "haha i changed it", "[[insert new description]]", "I can tell you a story... A story of.. No I can't, sry.", "**description in french**"];
              myRandStngs = getMessage(stngsStrng);
              myRandSep = getMessage(sepStrng);
              myRandDesc = getMessage(descStrng);
              myRandFubar = getMessage(nDescStrng);

              $("#dasModal").html(""+
                "<div class='fSvgResH'>"+
                "<p class='fSvgResUn'> <br/> </p>"+
                "<p class='fSvgResD' id='modalCurrentSelfDesc'>"+obj.urDescMate+"</p>"+
                "<p class='fSvgResCL'>"+myRandStngs+""+myRandSep+""+myRandDesc+"</p> "+
                "<div id='modalChangeMyDesc' class='feedCommentForm' style='display:block !important;'>"+
                "<input id='myNewDesc' class='feedCommentInput' type='text' placeholder='"+myRandFubar+"'>"+
                "<input id='myNewDescSender' class='feedCommentBtn' type='button' value='> save <'>"+
                "</div> </div> ");

              $("#myNewDescSender").click(function(){
                myNewDesc = $("#myNewDesc").val();
                var arr = {canYou:"letMeChangeMyDesc", myName:window.localStorage.getItem("loggedAs"), whatShallBeIt: myNewDesc, tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform};
                identify(arr);
                return false;
              });
              return false;
            }
              // if canYou:letMeFollowThem
              // the server has to decide, as it's already rigged for private accs
              // it now alwayts responds with 1
            if (obj.myDecisionAboutYourFollowing == 1) {
              $("#profileFollowers").data( "iFollow", 1);
              $("#profileFollowers").css({"background":"rgba(100, 149, 237, 0.7)"})
              $("#profileFollowers").css({"color":"ghostwhite"});
                //and we update the view.
            }

            if (obj.myDecisionAboutYourFollowing == 2) {
              //alert ("Wait untill they accept you!");
            }
              // if canYou:makeMeUnfollowThem
              // request to UNFOLLOW
              // the server answers with 0 if NOT FOLLOWING
            if (obj.didILetYouUnfollow == 0) {
              $("#profileFollowers").data( "iFollow", 0);
              $("#profileFollowers").css({"background":"white"})
              $("#profileFollowers").css({"color":"#003440"})
            }

              //canYou:giveMeTheCommentsOfThisPost
              //gives an obj.commentsRes
              //json containing array with:
              //commenter : USERNAME
              //comment : COMMENT
            if (typeof obj.commentsRes != "undefined") {
              var arr = obj.commentsRes;
              $("#feedComments"+obj.gbt).html("")
              $("#feedComments"+obj.gbt).css({"display":"none"})
              for (i in arr)
              {
              $("#feedComments"+obj.gbt).append("<p> <span id='p"+obj.gbt+"comment"+i+"' data-uname='"+arr[i].commenter+"'>@"+arr[i].commenter+"</span> "+arr[i].comment+"</p>");

              $("#p"+obj.gbt+"comment"+i).click(function(){
                gtlink = $(this).data("uname");
                window.localStorage.setItem("history", "feed");
                $("#profileName").html("<div id='callProfAction' class='arrow' data-seeProf='"+gtlink+"'>@"+gtlink+"</div>");
                var arr = {canYou:"showMeSomeProfile", myName:window.localStorage.getItem("loggedAs"), seeProfile:gtlink, tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform, proffset: 0};
                identify(arr);
                return false;
              })

              }
              $("#feedComments"+obj.gbt).data( "toggled", 1);
              $("#feedComments"+obj.gbt).slideToggle();
              $("#feedComForm"+obj.gbt).slideToggle();

            }

            if(typeof obj.youCanBother != "undefined")
            {
              $("#msgresholder").css({"display":"block"});
              $("#chatbox").css({"display":"none"});
              $("#chat").css({"display":"none"});

              $msg = $('#msgresholder');
              $msg.html("")
              var arr=obj.youCanBother;
              for (i in arr)
              {
                $msg.append(""+
                "<div id='msgRes"+i+"' class='mrid' data-uname='"+arr[i].username+"'>"+
                "<div class='pinfo'>"+arr[i].uRname+
                "<span class='psm'> @"+arr[i].username+"</span>"+
                "</div>   <div class='searchResCnt'>"+
                "<div class='cropSRes' id='cropMRes"+i+"' > </div>"+
                "</div></div>");
                $("#cropMRes"+i).css({"background-image":"url('https://kollaj.net/uploads/"+arr[i].avatar+"')"});
              }

              $(".mrid").click(function(){
                $("#msgresholder").css({"display":"none"});
                var seekProfile = $(this).data("uname");
                //console.log(seekProfile);
                window.localStorage.setItem("seeingMsgs", seekProfile);
                window.localStorage.setItem("firstReload", 1);
                var arr = {canYou:"STOPiMadeUpMyMind", myName:window.localStorage.getItem("loggedAs"), illBeBothering: seekProfile, tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform};
                identify(arr);
                return false;
              });
            }

            if (typeof obj.hahaOkUCanTry != "undefined")
            {

                  $("#chatbox").css({"display":"block"});
                  $("#chat").css({"display":"block"});
                  $chatThing = $("#theChatThing");
                  $chatThing.html("");

                  var arr = obj.hahaOkUCanTry;
                  for (i in arr)
                  {
                    //console.log("here...");
                    if (arr[i].guilty != 1)
                    {
                      username = arr[i].uname;
                      window.localStorage.setItem("msgSendTo", username);
                      style="style='color:crimson;'";
                    }
                    else {
                      username = window.localStorage.getItem("loggedAs");
                      style="style='color:CornflowerBlue;'";
                    }
                  $chatThing.append("<p><span id='chatMsgId"+i+"' "+style+" data-uname='"+username+"'>@"+username+" </span> <time class='timeago' "+style+" datetime='"+arr[i].on+"'>"+arr[i].on+"</time>:</p> <p>"+arr[i].msg+"<p>");
                  }

                  jQuery("time.timeago").timeago();
                  $msg =$("#msg");

                  $(function() {
                    var vTimeOut= setTimeout(startRefresh, 7500)
                  });

                  function startRefresh() { 
                    clearInterval(vTimeOut);

                    if($msg.is(":hidden")){messageState = 0}else{messageState = 1}
                    if (messageState != 0)
                      {
                        vTimeOut= setTimeout(startRefresh, 7500);
                        checkMessagesWith = window.localStorage.getItem("seeingMsgs");
                        daTime = parseInt(window.localStorage.getItem("checkedMsgsAt"))+7250;
                        if (daTime < Date.now())
                        {
                          window.localStorage.setItem("checkedMsgsAt", Date.now());
                          var arr = {canYou:"STOPiMadeUpMyMind", myName:window.localStorage.getItem("loggedAs"), illBeBothering: checkMessagesWith, tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform};
                          identify(arr);
                        }
                      }

                      $mrH = $("#msgresholder");
                      if($mrH.is(":hidden")){cbState = 0}else{cbState = 1}
                      //console.log(cbState)
                        if (cbState == 1)
                        {
                          clearInterval(vTimeOut);
                          $("#chatbox").css({"display":"none"});
                          $("#chat").css({"display":"none"});
                        }

                  }

                  $mrH = $("#msgresholder");
                  if($mrH.is(":hidden")){cbState = 0}else{cbState = 1}
                  //console.log(cbState)
                    if (cbState == 1)
                    {
                      clearInterval(vTimeOut);
                      $("#chatbox").css({"display":"none"});
                      $("#chat").css({"display":"none"});
                    }
                    if(window.localStorage.getItem("firstReload") == 1)
                    {
                      var objDiv = document.getElementById("chatbox");
                      objDiv.scrollTop = objDiv.scrollHeight;
                      window.localStorage.setItem("firstReload",0);
                    }
            }
            if (typeof obj.ncGbt != "undefined") {

              $("#feedComments"+obj.ncGbt).append("<p> <span>@"+obj.loginUser+"</span> "+obj.urNewComment+"</p>");

            }
            if(typeof obj.datUserRes !="undefined")
            {

              function getMessage(messages) {
                 return messages[Math.floor(Math.random() * messages.length)];
              }

              //console.log("here!");
              if (obj.datUserRes != 1)
              {
                //console.log(obj.seeing);
                theCss = $("#whereuputurppic").css("background-image");
                  //console.log(theCss);

                  $("#last").css({"display":"none"});

                  $("#ppicindaModal").css({"background-image":theCss});

                  window.localStorage.setItem("seeProfFollowing", obj.following);
                  window.localStorage.setItem("seeProfFollowers", obj.followers);

                  $("#section-one").html("<h1>"+obj.following+" ></h1>");
                  $("#section-two").html("<h1>> "+obj.followers+" [follow]</h1>");
                  window.localStorage.setItem("seeProfName", obj.seeing);

                  if(obj.iFollow == 1)
                  {
                    window.localStorage.setItem("seeProfIFollow", 1);
                    var messages = ["<h1>> you and "+obj.followers+" people [UNFOLLOW]</h1>", "<h1>> followed by "+obj.followers+", and you</h1>", "<h1>> you and "+obj.followers+"in the vibe</h1>", "<h1>"+obj.followers+" [unvibe]</h1>"];
                    if(obj.followers == 1){
                    var messages = ["<h1>> you and you</h1>", "<h1>> followed only by you</h1>", "<h1>> you'll be the last unviber</h1>", "<h1>> "+obj.followers+" :( [unvibe]</h1>"];
                    }
                  }
                  if(obj.iFollow == 0)
                  {
                    window.localStorage.setItem("seeProfIFollow", 0);
                    var messages = ["<h1>"+obj.followers+" in the vibe [FOLLOW]</h1>", "<h1>followed by "+obj.followers+"</h1>", "<h1>"+obj.followers+"</h1>", "<h1>"+obj.followers+" [VIBE]</h1>"];
                    if(obj.followers == 0){
                    var messages = ["<h1>you could be the 1st follower</h1>", "<h1>followed by no one :(</h1>", "<h1>vibe me?</h1>", "<h1>follow..</h1>"];
                    }
                    if(window.localStorage.getItem("loggedAs")=="_allexaa" && obj.seeing=="spacewalkingninja")
                    {
                      var messages = ["<h1>aloha, in the vibe?</h1>", "<h1>aloha, click to follow</h1>", "<h1>not a joke, click to follow</h1>"];
                    }
                  }

                  myRandSt = getMessage(messages);
                  $("#section-two").html(myRandSt);

                  if(obj.followsMe == 1)
                  {
                    var messages = ["<h1>> we are working on block...</h1>", "<h1>> follows "+obj.following+" people</h1>", "<h1>> "+obj.following+"</h1>", "<h1>>  in "+obj.followers+" vibes</h1>", "<h1>> in the same vibe</h1>"];
                    if(obj.following == 1){
                    var messages = ["<h1>we ARE working on block... ></h1>", "<h1>stalks only you ></h1>", "<h1>it is awkward ></h1>", "<h1>follows you and only you <3 ></h1>"];
                    }

                  }
                  if(obj.followsMe == 0)
                  {
                    var messages = ["<h1>is from a distant galaxy ></h1>", "<h1>follows "+obj.following+" people  ></h1>", "<h1>"+obj.following+", but not you :/ ></h1>", "<h1> in "+obj.followers+" vibes ></h1>", "<h1>in other vibes ></h1>"];
                    if(obj.following == 0){
                    var messages = ["<h1>is from a VERY distant galaxy ></h1>", "<h1>follows NO people ></h1>", "<h1>NO ONE! ></h1>", "<h1>not in the vibe ></h1>", "<h1>nah.. ></h1>"];
                    }
                  }
                  myRandSo = getMessage(messages);
                  $("#section-one").html(myRandSo);
                  usrDesc = "";
                  if (typeof obj.usrDesc != "undefined")
                  {
                  usrDesc = obj.usrDesc
                  }
                  $("#section-three").html("<h1 style='line-height: 0.9rem;padding: 0.5rem 0;font-size: 0.8rem;'>"+obj.usrDesc+"</h1>");
                  $("#section-four").html("<h1> message </h1> ");

                  window.localStorage.setItem("forProfile", 1);

                  $("#section-one").one('click',function()
                {
                  if(window.localStorage.getItem("forProfile") == 1)
                  {
                    return false;
                  }
                });
                  $("#section-two").one('click',function()
                {
                  if(window.localStorage.getItem("forProfile") == 1)
                  {
                    seeProfName = window.localStorage.getItem("seeProfName");
                    cFollowers = window.localStorage.getItem("seeProfFollowers");
                    iFollow = window.localStorage.getItem("seeProfIFollow");

                    if (iFollow == 1)
                    {
                    var arr = {canYou:"makeMeUnfollowThem", myName:window.localStorage.getItem("loggedAs"), seeProfile: seeProfName, tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform};
                    identify(arr);
                    //console.log("[unfollow]"+seeProfName);
                    var messages = ["<h1>well, you did it..</h1>", "<h1>[[unvibed]]</h1>", "<h1>aye, captain!</h1>", "<h1>bye :(</h1>", "<h1>nah..</h1>"];
                    }
                    if (iFollow == 0)
                    {
                    var arr = {canYou:"letMeFollowThem", myName:window.localStorage.getItem("loggedAs"), seeProfile: seeProfName, tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform};
                    identify(arr);
                    var messages = ["<h1>trying..</h1>", "<h1>[[vibing]]</h1>", "<h1>aye, captain!</h1>", "<h1>aloha!</h1>", "<h1>:)</h1>"];

                    if(window.localStorage.getItem("loggedAs")=="_allexaa" && seeProfName=="spacewalkingninja")
                    {
                      var messages = ["<h1>aloha.. is this a joke?</h1>", "<h1>ok, this is a joke</h1>"];
                    }

                    //console.log("[follow]"+seeProfName);
                    }

                    myRandAnswer = getMessage(messages);
                    $("#section-two").html(myRandAnswer);

                    //console.log("trying to follow/unfollow");
                    return false;
                  }
                });
                  $("#section-three").one('click',function()
                {
                  if(window.localStorage.getItem("forProfile") == 1)
                  {
                  return false;
                  }
                });
                  $("#section-four").one('click',function()
                {
                  if(window.localStorage.getItem("forProfile") == 1)
                  {
                  var seeProfName = window.localStorage.getItem("seeProfName");
                  window.localStorage.setItem('history', 'profileMenu');
                  window.localStorage.setItem('historyPMen', seeProfName);

                  $("#infiniteScrollModal").css({"display":"none"});
                  $("#dasModal").css({"display":"block"});
                  $('.close').css({"top":"6.5rem"});

                  $("#dasModal").html(""+
                    "<div class='fSvgResH'>"+
                    "<p class='fSvgResUn'> <br/> </p>"+
                    "<p class='fSvgResCL'> Sending a message to "+seeProfName+"</p> "+
                    "<div id='modalChangeMyDesc' class='feedCommentForm' style='display:block !important;'>"+
                    "<input id='myNewMsg' class='feedCommentInput' type='text' placeholder='"+myRandFubar+"'>"+
                    "<input id='myNewMsgSender' class='feedCommentBtn' type='button' value='> SEND <'>"+
                    "</div> </div> ");

                  $("#myNewMsgSender").click(function(){
                    myMsg = $("#myNewMsg").val();
                    var arr = {canYou:"letMeSendAMsg", myName:window.localStorage.getItem("loggedAs"), myMsg: myMsg, myMsgIsGoingTo:seeProfName, tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform};
                    identify(arr);

                    $modal = $('.modal-frame');
                    $overlay = $('.modal-overlay');
                    window.localStorage.setItem("modal", 0);
                    $overlay.removeClass('state-show');
                    $modal.removeClass('state-appear').addClass('state-leave');

                    return false;
                  });

                  //console.log("message");
                  return false;
                }
                });
                  $("#last").one('click',function()
                {
                  if(window.localStorage.getItem("forProfile") == 1)
                  {
                  return false;
                }
                });

              }

            }
            if(typeof obj.datPostRes !="undefined")
            {
              $("#dasModal").html("");
              var arr = obj.datPostRes;

                function getMessage(messages) {
                   return messages[Math.floor(Math.random() * messages.length)];
                }
              for (i in arr)
             {
               theImg = "";
               if(arr[i].fullIPage == 1)
               {
                 theImg = '<img class="imagesThatAppearInModals" src="'+arr[i].imgpath+'" >';
               }
               $("#dasModal").append("<div class='fSvgResH'>"+ theImg +" <p class='fSvgResD' id='mSvgResD"+i+"'> <br/> "+arr[i].idesc+"</p> <p class='fSvgResCL' style='font-size:0.7rem' id='mSvgResCL"+i+"' data-img='"+arr[i].imgpath+"' data-i='"+i+"'>[[ "+arr[i].commentsC+" comments. ]]</p> <div id='modalComments"+i+"' class='feedCommentsHolder'>");


               var carr = arr[i].commentsForUrDelight;
               for (n in carr)
               {
               $("#modalComments"+i).append("<p> <span id='mp"+i+"comment"+n+"' data-uname='"+carr[n].commenter+"'>@"+carr[n].commenter+"</span> "+carr[n].comment+"</p>");
               $("#mp"+i+"comment"+n).click(function(){
                 window.localStorage.setItem("history", "feed");
                 gtlink = $(this).data("uname");
                 $("#profileName").html("<div id='callProfAction' class='arrow' data-seeProf='"+gtlink+"'>@"+gtlink+"</div>");
                 var arr = {canYou:"showMeSomeProfile", myName:window.localStorage.getItem("loggedAs"), seeProfile:gtlink, tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform, proffset: 0};
                 identify(arr);
                 $modal = $('.modal-frame');
                 $overlay = $('.modal-overlay');
                 $overlay.removeClass('state-show');
                 $modal.removeClass('state-appear').addClass('state-leave');
                 return false;

               })

               }

               $("#dasModal").append("</div> <div id='modalComForm"+i+"' class='feedCommentForm' style='display:block !important;'> <input id='mcfInput"+i+"' class='feedCommentInput' data-i='"+i+"' type='text' placeholder='You can say something!'> <input id='mcfButton"+i+"' data-i='"+i+"' data-img='"+arr[i].imgpath+"' class='feedCommentBtn' type='button' value='> send <'>  </div> </div> ");

               $("#mcfInput"+i).click(function()
               {
                 window.scrollTo(0,0);
               })

               $("#mSvgResD"+i).shorten();

               if(arr[i].commentsC == 0)
               {
               var messages = ["[[nothing yet]]", "[[Error 404]]", "[[No comments yet :(]]", "[[Be the first to comment this!]]", "[[Nobody has said anything yet!]]", "[[So, what do you think :) ?]]"];
               myRandRet = getMessage(messages);
               $("#mSvgResCL"+i).html("[["+myRandRet+"]]");
               }
               if(arr[i].commentsC == 1)
               {
                 var messages = ["[[1 comment!]]", "[[Hurry, you can be the second!]]", "[[Somebody wrote something!]]", "[[There's exactly 1 comment!]]", "[[At least 1 comment!]]", "[[0 Comments!.. 1 Now!]]"];
                 myRandRet = getMessage(messages);
                 $("#mSvgResCL"+i).html("[["+myRandRet+"]]");
               }

               theLevel = "";
               if(typeof arr[i].yourMark != "undefined")
               {
                 theLevel= "level"+arr[i].yourMark;
               }


               if(arr[i].feedUName !== window.localStorage.getItem("loggedAs"))
               {
               warningIcon = "<span class='circleSpanBase csbWarning' data-img='"+arr[i].imgpath+"' id='anotherKindOfAlertOurTeamAbout"+i+"'></span>";
               }
               else
               {
                 warningIcon = "<span class='circleSpanBase csbDeleteLocked' data-img='"+arr[i].imgpath+"' id='thisIsTheDeleteButtonNumber"+i+"'></span>";
               }

               $("#mSvgResCL"+i).append(warningIcon + "<span class='circleSpanCounter "+theLevel+"' id='feedCsp"+theLevel+"' data-postPh='"+arr[i].imgpath+"'>"+arr[i].totalVibes+"</span>");

               $("#thisIsTheDeleteButtonNumber"+i).click(function(){
                 if($(this).hasClass('csbDeleteUnlocked'))
                 {
                   imgImAlerting = $(this).data("img");
                   theImg = imgImAlerting.substring(imgImAlerting.lastIndexOf('/')+1);
                   var arr = {canYou:"wellYeahIWantUToUndoMyShit", myName:window.localStorage.getItem("loggedAs"), postImage: theImg, tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform};
                   identify(arr);
                   $modal = $('.modal-frame');
                   $overlay = $('.modal-overlay');
                   window.localStorage.setItem("modal", 0);
                   $overlay.removeClass('state-show');
                   $modal.removeClass('state-appear').addClass('state-leave');
                 }
                 if($(this).hasClass('csbDeleteLocked'))
                 {
                   $(this).addClass('csbDeleteUnlocked');
                   $(this).removeClass('csbDeleteLocked');
                 }
                 //console.log("delClicked!");
               });


               $("#anotherKindOfAlertOurTeamAbout"+i).click(function(){
                 imgImAlerting = $(this).data("img");
                 theImg = imgImAlerting.substring(imgImAlerting.lastIndexOf('/')+1);
                 var arr = {canYou:"listenToMeCarefully", myName:window.localStorage.getItem("loggedAs"), postImage: theImg, tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform};
                 identify(arr);
               });

               $("#postEyeSee"+i).click(function(){
                 imgIWannaSee = $(this).data("img");

                 var img = document.createElement("IMG");
                 img.src = imgIWannaSee;
                 $('#picViewerFull').html(img);

                 $('#picViewerFull').show().delay(5000).queue(function(n) {
                   $('#picViewerFull').hide();
                   n();
                 });

                 //console.log("you are trying to see "+imgIWannaSee)
               })

               if(arr[i].feedUName !== window.localStorage.getItem("loggedAs"))
               {
               $("#mSvgResCL"+i).append("<input type='button' id='lbutton"+i+"' data-i='"+arr[i].imgpath+"' class='hrtButton'>");

               $("#lbutton"+i).bind('touchstart mousedown', function(event) {
                 $(".mood-listitem").removeClass('active');
                 var obj = event.target;
                 obj = $(this);
                 // | great thingie by mboeckle / khanhvdv
                 //http://stackoverflow.com/questions/12925585/get-element-on-touchstart
                 $("#thatThing").css({"display":"block"});
                 $("#header").css({"display":"none"});

                  window.localStorage.setItem("gonnaVoteFor", $(this).data("i").substring($(this).data("i").lastIndexOf('/')+1));
                  getThatThingOutOfThere();
                  window.localStorage.setItem("history", "thatThing");

                  event.preventDefault();
                  return false;
               });

               }

               $("#mcfButton"+i).click(function(){
                 ifuri = $(this).data("img");
                 gbt = $(this).data("i");
                 commentVal = $("#mcfInput"+gbt).val();
                 iname = ifuri.substring(ifuri.lastIndexOf('/')+1);
                 if (commentVal.replace(/\s/g, '').length)
                 {
                 var arr = {canYou:"letMeCommentAPost", myName:window.localStorage.getItem("loggedAs"), postImage: iname, myComment:commentVal, tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform, gbt: 150000000};
                 identify(arr);
                 $("#mcfInput"+gbt).val("");
                 $("#modalComments"+gbt).append("<p> <span>@"+window.localStorage.getItem("loggedAs")+"</span> "+commentVal+"</p>");
                 }
               });

            }
          }

          if (typeof obj.vibeOMeter != "undefined")
          {
            $("#header").css({"display":"block"});
            s = Snap("#header");
            pulsar = s.select('#pulsar');

            if(obj.vibeOMeter == 0)
            {
              pulsar.attr({"stroke":"#003440"});
            }
            if(obj.vibeOMeter == 1)
            {
              pulsar.attr({"stroke":"#07aeb0"});
            }
            if(obj.vibeOMeter == 2)
            {
              pulsar.attr({"stroke":"#1acf80"});
            }
            if(obj.vibeOMeter == 3)
            {
              pulsar.attr({"stroke":"#73de3f"});
            }
            if(obj.vibeOMeter == 4)
            {
              pulsar.attr({"stroke":"#b7f808"});
            }
            if(obj.vibeOMeter == 5)
            {
              pulsar.attr({"stroke":"#f8ea08"});
            }
            if(obj.vibeOMeter == 6)
            {
              pulsar.attr({"stroke":"#f1ab00"});
            }
            if(obj.vibeOMeter == 7)
            {
              pulsar.attr({"stroke":"#f77a0c"});
            }
            if(obj.vibeOMeter == 8)
            {
              pulsar.attr({"stroke":"#b80808"});
            }
            if(obj.vibeOMeter == 9)
            {
              pulsar.attr({"stroke":"#bd2867"});
            }
            if(obj.vibeOMeter == 10)
            {
              pulsar.attr({"stroke":"#a91bb0"});
            }

          }


          if (typeof obj.uCanDiscoverThemPpz != "undefined")
          {
            //console.log("notifications toglged");
            window.localStorage.setItem("history", "notifications");
            var arr = obj.uCanDiscoverThemPpz;
            $vibes = $("#vibes");
            $vibes.html("");


            for (i in arr)
            {
              $vibes.append(""+
              "<div class='notifHolder' id='potif"+i+"' data-raction='1' data-actionTo='"+arr[i].themUserNamz+"'>"+
              "<div class='notifPPHolder'> <div class='cropSRes' id='notifProfileP"+i+"'> </div> </div>"+
              "<p>"+arr[i].themUserNamz+" <br/> "+arr[i].themReelzNamz+" "+
              "</p> </div>")
              $("#notifProfileP"+i).css({"background-image":'url("'+arr[i].avatar+'")'});

              $("#potif"+i).click(function (){
                window.localStorage.setItem("history", "notifications");
                //PROFILES

                  //console.log("got here")
                  var seekProfile = $(this).data("actionto");
                  $("#profileName").html("<div id='callProfAction' class='arrow' data-seeProf='"+seekProfile+"'>@"+seekProfile+"</div>");
                  $("#callProfAction").click (function()
                  {
                    seeProf = seekProfile;
                    callDaProfileMenu(seeProf);
                    //console.log(seeProf);
                    }
                  );
                  var arr = {canYou:"showMeSomeProfile", myName:window.localStorage.getItem("loggedAs"), seeProfile: seekProfile, tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform, proffset:0};
                  identify(arr);
                  $("#vibes").css({"display":"none"});
                  $("#profile").css({"display":"block"});


                // POSTS


                //TO DO!

            });


          }
        }

          if (typeof obj.notifRes != "undefined")
          {
            //console.log("notifications toglged");
            var arr = obj.notifRes;
            $vibes = $("#vibes");
            $vibes.html("");
            $vibes.append(""+
            "<div class='notifHolder' id='discoverPplzClickable' >"+
            "<p style='width:100% !important; margin: 0.5rem auto !important;'> Discover people? <br/> </p>"+
            "</div>");
            $("#discoverPplzClickable").click(function (){
              window.localStorage.setItem("history", "notifications");
              //PROFILES

                //console.log("got here")

//                $("#profileName").html("<div id='callProfAction' class='arrow' data-seeProf='"+seekProfile+"'>@"+seekProfile+"</div>");
//                $("#callProfAction").click (function(){
//                  seeProf = seekProfile;
//                  callDaProfileMenu(seeProf);
//                  console.log(seeProf);
//                });
                var arr = {canYou:"makeMeDiscoverPpz", myName:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform};
                identify(arr);
                $("#vibes").css({"display":"block"});
              });


            for (i in arr)
            {
              $vibes.append(""+
              "<div class='notifHolder' id='notif"+i+"' data-raction='"+arr[i].isUsableFor+"' data-actionTo='"+arr[i].withThis+"'>"+
              "<div class='notifPPHolder'> <div class='cropSRes' id='notifProfileP"+i+"'> </div> </div>"+
              "<p>"+arr[i].nText+" <br/>"+
              "<time class='timeago' datetime='"+arr[i].notifOn+"'>"+arr[i].on+"</time>"+
              "</p> </div>")
              $("#notifProfileP"+i).css({"background-image":'url("https://kollaj.net/uploads/'+arr[i].notifImage+'")'});

              $("#notif"+i).click(function (){
                window.localStorage.setItem("history", "notifications");
                //PROFILES
                if($(this).data("raction") == 1)
                {
                  //console.log("got here")
                  var seekProfile = $(this).data("actionto");
                  $("#profileName").html("<div id='callProfAction' class='arrow' data-seeProf='"+seekProfile+"'>@"+seekProfile+"</div>");
                  $("#callProfAction").click (function()
                  {
                    seeProf = seekProfile;
                    callDaProfileMenu(seeProf);
                    //console.log(seeProf);
                    }
                  );
                  var arr = {canYou:"showMeSomeProfile", myName:window.localStorage.getItem("loggedAs"), seeProfile: seekProfile, tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform, proffset:0};
                  identify(arr);
                  $("#vibes").css({"display":"none"});
                  $("#profile").css({"display":"block"});
                }

                // POSTS
                if ($(this).data("raction") == 3 || $(this).data("raction") == 2  )
                bringInThePostSeeWindow($(this).data("actionto"));
                });

                //TO DO!

            }
            jQuery("time.timeago").timeago();

          }

            if (typeof obj.feedRes != "undefined")
            {
              var arr = obj.feedRes;

              function calcDistance(x1, y1, x2, y2) {
              return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
              }
              document.getElementById("feedRes").innerHTML = "";
              // found on stack @http://stackoverflow.com/questions/31825807/how-do-i-clear-an-snap-svg-canvus-after-snap-load by Lin Yuan

              //Crossbrowser window Width
              var width = document.getElementById("feedRes").clientWidth;
              //Crossbrowser window Height
              //Clear everything beforehand
              $("#feedRes").html("");
              var i =0;
              function welderEmbeddedFP (ih, iw, ix, iy, iURI, m1, m2, ang, scl, itx, ity, i, feedUname)
              {
                var height = document.getElementById("FeedSVG"+i).clientHeight;
                var s = Snap("#FeedSVG"+i);
                s.clear();//just add this piece of magic....
                var myImg = s.image(iURI, ix, iy, iw, ih);
                var mask1=s.path(m1).attr({fill:"white"});
                var mask2=s.path(m2).attr({fill:"white"});
                var maskGroups = s.group()

                maskGroups.add(mask1);
                maskGroups.attr({fill: "white"});

                finalGroup = s.group(maskGroups, myImg);

                myImg.attr({mask: maskGroups})
                maskGroups.attr({mask: mask2});

                maxWidth = width;
                scaleF = maxWidth/iw;
                lftDis = itx*scaleF;
                topDis = ity*scaleF;
                absXCenter = (width/2);
                absYCenter = (height/2);

                var bb = finalGroup.getBBox();
                var diffX = absXCenter - bb.cx;
                var diffY = absYCenter - bb.cy;

                finalGroup.transform('T' + diffX + ',' + diffY + 'S'+scaleF+'R'+ang);

                moveGroup=s.group(finalGroup);

                  var bb = moveGroup.getBBox();
                  moveGroup.attr({id:"fg"+i});
                  //M10 10 H 90 V 90 H 10 L 10 10
                  moveGroup.attr({"data-img":iURI})
                  moveGroup.attr({class:"gardar"});

                  if(feedUname !== window.localStorage.getItem("loggedAs"))
                  {
                     var tapped = false;
                     var pressTimer = "";
                  $("#fg"+i).bind('touchstart mousedown', function(event) {
                    gnStartX = event.pageX;
                    gnStartY = event.pageY;
                    if (gnStartX == null)
                    {
                      gnStartX = event.touches[0].pageX;
                      gnStartY = event.touches[0].pageY;
                    }

                    // http://stackoverflow.com/questions/24058241/touch-device-single-and-double-tap-events-handler-jquery-javascript
                    if(!tapped){ //if tap is not set, set up single tap
                      tapped=setTimeout(function(){
                          tapped=null
                          //insert things you want to do when single tapped
                      },300);   //wait 300ms then run single click code
                    } else {    //tapped within 300ms of last tap. double tap
                      clearTimeout(tapped); //stop single tap callback
                      tapped=null;
                      //console.log("doubleTap! @"+gnStartX+","+gnStartY+" and "+$(this).data("img"));
                      //insert things you want to do when double tapped
                    }

                    pressTimer = window.setTimeout(function () {
                      window.localStorage.setItem("gonnaVoteFor", iURI.substring(iURI.lastIndexOf('/')+1));
                      $("#thatThing").css({"display":"block"});
                      $("#header").css({"display":"none"});
                      getThatThingOutOfThere();
                      window.localStorage.setItem("history", "thatThing");
                    }, 450)
                  });
                  $("#fg"+i).bind('touchmove mousemove', function(event) {
                    gnEndX = event.pageX;
                    gnEndY = event.pageY;
                    if (gnEndX == null)
                    {
                      gnEndX = event.touches[0].pageX;
                      gnEndY = event.touches[0].pageY;
                    }

                    if(calcDistance(gnStartX, gnStartY, gnEndX, gnEndY)>20)
                    {
                      //console.log(gnStartX+","+gnStartY+"\n"+gnEndX+","+gnEndY);
                      //console.log(">20pxMove, cancel")
                    clearTimeout(pressTimer);
                    }

                  });
                  $("#fg"+i).bind('touchend touchcancel mouseup', function(event) {
                    clearTimeout(pressTimer);
                  });
                  }
              return false;
              }

              function getMessage(messages) {
                 return messages[Math.floor(Math.random() * messages.length)];
              }

                 for (i in arr)
                {
                  theLevel = "";
                  if(typeof arr[i].yourMark != "undefined")
                  {
                    theLevel= "level"+arr[i].yourMark;
                  }
                  //feed
                  counter ="<span class='circleSpanCounter "+theLevel+"' id='postCsp"+i+"' data-postPh='"+arr[i].imgpath+"'>"+arr[i].totalVibes+"</span> ";

                  sfimg = arr[i].fullIPage;
                  if (sfimg == 1)
                  {
                    eyeIcon="<span class='circleSpanBase csbEye' id='feedEyeSee"+i+"' data-img='"+arr[i].imgpath+"'> </span>";

                  }

                  if (sfimg == 0)
                  {
                    eyeIcon="<span class='circleSpanBase csbEye-Off'> </span>";
                  }
                  if(arr[i].feedUName !== window.localStorage.getItem("loggedAs"))
                  {
                  warningIcon = "<span class='circleSpanBase csbWarning' data-img='"+arr[i].imgpath+"' id='alertOurTeamAbout"+i+"'></span>";
                  }
                  else {
                    warningIcon = "";
                  }
                  icons = counter + " " + eyeIcon;
                  $("#feedRes").append("<div class='fSvgResH'><svg id='FeedSVG"+i+"' class='feedSvgItem' data-img='"+arr[i].imgpath+"'></svg> <p class='fSvgResUn'>"+warningIcon+" <span id='frSvgResUn"+i+"' data-uname='"+arr[i].feedUName+"'>@"+arr[i].feedUName+"</span> "+icons+" </p> <p class='fSvgResD' id='fSvgResD"+i+"'> "+arr[i].idesc+"</p> <p class='fSvgResCL' id='fSvgResCL"+i+"' data-img='"+arr[i].imgpath+"' data-i='"+i+"'>[[ "+arr[i].commentsC+" comments. ]]</p> <div id='feedComments"+i+"' class='feedCommentsHolder'></div> <div id='feedComForm"+i+"' class='feedCommentForm'> <input id='fcfInput"+i+"' class='feedCommentInput' data-i='"+i+"' type='text' placeholder='You can say something!'> <input id='fcfButton"+i+"' data-i='"+i+"' data-img='"+arr[i].imgpath+"' class='feedCommentBtn' type='button' value='> send <'>  </div> </div> ");
                  $("#postCsp"+i).click(function(){
                    imgImRequing = $(this).data("postph");
                    theImg = imgImRequing.substring(imgImRequing.lastIndexOf('/')+1);
                    var arr = {canYou:"letMeBeSneaky", myName:window.localStorage.getItem("loggedAs"), postImage: theImg, tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform};
                    identify(arr);
                    $('#vibeView').css({"display":"block"});
                    window.localStorage.setItem("history", "feed");

                  });

                  $("#fSvgResD"+i).shorten();

                  $("#alertOurTeamAbout"+i).click(function(){
                    imgImAlerting = $(this).data("img");
                    theImg = imgImAlerting.substring(imgImAlerting.lastIndexOf('/')+1);
                    var arr = {canYou:"listenToMeCarefully", myName:window.localStorage.getItem("loggedAs"), postImage: theImg, tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform};
                    identify(arr);
                    window.localStorage.setItem("history", "feed");
                  });

                  $("#feedEyeSee"+i).click(function(){
                    imgIWannaSee = $(this).data("img");

                    var img = document.createElement("IMG");
                    img.src = imgIWannaSee;
                    $('#picViewer').html(img);
                    $('#feedRes').css({"opacity":"0"});
                    $('#searchF').css({"opacity":"0"});
                    $('#picViewer').show().delay(5000).queue(function(n) {
                      window.localStorage.setItem("history", "feed");
                      $('#picViewer').hide();
                      $('#feedRes').css({"opacity":"1"});
                      $('#searchF').css({"opacity":"1"});
                      n();
                    });

                    //console.log("you are trying to see "+imgIWannaSee)
                  })

                  if(arr[i].commentsC == 0)
                  {
                  var messages = ["[[nothing yet]]", "[[Error 404]]", "[[No comments yet :(]]", "[[Be the first to comment this!]]", "[[Nobody has said anything yet!]]", "[[So, what do you think :) ?]]"];
                  myRandRet = getMessage(messages);
                  $("#fSvgResCL"+i).html(myRandRet);
                  }
                  if(arr[i].commentsC == 1)
                  {
                    var messages = ["[[1 comment!]]", "[[Hurry, you can be the second!]]", "[[Somebody wrote something!]]", "[[There's exactly 1 comment!]]", "[[At least 1 comment!]]", "[[0 Comments!.. 1 Now!]]"];
                    myRandRet = getMessage(messages);
                    $("#fSvgResCL"+i).html(myRandRet);
                  }

                  $("#fcfButton"+i).click(function(){
                    ifuri = $(this).data("img");
                    gbt = $(this).data("i");
                    commentVal = $("#fcfInput"+gbt).val();
                    if (commentVal.replace(/\s/g, '').length)
                    {
                    iname = ifuri.substring(ifuri.lastIndexOf('/')+1);
                    $("#fcfInput"+gbt).val("");
                    var arr = {canYou:"letMeCommentAPost", myName:window.localStorage.getItem("loggedAs"), postImage: iname, myComment:commentVal, tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform, gbt: gbt};
                    identify(arr);
                    }

                  });

                  $("#frSvgResUn"+i).click(function(){
                    gtlink = $(this).data("uname");
                    $("#profileName").html("<div id='callProfAction' class='arrow' data-seeProf='"+gtlink+"'>@"+gtlink+"</div>");
                    var arr = {canYou:"showMeSomeProfile", myName:window.localStorage.getItem("loggedAs"), seeProfile:gtlink, tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform, proffset: 0};
                    identify(arr);
                    return false;
                  })

                  $("#fSvgResCL"+i).click(function(){
                    ifuri = $(this).data("img");
                    gbt = $(this).data("i");
                    iname = ifuri.substring(ifuri.lastIndexOf('/')+1);

                    if ($("#feedComments"+gbt).data("toggled") == 1)
                    {
                    $("#feedComForm"+gbt).slideToggle();
                    $("#feedComments"+gbt).slideToggle();
                    $("#feedComments"+gbt).data( "toggled", 0)
                    }
                    else {
                      var arr = {canYou:"giveMeTheCommentsOfThisPost", myName:window.localStorage.getItem("loggedAs"), postImage: iname, tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform, gbt: gbt};
                      identify(arr);
                    }
                    return false;
                  });
                  welderEmbeddedFP (arr[i].imgH, arr[i].imgW, arr[i].imgX, arr[i].imgY, arr[i].imgpath, arr[i].mask1, arr[i].mask2, arr[i].angle, arr[i].scale, arr[i].tx, arr[i].ty, i, arr[i].feedUName );
                }
                croffset = window.localStorage.getItem("roffset");
                croffset++;
                croffset = window.localStorage.setItem("roffset", croffset);

                function getMessage(messages) {
                   return messages[Math.floor(Math.random() * messages.length)];
                }

                var nDescStrng = ["I Want More", "nah, not enough", "MORE!", "[[click here for more]]", "this is where you click", "**kollaj is a meme**", "just tap here", "DO NOT PRESS THE BUTTON"];
                myRandFubar = getMessage(nDescStrng);

                $("#feedRes").append("<div id='growMyFeed' class='fSvgResH'> <p class='fSvgResUn'> "+myRandFubar+" </p> </div>");
                $("#growMyFeed").click(function(){
                  var arr = {canYou:"showMeMyFeed", myName:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform, roffset:window.localStorage.getItem("roffset")};
                  identify(arr);
                })

            }

            if (typeof obj.thePpzDatVibedDatCut != "undefined")
            {
              hist=window.localStorage.getItem("history");
              if (hist=="feed")
              {
                $("#feedRes").css({"display":"none"});
                $appendable = $("#vibeView");
                $appendable.html("");
                  arr = obj.thePpzDatVibedDatCut;
                  for (i in arr)
                  {
                    $appendable.append(""+
                    "<div class='notifHolder' id='usrVibedPostRes"+i+"' data-openuser='"+arr[i].vibedBy+"'>"+
                    "  <div class='notifPPHolder'>"+
                    "    <div class='cropSRes' id='usrVibedPostResImg"+i+"' > </div>"+
                    "  </div>"+
                    "  <p>@"+arr[i].vibedBy+"</p>"+
                    "</div>");

                    $("#usrVibedPostResImg"+i).css({"background-image":"url('https://kollaj.net/uploads/"+arr[i].usrAvatar+"')"});

                     // child: searchResCLICK
                     $("#usrVibedPostRes"+i).click(function(){
                       var seekProfile = $(this).data("openuser");
                       //console.log(seekProfile);
                       $("#profileName").html("<div id='callProfAction' class='arrow' data-seeProf='"+seekProfile+"'>@"+seekProfile+"</div>");
                       $("#callProfAction").click (function()
                       {
                         seeProf = seekProfile;
                         callDaProfileMenu(seeProf);
                       });
                       var arr = {canYou:"showMeSomeProfile", myName:window.localStorage.getItem("loggedAs"), seeProfile: seekProfile, tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform, proffset:0};
                       identify(arr);
                       $("#profile").css({"display":"block"});
                       $("#vibeView").css({"display":"none"});
                       $("#feed").css({"display":"none"});
                     });

                  }
              }
            }

            if (typeof obj.seeRes != "undefined") {



              var arr = obj.seeRes;
              var dataArray = new Array;
              for(var o in arr) {
                dataArray.push(arr[o]);
                }
              $("#feed").css({"display":"none"});
              $("#profile").css({"display":"block"});

              $("#profileName").html("<div id='callProfAction' class='arrow' data-seeProf='"+obj.seeing+"'>@"+obj.seeing+"</div>");

              $("#callProfAction").click (function()
              {
                seeProf = obj.seeing;
                callDaProfileMenu(seeProf);
                //console.log(seeProf);
                }
              );

              $("#profileFollowing").html(obj.following);
              $("#profileFollowers").html(obj.followers);

              if(obj.iFollow == 1)
              {
                $("#profileFollowers").data( "uname", obj.seeing)
                $("#profileFollowers").data( "iFollow", obj.iFollow);
                $("#profileFollowers").css({"background":"rgba(100, 149, 237, 0.7)"})
                $("#profileFollowers").css({"color":"ghostwhite"})
              }
              if(obj.iFollow == 0)
              {
                $("#profileFollowers").data( "uname", obj.seeing);
                $("#profileFollowers").data( "iFollow", obj.iFollow);
                $("#profileFollowers").css({"background":"white"})
                $("#profileFollowers").css({"color":"#003440"})
              }
              if(obj.followsMe == 1)
              {
                $("#profileFollowing").data( "uname", obj.seeing)
                $("#profileFollowing").data( "followsMe", obj.followsMe);
                $("#profileFollowing").css({"background":"rgba(193, 4, 53, 0.7)"})
                $("#profileFollowing").css({"color":"ghostwhite"})
              }
              if(obj.followsMe == 0)
              {
                $("#profileFollowing").data( "uname", obj.seeing);
                $("#profileFollowing").data( "followsMe", obj.followsMe);
                $("#profileFollowing").css({"background":"white"})
                $("#profileFollowing").css({"color":"#003440"})
              }

              if (obj.seeingSame == 1)
              {
                var karr = {canYou:"getMyKollajDistance", myName:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid};
                identify(karr);
              }


              if (obj.seeingSame < 1)
              {
              //  console.log("not ur p");
              $("#profileFollowing").click(function()
              {
              seekProfile = $(this).data("uname");
              followsMe = $(this).data("followsMe");
              if (followsMe == 1)
              {
              var arr = {canYou:"showMeWhoDoTheyFollow", myName:window.localStorage.getItem("loggedAs"), seeProfile: seekProfile, tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform};
              identify(arr);
//              $("#profile").css({"display":"block"});
              }
              return false;
              });
              $("#profileFollowers").one('click',function()
              {
              seekProfile = $(this).data("uname");
              iFollow = $(this).data("iFollow");
              if (iFollow == 1)
              {
              var arr = {canYou:"makeMeUnfollowThem", myName:window.localStorage.getItem("loggedAs"), seeProfile: seekProfile, tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform};
              identify(arr);

//              $("#profile").css({"display":"block"});
              }
              if (iFollow == 0)
              {
              var arr = {canYou:"letMeFollowThem", myName:window.localStorage.getItem("loggedAs"), seeProfile: seekProfile, tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform};
              identify(arr);

//              $("#profile").css({"display":"block"});
              }
              return false;
              });
              }

              function calcDistance(x1, y1, x2, y2) {
              return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
              }
              $("#profileSVG").css({"height":"100%"});
              document.getElementById("profileSVG").innerHTML = "";
              window.localStorage.setItem("originalHeight", document.getElementById("profileSVG").clientHeight);
              var OHght = window.localStorage.getItem("originalHeight");




              var s = Snap("#profileSVG");
              s.clear();//just add this piece of magic....
              // found on stack @http://stackoverflow.com/questions/31825807/how-do-i-clear-an-snap-svg-canvus-after-snap-load by Lin Yuan


              //Crossbrowser window Width
              var width = document.getElementById("profileSVG").clientWidth;
              //Crossbrowser window Height
              var height = document.getElementById("profileSVG").clientHeight;


              var sprivate = 1;
              var text = s.text(30, 50, "This Kollaj is private.");
              var text2 =s.text(30, 90, "Try following them ;) !");
                text.attr({
                    'font-size':"1.5rem"
                  });
              text2.attr({
                      'font-size':"1.5rem"
                    });
                    var cordx = new Array;
                    var cordy = new Array;
                    var cordI = new Array;
                    var i =0;
                    var lasTopDis = 0;
              function welderEmbeddedSP (ih, iw, ix, iy, iURI, m1, m2, ang, scl, itx, ity)

              {
                var OHght = window.localStorage.getItem("originalHeight");
                var myImg = s.image(iURI, ix, iy, iw, ih);
                var mask1=s.path(m1).attr({fill:"white"});
                var mask2=s.path(m2).attr({fill:"white"});
                var maskGroups = s.group()

                maskGroups.add(mask1);
                maskGroups.attr({fill: "white"});

                finalGroup = s.group(maskGroups, myImg);

                myImg.attr({mask: maskGroups})
                maskGroups.attr({mask: mask2});

                maxWidth = width - (width/9);
                scaleF = maxWidth/iw;
                lftDis = itx*scaleF;
                topDis = ity*scaleF;
                absXCenter = (width/2);
                absYCenter = (OHght/2);

                if (lasTopDis < topDis)
                {
                lasTopDis = topDis;
                }

                var bb = finalGroup.getBBox();
                var diffX = absXCenter - bb.cx;
                var diffY = absYCenter - bb.cy;

                finalGroup.transform('T' + diffX + ',' + diffY + 'S'+scaleF+'R0');

                moveGroup=s.group(finalGroup).attr({style:"border:3px solid white"});
                //          console.log("first move, follow secondmove");
                moveGroup.transform('t' + lftDis + ',' + topDis + 's'+scl+'r'+ang);

                if(i == obj.seeRes.length - 1)
                {
                  nH = parseInt(lasTopDis) + 780;
                  window.localStorage.setItem("profileSVGHeight", nH);
                  $("#profileSVG").css({"height":nH+"px"});
                  //console.log("puttint it @"+nH);
                  if (i > 13)
                  {
                      var textSm = s.text(30, (lasTopDis + 400), "click to load more..");
                      textSm.attr({
                          'font-size': "1.5rem",
                          'stroke': 'white',
                          'strokeWidth': 1,
                          'id': "loadMoreSProfile"
                      });
                      $("#loadMoreSProfile").click(function () {
                          var arr = { canYou: "showMeSomeProfile", myName: window.localStorage.getItem("loggedAs"), seeProfile: obj.seeing, tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform: device.platform, proffset: obj.proffset };
                          identify(arr);
                      });

                  }
                }

/*
                moveGroup.click(function(evt){
                  pt.x = evt.clientX;
                  pt.y = evt.clientY;
                  console.log(pt.x + "\n"+pt.y )
/                  seekProfile = $(this).data("uname");
                  $("#profileName").html("@"+seekProfile);
                    var arr = {canYou:"showMeSomeProfile", myName:window.localStorage.getItem("loggedAs"), seeProfile: seekProfile, tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform};
                    identify(arr);
                  $("#profile").css({"display":"block"});
/
                  console.log(this.data("img"));
                  return false;
                });
*/

                if (i==0)
                {
                 moveGroup.remove()
              //    document.getElementById("whereuputurppic").innerHTML = "";
                 $("#whereuputurppic").css({"background-image":'url("'+iURI+'")'});
                }
                else
                {
                  var bb = moveGroup.getBBox();
                  moveGroup.attr({id:"g"+i});
                  //M10 10 H 90 V 90 H 10 L 10 10
                  moveGroup.attr({"data-img":iURI})
                  moveGroup.attr({class:"gardar"});

                  cordx.push(bb.cx);
                  cordy.push(bb.cy);

                  iname = iURI.substring(iURI.lastIndexOf('/')+1);
                  cordI.push(iname);


                  if (obj.seeingSame < 1)
                  {


                  }

                }

                if (iw > 0 ) {sprivate = 0; }
                if (sprivate<1){
                    text.remove();
                    text2.remove();
                  }
                //          console.log("in place!?");

              return false;
              }


                 for (i in arr)
                {
                  welderEmbeddedSP (arr[i].imgH, arr[i].imgW, arr[i].imgX, arr[i].imgY, arr[i].imgpath, arr[i].mask1, arr[i].mask2, arr[i].angle, arr[i].scale, arr[i].tx, arr[i].ty );
                }
                commentsPoint=new Array;
                for (n in cordx)
                {
                  commentsPoint[n] = s.circle(cordx[n], cordy[n], 25).attr({fill: "rgba(255,255,255, 0.05)"});
                  commentsPoint[n].attr({
                    stroke: "rgba(255,255, 255,0.4)",
                    strokeWidth: 2,
                    strokeDasharray: 4
                  })
                  commentsPoint[n].attr({"data-img":cordI[n]});
                  commentsPoint[n].attr({"id":"profileCommPtL"+n})
                  commentsPoint[n].click(
                    function ()
                    {
                      window.localStorage.setItem("history", "smProfile");
                      bringInThePostSeeWindow(this.attr("data-img"));
                    }
                  );
                }





              var myNewHeight=window.localStorage.getItem("profileSVGHeight");

              if (sprivate != "0")
              {
                var myNewHeight=window.localStorage.getItem("originalHeight");
              }

              //console.log ("got here but"+ myNewHeight+"px aint enough OR, sprivate is "+sprivate);

              $("#profileSVG").css({"height":myNewHeight+"px"});

            }

            if (obj.searchResult !== "")
            {
              var arr = obj.searchResult;
              var dataArray = new Array;
              for(var o in arr) {
                dataArray.push(arr[o]);
                }

              $("#searchRes").html("");

              for (i in dataArray)
              {
                $("#searchRes").append(" <div id='searchRes"+i+"' class='srid' data-uname='"+dataArray[i].username+"' >   <div class='pinfo'>" + dataArray[i].name + " <span class='psm'> @" + dataArray[i].username + " </span> </div>   <div class='searchResCnt'> <div class='cropSRes' id='cropSRes"+i+"'></div></div></div>");
                 $("#cropSRes"+i).css({"background-image":"url('"+dataArray[i].avatar+"')"});
                 $("#cropSRes"+i).addClass("cropSRes");
              }

              // child: searchResCLICK
              $(".srid").click(function(){
                window.localStorage.setItem("history", "search");
                var seekProfile = $(this).data("uname");
                $("#profileName").html("<div id='callProfAction' class='arrow' data-seeProf='"+seekProfile+"'>@"+seekProfile+"</div>");

                $("#callProfAction").click (function()
                {
                  seeProf = seekProfile;
                  callDaProfileMenu(seeProf);
                  //console.log(seeProf);
                  }
                );
                  var arr = {canYou:"showMeSomeProfile", myName:window.localStorage.getItem("loggedAs"), seeProfile: seekProfile, tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform, proffset:0};
                  identify(arr);
                $("#profile").css({"display":"block"});
              });

              return false;
            }

            if (obj.userAddError == 'addUser')
              {
              }

            if (obj.emailAddError == 'addEmail')
              {
              }

            if (obj.urFeeling == 'daNewGenerationArtisticShit')
              {
                window.localStorage.setItem("username", obj.urArtistName);
                //console.log(window.localStorage.getItem("sessHash"));
                location.reload();
              }
          }
        var result = "undefined";
        var saveData = $.ajax({
              type: "POST",
              url: "https://kollaj.net/bouncer.php",
              data: JSON.stringify(arr),
              dataType: "json",
              contentType: 'application/json',
              success: function(resultData){
              var obj = resultData;
              actionCall(obj);
              }
        });

        };

        //before anything else, logins
        // and registrations
        //regs first
        // but actually, we first verify if the user wasnt already logged in
        if (window.localStorage.getItem("loggedAs") !== null)
        {
        var arr = {canYou:"makeSureMeIsNotMiniMe", myName:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), devUuid: device.uuid, devModel: device.version, devPlatform:device.platform};
        identify(arr);
        }


        //defining variables
        var emailPass=0;
        var userPass=0;
        var pwPass=0;
        var tosCheck=0;

        // with some regex from http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
        function validateEmail(email) {
                var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            //if(re.test(email) && dbValEmail(myMail))
            if(re.test(email))
            { return true; }
            else
            { return false; }
        }
        // checkUp eMail @DB
        function dbValEmail (email)
        {
          var arr = {canYou:"emailCheck", myMail:email};
          identify(arr)
        }
        // checkUp userName @DB
        function dbValUname (uname)
        {
          var arr = {canYou:"userCheck", myName:uname};
          identify(arr)
          var re = /^@?([a-zA-Z0-9_]){1,17}$/;
          if (re.test(uname)) {
              return true
          }
          else {
              return false
          }
        }
        //emailPass
        $("#registerEmail").on("change paste keyup", function() {
           myMail=($(this).val());
            if(validateEmail(myMail))
            {
              dbValEmail(myMail)
              $(this).css({background:"rgba(0,255,0,0.4)"})
              emailPass=1;
            }
            else {
              $(this).css({background:"rgba(255,0,0,0.4)"})
              emailPass=0;
            }
        });
        //userPass
        $("#registerName").on("change paste keyup", function() {
           if( $("#registerName").val().length > 3 && dbValUname($(this).val()) ) {
             myUsername=($(this).val());
             userPass=1;
             $("#registerName").css({background:"rgba(0,255,0,0.4)"});
            }
            else {
              userPass=0;
              $("#registerName").css({background:"rgba(255,0,0,0.4)"})
            }
         });

         //pwPass
         $("#registerPassword").on("change paste keyup", function() {
            if( $("#registerPassword").val().length > 5) {
              myPass=($(this).val());
              pwPass=1;
              $("#registerPassword").css({background:"rgba(0,255,0,0.4)"});
             }
             else {
               pwPass=0;
               $("#registerPassword").css({background:"rgba(255,0,0,0.4)"})
             }
          });

        //registerButton click
        $("#registerButton").click(function(){
            var myUNRes = window.localStorage.getItem("unamePass");
            var myERes = window.localStorage.getItem("emailPass");
            if (myERes == "pass") { emailC = 1; } else { emailC = 0;}

          // send our stuff to DB
            if (myUNRes == "pass") { unC = 1; }

          if(emailC==1&&unC==1&&pwPass==1 && $('#tosCheck').is(':checked') )
          {
            //Here we register
              uname = $("#registerName").val();
              email = $("#registerEmail").val();
              password = $("#registerPassword").val();
              var renciptPass = keccak_384(password);
              var arr = { canYou: "makeMeDumpInstagram", myName: uname, myMail: email, myPass: renciptPass, devUuid: device.uuid, devModel: device.version, devPlatform: device.platform };
              identify(arr);
              $("#lipErrorText").slideUp(1000, "easeOutCirc");

            }
          else {
            $("#lipErrorText").slideDown(1000, "easeOutCirc");
          }
        });

        $("#goToReg").click(function(){
          $("#registerContainer").toggle();
          $("#linputContainer").toggle();
          window.localStorage.setItem("history", "loginContainer");
        });

        $("#showTOS").click(function(){
          $("#registerContainer").toggle();
          $("#tosContainer").toggle();
        });

        $("#tosNot").click(function(){
          $("#registerContainer").toggle();
          $("#tosContainer").toggle();
          $('#tosCheck').prop('checked', false);
        });

        $("#tosYes").click(function(){
          $("#registerContainer").toggle();
          $("#tosContainer").toggle();
          $('#tosCheck').prop('checked', true);
        });


        //LOGIN CHECKER WILL BE COMING HERE:
        $("#loginButton").click(function(){

          // checkUp loginInfo @DB
          function letMeIn(uname, password )
          {
            var landlordPass = keccak_384(password);
            var arr = {canYou:"letMeIn", myName:uname, myPass: landlordPass, devUuid: device.uuid, devModel: device.version, devPlatform:device.platform};
            identify(arr);
            return true;
          }

          if(letMeIn ($("#loginName").val(), $("#loginPassword").val()))
          {return true;}

        });

      //REGULAR SHITS HERE


      	  var h=$(window).height(),
      		w=$(window).width();
        $("#mainContainer").css({
          'width' : w+'px',
          'height' : h+'px'
          });

        var sendPicState = 0;
        var feedState = 0;
        var profileState = 0;
        var messageState = 0;
        var notificationState = 0;
        var chatState = 0;

//ok so the above variables are defining some initial states for a way to integrate jqueryUITabs with my secondary tabs.
//then for each we check:
// IF(#MenuItem is hidden) {menuItemState = hidden} else  {menuItemState = visible}
//and then
// IF(menuItemState == hidden) {#MenuItem.displayToggle}

        $("#feedLink").click(function(){
          window.localStorage.setItem("history", "feed");

          window.localStorage.setItem("modal", 0);
          $modal = $('.modal-frame');
          $overlay = $('.modal-overlay');
          $overlay.removeClass('state-show');
          $modal.removeClass('state-appear').removeClass('state-leave');

          $('#vibeView').css({"display":"none"});

          if($("#msg").is(":hidden")){messageState = 0}else{messageState = 1}
          if($("#vibes").is(":hidden")){notificationState = 0}else{notificationState = 1}
          if($("#chat").is(":visible")){chatState = 1}else{chatState = 0}

          if(messageState == 1) {$("#msg").toggle()};
          if(notificationState == 1) {$("#vibes").toggle()};
          if(chatState == 1) {$("#chat").css({"display":"none"});$(".chatbox").css({"display":"none"})};

          $("#profile").css({"display":"none"});
          $("#searchRes").css({"display":"none"});
          $("#feed").css({"display":"block"});
          $("#feedRes").css({"display":"block"});
          $("#mySvg").css({"display":"none"});

          var arr = {canYou:"showMeMyFeed", myName:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform, roffset:0};
          identify(arr);

        });

        //child: SEARCH

        $("#fsButton").click(function(){
          window.localStorage.setItem("history", "feed");
          $("#feedRes").css({"display":"none"});
          $("#searchRes").css({"display":"block"});
          $("#profile").css({"display":"none"});
          searchQuery = $("#searchQuery").val();
          var arr = {canYou:"findSmth", myName:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform, searchQuery:searchQuery};
          identify(arr);
        })
        $("#sendPicLink").click(function(){



            window.localStorage.setItem("modal", 0);
            $modal = $('.modal-frame');
            $overlay = $('.modal-overlay');
            $overlay.removeClass('state-show');
            $modal.removeClass('state-appear').removeClass('state-leave');




          if($("#msg").is(":hidden")){messageState = 0}else{messageState = 1}
          if($("#vibes").is(":hidden")){notificationState = 0}else{notificationState = 1}
          if($("#chat").is(":visible")){chatState = 1}else{chatState = 0}
          if($("#otherOptions").is(":visible")){otherOptsState = 1}else{otherOptsState = 0}
          if($("#profile").is(":visible")){profileState = 1}else{profileState = 0}

          if(messageState == 1) {$("#msg").toggle()};
          if(notificationState == 1) {$("#vibes").toggle()};
          if (chatState == 1) {
              $("#chat").css({ "display": "none" });
              $(".chatbox").css({ "display": "none" })
          };
          if(otherOptsState == 1) {$("#otherOptions").css({"display":"none"})};
           $("#profile").css({"display":"none"});
           $("#feed").css({ "display": "none" });

          $("#sendPicture").css({"display":"block"});
          $("#leNextStepper").css({"display":"block"});
          $("#detailsWindow").css({"display":"none"});
          
          document.getElementById("mySvg").innerHTML = "";
          $("#mySvg").css({ "opacity": "0" });
          $("#mySvg").css({ "display": "block" });
          $("#mySvg").css({ "height": "100%" });
          $("#mySvg").css({ "visibility": "visible" });

          var height = document.getElementById("mySvg").clientHeight;
          window.localStorage.setItem("originalHeight", height);

          $("#editorHolder").css({"display":"block"});
          $("#editorHolder").css({ "height": height + "px" });
          $("#editorHolder").css({ "visibility": "visible" });
          $("#editorHolder").css({ "opacity": "0" });

            //$("#mySvg").css({ "opacity": "1" });
          var lowerThan=window.localStorage.getItem("originalHeight");
          //console.log(":::: \n orig height :" + lowerThan);
          var arr = {canYou:"showMeMyProfile", myName:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, inEditor: "yes", lowerThan:lowerThan};
          // first we start loading pre-existing images so they are in the back

            var getProfile = $.ajax({
                  type: "POST",
                  url: "https://kollaj.net/bouncer.php?seekProfile="+window.localStorage.getItem("loggedAs"),
                  data: JSON.stringify(arr),
                  dataType: "json",
                  contentType: 'application/json',
                  success: function(resultData){
                  //console.log("we got success") ;
                  var arr = resultData;
                  // console.log(arr);

                  function calcDistance(x1, y1, x2, y2) {
                  return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
                  }
                  var s = Snap("#mySvg");
                  s.clear();//just add this piece of magic....
                  //Crossbrowser window Width
                  var width = document.getElementById("mySvg").clientWidth;
                  //Crossbrowser window Height
                  var height = document.getElementById("mySvg").clientHeight;
                  var i =0;
                  var bottomMost = 0;
                  function welderEmbedded (ih, iw, ix, iy, iURI, m1, m2, ang, scl, itx, ity)
                  {

                    var myImg = s.image(iURI, ix, iy, iw, ih);
                    var mask1=s.path(m1).attr({fill:"white"});
                    var mask2=s.path(m2).attr({fill:"white"});
                    var maskGroups = s.group()

                    maskGroups.add(mask1);
                    maskGroups.attr({fill: "white"});

                    finalGroup = s.group(maskGroups, myImg);

                    myImg.attr({mask: maskGroups})
                    maskGroups.attr({mask: mask2});

                    maxWidth = width - (width/9);
                    scaleF = maxWidth/iw;
                    lftDis = itx*scaleF;
                    topDis = ity*scaleF;
                    if (topDis > bottomMost)
                    {
                      bottomMost = topDis;
                      //console.log("::::::::BOTTOMMOST-->"+bottomMost+"\n");
                    }
                    last_element = arr.length - 1;

                    absXCenter = (width/2);
                    absYCenter = (height/2);

                    var bb = finalGroup.getBBox();
                    var diffX = absXCenter - bb.cx;
                    var diffY = absYCenter - bb.cy;

                    finalGroup.transform('T' + diffX + ',' + diffY + 'S'+scaleF+'R0');

                    moveGroup=s.group(finalGroup);
            //          console.log("first move, follow secondmove");
                    moveGroup.transform('t' + lftDis + ',' + topDis + 's'+scl+'r'+ang);
                    if (i==0 && window.localStorage.getItem('kollajDistance') == 1)
                    {
                    // moveGroup.remove()
                    }
            //          console.log("in place!?");
              if(i == last_element)
              {
                var scrollDist = window.localStorage.getItem('originalHeight');

                //console.log(i + " and bottomMost " + bottomMost );
                window.localStorage.setItem("editorScrollTo",bottomMost);
                var edtHeight =  (parseInt( ( parseFloat(bottomMost) / parseInt(scrollDist) ) + 1.5 ) * parseInt( scrollDist )) + parseInt( scrollDist );

                //console.log("edtHeight should be "+edtHeight+"because (("+bottomMost+"+1080)/"+scrollDist+")*"+scrollDist+"="+edtHeight);
                window.localStorage.setItem("editorHeight",edtHeight);
                $("#mySvg").css({"height":edtHeight+"px"});
                $("#mySvg").css({"background-color":"white"});
              }
            }

                  for (i in arr)
                  {
                    nty = arr[i].ty;
                    //console.log('received img'+ i +' ty'+ arr[i].ty +' nty'+ nty +' desc'+arr[i].imgdesc);
                    welderEmbedded (arr[i].imgH, arr[i].imgW, arr[i].imgX, arr[i].imgY, arr[i].imgpath, arr[i].mask1, arr[i].mask2, arr[i].angle, arr[i].scale, arr[i].tx, nty );
                  }
                  //console.log('well at least i tried');
                  }
            });

            // then we take the photo
          navigator.camera.getPicture(onSuccess, onFail, {
            quality: 100,
            destinationType: Camera.DestinationType.NATIVE_URI,
            sourceType: 1,
            encodingType: Camera.EncodingType.JPEG,
            allowEdit: false,
            encodingType: 0,
            targetWidth: 1920,
            targetHeight: 1080,
            direction: 1,
            saveToPhotoAlbum: true
          });

          function onSuccess(imageData) {
//              alert("Congz!! You might've found a bug :( \n I'm fixing it! \n You can go back though.. or close & open Kollaj");
              //just to be sure
              $("#editorHolder").css({ "visibility": "visible" });
              $("#editorHolder").css({ "opacity": "1" });

            $("#otherOptions").css({ "display": "none" });
            $("#detailsWindow").css({ "display": "none" });
            $("#mySvg").css({ "visibility": "visible" });
            $("#mySvg").css({"opacity":"1"});
             //so witht the image path we will
              //first find cWidth & cHeight
              var img = new Image();
              img.onload = function() {
                var cWidth = this.width;
                var cHeight = this.height;
                //and then pass it to the Hobbit :) (ref ==>) http://codepen.io/spacewalkingninja/full/yVwqWQ/
                bringinTheEditor(imageData, this.width, this.height);
              }
              img.src = imageData;

          }

          function onFail(message) {
              $("#editorHolder").css({ "visibility": "hidden" });
              $("#editorHolder").css({ "opacity": "0" });

              $("#detailsWindow").css({"display":"none"})
              $("#otherOptions").toggle();
              $("#mySvg").css({"visibility":"hidden"})
              }

        });

        $("#selfieMode").click(function(){
          if($("#msg").is(":hidden")){messageState = 0}else{messageState = 1}
          if($("#vibes").is(":hidden")){notificationState = 0}else{notificationState = 1}
          if($("#chat").is(":visible")){chatState = 1}else{chatState = 0}

          if(messageState == 1) {$("#msg").toggle()};
          if(notificationState == 1) {$("#vibes").toggle()};
          if(chatState == 1) {$("#chat").css({"display":"none"});$(".chatbox").css({"display":"none"})};

          $("#sendPicture").css({"display":"block"});
          $("#detailsWindow").css({"display":"none"});
          $("#mySvg").css({ "visibility": "visible" });
          $("#mySvg").css({ "opacity": "1" });

          navigator.camera.getPicture(onSuccess, onFail, {
            quality: 100,
            destinationType: Camera.DestinationType.NATIVE_URI,
            sourceType: 1,
            encodingType: Camera.EncodingType.JPEG,
            allowEdit: false,
            encodingType: 0,
            targetWidth: 1920,
            targetHeight: 1080,
            direction: 0,
            saveToPhotoAlbum: true
          });

          function onSuccess(imageData) {
            //just to be sure
//              alert("Congz!! You might've found a bug :( \n I'm fixing it! \n You can go back though.. or close & open Kollaj");
              $("#otherOptions").css({ "display": "none" })
              $("#editorHolder").css({ "visibility": "visible" });
              $("#editorHolder").css({ "opacity": "1" });

              //so witht the image path we will
              //first find cWidth & cHeight
              var img = new Image();
              img.onload = function() {
                var cWidth = this.width;
                var cHeight = this.height;
                //and then pass it to the Hobbit :) (ref ==>) http://codepen.io/spacewalkingninja/full/yVwqWQ/
                bringinTheEditor(imageData, this.width, this.height);
              }
              img.src = imageData;

          }

          function onFail(message) {
            $("#editorHolder").css({"visibility":"hidden"});
            $("#mySvg").css({"visibility":"hidden"});
            $("#detailsWindow").css({ "display": "none" });
            $("#editorHolder").css({ "visibility": "hidden" });
            $("#editorHolder").css({ "opacity": "1" });

            if($("#otherOptions").is(":visible")){otherOptsState = 0}else{otherOptsState = 1}
            if(otherOptsState == 1) {$("#otherOptions").css({"display":"block"})};
          }

        });

        $("#galleryMode").click(function(){
          if($("#msg").is(":hidden")){messageState = 0}else{messageState = 1}
          if($("#vibes").is(":hidden")){notificationState = 0}else{notificationState = 1}
          if($("#chat").is(":visible")){chatState = 1}else{chatState = 0}

          if(messageState == 1) {$("#msg").toggle()};
          if(notificationState == 1) {$("#vibes").toggle()};
          if (chatState == 1) {
              $("#chat").css({ "display": "none" });
              $(".chatbox").css({ "display": "none" })
          };
          $("#feed").css({ "display": "none" });
          $("#profile").css({ "display": "none" });
          $("#detailsWindow").css({ "display": "none" });
          $("#sendPicture").css({"display":"block"});

          navigator.camera.getPicture(onSuccess, onFail, {
            quality: 100,
            destinationType: Camera.DestinationType.NATIVE_URI,
            sourceType: 0,
            encodingType: Camera.EncodingType.JPEG,
            allowEdit: false,
            encodingType: 0,
            targetWidth: 1920,
            targetHeight: 1080,
            direction: 0,
            saveToPhotoAlbum: true
          });

          function onSuccess(imageData) {
//              alert("Congz!! You might've found a bug :( \n I'm fixing it! \n You can go back though.. or close & open Kollaj");
              //just to be sure
              $("#editorHolder").css({ "opacity": "1" });
              $("#editorHolder").css({ "visibility": "visible" });

              $("#mySvg").css({ "visibility": "visible" });
              $("#mySvg").css({ "opacity": "1" });
            $("#otherOptions").css({"display":"none"})
              //so witht the image path we will
              //first find cWidth & cHeight
              var img = new Image();
              img.onload = function() {
                var cWidth = this.width;
                var cHeight = this.height;
                //and then pass it to the Hobbit :) (ref ==>) http://codepen.io/spacewalkingninja/full/yVwqWQ/
                bringinTheEditor(imageData, this.width, this.height);
              }
              img.src = imageData;

          }

          function onFail(message) {
              $("#editorHolder").css({ "visibility": "hidden" });
              $("#editorHolder").css({ "opacity": "0" });

            $("#mySvg").css({"visibility":"hidden"});
            $("#detailsWindow").css({"display":"none"});
            if($("#otherOptions").is(":visible")){otherOptsState = 0}else{otherOptsState = 1}
            if(otherOptsState == 1) {$("#otherOptions").css({"display":"block"})};
          }

        });

        $("#profLink").click(function(){

            window.localStorage.setItem("modal", 0);
            $modal = $('.modal-frame');
            $overlay = $('.modal-overlay');
            $overlay.removeClass('state-show');
            $modal.removeClass('state-appear').removeClass('state-leave');


            $("#mySvg").css({ "display": "none" });
            $("#feed").css({ "display": "none" });

          var arr1 = {canYou:"giveMeMyStats", myName:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform}
          identify (arr1);
          if($("#msg").is(":hidden")){messageState = 0}else{messageState = 1}
          if($("#vibes").is(":hidden")){notificationState = 0}else{notificationState = 1}
          if($("#chat").is(":visible")){chatState = 1}else{chatState = 0}
          if($("#takePicture").is(":visible")){takePictureState = 1}else{takePictureState = 0}

          if(messageState == 1) {$("#msg").toggle()};
          if(notificationState == 1) {$("#vibes").toggle()};
          if(chatState == 1) {$("#chat").css({"display":"none"});$(".chatbox").css({"display":"none"})};
          if(takePictureState == 1) {$("#takePicture").css({"display":"none"});};


          window.localStorage.setItem("mproffset", 0);

          $("#profileName").html("<div id='callProfAction' class='arrow' data-seeProf='"+window.localStorage.getItem("loggedAs")+"'>@"+window.localStorage.getItem("loggedAs")+"</div>");
          $("#callProfAction").click (function()
          {
            window.localStorage.setItem('history', 'profile');
            callDaProfileMenu(window.localStorage.getItem("loggedAs"));
          //console.log(window.localStorage.getItem("loggedAs"));
          });

          $("#profileFollowing").html(window.localStorage.getItem("myProfileFollowing"));
          $("#profileFollowers").html(window.localStorage.getItem("myProfileFollowers"));
            var arr = {canYou:"showMeMyProfile", myName:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, proffset:window.localStorage.getItem("mproffset")};

          $("#profile").css({"display":"block"});
          var getProfile = $.ajax({
                type: "POST",
                url: "https://kollaj.net/bouncer.php?seekProfile="+window.localStorage.getItem("loggedAs"),
                data: JSON.stringify(arr),
                dataType: "json",
                contentType: 'application/json',
                success: function(resultData){
                  $("#profileSVG").css({"height":"100%"});
                  document.getElementById("profileSVG").innerHTML = "";
                  window.localStorage.setItem("originalHeight", document.getElementById("profileSVG").clientHeight);
                  var OHght = window.localStorage.getItem("originalHeight");

                  var karr = {canYou:"getMyKollajDistance", myName:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid};
                  identify(karr);

                //make sure

                var arr = resultData;

                function calcDistance(x1, y1, x2, y2) {
                return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
                }



                var s = Snap("#profileSVG");
                s.clear();//just add this piece of magic....
                // found on stack @http://stackoverflow.com/questions/31825807/how-do-i-clear-an-snap-svg-canvus-after-snap-load by Lin Yuan

                //Crossbrowser window Width
                var width = document.getElementById("profileSVG").clientWidth;
                //Crossbrowser window Height
                var height = document.getElementById("profileSVG").clientHeight;
                var i =0;
                var lasTopDis = 0;
                var cordx = new Array;
                var cordy = new Array;
                var cordI = new Array;
                function welderEmbeddedMP (ih, iw, ix, iy, iURI, m1, m2, ang, scl, itx, ity)
                {
                  var OHght = window.localStorage.getItem("originalHeight");
                  var myImg = s.image(iURI, ix, iy, iw, ih);
                  var mask1=s.path(m1).attr({fill:"white"});
                  var mask2=s.path(m2).attr({fill:"white"});
                  var maskGroups = s.group()

                  maskGroups.add(mask1);
                  maskGroups.attr({fill: "white"});

                  finalGroup = s.group(maskGroups, myImg);

                  myImg.attr({mask: maskGroups})
                  maskGroups.attr({mask: mask2});

                  maxWidth = width - (width/9);
                  scaleF = maxWidth/iw;
                  lftDis = itx*scaleF;
                  topDis = ity*scaleF;
                  absXCenter = (width/2);
                  absYCenter = (OHght/2);

                  if (lasTopDis < topDis)
                  {
                  lasTopDis = topDis
                  }
                  var bb = finalGroup.getBBox();
                  var diffX = absXCenter - bb.cx;
                  var diffY = absYCenter - bb.cy;

                  finalGroup.transform('T' + diffX + ',' + diffY + 'S'+scaleF+'R0');

                  moveGroup=s.group(finalGroup).attr({style:"border:3px solid white"});
        //          console.log("first move, follow secondmove");

        //          console.log("in place!?");
                    moveGroup.transform('t' + lftDis + ',' + topDis + 's'+scl+'r'+ang);
                    if (i==0)
                    {
                       moveGroup.remove()
                       //console.log("aro!");
                    //    document.getElementById("whereuputurppic").innerHTML = "";
                       $("#whereuputurppic").css({"background-image":'url("'+iURI+'")'});
                    }
                    if (i>0)
                    {
                      var bb = moveGroup.getBBox();
                      cordx.push(bb.cx);
                      cordy.push(bb.cy);

                      iname = iURI.substring(iURI.lastIndexOf('/')+1);
                      cordI.push(iname);
                    }

                    if(i == resultData.length - 1)
                    {
                      nH = parseInt(lasTopDis) + 780;
                      $("#profileSVG").css({"height":nH+"px"});
                      window.localStorage.setItem("profileSVGHeight", nH);
                        //console.log("puttint it @"+nH);
                      if (i > 13) {

                          var text = s.text(30, (lasTopDis + 400), "click to load more..");
                          text.attr({
                              'font-size': "1.5rem",
                              'stroke': 'white',
                              'strokeWidth': 1,
                              'id': "loadMoreMProfile"
                          });
                          $("#loadMoreMProfile").click(function () {

                              var arr = { canYou: "showMeSomeProfile", myName: window.localStorage.getItem("loggedAs"), seeProfile: window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform: device.platform, proffset: window.localStorage.getItem("mproffset") };
                              identify(arr);

                          });
                      }
                    }

        return false;
      }

                for (i in arr)
                {
                  window.localStorage.setItem("mproffset", arr[i].proffset);
                  welderEmbeddedMP (arr[i].imgH, arr[i].imgW, arr[i].imgX, arr[i].imgY, arr[i].imgpath, arr[i].mask1, arr[i].mask2, arr[i].angle, arr[i].scale, arr[i].tx, arr[i].ty);
                }
                commentsPoint=new Array;
                for (n in cordx)
                {

                  commentsPoint[n] = s.circle(cordx[n], cordy[n], 25).attr({fill: "rgba(255,255,255, 0.05)"});
                  commentsPoint[n].attr({
                    stroke: "rgba(255,255, 255,0.4)",
                    strokeWidth: 2,
                    strokeDasharray: 4
                  })

                  commentsPoint[n].attr({"data-img":cordI[n]});
                  commentsPoint[n].attr({"id":"profileCommPtL"+n})
                  commentsPoint[n].click(
                    function ()
                    {
                      window.localStorage.setItem('history', 'profile');
                      bringInThePostSeeWindow(this.attr("data-img"));
                    }
                  );
                }


                }
          });


        });


        $("#messages").click(function(){
            $("#mySvg").css({ "display": "none" });

          window.localStorage.setItem("modal", 0);
          $modal = $('.modal-frame');
          $overlay = $('.modal-overlay');
          $overlay.removeClass('state-show');
          $modal.removeClass('state-appear').removeClass('state-leave');


          if($("#vibes").is(":visible")){notificationState = 1}else{notificationState = 0}
          if($("#profile").is(":visible")){profileState = 1}else{profileState = 0}
          if($("#feed").is(":visible")){feedState = 1}else{feedState = 0}
          if($("#sendPicture").is(":visible")){sendPicState = 1}else{sendPicState = 0}
          if($("#chat").is(":visible")){chatState = 1}else{chatState = 0}

          if(notificationState == 1) {$("#vibes").toggle()};
          if(profileState == 1) {$("#profile").toggle()};
          if(feedState == 1) {$("#feed").toggle()};
          if(sendPicState == 1) {$("#sendPicture").toggle()};
          if(chatState == 1) {$("#chat").css({"display":"none"});$(".chatbox").css({"display":"none"})};

          $('#msg').slideDown(1000, "easeOutCirc");
//          var arr = {canYou:"checkMyInbox", myName:window.localStorage.getItem("loggedAs"), devUuid:device.uuid, tracker: window.localStorage.getItem("tracker")};
//          identify (arr);

          var arr = {canYou:"letMeKnowWhoShouldIBotherInsteadOfUDearServerOfMine", myName:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform};
          identify(arr);


        });

        $("#chatButton").click(function(){
          myMsg = $("#chatInput").val();
          if (myMsg.replace(/\s/g, '').length) {
            var arr = {canYou:"letMeSendAMsg", myName:window.localStorage.getItem("loggedAs"), myMsg: myMsg, myMsgIsGoingTo:window.localStorage.getItem("seeingMsgs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform};
            identify(arr);
          }
          myMsg = $("#chatInput").val("");
        });

        $(".contactBox").click(function(){
          window.localStorage.setItem('history', 'messages');

          $("#mySvg").css({"display":"none"});

          if($("#msg").is(":hidden")){messageState = 0}else{messageState = 1}
          if($("#vibes").is(":visible")){notificationState = 1}else{notificationState = 0}
          if($("#profile").is(":visible")){profileState = 1}else{profileState = 0}
          if($("#feed").is(":visible")){feedState = 1}else{feedState = 0}
          if($("#sendPicture").is(":visible")){sendPicState = 1}else{sendPicState = 0}

          if(notificationState == 1) {$("#vibes").toggle()};
          if(profileState == 1) {$("#profile").toggle()};
          if(feedState == 1) {$("#feed").toggle()};
          if(sendPicState == 1) {$("#sendPicture").toggle()};
          if(messageState == 1) {$("#msg").toggle()};

          var str = $(this).attr('id');
          var res = str.substring(5, 6);
          see = "#chatBox"+res;
          $("#chat").toggle(function(){
            $(see).slideDown(400, "easeInCirc");
          });

        });

        $("#notifications").click(function(){
          window.localStorage.setItem("history", "feed");
            $("#mySvg").css({"display":"none"});

            window.localStorage.setItem("modal", 0);
            $modal = $('.modal-frame');
            $overlay = $('.modal-overlay');
            $overlay.removeClass('state-show');
            $modal.removeClass('state-appear').removeClass('state-leave');

          if($("#msg").is(":visible")){messageState = 1}else{messageState = 0}
          if($("#profile").is(":visible")){profileState = 1}else{profileState = 0}
          if($("#feed").is(":visible")){feedState = 1}else{feedState = 0}
          if($("#sendPicture").is(":visible")){sendPicState = 1}else{sendPicState = 0}
          if($("#chat").is(":visible")){chatState = 1}else{chatState = 0}

          if(messageState == 1) {$("#msg").toggle()};
          if(profileState == 1) {$("#profile").toggle()};
          if(feedState == 1) {$("#feed").toggle()};
          if(sendPicState == 1) {$("#sendPicture").toggle()};
          if(chatState == 1) {$("#chat").css({"display":"none"});$(".chatbox").css({"display":"none"})};

          $('#vibes').css({"display":"block"});

          var arr = {canYou:"showMeMyVibes", myName:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform};
          identify(arr);
        });


          function calcDistance(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
          }

(function() {

var lineAttributes = {
  stroke: 'red',
  strokeWidth: 2,
  strokeDasharray: "5,5"
};

Snap.plugin(function(Snap, Element, Paper, global) {

  var ftOption = {
    handleFill: "rgba(0,0,0, 0.4)",
    handleStrokeDash: "5,5",
      handleStrokeWidth: "2",
    handleLength: 40,
    handleRadius: "18",
    handleLineWidth: 2,
  };

  Element.prototype.ftCreateHandles = function() {
    this.ftInit();
    var freetransEl = this;
    var bb = freetransEl.getBBox(0);
    var rotateDragger = this.paper.circle(bb.width - (ftOption.handleLength ), bb.cy, ftOption.handleRadius).attr({
      fill: "rgba(59,89,152, 0.8)"
    });

    var translateDragger = this.paper.circle(bb.cx, bb.cy, ftOption.handleRadius).attr({
      fill: "rgba(59,89,152, 0.4)"
    });

    var joinLine = freetransEl.ftDrawJoinLine(rotateDragger);
    var handlesGroup = this.paper.g(joinLine, rotateDragger, translateDragger);

    freetransEl.data("handlesGroup", handlesGroup);
    freetransEl.data("joinLine", joinLine);

    freetransEl.data("scaleFactor", calcDistance(bb.cx, bb.cy, rotateDragger.attr('cx'), rotateDragger.attr('cy')));

    translateDragger.drag(elementDragMove.bind(translateDragger, freetransEl),
      elementDragStart.bind(translateDragger, freetransEl),
      elementDragEnd.bind(translateDragger, freetransEl));

    freetransEl.undblclick();
    freetransEl.data("dblclick", freetransEl.dblclick(function() {
      this.ftRemoveHandles()
    }));

    rotateDragger.drag(
      dragHandleRotateMove.bind(rotateDragger, freetransEl),
      dragHandleRotateStart.bind(rotateDragger, freetransEl),
      dragHandleRotateEnd.bind(rotateDragger, freetransEl)
    );
    freetransEl.ftStoreInitialTransformMatrix();

    freetransEl.ftHighlightBB();
    return this;
  };

  Element.prototype.ftInit = function() {
    this.data("angle", 0);
    this.data("scale", 1);
    this.data("tx", 0);
    this.data("ty", 0);
    return this;
  };

  Element.prototype.ftCleanUp = function() {
    var myClosureEl = this;
    var myData = ["angle", "scale", "scaleFactor", "tx", "ty", "otx", "oty", "bb", "bbT", "initialTransformMatrix", "handlesGroup", "joinLine"];
    myData.forEach(function(el) {
      myClosureEl.removeData([el])
    });
    return this;
  };

  Element.prototype.ftStoreStartCenter = function() {
    this.data('ocx', this.attr('cx'));
    this.data('ocy', this.attr('cy'));
    return this;
  }

  Element.prototype.ftStoreInitialTransformMatrix = function() {
    this.data('initialTransformMatrix', this.transform().localMatrix);
    return this;
  };

  Element.prototype.ftGetInitialTransformMatrix = function() {
    return this.data('initialTransformMatrix');
  };

  Element.prototype.ftRemoveHandles = function() {
    this.undblclick();
    this.data("handlesGroup").remove();
    this.data("bbT") && this.data("bbT").remove();
    this.data("bb") && this.data("bb").remove();
    this.dblclick(function() {
      this.ftCreateHandles()
    });
    this.ftCleanUp();
    return this;
  };

  Element.prototype.ftDrawJoinLine = function(handle) { // note, handle could be either dragger or rotater
    var lineAttributes = {
      stroke: ftOption.handleFill,
      strokeWidth: ftOption.handleStrokeWidth,
      strokeDasharray: ftOption.handleStrokeDash
    };
    var rotateHandle = handle.parent()[1];
    var dragHandle = handle.parent()[2];

    var thisBB = this.getBBox(0);

    if (this.data("joinLine")) {
      this.data("joinLine").attr({
        x1: dragHandle.attr('cx'),
        y1: dragHandle.attr('cy'),
        x2: rotateHandle.attr('cx'),
        y2: rotateHandle.attr('cy')
      });
    } else {
      return this.paper.line(thisBB.cx, thisBB.cy, handle.attr('cx'), handle.attr('cy')).attr(lineAttributes);
    };

    return this;
  };

  Element.prototype.ftTransformedPoint = function(x, y) {
    var transform = this.transform().diffMatrix;
    return {
      x: transform.x(x, y),
      y: transform.y(x, y)
    };
  };

  Element.prototype.ftUpdateTransform = function() {
    var tstring = "t" + this.data("tx") + "," + this.data("ty") + this.ftGetInitialTransformMatrix().toTransformString() + "r" + this.data("angle") + 'S' + this.data("scale");
    this.attr({
      transform: tstring
    });
    this.data("bbT") && this.ftHighlightBB();
    return this;
  };

  Element.prototype.ftHighlightBB = function() {
    this.data("bbT") && this.data("bbT").remove();
    this.data("bb") && this.data("bb").remove();

    this.data("bbT", this.paper.rect(rectObjFromBB(this.getBBox(1)))
      .attr({
        fill: "none"
      }) //stroke: ftOption.handleFill, strokeDasharray: ftOption.handleStrokeDash
      //			handleStrokeDash: "5,5",
      //			handleStrokeWidth: "2",
      //strokeDasharray: 5,5
      .transform(this.transform().local.toString()));
    this.data("bb", this.paper.rect(rectObjFromBB(this.getBBox()))
      .attr({
        fill: "none"
      })); //stroke: ftOption.handleFill, strokeDasharray: ftOption.handleStrokeDash -
    return this;
  };

});

function rectObjFromBB(bb) {
  return {
    x: bb.x,
    y: bb.y,
    width: bb.width,
    height: bb.height
  }
}

function elementDragStart(mainEl, x, y, ev) {
  this.parent().selectAll('circle').forEach(function(el, i) {
    el.ftStoreStartCenter();
  });
  mainEl.data("otx", mainEl.data("tx") || 0);
  mainEl.data("oty", mainEl.data("ty") || 0);
};

function invTransformPoint(el, x, y) {
  var tdx, tdy;
  var snapInvMatrix = el.transform().diffMatrix.invert();
  snapInvMatrix.e = snapInvMatrix.f = 0;
  return {
    tx: snapInvMatrix.x(x, y),
    ty: snapInvMatrix.y(x, y)
  }
}

function elementDragMove(mainEl, dx, dy, x, y) {
  var dragHandle = this;
  var ip = invTransformPoint(this, dx, dy);

  this.parent().selectAll('circle').forEach(function(el, i) {
    el.attr({
      cx: +el.data('ocx') + ip.tx,
      cy: +el.data('ocy') + ip.ty
    });
  });
  mainEl.data("tx", mainEl.data("otx") + +ip.tx);
  mainEl.data("ty", mainEl.data("oty") + +ip.ty);

  mainEl.ftUpdateTransform();
  mainEl.ftDrawJoinLine(dragHandle);
}

function elementDragEnd(mainEl, dx, dy, x, y) {
  mY = parseInt( mainEl.data("ty") ) ;
  var $editorHolder = $("#editorHolder");
  $editorHolder.animate({ scrollTop: mY });

};

function dragHandleRotateStart(mainElement) {
  this.ftStoreStartCenter();
};

function dragHandleRotateEnd(mainElement) {};

function dragHandleRotateMove(mainEl, dx, dy, x, y, event) {
  var handle = this;
  var mainBB = mainEl.getBBox();
  var ip = invTransformPoint(this, dx, dy);

  handle.attr({
    cx: +handle.data('ocx') + ip.tx,
    cy: +handle.data('ocy') + ip.ty
  });

  mainEl.data("angle", Snap.angle(mainBB.cx, mainBB.cy, handle.attr('cx'), handle.attr('cy')) - 180);

  var distance = calcDistance(mainBB.cx, mainBB.cy, handle.attr('cx'), handle.attr('cy'));
  //console.log (distance);
  mainEl.data("scale", distance / mainEl.data("scaleFactor"));

  mainEl.ftUpdateTransform();
  mainEl.ftDrawJoinLine(handle);
};

function calcDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}

})();

Snap.plugin(function(Snap, Element, Paper, glob) {
var elproto = Element.prototype;
elproto.toFront = function() {
  this.prependTo(this.paper);
};
elproto.toBack = function() {
  this.appendTo(this.paper);
};
});

Snap.plugin(function(Snap, Element, Paper, global) {
Paper.prototype.circlePath = function(cx, cy, r) {
  var p = "M" + cx + "," + cy;
  p += "m" + -r + ",0";
  p += "a" + r + "," + r + " 0 1,0 " + (r * 2) + ",0";
  p += "a" + r + "," + r + " 0 1,0 " + -(r * 2) + ",0";
  return this.path(p, cx, cy);

};
});

Snap.plugin(function(Snap, Element, Paper, global) {
Element.prototype.addTransform = function(t) {
  return this.transform(this.transform().localMatrix.toTransformString() + t);
};
});


function gridGen(wWidth, wHeight, actualHeight, s, colorA, colorB) {
  function isEven(n) {
    return n == parseFloat(n) ? !(n % 2) : void 0;
  }

  thirdWidth = wWidth / 6;
  vl = new Array;
  for (i = 1; i < 6; i++) {
    if (isEven(i)) {
      color = colorA;
      sW = 2;
    } else {
      color = colorB;
      sW = 1;
    }
    x1 = thirdWidth * i
    y1 = 0
    x2 = thirdWidth * i
    y2 = actualHeight;
    vl[i] = s.line(x1, 0, thirdWidth * i, actualHeight).attr({
      strokeWidth: sW,
      stroke: color,
      strokeLinecap: "round"
    })
  }
  hl = new Array;
  tlines = parseInt(actualHeight / thirdWidth) + 10;
  for (i = 1; i < tlines; i++) {
    if (isEven(i)) {
      color = colorA;
      sW = 2;
    } else {
      color = colorB;
      sW = 1;
    }
    x1 = 0;
    y1 = thirdWidth * i;
    x2 = wWidth;
    y2 = thirdWidth * i;
    hl[i] = s.line(x1, y1, x2, y2).attr({
      strokeWidth: sW,
      stroke: color
    })
  }
}

function bringinTheEditor(photoSrc, cWidth, cHeight) {

  window.localStorage.setItem("history", "feed");
  window.localStorage.setItem("photoSrcUndo",photoSrc);
  window.localStorage.setItem("photoCWidthUndo",cWidth);
  window.localStorage.setItem("photoCHeightUndo",cWidth);

  $("#header").css({"display":"none"});
  $("#mainNav").css({"visibility":"hidden"});
  $("#mySvg").css({"display":"block"});
  $("#editorHolder").css({"visibility":"visible"});
  $("#editorHelper").css({"display":"block"});
  $("#lesArrowHolder").css({"display":"none"});
  $("#leNextStepper").css({"display":"none"});

  if(window.localStorage.getItem("myCalibration") == "hateToMakeYouSadButUrOnUrOwn")
  {
    $("#calibrateHolder").css({"display":"block"});
  }

  var s = Snap("#mySvg");

  var width = document.getElementById("mySvg").clientWidth;
  var actualHeight = document.getElementById("mySvg").clientHeight;
  var height = parseInt(window.localStorage.getItem("originalHeight"));
  var maxWidth = width - (width / 9); // Max width for the image
  var maxHeight = height - (height * 0.3); // Max height for the image
  var ratio = 0; // Used for aspect ratio
  var imgWidth = cWidth; // Current image width
  var imgHeight = cHeight; // Current image height
  if (width > maxWidth) {
    ratio = maxWidth / imgWidth; // get ratio for scaling image
    imgHeight = imgHeight * ratio; // Reset height to match scaled image
    imgWidth = imgWidth * ratio; // Reset width to match scaled image
  }
  if (imgHeight > maxHeight) {
    ratio = maxHeight / imgHeight; // get ratio for scaling image
    imgWidth = imgWidth * ratio; // Reset width to match scaled image
    imgHeight = imgHeight * ratio; // Reset height to match scaled image
  }
  var ixCenter = parseInt((width - imgWidth) / 2);
  var iyCenter = parseInt((height - imgHeight) / 2);
  gridGen(width, height, actualHeight, s, "CornflowerBlue", "MediumTurquoise");
  var myImg = s.image(photoSrc, ixCenter, iyCenter, imgWidth, imgHeight).attr({id: "editImg"});

  var imgCorner = [];
	  var ixCorner = [];
	  var iyCorner = [];
	  var imgHandle = [];
	  ixCorner[0] = ixCenter;
	  ixCorner[1] = imgWidth + ixCenter;
	  ixCorner[2] = imgWidth + ixCenter;
	  ixCorner[3] = ixCenter;

	  iyCorner[0] = iyCenter;
	  iyCorner[1] = iyCenter;
	  iyCorner[2] = iyCenter + imgHeight;
	  iyCorner[3] = iyCenter + imgHeight;

	  var imgCx = ixCorner[0] + (imgWidth / 2);
	  var imgCy = iyCorner[0] + (imgHeight / 2);

	  var centerPoint = s.circle(imgCx, imgCy, 10).attr({fill: "rgba(250,89,152, 0)"});
	  imgHandle[0] = s.circle(ixCenter, iyCenter, 10).attr({fill: "rgba(59,89,152, 1)"});
	  imgHandle[1] = s.circle(imgWidth + ixCenter, iyCenter, 10).attr({fill: "rgba(59,89,152, 1)"});
	  imgHandle[2] = s.circle(imgWidth + ixCenter, iyCenter + imgHeight, 10).attr({fill: "rgba(59,89,152, 1)"});
	  imgHandle[3] = s.circle(ixCenter, iyCenter + imgHeight, 10).attr({fill: "rgba(59,89,152, 1)"});

	  var myLine = [];
	  var touches = 0;
    var touchCuts = 0 //this should be better than the touches counter to count the actual cuts only
	  var imgMask = []; //our mask paths
	  var maskGroups = s.group();
	  var m = 0; //our mask counter
    var myMaskFrag = []; //our mask fragments
	  var maskColor = "white"; //this is our mask color, we can change it here globally

    $("#mySvg").css({"position":"static"});
    $("#editorHolder").css({"overflow-y":"hidden"});
    $("#mySvg").on('touchstart mousedown', function(event) {
      //console.log(touches);
      gnStartX = event.touches[0].pageX;
      gnStartY = event.touches[0].pageY;
      gnStartX = parseInt(gnStartX);
      gnStartY = parseInt(gnStartY);
      cutTouchStart (event, s, touches, centerPoint, myLine, gnStartX, gnStartY);
    });
    $("#mySvg").on('touchmove mousemove', function(event) {
      gnEndX = event.touches[0].pageX;
      gnEndY = event.touches[0].pageY;
      gnEndX = parseInt(gnEndX);
      gnEndY = parseInt(gnEndY);
      cutTouchMove (event, s, touches, centerPoint, myLine, gnStartX, gnStartY, gnEndX, gnEndY);
    });
    $("#mySvg").on('touchend touchcancel mouseup', function(event) {

      	    centerPoint.attr({fill: "rgba(250,89,152, 0)"});
            //console.log("touchend")
      	    p1 = ("M " + gnStartX + " " + gnStartY + " L " + gnEndX + " " + gnEndY)
      	    p2 = ("M " + ixCorner[0] + " " + iyCorner[0] + " L " + ixCorner[1] + " " + iyCorner[1] + " " + ixCorner[2] + " " + iyCorner[2] + " " + ixCorner[3] + " " + iyCorner[3] + " Z")
            //console.log(p1+ " and " +p2 );
      	    var intersects = Snap.path.intersection(p1, p2); // intersection array
      	    var intersectPointX = []; //intersection point x's
      	    var intersectPointY = []; //and y's
      	    var intersectHandler = []; //just the graphical thingies
      	    var c = 0; //counter
            if (intersects[0] && intersects[1] && touchCuts <= 1) {
              window.localStorage.setItem("history", "callEd");
              touchCuts++;
              touches++;
              //console.log("touchCuts "+touchCuts +" touches"+ touches);
      	      intersects.forEach(function(el) {
      	        intersectHandler[c] = s.circle(el.x, el.y, 10).attr({fill: "rgba(250,89,152, 1)", class:"handleSwitcher"});
      	        intersectPointX[c] = el.x;
      	        intersectPointY[c] = el.y;
      	        c++;
                //console.log("intersection detected @"+el.x+","+el.y);
      	      });

      	      var fiPClassification = []
      	      var siPClassification = []
      	      if((intersectPointY[0]>iyCorner[0]-1 && intersectPointY[0]<iyCorner[0]+1)
                  ||
                (intersectPointY[0]>iyCorner[3]-1 && intersectPointY[0]<iyCorner[3]+1)){
      	        fiPClassification[0] = 0; //VerticalCut
      	        if (intersectPointY[0] > iyCorner[0] + imgHeight / 2) {
      	          fiPClassification[1] = 0; //BottomHalf
      	          if (intersectPointX[0] > ixCorner[0] + imgWidth / 2)
                  {fiPClassification[2] = 0;} else {fiPClassification[2] = 1;}
      	        } else {
      	          fiPClassification[1] = 1; //TopHalf
      	          if (intersectPointX[0] > ixCorner[0] + imgWidth / 2)
                  {fiPClassification[2] = 0;} else {fiPClassification[2] = 1;}
      	        }
              }
      	      else if (intersectPointY[0]) {
      	        fiPClassification[0] = 1; //HorizontalCut
      	        if (intersectPointY[0] > iyCorner[0] + imgHeight / 2) {
      	          fiPClassification[1] = 0; //BottomHalf
      	          if (intersectPointX[0] > ixCorner[0] + imgWidth / 2)
                  {fiPClassification[2] = 0;} else {fiPClassification[2] = 1;}
      	        } else {
      	          fiPClassification[1] = 1; //TopHalf
      	          if (intersectPointX[0] > ixCorner[0] + imgWidth / 2)
                  {fiPClassification[2] = 0;} else {fiPClassification[2] = 1;}
      	        }
      	      }
      	      	if((intersectPointY[1]>iyCorner[0]-1 && intersectPointY[1]<iyCorner[0]+1)
                  ||
                  (intersectPointY[1]>iyCorner[3]-1 && intersectPointY[1]<iyCorner[3]+1)){
      	        siPClassification[0] = 0; //VerticalCut
      	        if (intersectPointY[1] > iyCorner[0] + imgHeight / 2) {
      	          siPClassification[1] = 0; //BottomHalf
      	          if (intersectPointX[1] > ixCorner[0] + imgWidth / 2)
                  {siPClassification[2] = 0;} else {siPClassification[2] = 1;}
      	        } else {
      	          siPClassification[1] = 1; //TopHalf
      	          if (intersectPointX[1] > ixCorner[0] + imgWidth / 2)
                  {siPClassification[2] = 0;} else {siPClassification[2] = 1;}
      	        }
      	      } else if (intersectPointY[1]) {
      	        siPClassification[0] = 1; //HorizontalCut
      	        if (intersectPointY[1] > iyCorner[0] + imgHeight / 2) {
      	          siPClassification[1] = 0; //BottomHalf
      	          if (intersectPointX[1] > ixCorner[0] + imgWidth / 2)
                  {siPClassification[2] = 0;} else {siPClassification[2] = 1;}
      	        } else {
      	          siPClassification[1] = 1; //TopHalf
      	          if (intersectPointX[1] > ixCorner[0] + imgWidth / 2)
                  {siPClassification[2] = 0;} else {siPClassification[2] = 1;}
      	        }
      	      }

              //console.log(fiPClassification[0] + " " + fiPClassification[1] + " " + fiPClassification[2] + " \n " + siPClassification[0] + " " + siPClassification[1] + " " + siPClassification[2] + " ")

              if (fiPClassification[0] == 0 && fiPClassification[1] == 1 && fiPClassification[2] == 1 && siPClassification[0] == 1 && siPClassification[1] == 1 && siPClassification[2] == 1) {
      	        cutPath = ("M " + intersectPointX[0] + " " + intersectPointY[0] + " L " + ixCorner[1] + " " + iyCorner[1] + " " + ixCorner[2] + " " + iyCorner[2] + " " + ixCorner[3] + " " + iyCorner[3] + " " + intersectPointX[1] + " " + intersectPointY[1] + " Z");
      	        imgMask[m] = s.path(cutPath).attr({fill: maskColor});
                imgHandle[0].attr({fill:"rgba(0,0,0,0)"});
      	        m++;
      	      }

              if (fiPClassification[0] == 0 && fiPClassification[1] == 1 && fiPClassification[2] == 1 && siPClassification[0] == 1 && siPClassification[1] == 0 && siPClassification[2] == 1) {
      	        cutPath = ("M " + intersectPointX[0] + " " + intersectPointY[0] + " L " + ixCorner[1] + " " + iyCorner[1] + " " + ixCorner[2] + " " + iyCorner[2] + " " + ixCorner[3] + " " + iyCorner[3] + " " + intersectPointX[1] + " " + intersectPointY[1] + " Z");
      	        imgMask[m] = s.path(cutPath).attr({fill: maskColor});
                imgHandle[0].attr({fill:"rgba(0,0,0,0)"});
      	        m++;
      	      }

      	      if (fiPClassification[0] == 0 && fiPClassification[1] == 1 && fiPClassification[2] == 0 && siPClassification[0] == 1 && siPClassification[1] == 1 && siPClassification[2] == 1) {
      	        cutPath = ("M " + intersectPointX[0] + " " + intersectPointY[0] + " L " + ixCorner[1] + " " + iyCorner[1] + " " + ixCorner[2] + " " + iyCorner[2] + " " + ixCorner[3] + " " + iyCorner[3] + " " + intersectPointX[1] + " " + intersectPointY[1] + " Z");
      	        imgMask[m] = s.path(cutPath).attr({fill: maskColor});
                imgHandle[0].attr({fill:"rgba(0,0,0,0)"});
      	        m++;
      	      }

      	      if (fiPClassification[0] == 0 && fiPClassification[1] == 1 && fiPClassification[2] == 0 && siPClassification[0] == 1 && siPClassification[1] == 0 && siPClassification[2] == 1) {
      	        cutPath = ("M " + intersectPointX[0] + " " + intersectPointY[0] + " L " + ixCorner[1] + " " + iyCorner[1] + " " + ixCorner[2] + " " + iyCorner[2] + " " + ixCorner[3] + " " + iyCorner[3] + " " + intersectPointX[1] + " " + intersectPointY[1] + " Z");
      	        imgMask[m] = s.path(cutPath).attr({fill: maskColor});
                imgHandle[0].attr({fill:"rgba(0,0,0,0)"});
      	        m++;
      	      }

      	      if (fiPClassification[0] == 0 && fiPClassification[1] == 0 && fiPClassification[2] == 1 && siPClassification[0] == 1 && siPClassification[1] == 0 && siPClassification[2] == 1) {
      	        cutPath = ("M " + ixCorner[0] + " " + iyCorner[0] + " L " + ixCorner[1] + " " + iyCorner[1] + " " + ixCorner[2] + " " + iyCorner[2] + " " + intersectPointX[0] + " " + intersectPointY[0] + " " + intersectPointX[1] + " " + intersectPointY[1] + " Z");
                imgMask[m] = s.path(cutPath).attr({fill: maskColor});
                imgHandle[3].attr({fill:"rgba(0,0,0,0)"});
      	        m++;
      	      }

      	      if (fiPClassification[0] == 0 && fiPClassification[1] == 0 && fiPClassification[2] == 1 && siPClassification[0] == 1 && siPClassification[1] == 1 && siPClassification[2] == 1) {
      	        cutPath = ("M " + ixCorner[0] + " " + iyCorner[0] + " L " + ixCorner[1] + " " + iyCorner[1] + " " + ixCorner[2] + " " + iyCorner[2] + " " + intersectPointX[0] + " " + intersectPointY[0] + " " + intersectPointX[1] + " " + intersectPointY[1] + " Z");
      	        imgMask[m] = s.path(cutPath).attr({fill: maskColor});
                imgHandle[3].attr({fill:"rgba(0,0,0,0)"});
      	        m++;
      	      }

      	      if (fiPClassification[0] == 0 && fiPClassification[1] == 0 && fiPClassification[2] == 0 && siPClassification[0] == 1 && siPClassification[1] == 0 && siPClassification[2] == 1) {
      	        cutPath = ("M " + ixCorner[0] + " " + iyCorner[0] + " L " + ixCorner[1] + " " + iyCorner[1] + " " + ixCorner[2] + " " + iyCorner[2] + " " + intersectPointX[0] + " " + intersectPointY[0] + " " + intersectPointX[1] + " " + intersectPointY[1] + " Z");
      	        imgMask[m] = s.path(cutPath).attr({fill: maskColor});
                imgHandle[3].attr({fill:"rgba(0,0,0,0)"});
      	        m++;
      	      }

      	      if (fiPClassification[0] == 0 && fiPClassification[1] == 0 && fiPClassification[2] == 0 && siPClassification[0] == 1 && siPClassification[1] == 1 && siPClassification[2] == 1) {
      	        cutPath = ("M " + ixCorner[0] + " " + iyCorner[0] + " L " + ixCorner[1] + " " + iyCorner[1] + " " + ixCorner[2] + " " + iyCorner[2] + " " + intersectPointX[0] + " " + intersectPointY[0] + " " + intersectPointX[1] + " " + intersectPointY[1] + " Z");
      	        imgMask[m] = s.path(cutPath).attr({fill: maskColor});
                imgHandle[3].attr({fill:"rgba(0,0,0,0)"});
      	        m++;
      	      }

      	      if (fiPClassification[0] == 0 && fiPClassification[1] == 1 && fiPClassification[2] == 0 && siPClassification[0] == 1 && siPClassification[1] == 1 && siPClassification[2] == 0) {
      	        cutPath = ("M " + ixCorner[0] + " " + iyCorner[0] + " L " + intersectPointX[0] + " " + intersectPointY[0] + " " + intersectPointX[1] + " " + intersectPointY[1] + " " + ixCorner[2] + " " + iyCorner[2] + " " + ixCorner[3] + " " + iyCorner[3] + " Z");
      	        imgMask[m] = s.path(cutPath).attr({fill: maskColor});
                imgHandle[1].attr({fill:"rgba(0,0,0,0)"});
      	        m++;
      	      }

      	      if (fiPClassification[0] == 0 && fiPClassification[1] == 1 && fiPClassification[2] == 0 && siPClassification[0] == 1 && siPClassification[1] == 0 && siPClassification[2] == 0) {
      	        cutPath = ("M " + ixCorner[0] + " " + iyCorner[0] + " L " + intersectPointX[0] + " " + intersectPointY[0] + " " + intersectPointX[1] + " " + intersectPointY[1] + " " + ixCorner[2] + " " + iyCorner[2] + " " + ixCorner[3] + " " + iyCorner[3] + " Z");
      	        imgMask[m] = s.path(cutPath).attr({fill: maskColor});
                imgHandle[1].attr({fill:"rgba(0,0,0,0)"});
      	        m++;
      	      }

      	      if (fiPClassification[0] == 0 && fiPClassification[1] == 1 && fiPClassification[2] == 1 && siPClassification[0] == 1 && siPClassification[1] == 1 && siPClassification[2] == 0) {
      	        cutPath = ("M " + ixCorner[0] + " " + iyCorner[0] + " L " + intersectPointX[0] + " " + intersectPointY[0] + " " + intersectPointX[1] + " " + intersectPointY[1] + " " + ixCorner[2] + " " + iyCorner[2] + " " + ixCorner[3] + " " + iyCorner[3] + " Z");
      	        imgMask[m] = s.path(cutPath).attr({fill: maskColor});
                imgHandle[1].attr({fill:"rgba(0,0,0,0)"});
      	        m++;
      	      }

      	      if (fiPClassification[0] == 0 && fiPClassification[1] == 1 && fiPClassification[2] == 1 && siPClassification[0] == 1 && siPClassification[1] == 0 && siPClassification[2] == 0) {
      	        cutPath = ("M " + ixCorner[0] + " " + iyCorner[0] + " L " + intersectPointX[0] + " " + intersectPointY[0] + " " + intersectPointX[1] + " " + intersectPointY[1] + " " + ixCorner[2] + " " + iyCorner[2] + " " + ixCorner[3] + " " + iyCorner[3] + " Z");
      	        imgMask[m] = s.path(cutPath).attr({fill: maskColor});
                imgHandle[1].attr({fill:"rgba(0,0,0,0)"});
      	        m++;
      	      }

      	      if (fiPClassification[0] == 1 && fiPClassification[1] == 0 && fiPClassification[2] == 0 && siPClassification[0] == 0 && siPClassification[1] == 0 && siPClassification[2] == 0) {
      	        cutPath = ("M " + ixCorner[0] + " " + iyCorner[0] + " L " + ixCorner[1] + " " + iyCorner[1] + " " + intersectPointX[0] + " " + intersectPointY[0] + " " + intersectPointX[1] + " " + intersectPointY[1] + " " + ixCorner[3] + " " + iyCorner[3] + " Z");
      	        imgMask[m] = s.path(cutPath).attr({fill: maskColor});
                imgHandle[2].attr({fill:"rgba(0,0,0,0)"});
      	        m++;
      	      }

      	      if (fiPClassification[0] == 1 && fiPClassification[1] == 1 && fiPClassification[2] == 0 && siPClassification[0] == 0 && siPClassification[1] == 0 && siPClassification[2] == 0) {
      	        cutPath = ("M " + ixCorner[0] + " " + iyCorner[0] + " L " + ixCorner[1] + " " + iyCorner[1] + " " + intersectPointX[0] + " " + intersectPointY[0] + " " + intersectPointX[1] + " " + intersectPointY[1] + " " + ixCorner[3] + " " + iyCorner[3] + " Z");
      	        imgMask[m] = s.path(cutPath).attr({fill: maskColor});
                imgHandle[2].attr({fill:"rgba(0,0,0,0)"});
      	        m++;
      	      }

      	      if (fiPClassification[0] == 1 && fiPClassification[1] == 0 && fiPClassification[2] == 0 && siPClassification[0] == 0 && siPClassification[1] == 0 && siPClassification[2] == 1) {
      	        cutPath = ("M " + ixCorner[0] + " " + iyCorner[0] + " L " + ixCorner[1] + " " + iyCorner[1] + " " + intersectPointX[0] + " " + intersectPointY[0] + " " + intersectPointX[1] + " " + intersectPointY[1] + " " + ixCorner[3] + " " + iyCorner[3] + " Z");
      	        imgMask[m] = s.path(cutPath).attr({fill: maskColor});
                imgHandle[2].attr({fill:"rgba(0,0,0,0)"});
      	        m++;
      	      }

      	      if (fiPClassification[0] == 1 && fiPClassification[1] == 1 && fiPClassification[2] == 0 && siPClassification[0] == 0 && siPClassification[1] == 0 && siPClassification[2] == 1) {
      	        cutPath = ("M " + ixCorner[0] + " " + iyCorner[0] + " L " + ixCorner[1] + " " + iyCorner[1] + " " + intersectPointX[0] + " " + intersectPointY[0] + " " + intersectPointX[1] + " " + intersectPointY[1] + " " + ixCorner[3] + " " + iyCorner[3] + " Z");
      	        imgMask[m] = s.path(cutPath).attr({fill: maskColor});
                imgHandle[2].attr({fill:"rgba(0,0,0,0)"});
      	        m++;
      	      }

      	      if (fiPClassification[0] == 0 && fiPClassification[1] == 1 && fiPClassification[2] == 1 && siPClassification[0] == 0 && siPClassification[1] == 0 && siPClassification[2] == 1) {
      	        cutPath = ("M " + ixCorner[1] + " " + iyCorner[1] + " L " + intersectPointX[0] + " " + intersectPointY[0] + " " + intersectPointX[1] + " " + intersectPointY[1] + " " + ixCorner[2] + " " + iyCorner[2] + " Z");
      	        imgMask[m] = s.path(cutPath).attr({fill: maskColor});
                imgHandle[0].attr({fill:"rgba(0,0,0,0)"});
                imgHandle[3].attr({fill:"rgba(0,0,0,0)"});
      	        m++;
      	      }

              if (fiPClassification[0] == 0 && fiPClassification[1] == 1 && fiPClassification[2] == 0 && siPClassification[0] == 0 && siPClassification[1] == 0 && siPClassification[2] == 0) {
      	        cutPath = ("M " + ixCorner[0] + " " + iyCorner[0] + " L " + intersectPointX[0] + " " + intersectPointY[0] + " " + intersectPointX[1] + " " + intersectPointY[1] + " " + ixCorner[3] + " " + iyCorner[3] + " Z");
      	        imgMask[m] = s.path(cutPath).attr({fill: maskColor});
                imgHandle[1].attr({fill:"rgba(0,0,0,0)"});
                imgHandle[2].attr({fill:"rgba(0,0,0,0)"});
      	        m++;
      	      }

      	      if (fiPClassification[0] == 1 && fiPClassification[1] == 1 && fiPClassification[2] == 0 && siPClassification[0] == 1 && siPClassification[1] == 1 && siPClassification[2] == 1) {
      	        cutPath = ("M " + ixCorner[3] + " " + iyCorner[3] + " L " + ixCorner[2] + " " + iyCorner[2] + " " + intersectPointX[0] + " " + intersectPointY[0] + " " + intersectPointX[1] + " " + intersectPointY[1] + " Z");
      	        imgMask[m] = s.path(cutPath).attr({fill: maskColor});
                imgHandle[0].attr({fill:"rgba(0,0,0,0)"});
                imgHandle[1].attr({fill:"rgba(0,0,0,0)"});
      	        m++;
      	      }

              if (fiPClassification[0] == 1 && fiPClassification[1] == 0 && fiPClassification[2] == 0 && siPClassification[0] == 1 && siPClassification[1] == 0 && siPClassification[2] == 1) {
      	        cutPath = ("M " + intersectPointX[1] + " " + intersectPointY[1] + " L " + intersectPointX[0] + " " + intersectPointY[0] + " " + ixCorner[1] + " " + iyCorner[1] + " " + ixCorner[0] + " " + iyCorner[0] + " Z");
      	        imgMask[m] = s.path(cutPath).attr({fill: maskColor});
                imgHandle[2].attr({fill:"rgba(0,0,0,0)"});
                imgHandle[3].attr({fill:"rgba(0,0,0,0)"});
      	        m++;
      	      }

              if (fiPClassification[0] == 0 && fiPClassification[1] == 1 && fiPClassification[2] == 1 && siPClassification[0] == 0 && siPClassification[1] == 0 && siPClassification[2] == 0) {
      	        path1 = ("M " + ixCorner[0] + " " + iyCorner[0] + " L " + intersectPointX[0] + " " + intersectPointY[0] + " " + intersectPointX[1] + " " + intersectPointY[1] + " " + ixCorner[3] + " " + iyCorner[3] + " Z");
      	        path2 = ("M " + ixCorner[1] + " " + iyCorner[1] + " L " + intersectPointX[0] + " " + intersectPointY[0] + " " + intersectPointX[1] + " " + intersectPointY[1] + " " + ixCorner[2] + " " + iyCorner[2] + " Z");
      	        if (Snap.path.isPointInside(path1, imgCx, imgCy)) {
      	          imgMask[m] = s.path(path1).attr({fill: maskColor});
                  imgHandle[1].attr({fill:"rgba(0,0,0,0)"});
                  imgHandle[2].attr({fill:"rgba(0,0,0,0)"});
      	        } else if (Snap.path.isPointInside(path2, imgCx, imgCy)) {
      	          imgMask[m] = s.path(path2).attr({fill: maskColor});
                  imgHandle[0].attr({fill:"rgba(0,0,0,0)"});
                  imgHandle[3].attr({fill:"rgba(0,0,0,0)"});}
      	        m++;

      	      }

              if (fiPClassification[0] == 0 && fiPClassification[1] == 1 && fiPClassification[2] == 0 && siPClassification[0] == 0 && siPClassification[1] == 0 && siPClassification[2] == 1) {
      	        path1 = ("M " + ixCorner[0] + " " + iyCorner[0] + " L " + intersectPointX[0] + " " + intersectPointY[0] + " " + intersectPointX[1] + " " + intersectPointY[1] + " " + ixCorner[3] + " " + iyCorner[3] + " Z");
      	        path2 = ("M " + ixCorner[1] + " " + iyCorner[1] + " L " + intersectPointX[0] + " " + intersectPointY[0] + " " + intersectPointX[1] + " " + intersectPointY[1] + " " + ixCorner[2] + " " + iyCorner[2] + " Z");

      	        if (Snap.path.isPointInside(path1, imgCx, imgCy)) {
      	          imgMask[m] = s.path(path1).attr({fill: maskColor});
                  imgHandle[1].attr({fill:"rgba(0,0,0,0)"});
                  imgHandle[2].attr({fill:"rgba(0,0,0,0)"});
      	        } else if (Snap.path.isPointInside(path2, imgCx, imgCy)) {
      	          imgMask[m] = s.path(path2).attr({fill: maskColor});
                  imgHandle[0].attr({fill:"rgba(0,0,0,0)"});
                  imgHandle[3].attr({fill:"rgba(0,0,0,0)"});}
      	        m++;
      	      }

              if (fiPClassification[0] == 1 && fiPClassification[1] == 0 && fiPClassification[2] == 0 && siPClassification[0] == 1 && siPClassification[1] == 1 && siPClassification[2] == 1) {
      	        path1 = ("M " + ixCorner[0] + " " + iyCorner[0] + " L " + ixCorner[1] + " " + iyCorner[1] + " " + intersectPointX[0] + " " + intersectPointY[0] + " " + intersectPointX[1] + " " + intersectPointY[1] + " Z");
      	        path2 = ("M " + ixCorner[3] + " " + iyCorner[3] + " L " + ixCorner[2] + " " + iyCorner[2] + " " + intersectPointX[0] + " " + intersectPointY[0] + " " + intersectPointX[1] + " " + intersectPointY[1] + " Z");

      	        if (Snap.path.isPointInside(path1, imgCx, imgCy)) {
      	          imgMask[m] = s.path(path1).attr({fill: maskColor});
                  imgHandle[2].attr({fill:"rgba(0,0,0,0)"});
                  imgHandle[3].attr({fill:"rgba(0,0,0,0)"});
      	        } else if (Snap.path.isPointInside(path2, imgCx, imgCy)) {
      	          imgMask[m] = s.path(path2).attr({fill: maskColor});
                  imgHandle[0].attr({fill:"rgba(0,0,0,0)"});
                  imgHandle[1].attr({fill:"rgba(0,0,0,0)"});}
      	        m++;
      	      }

              if (fiPClassification[0] == 1 && fiPClassification[1] == 1 && fiPClassification[2] == 0 && siPClassification[0] == 1 && siPClassification[1] == 0 && siPClassification[2] == 1) {
      	        path1 = ("M " + ixCorner[0] + " " + iyCorner[0] + " L " + ixCorner[1] + " " + iyCorner[1] + " " + intersectPointX[0] + " " + intersectPointY[0] + " " + intersectPointX[1] + " " + intersectPointY[1] + " Z");
      	        path2 = ("M " + ixCorner[3] + " " + iyCorner[3] + " L " + ixCorner[2] + " " + iyCorner[2] + " " + intersectPointX[0] + " " + intersectPointY[0] + " " + intersectPointX[1] + " " + intersectPointY[1] + " Z");

      	        if (Snap.path.isPointInside(path1, imgCx, imgCy)) {
      	          imgMask[m] = s.path(path1).attr({fill: maskColor});
                  imgHandle[2].attr({fill:"rgba(0,0,0,0)"});
                  imgHandle[3].attr({fill:"rgba(0,0,0,0)"});
      	        } else if (Snap.path.isPointInside(path2, imgCx, imgCy)) {
      	          imgMask[m] = s.path(path2).attr({fill: maskColor});
                  imgHandle[0].attr({fill:"rgba(0,0,0,0)"});
                  imgHandle[1].attr({fill:"rgba(0,0,0,0)"});}
      	        m++;
      	      }
              //console.log("got to post FI&SIP, got paths!.. ");

      	      minusm = m - 1;
                      //and here we add the mask to the exporting var:
      	      myMaskFrag[minusm] = imgMask[minusm].attr("d");

      	      if (touches == 2)
              {
                maskGroups.attr({mask: imgMask[minusm]});
              }
              if (touches == 1)
              {
      	        maskGroups.add(imgMask[minusm]);
      	        maskGroups.attr({fill: "white"});
                finalGroup = s.group(maskGroups, myImg);
                myImg.attr({mask: maskGroups});
              }

      	    }
              if (touchCuts == 2) {
                //console.log("touchCuts =  2 !!")
                  for(i=0; i<4; i++){
                    imgHandle[i].remove()
                  }
                  /*for(i=1; i<=touches; i++){
                    myLine[i].remove()
                  }*/
                  $(".handleSwitcher").addClass("unseen");
                  //myImgFrag = myImg.outerSVG();
                  $("#mySvg").off( "touchstart mousedown" );
                  $("#mySvg").off( "touchmove mousemove");
                  $("#mySvg").off( "touchend touchcancel mouseup");
                  finalGroup.data({maskF0:myMaskFrag[0],maskF2:myMaskFrag[1], imgURI:myImg.attr("href"), imgX:myImg.attr("x"), imgY:myImg.attr("y"),imgW:myImg.attr("width"),imgH:myImg.attr("height") });
                  finalGroup.ftCreateHandles();

                  $("#editorHolder").css({"overflow-y":"scroll"});
                  $("#leNextStepper").css({"display":"block"});


                  //console.log(myImgFrag);
                  //console.log(myMaskFrag);

                  //$("#mySvg").off();
                  //AND HERE, WE send the fragments & img data to the finalGroup

                  //console.log("the data is: ");console.log(finalGroup.data());
                  //  $("#mySvg").off( "touchend touchcancel mouseup", cutTouchEnd );
                }

      	      myLine[touches].remove();
              Ls=0;
              for (Ls in myLine)
              {
                myLine[Ls].remove();
              }
//      	      touches = touches - 1;

      	    gnStartX = "";
      	    gnStartY = "";
      	    gnEndX = "";
      	    gnEndY = "";
          });

            $("#detailStep").on("touchend mouseup", function(event)
          {

            $("#editorHolder").css({"visibility":"hidden"});
            $("#editorHelper").css({"display":"none"});

            $("#mySvg").css({"visibility":"hidden"});
            $("#mySvg").off( "touchend touchcancel mouseup");

            $("#detailsWindow").css({"display":"block"});
            $("#uploadMyPic").css({"display":"block"});
            $("#timerContainer").css({"display":"none"});

            //admob.cacheInterstitial();// load admob Interstitial

            if(AdMob) AdMob.prepareInterstitial( {adId:'ca-app-pub-5520633259009545/7928666319', autoShow:false} );

            $('#switchFDisplay').click(function(e){
              e.preventDefault(); // The flicker is a codepen thing
              $(this).toggleClass('toggle-on');
            });
          })

            $("#uploadMyPic").on("touchend mouseup", function(event)
            {
              $("#uploadMyPic").css({"display":"none"});
              $("#timerContainer").css({"display":"block"});

          var nextPager =0;

          feedCheck = 0;
          if($('#feedCheck').is(':checked') )
          {
          feedCheck = 1;
          }
          fullImgCheck=0;
          if($('#fullImgCheck').is(':checked') )
          {
          fullImgCheck = 1;
          }

          uploadPicDesc = $('#uploadPicDesc').val();


              function uploadPhoto(imgH, imgW, imgX, imgY, imageURI, mask1, mask2, scale, angle, tx, ty, nextPager) {
                  var options = new FileUploadOptions();
                  options.fileKey="file";
                  options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
                  options.mimeType="image/jpeg";
                  window.localStorage.setItem("lastPhotoUploadFName", (imageURI.substr(imageURI.lastIndexOf('/')+1)));

                  userCalibration = parseFloat(window.localStorage.getItem("myCalibration"));
                  sctpy = ty - (ty*userCalibration);

                  if(window.localStorage.getItem("myCalibration") == "hateToMakeYouSadButUrOnUrOwn")
                  {
                  sctpy = ty ;
                  }
                  window.localStorage.setItem("history", "feed");
                  //console.log("Sending TY = "+sctpy+"\n");
                  var params = new Object();
                  params.user = window.localStorage.getItem("loggedAs");
                  params.tracker = window.localStorage.getItem("tracker");
                  params.uuid = device.uuid;
                  params.devModel = device.version;
                  params.devPlatform = device.platform;
                  params.kollaj = "primary";
                  params.imgH = imgH;
                  params.imgW = imgW;
                  params.imgX = imgX;
                  params.imgY = imgY;
                  params.mask1 = mask1;
                  params.mask2 = mask2;
                  params.angle = angle;
                  params.scale = scale;
                  params.tx = tx;
                  params.ty = sctpy;
                  params.nextPager = nextPager;
                  params.feedCheck = feedCheck;
                  params.fullImgCheck = fullImgCheck;
                  params.uploadPicDesc = uploadPicDesc;


                  options.params = params;
                  options.chunkedMode = false;

                  var ft = new FileTransfer();
                  ft.upload(imageURI, "https://kollaj.net/bouncer.php", win, fail, options);
              }

              function win(r) {
          // here we redirect the user to the uploaded image, dont forget this XD

          //          alert("Code = " + r.responseCode.toString()+"\n");
          //        $("#uploadPicDesc").val("Response = " + r.response.toString()+"\n");
          //          alert("Sent = " + r.bytesSent.toString()+"\n");
                  //alert("Code Slayer!!!");
                  var the400kwh = Math.floor(Math.random()*(42-1+1)+1);
                  //alert (the400kwh);
                  if (the400kwh > 0)
                  {
                    if(AdMob) AdMob.showInterstitial();

                    window.localStorage.setItem("history", "feed");
                    if(window.localStorage.getItem("modal")==1)
                    {
                      window.localStorage.setItem("modal", 0);
                      $modal = $('.modal-frame');
                      $overlay = $('.modal-overlay');
                      $overlay.removeClass('state-show');
                      $modal.removeClass('state-appear').addClass('state-leave');
                    }

                    $('#vibeView').css({"display":"none"});

                    if($("#msg").is(":hidden")){messageState = 0}else{messageState = 1}
                    if($("#vibes").is(":hidden")){notificationState = 0}else{notificationState = 1}
                    if($("#chat").is(":visible")){chatState = 1}else{chatState = 0}

                    if(messageState == 1) {$("#msg").toggle()};
                    if(notificationState == 1) {$("#vibes").toggle()};
                    if(chatState == 1) {$("#chat").css({"display":"none"});$(".chatbox").css({"display":"none"})};

                    $("#profile").css({"display":"none"});
                    $("#searchRes").css({"display":"none"});
                    $("#feed").css({"display":"block"});
                    $("#feedRes").css({"display":"block"});
                    $("#mySvg").css({"display":"none"});

                    var arr = {canYou:"showMeMyFeed", myName:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform, roffset:0};
                    identify(arr);

                  }

                  stopper = 2;
                  $("#detailsWindow").css({"display":"none"});
                  $("#header").css({"display":"block"});
                  $("#mainNav").css({"visibility":"visible"});

                    $("#profile").css({"display":"none"});
                    $("#searchRes").css({"display":"none"});
                    $("#feed").css({"display":"block"});
                    $("#feedRes").css({"display":"block"});
                    $("#mySvg").css({"display":"none"});

              }

          // in case of error, we gotta say smth honestly lel SEE
              function fail(error) {
                  alert("An error has occurred: Code = " + error.code);

                  window.localStorage.setItem("history", "feed");

                  var arr = { canYou: "showMeMyFeed", myName: window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform: device.platform, roffset: 0 };
                  identify(arr);

                  $("#profile").css({ "display": "none" });
                  $("#searchRes").css({ "display": "none" });
                  $("#feed").css({ "display": "block" });
                  $("#feedRes").css({ "display": "block" });
                  $("#mySvg").css({ "display": "none" });

              }
              //console.log(window.localStorage.getItem("lastPhotoUploadFName")+ " and "+finalGroup.data("imgURI"));
              if(window.localStorage.getItem("lastPhotoUploadFName") != (finalGroup.data("imgURI").substr(finalGroup.data("imgURI").lastIndexOf('/')+1)) )
              {
              uploadPhoto(finalGroup.data("imgH") , finalGroup.data("imgW"), finalGroup.data("imgX") , finalGroup.data("imgY") , finalGroup.data("imgURI") , finalGroup.data("maskF0") , finalGroup.data("maskF2") , finalGroup.data("scale") , finalGroup.data("angle") , finalGroup.data("tx") , finalGroup.data("ty") , nextPager);
              $("#uploadMyPic").off("touchend mouseup");
              }

              return false;
            })

};
      function cutTouchStart (event, s, touches, centerPoint, myLine, gnStartX, gnStartY) {
	    myLine[touches] = s.line(gnStartX, gnStartY, gnStartX + 1, gnStartY + 1);
	    centerPoint.attr({
	      fill: "rgba(250,89,152, 0.2)"
	    });
	  };
	  function cutTouchMove(event, s, touches, centerPoint, myLine, gnStartX, gnStartY, gnEndX, gnEndY) {
      myLine[touches].attr({x1: gnStartX, y1: gnStartY, x2: gnEndX, y2: gnEndY, strokeWidth: 2, stroke: "rgba(0,0,0,0.4)",strokeLinecap: "round",strokeDasharray: 5});
	    centerPoint.attr({fill: "rgba(250,89,152, 0.5)"});
	  };




        var i=0;
        function welder (ih, iw, ix, iy, iURI, m1, m2, ang, scl, itx, ity)
        {
          function calcDistance(x1, y1, x2, y2) {
          return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
        }

          var s = Snap("#profileSVG");
          s.clear();//just add this piece of magic....
          //Crossbrowser window Width
          var width = document.getElementById("profileSVG").clientWidth;
          //Crossbrowser window Height
          var height = document.getElementById("profileSVG").clientHeight;

          var myImg = s.image(iURI, ix, iy, iw, ih);
          var mask1=s.path(m1).attr({fill:"white"});
          var mask2=s.path(m2).attr({fill:"white"});
          var maskGroups = s.group()

          maskGroups.add(mask1);
          maskGroups.attr({fill: "white"});

          finalGroup = s.group(maskGroups, myImg);

          myImg.attr({mask: maskGroups})
          maskGroups.attr({mask: mask2});

          var width = document.getElementById("profileSVG").clientWidth;
          var height = document.getElementById("profileSVG").clientHeight;

          maxWidth = width - (width/9);
          scaleF = maxWidth/iw;
          lftDis = itx*scaleF;
          topDis = ity*scaleF;
          absXCenter = (width/2);
          absYCenter = (height/2);

          var bb = finalGroup.getBBox();
          var diffX = absXCenter - bb.cx;
          var diffY = absYCenter - bb.cy;

          finalGroup.transform('T' + diffX + ',' + diffY + 'S'+scaleF+'R0');

          moveGroup=s.group(finalGroup);
//          console.log("first move, follow secondmove");
          moveGroup.transform('t' + lftDis + ',' + topDis + 's'+scl+'r'+ang);
          if (i==0)
          {
          var bb =moveGroup.getBBox();
          nd=(0-bb.cy)*2;
          //console.log(nd);
          moveGroup.transform('t' + lftDis + ',' + nd + 's'+scl+'r'+ang);
            i++;
          }
//         ("in place!?");
          return false;
        }

        function bringInTheAlertWindow()
        {
          window.localStorage.setItem("modal", 1);

          $("#whoAmIFollowing").css({"display":"none"});
          $("#whoAreMyFollowers").css({"display":"none"});

          $("#infiniteScrollModal").css({"display":"none"});
          $("#dasModal").css({"display":"block"});
          $("#dasModal").html("<p style='margin-top: 4rem;line-height: 1.4rem;font-size: 1.1rem; font-weight: 500;'> Thank you for the Alert! <br/> A human being will review this post very soon!</p>");
          $('.close').css({"top":"27%"});

          $modal = $('.modal-frame');
          $overlay = $('.modal-overlay');

           /* Need this to clear out the keyframe classes so they dont clash with each other between ener/leave. Cheers. */
           $modal.bind('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e){
             if($modal.hasClass('state-leave')) {
               $modal.removeClass('state-leave');
             }
           });

           $('.close').on('click', function(){
             window.localStorage.setItem("modal", 0);
             $overlay.removeClass('state-show');
             $modal.removeClass('state-appear').addClass('state-leave');
           });

           $overlay.addClass('state-show');
           $modal.removeClass('state-leave').addClass('state-appear');
        }


function bringInThePostSeeWindow(imgl)
{
  window.localStorage.setItem("modal", 1);

  $("#whoAmIFollowing").css({"display":"none"});
  $("#whoAreMyFollowers").css({"display":"none"});

  var arr = {canYou:"gimmeDatPostNfo", myName:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform, datPost:imgl};
  identify(arr);
  $("#infiniteScrollModal").css({"display":"none"});
  $("#dasModal").css({"display":"block"});
  $('.close').css({"top":"27%"});

  $modal = $('.modal-frame');
  $overlay = $('.modal-overlay');

   /* Need this to clear out the keyframe classes so they dont clash with each other between ener/leave. Cheers. */
   $modal.bind('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e){
     if($modal.hasClass('state-leave')) {
       $modal.removeClass('state-leave');
     }
   });

   $('.close').on('click', function(){
     window.localStorage.setItem("modal", 0);
     $overlay.removeClass('state-show');
     $modal.removeClass('state-appear').addClass('state-leave');
   });

   $overlay.addClass('state-show');
   $modal.removeClass('state-leave').addClass('state-appear');

  //console.log("trying to retrieve thePostSeeWindow for "+imgl);
}


function callDaProfileMenu(daProfile)
{
  $("#whoAmIFollowing").css({"display":"none"});
  $("#whoAreMyFollowers").css({"display":"none"});

  //lil' fix
  if (window.localStorage.getItem("history") == "profileMenu" || window.localStorage.getItem("history")=="profile" || window.localStorage.getItem("history"=="smProfile"))
  {
    window.localStorage.setItem("modal", 0);
  }

  if(window.localStorage.getItem("modal") != 0 && window.localStorage.getItem("modal") != 'null' )
  {
    //console.log("fireA")
    $modal = $('.modal-frame');
    $overlay = $('.modal-overlay');
    window.localStorage.setItem("modal", 0);
    $overlay.removeClass('state-show');
    $modal.removeClass('state-appear').addClass('state-leave');
  }
  else {
    //console.log("fireB")
    $("#whoAmIFollowing").css({"display":"none"});
    $("#whoAreMyFollowers").css({"display":"none"});
    window.localStorage.setItem("modal", 1);
    window.localStorage.setItem("forProfile", 0);

    $("#deepMenu").css({"display":"none"});
    $('.close').css({"top":"6.5rem"});
    $("#dasModal").html("");
    $("#infiniteScrollModal").css({"display":"block"});

    if (daProfile !== window.localStorage.getItem("loggedAs"))
    {
      window.localStorage.setItem('history', 'smProfile');
      window.localStorage.setItem('historyPMen', daProfile);
      //console.log("otherPplsProf");
      var arr = {canYou:"gimmeDatProfileNfo", myName:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform, datProfile:daProfile};
      identify(arr);
    }
    else {
      $("#section-one").html("Following <span style='font-weight:200'> > </span>");
      $("#section-two").html(" <span style='font-weight:200'> > </span> Followers");
      $("#section-three").html("Avatar, Bio & Settings");
      $("#section-four").html("Sign Out!");
      $("#last").html("About Kollaj");

      $("#last").css({"display":"block"});



      theCss = $("#whereuputurppic").css("background-image");
      $("#ppicindaModal").css({"background-image":theCss});

      $("#section-one").one('click',function()
      {
        if(window.localStorage.getItem("forProfile") != 1)
        {
          window.localStorage.setItem('history', 'profileMenu');
          window.localStorage.setItem('historyPMen', window.localStorage.getItem("loggedAs"));
          $("#infiniteScrollModal").css({"display":"none"});
          $("#dasModal").css({"display":"none"});
          $("#deepMenu").css({"display":"none"});
          $("#whoAmIFollowing").css({"display":"block"});
          $("#whoAreMyFollowers").css({"display":"none"});
          var arr = {canYou:"tellMeWhoIFollow", myName:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform};
          identify(arr);

          //console.log("profile-pic opt!");
        }
        return false;
      });
      $("#section-two").one('click',function()
      {
        if(window.localStorage.getItem("forProfile") != 1)
        {
          window.localStorage.setItem('history', 'profileMenu');
          window.localStorage.setItem('historyPMen', window.localStorage.getItem("loggedAs"));
          $("#infiniteScrollModal").css({"display":"none"});
          $("#dasModal").css({"display":"none"});
          $("#deepMenu").css({"display":"none"});
          $("#whoAmIFollowing").css({"display":"none"});
          $("#whoAreMyFollowers").css({"display":"block"});

          var arr = {canYou:"tellMeWhoFollowsMe", myName:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform};
          identify(arr);

          //console.log("profile-desc opt!");
          return false;
        }
        return false;
      });
      $("#section-three").one('click',function()
      {
        if(window.localStorage.getItem("forProfile") != 1)
        {
          window.localStorage.setItem('history', 'profileMenu');
          window.localStorage.setItem('historyPMen', window.localStorage.getItem("loggedAs"));
          $("#deepMenu").css({"display":"block"});
          $("#deepMenuChooser").css({"display":"block"});
          $("#myNameSet").css({"display":"none"});
          $("#myBioSet").css({"display":"none"});
          $("#myPassSet").css({"display":"none"});
          $("#myEmailSet").css({"display":"none"});
          //console.log("profile-security opt!");
          return false;
        }
      });
      $("#section-four").one('click',function()
      {
        if(window.localStorage.getItem("forProfile") != 1)
        {
          window.localStorage.setItem('history', 'profileMenu');
          window.localStorage.setItem('modal', 0);
          window.localStorage.setItem('historyPMen', window.localStorage.getItem("loggedAs"));
          //console.log("profile-sign-out opt!");
          var arr = {canYou:"sayBye", myName:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform};
          identify(arr);
          return false;
        }
      });
      $("#last").one('click',function()
      {
        if(window.localStorage.getItem("forProfile") != 1)
        {
          window.localStorage.setItem('history', 'profileMenu');
          window.localStorage.setItem('historyPMen', window.localStorage.getItem("loggedAs"));
          $("#mainContainer").css({"display":"none"});
          $(".modal-frame").css({"display":"none"});
          $("#header").css({"display":"none"});
          $("#abt").css({"display":"block"});
          //console.log("About Kollaj!");
          return false;
        }
      });


  }


      //console.log("ur profile");
  }


  $modal = $('.modal-frame');
  $overlay = $('.modal-overlay');

   /* Need this to clear out the keyframe classes so they dont clash with each other between ener/leave. Cheers. */
   $modal.bind('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e){
     if($modal.hasClass('state-leave')) {
       $modal.removeClass('state-leave');
     }
   });

   $('.close').on('click', function(){
     window.localStorage.setItem("modal", 0);
     $overlay.removeClass('state-show');
     $modal.removeClass('state-appear').addClass('state-leave');
   });

   $overlay.addClass('state-show');
   $modal.removeClass('state-leave').addClass('state-appear');

  //console.log("trying to retrieve daProfileMenu for "+daProfile);
}




window.localStorage.setItem('history', 'feed');
    //console.log("alo!");
      var rafID;

      var dragEl = document.getElementById('picker')
      var ulEl = document.getElementById('mood-list')
      var ulHeight = ulEl.offsetHeight
      var liEls = ulEl.querySelectorAll('li')
      var liCount = liEls.length
      var liHeight = ulHeight / liCount
      var currentActive = 9;
      var distance = 1;
      var position = ulHeight;
      var velocity = 5;
      var friction = 0.8;
      var isDragging = false;
      var dragPositionY = position;
      var targetBound = 15;
      var attractionStrength = 0.05;
      var topBound = 0;
      var bottomBound = ulHeight - liHeight;

      function inverse(num, min, max) {
        return (max + min) - num;
      }

      function animate() {
        update();
        render();
        // stop animation loop if inertia has ended
        if (Math.round(Math.abs(velocity) * 100) / 100 <= 0.01 && !isDragging) {
          //console.log("stopping  due to inertia");
          carefullyPutItBackThere()
        } else {
          rafID = requestAnimationFrame( animate );
        }
      }

      function getThatThingOutOfThere() {
        if (!rafID) {
          isDragging = true;
          animate();
        }
        cntr =1;
      }

      function carefullyPutItBackThere() {
        if (rafID) {
          cancelAnimationFrame(rafID);

          window.localStorage.setItem("currentVote",inverse(currentActive, 0, liCount));
          $("#thatThing").css({"display":"none"});
          $("#header").css({"display":"block"});
          vibes = window.localStorage.getItem("currentVote");
          imVibing = window.localStorage.getItem("gonnaVoteFor");

          if(imVibing != 0)
          {
            var arr = {canYou:"letMeVibeAPost", myName:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform, imVibing: imVibing, vibes:vibes};
            identify(arr);
          }

          window.localStorage.setItem("currentVote","NaN")
          window.localStorage.setItem("gonnaVoteFor", 0);
          rafID = undefined;
        }
      }


      function applyTopBoundForce() {
        if ( isDragging || position >= topBound ) {
          return;
        }
        // bouncing past bound
        var distance = topBound+1 - position;
        var force = distance * 0.1;
        // calculate resting position with this force
        var rest = position + ( velocity + force ) / ( 1 - friction );
        // apply force if resting position is out of bounds
        if ( rest <= topBound ) {
          applyForce( force );
          return;
        }
        // if in bounds, apply force to align at bounds
        force = distance * 0.1 - velocity;
        applyForce( force );
      }

      function applyBottomBoundForce() {
        if ( isDragging || position < bottomBound ) {
          return;
        }
        var distance = bottomBound - position;
        var force = distance * 0.1;
        var rest = position + ( velocity + force ) / ( 1 - friction );
        if ( rest > bottomBound ) {
          applyForce( force );
          return;
        }
        force = distance * 0.1 - velocity;
        applyForce( force );
      }


      function update() {
        applyTopBoundForce();
        applyBottomBoundForce();

        // create attraction points for each <li>
        for (var i = 0; i < liCount; i++) {
          var element = i * liHeight;
          currentActive = Math.round(position / liHeight);
          attract(element);


          // current active cant be less than 0
          if (currentActive < 0) {
            currentActive = 0
          }
          // current active cant be more than the number of <li>
          if (currentActive >= liCount) {
            currentActive = liCount - 1
          }


            // only change classes when inertia has come to rest to avoid dom thrash
          if (Math.floor(Math.abs(velocity)) !== 0) {
            liEls[i].classList.remove('active');
            liEls[currentActive].classList.add('active');

           if (currentActive==0)
             {
           $("#thatThing").css({"background":"#a91bb0"})
                 }
           if (currentActive==1)
             {
           $("#thatThing").css({"background":"#bd2867"})
                 }
           if (currentActive==2)
             {
           $("#thatThing").css({"background":"#b80808"})
                 }
           if (currentActive==3)
             {
           $("#thatThing").css({"background":"#f77a0c"})
                 }
           if (currentActive==4)
             {
           $("#thatThing").css({"background":"#f1ab00"})
               }
           if (currentActive==5)
             {
           $("#thatThing").css({"background":"#f8ea08"})
               }
           if (currentActive==6)
             {
           $("#thatThing").css({"background":"#b7f808"})
               }
           if (currentActive==7)
             {
           $("#thatThing").css({"background":"#73de3f"})
               }
           if (currentActive==8)
             {
           $("#thatThing").css({"background":"#1acf80"})
               }
           if (currentActive==9)
             {
           $("#thatThing").css({"background":"#07aeb0"})
               }

          }

        }

        // drag
        applyDragForce();
        // integrate physics
        velocity *= friction;
        position += velocity;
      }

      function attract( target ) {
        // attraction
        distance = target - position;
        // attract if within bounds
        var attraction = Math.abs( distance ) <= targetBound ? distance * attractionStrength : 0;
        applyForce( attraction );
      }

      function applyForce( force ) {
        velocity += force;
      }

      function applyDragForce() {
        if ( !isDragging ) {
          return;
        }
        var dragVelocity = dragPositionY - position;
        var dragForce = dragVelocity - velocity;
        applyForce( dragForce );
      }

      function render() {
        position = Math.round(position * 100) / 100
        dragEl.style.transform = `translateY(${position}px)`
      }


      // ----- interaction events ----- //

      var interactionY;
      var dragStartPositionY;

      dragEl.addEventListener( 'touchstart', function( event ) {
        cntr = 1;
        velocity = 1;

        getThatThingOutOfThere()
        isDragging = true;
        interactionY = event.touches[0].pageY;

        dragStartPositionY = position;
        setDragPosition( event );
        window.addEventListener( 'touchmove', setDragPosition );
        window.addEventListener( 'touchend', onInteractionEnd );
      });

      dragEl.addEventListener( 'mousedown', function( event ) {

        velocity = 1;

        getThatThingOutOfThere()
        isDragging = true;
        interactionY = event.pageY;
        dragStartPositionY = position;


        setDragPosition( event );
        window.addEventListener( 'mousemove', setDragPosition );
        window.addEventListener( 'mouseup', onInteractionEnd );
      });

      function setDragPosition( event ) {
        var move;
        if (event.type === 'touchmove' || event.type === 'touchstart') {
          move = event.touches[0].pageY - interactionY;
        } else {
          move = event.pageY - interactionY;
        }
        dragPositionY = dragStartPositionY + move;
        //event.preventDefault();
        return false;
      }

      function onInteractionEnd() {
        isDragging = false;
        window.removeEventListener( 'mousemove', setDragPosition );
        window.removeEventListener( 'mouseup', onInteractionEnd );
        window.removeEventListener( 'touchmove', setDragPosition );
        window.removeEventListener( 'touchend', onInteractionEnd );
      }
      getThatThingOutOfThere();
      $("#thatThing").css({"display":"none"});
      $("#mySvg").css({"display":"none"});


      $("#questionIcon").on('touchend touchcancel mouseup', function(event) {
        if($("#helpHolder").is(":hidden")){hHolder = 0}else{hHolder = 1}
        if(hHolder == 0)
        {
          $("#helpHolder").css({"display":"block"});
        }
        if(hHolder == 1)
        {
          $("#helpHolder").css({"display":"none"});
        }

        if($("#calibrateHolder").is(":hidden")){cHolder = 0}else{cHolder = 1}
        if(cHolder == 1)
        {
          $("#calibrateHolder").css({"display":"none"});
        }

        //console.log("THEY ARE CALLING ME!!!!");
        event.preventDefault();
      });
      $("#calibrationTool").on('touchend touchcancel mouseup', function(event) {
        if($("#calibrateHolder").is(":hidden")){cHolder = 0}else{cHolder = 1}
        if(cHolder == 0)
        {
          $("#calibrateHolder").css({"display":"block"});
        }
        if(cHolder == 1)
        {
          $("#calibrateHolder").css({"display":"none"});
        }

        if($("#helpHolder").is(":hidden")){hHolder = 0}else{hHolder = 1}
        if(hHolder == 1)
        {
          $("#helpHolder").css({"display":"none"});
        }

        event.preventDefault();
      });

      if(window.localStorage.getItem('myCalibration') === null || window.localStorage.getItem('myCalibration') == "undefined" || window.localStorage.getItem('myCalibration') == "hateToMakeYouSadButUrOnUrOwn")
      {
        var arr = {canYou:"calibrateMePLZ", uuid: device.uuid, model: device.model, manufacturer:device.manufacturer};
        identify(arr);
      }

      var calibrationRanger = document.querySelector('#calibrationRanger');

      var rangeValue = function(){
        var newValue = calibrationRanger.value;
        var target = document.querySelector('.calibrationValue');
        target.innerHTML = newValue;
      }

      var rangeUpdate = function(){
        if(window.localStorage.getItem('myCalibration') != newValue )
        {
          var newValue = calibrationRanger.value;
          window.localStorage.setItem("myCalibration", newValue);
          var arr = {canYou:"letMeCalibrateThisShit", myName:window.localStorage.getItem("loggedAs"), whatShallBeIt: newValue, tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform, model: device.model, manufacturer: device.manufacturer};
          identify(arr);
        }
      }

      calibrationRanger.addEventListener("input", rangeValue);
      calibrationRanger.addEventListener("touchend", rangeUpdate);
      calibrationRanger.addEventListener("mouseup", rangeUpdate);

      $("#setMyAvatar").on('touchend mouseup', function(event) {

        navigator.camera.getPicture(onSuccess, onFail, {
          quality: 100,
          destinationType: Camera.DestinationType.NATIVE_URI,
          sourceType: 0,
          encodingType: Camera.EncodingType.JPEG,
          allowEdit: false,
          encodingType: 0,
          targetWidth: 1920,
          targetHeight: 1080,
          direction: 0,
          saveToPhotoAlbum: true
        });

        function onSuccess(imageData) {
          //just to be sure

            function setRepresenter(imageURI) {
                var options = new FileUploadOptions();
                options.fileKey="file";
                options.fileName=imageURI.substr(imageURI.lastIndexOf('/')+1);
                options.mimeType="image/jpeg";

                var params = new Object();
                params.user = window.localStorage.getItem("loggedAs");
                params.tracker = window.localStorage.getItem("tracker");
                params.uuid = device.uuid;
                params.devModel = device.version;
                params.devPlatform = device.platform;
                params.iHave = "choosenToRepresent";

                options.params = params;
                options.chunkedMode = false;

                var ft = new FileTransfer();
                ft.upload(imageURI, "https://kollaj.net/bouncer.php", win, fail, options);
            }

            function win(r) {
        // here we redirect the user to the uploaded image, dont forget this XD
        $modal = $('.modal-frame');
        $overlay = $('.modal-overlay');
        window.localStorage.setItem("modal", 0);
        $overlay.removeClass('state-show');
        $modal.removeClass('state-appear').addClass('state-leave');
        var arr = {canYou:"showMeSomeProfile", myName:window.localStorage.getItem("loggedAs"), seeProfile:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform, proffset: window.localStorage.getItem("mproffset") };
        identify(arr);
        //          alert("Code = " + r.responseCode.toString()+"\n");
        //        $("#uploadPicDesc").val("Response = " + r.response.toString()+"\n");
        //          alert("Sent = " + r.bytesSent.toString()+"\n");
                //alert("Code Slayer!!!");
            }

        // in case of error, we gotta say smth honestly lel SEE
            function fail(error) {
                alert("An error has occurred: Code = " + error.code);
            }

            setRepresenter(imageData);
            $("#deepMenu").css({"display":"none"});

        }

        function onFail(message) {
            $("#deepMenu").css({"display":"none"});
        }

        return false;
      });

            $("#setMyName").on('touchend mouseup', function(event) {
              $("#deepMenuChooser").css({"display":"none"});
              $("#myNameSet").css({"display":"block"});
              if (window.localStorage.getItem("realName") != null)
              {
              $("#myNameIs").val(window.localStorage.getItem("realName"))
              }
              else {
                var arr = {canYou:"giveMeMyName", myName:window.localStorage.getItem("loggedAs"), seeProfile:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform };
                identify(arr);
              }
              return false;
            });

            $("#myNameSaver").on('touchend mouseup', function(event) {
              myNewName = $("#myNameIs").val();
              var arr = {canYou:"setMyName", myNewName:myNewName, myName:window.localStorage.getItem("loggedAs"), seeProfile:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform };
              identify(arr);
              $("#deepMenuChooser").css({"display":"block"});
              $("#myNameSet").css({"display":"none"});
              $("#deepMenu").css({"display":"none"});
              $modal = $('.modal-frame');
              $overlay = $('.modal-overlay');
              window.localStorage.setItem("modal", 0);
              $overlay.removeClass('state-show');
              $modal.removeClass('state-appear').addClass('state-leave');
              return false;
            });


            $("#setMyBio").on('touchend mouseup', function(event) {
              $("#deepMenuChooser").css({"display":"none"});
              $("#myBioSet").css({"display":"block"});
              if (window.localStorage.getItem("myBio") != null)
              {
              $("#currentBio").html(window.localStorage.getItem("myBio"))
              }
              else {
                var arr = {canYou:"giveMeMyBio", myName:window.localStorage.getItem("loggedAs"), seeProfile:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform };
                identify(arr);
              }
              return false;
            });


            $("#myBioSaver").on('touchend mouseup', function(event) {
              myNewBio = $("#myBioIs").val();
              var arr = {canYou:"setMyBio", myNewBio:myNewBio, myName:window.localStorage.getItem("loggedAs"), seeProfile:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform };
              identify(arr);
              $("#deepMenuChooser").css({"display":"block"});
              $("#myBioSet").css({"display":"none"});
              $("#deepMenu").css({"display":"none"});
              $modal = $('.modal-frame');
              $overlay = $('.modal-overlay');
              window.localStorage.setItem("modal", 0);
              $overlay.removeClass('state-show');
              $modal.removeClass('state-appear').addClass('state-leave');
              return false;
            });


            $("#setMyEmail").on('touchend mouseup', function(event) {
              $("#deepMenuChooser").css({"display":"none"});
              $("#myEmailSet").css({"display":"block"});
              if (window.localStorage.getItem("myEmail") != null)
              {
              $("#myEmailIs").val(window.localStorage.getItem("myEmail"))
              }
              else {
                var arr = {canYou:"giveMeMyMail", myName:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform };
                identify(arr);
              }
              return false;
            });

            $("#myEmailIs").on("change paste keyup", function() {
            email =$(this).val();
            var re = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            if(re.test(email))
            {
              $(this).css({background:"rgba(0,255,0,0.4)"})
              emailPass=1;
            }
            else {
              $(this).css({background:"rgba(255,0,0,0.4)"})
              emailPass=0;
            }

            if(emailPass == 1)
            {
              var arr = {canYou:"doEmailThings", iWanna:"justSearch", myNewEmail:email, myName:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform };
              identify(arr);
            }
            });


            $("#myEmailSaver").on('touchend mouseup', function(event) {
              if(window.localStorage.getItem("emailCheck") == "yes")
              {
                myNewEmail = $("#myEmailIs").val();
                var arr = {canYou:"doEmailThings", myNewEmail:myNewEmail, iWanna:"imGonnaUpdate", myName:window.localStorage.getItem("loggedAs"), seeProfile:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform };
                identify(arr);
                $("#deepMenuChooser").css({"display":"block"});
                $("#myNameSet").css({"display":"none"});
                $("#deepMenu").css({"display":"none"});
                $modal = $('.modal-frame');
                $overlay = $('.modal-overlay');
                window.localStorage.setItem("modal", 0);
                $overlay.removeClass('state-show');
                $modal.removeClass('state-appear').addClass('state-leave');
                return false;

              }
              });

              $("#setMyPass").on('touchend mouseup', function(event) {
                $("#deepMenuChooser").css({"display":"none"});
                $("#myPassSet").css({"display":"block"});
                return false;
              });

              $("#myPassSaver").on('touchend mouseup', function(event) {
                myOldPass = $("#myOldPass").val();
                myNewPass = $("#myNewPass").val();
                ohAndMyOldPassCryptedAsWell = keccak_384(myOldPass)
                myNewSuperCryptoMegaPassYoMaMen = keccak_384(myNewPass);
                var arr = {canYou:"changeMyPass", myOldPass:ohAndMyOldPassCryptedAsWell, myNewPass:myNewSuperCryptoMegaPassYoMaMen, myName:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform };
                identify(arr);
                return false;
              });

              if(window.localStorage.getItem('modal') == 0)
              {
                $modal = $('.modal-frame');
                $overlay = $('.modal-overlay');
                window.localStorage.setItem("modal", 0);
                $overlay.removeClass('state-show');
                $modal.removeClass('state-appear').removeClass('state-leave');
              }

              document.addEventListener("backbutton", function(e){
              ahistory = window.localStorage.getItem('history');
              //console.log ("automated goto: " + ahistory);
              if(ahistory == "exit") {
                navigator.app.backHistory()
              }
              if(ahistory == "loginContainer")
              {
                $("#registerContainer").toggle();
                $("#linputContainer").toggle();
                window.localStorage.setItem("history", "exit");
              }
              if(ahistory == "thatThing")
              {
                carefullyPutItBackThere();
                window.localStorage.setItem("history", "feed");
                if(window.localStorage.getItem("modal")==1)
                {
                  window.localStorage.setItem("history", "smProfile");
                }
              }
              if(ahistory == "feed"){
                  e.preventDefault();
                  window.localStorage.setItem('history', "exit");

                  $("#header").css({"display":"block"});
                  $("#mainNav").css({"visibility":"visible"});
                  $("#mySvg").css({"display":"none"});
                  $("#editorHolder").css({"visibility":"hidden"});
                  $("#editorHelper").css({"display":"none"});
                  $("#lesArrowHolder").css({"display":"none"});
                  $("#leNextStepper").css({"display":"none"});

                  if(window.localStorage.getItem("modal")==1)
                  {
                    window.localStorage.setItem("modal", 0);
                    $modal = $('.modal-frame');
                    $overlay = $('.modal-overlay');
                    $overlay.removeClass('state-show');
                    $modal.removeClass('state-appear').addClass('state-leave');
                  }
                  $('#vibeView').css({"display":"none"});
                  if($("#msg").is(":hidden")){messageState = 0}else{messageState = 1}
                  if($("#vibes").is(":hidden")){notificationState = 0}else{notificationState = 1}
                  if($("#chat").is(":visible")){chatState = 1}else{chatState = 0}
                  if(messageState == 1) {$("#msg").toggle()};
                  if(notificationState == 1) {$("#vibes").toggle()};
                  if(chatState == 1) {$("#chat").css({"display":"none"});$(".chatbox").css({"display":"none"})};
                  $("#profile").css({"display":"none"});
                  $("#searchRes").css({"display":"none"});
                  $("#feed").css({"display":"block"});
                  $("#feedRes").css({"display":"block"});
                  $("#mySvg").css({"display":"none"});
              }
              if(ahistory == "search")
              {
                e.preventDefault();
                window.localStorage.setItem('history', "feed");
                if(window.localStorage.getItem("modal")==1)
                {
                  window.localStorage.setItem("modal", 0);
                  $modal = $('.modal-frame');
                  $overlay = $('.modal-overlay');
                  $overlay.removeClass('state-show');
                  $modal.removeClass('state-appear').addClass('state-leave');
                }
                $('#vibeView').css({"display":"none"});
                if($("#msg").is(":hidden")){messageState = 0}else{messageState = 1}
                if($("#vibes").is(":hidden")){notificationState = 0}else{notificationState = 1}
                if($("#chat").is(":visible")){chatState = 1}else{chatState = 0}
                if(messageState == 1) {$("#msg").toggle()};
                if(notificationState == 1) {$("#vibes").toggle()};
                if(chatState == 1) {$("#chat").css({"display":"none"});$(".chatbox").css({"display":"none"})};
                $("#feed").css({"display":"block"});
                $("#mySvg").css({"display":"none"});
                $("#feedRes").css({"display":"none"});
                $("#searchRes").css({"display":"block"});
                $("#profile").css({"display":"none"});
              }
              if(ahistory == "smProfile")
              {
                $modal = $('.modal-frame');
                $overlay = $('.modal-overlay');
                window.localStorage.setItem("modal", 0);
                $overlay.removeClass('state-show');
                $modal.removeClass('state-appear').addClass('state-leave');
              }
              if(ahistory == "profile")
              {
                if(window.localStorage.getItem("modal") != 0 && window.localStorage.getItem("modal") != 'null' )
                {
                  $modal = $('.modal-frame');
                  $overlay = $('.modal-overlay');
                  window.localStorage.setItem("modal", 0);
                  $overlay.removeClass('state-show');
                  $modal.removeClass('state-appear').addClass('state-leave');
                }

                $("#mySvg").css({"display":"none"});
                var arr1 = {canYou:"giveMeMyStats", myName:window.localStorage.getItem("loggedAs"), tracker: window.localStorage.getItem("tracker"), uuid: device.uuid, devModel: device.version, devPlatform:device.platform}
                identify (arr1);
                if($("#msg").is(":hidden")){messageState = 0}else{messageState = 1}
                if($("#vibes").is(":hidden")){notificationState = 0}else{notificationState = 1}
                if($("#chat").is(":visible")){chatState = 1}else{chatState = 0}
                if($("#takePicture").is(":visible")){takePictureState = 1}else{takePictureState = 0}
                if(messageState == 1) {$("#msg").toggle()};
                if(notificationState == 1) {$("#vibes").toggle()};
                if(chatState == 1) {$("#chat").css({"display":"none"});$(".chatbox").css({"display":"none"})};
                if(takePictureState == 1) {$("#takePicture").css({"display":"none"});};
                $("#profileName").html("<div id='callProfAction' class='arrow' data-seeProf='"+window.localStorage.getItem("loggedAs")+"'>@"+window.localStorage.getItem("loggedAs")+"</div>");
                $("#callProfAction").click (function()
                {
                  callDaProfileMenu(window.localStorage.getItem("loggedAs"));
                  //console.log(window.localStorage.getItem("loggedAs"));
                });
                $("#profileFollowing").html(window.localStorage.getItem("myProfileFollowing"));
                $("#profileFollowers").html(window.localStorage.getItem("myProfileFollowers"));
                $("#profile").css({"display":"block"});

              }
              if (ahistory == 'profileMenu')
              {
                $("#mainContainer").css({"display":"block"});
                $(".modal-frame").css({"display":"block"});
                $("#header").css({"display":"block"});
                $("#abt").css({"display":"none"});
                callDaProfileMenu(window.localStorage.getItem("historyPMen"));
              }
              if(ahistory == "notifications")
              {
                window.localStorage.setItem("history", "feed");
                $("#mySvg").css({"display":"none"});

              if(window.localStorage.getItem("modal")==1)
              {
                window.localStorage.setItem("modal", 0);
                $modal = $('.modal-frame');
                $overlay = $('.modal-overlay');
                $overlay.removeClass('state-show');
                $modal.removeClass('state-appear').addClass('state-leave');
              }

              if($("#msg").is(":visible")){messageState = 1}else{messageState = 0}
              if($("#profile").is(":visible")){profileState = 1}else{profileState = 0}
              if($("#feed").is(":visible")){feedState = 1}else{feedState = 0}
              if($("#sendPicture").is(":visible")){sendPicState = 1}else{sendPicState = 0}
              if($("#chat").is(":visible")){chatState = 1}else{chatState = 0}

              if(messageState == 1) {$("#msg").toggle()};
              if(profileState == 1) {$("#profile").toggle()};
              if(feedState == 1) {$("#feed").toggle()};
              if(sendPicState == 1) {$("#sendPicture").toggle()};
              if(chatState == 1) {$("#chat").css({"display":"none"});$(".chatbox").css({"display":"none"})};

              $('#vibes').css({"display":"block"});
              }

              if(ahistory == "callEd")
              {
                var s = Snap("#mySvg");
                myImgToDelete = Snap.select("#editImg");
                myImgToDelete.remove();
                photoSrc = window.localStorage.getItem("photoSrcUndo");
                cWidth = window.localStorage.getItem("photoCWidthUndo");
                cHeight = window.localStorage.getItem("photoCHeightUndo");
                bringinTheEditor(photoSrc, cWidth, cHeight);
                window.localStorage.setItem("history", "feed");
                var $editorHolder = $("#editorHolder");
                $editorHolder.animate({ scrollTop: 0 });
              }

              }, false);

              $("#callProfAction").click(function(){
                  if($(".modal-frame").hasClass("state-appear"))
                {
                  $modal = $('.modal-frame');
                  $overlay = $('.modal-overlay');
                  window.localStorage.setItem("modal", 0);
                  $overlay.removeClass('state-show');
                  $modal.removeClass('state-appear').addClass('state-leave');
                }
              });

      $(".modal-frame").removeClass("state-leave");

      var arr = { canYou: "tellMeIfMyVerIsOk", client: 11, uuid: device.uuid, devModel: device.version, devPlatform: device.platform };
      identify(arr);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {//console.log('Received Event: ' + id);
  }

};
