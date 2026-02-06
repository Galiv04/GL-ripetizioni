// testing
// user = "xxx@gmail.com";

// Firebase

var firebaseConfig = {
  apiKey: "AIzaSyC9tLHIe1Qqg6TvyYEOLmram6xsUfx2Gig",
  authDomain: "gl-ripetizioni.firebaseapp.com",
  projectId: "gl-ripetizioni",
  storageBucket: "gl-ripetizioni.appspot.com",
  messagingSenderId: "427650682112",
  appId: "1:427650682112:web:d9d897a0c08029213a37e5",
  measurementId: "G-K8077V6E4G",
};
// Initialize Firebase
fb = firebase.initializeApp(firebaseConfig);
firebase.analytics();

db = firebase.firestore();

function getGDriveFiles(folderID) {
  let url = `https://api.allorigins.win/get?url=https://drive.google.com/embeddedfolderview?id=${folderID}#list`;

  let xhr = new XMLHttpRequest();
  xhr.open("GET", url);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      console.log("User Files Request status: ", xhr.status);
      // console.log(xhr.responseText);
      el = document.createElement("html");
      el.innerHTML = xhr.responseText;
      nFiles = el.childNodes[1].childNodes[1].childNodes[2].childNodes.length;
      files = []; //array of objects

      // get user files array
      for (let i = 0; i < nFiles; i++) {
        let file = {};

        file.title =
          el.childNodes[1].childNodes[1].childNodes[2].childNodes[
            i
          ].childNodes[0].childNodes[0].innerText;

        file.url =
          el.childNodes[1].childNodes[1].childNodes[2].childNodes[
            i
          ].childNodes[0].childNodes[0].href;

        lastModStr =
          el.childNodes[1].childNodes[1].childNodes[2].childNodes[i]
            .childNodes[1].textContent;

        // get a correct lastModDate
        let nowDate = new Date();
        let thisYear = nowDate.getFullYear();
        
        date_nums = lastModStr.split("/");
        if (lastModStr.includes(":")) {
          lastModDate = nowDate;
        } else if (date_nums[2]) {
          lastModDate = new Date("20" + date_nums[2] + "/" + date_nums[1] + "/" + date_nums[0]);
        } else {
          idx = lastModStr.search(' ') + 1;
          month = lastModStr.substr(idx,3);

          // conversion from IT -> EN
          switch (month) {
            case 'gen':
              lastModStr = lastModStr.substr(0,idx-1) + 'jan';
              break
            case 'feb':
              // same 
              break
            case 'mar':
              // same
              break
            case 'apr':
              // same
              break
            case 'mag':
              lastModStr = lastModStr.substr(0,idx-1) + 'may'
              break
            case 'giu':
              lastModStr = lastModStr.substr(0,idx-1) + 'jun'
              break
            case 'lug':
              lastModStr = lastModStr.substr(0,idx-1) + 'jul'
              break
            case 'ago':
              lastModStr = lastModStr.substr(0,idx-1) + 'aug'
              break
            case 'set':
              lastModStr = lastModStr.substr(0,idx-1) + 'sep'
              break
            case 'ott':
              lastModStr = lastModStr.substr(0,idx-1) + 'oct'
              break
            case 'nov':
              // same
              break
            case 'dic':
              lastModStr = lastModStr.substr(0,idx-1) + 'dec'
              break
            default:
              console.log('Sorry, month not found');
              break
          }
          
          lastModDate = new Date(lastModStr + " " + thisYear);
        }

        file.lastModDate = lastModDate;

        file.previewUrl =
          el.childNodes[1].childNodes[1].childNodes[2].childNodes[
            i
          ].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].childNodes[0].src;

        files.push(file);
      }
      files.sort(function (a, b) {
        return -a.lastModDate.getTime() + b.lastModDate.getTime();
      });

      // write list of files on html
      userFilesSection = document.getElementById("user-files");

      for (let i = 0; i < files.length; i++) {
        file = files[i];

        // <img src="${file.previewUrl}" style="width: 150px; height: 110px; object-fit:cover; padding: 20px; display: block; margin:auto;" />
        userFilesSection.innerHTML += `
        <a style="width:100%; display:flex; border-bottom:solid 1px; height: auto; min-height: 60px;" href= "${file.url}" target="_blank"> <img src="https://cdn-icons-png.flaticon.com/512/2490/2490315.png" style="height:30px; width:30px; margin:auto; margin-left:0;" /> <p style="margin:auto; width:80%; text-align:center; color:#4b8ef1"> ${file.title} </p> </a> </td>`; // limit max char at 38 for mobile view
      }
    }
  };

  xhr.send();
}

function refreshOnUserData(docData) {
  section = document.getElementById("user-section");

  if (docData) {
    section.innerHTML = `
                <div class="container" style="margin-top: 100px;">
                <div class="row">
                  <div class="col-lg-8 offset-lg-2">
                    <div class="section-heading wow fadeInDown" data-wow-duration="1s" data-wow-delay="0.5s" style="margin-bottom: 20px;">
                      <h4>Le tue prossime <em>lezioni</em></h4>
                      <img src="assets/images/heading-line-dec.png" alt="">
                    </div>
                  </div>
                </div>
              </div>
              <div class="container" style="max-width: 500px; margin:auto; width: 80%; padding: 20px;">
                <div id="user-lessons" class="row">
                  <!-- js script user last lessons -->
                </div>
              </div>

              <div class="container">
                <div class="row">
                  <div class="col-lg-8 offset-lg-2">
                    <div class="section-heading wow fadeInDown" data-wow-duration="1s" data-wow-delay="0.5s" style="margin-bottom: 20px;">
                      <h4>I tuoi <em>file</em></h4>
                      <img src="assets/images/heading-line-dec.png" alt="">
                    </div>
                  </div>
                </div>
              </div>
              <div class="container">
                <div id="user-files" class="row" style="max-width: 600px; margin:auto; width: 100%; padding: 20px;">
                  <!-- js script userFilesSection -->
                </div>
              </div>
                `;

    getGDriveFiles(docData.folderID);
    checkUserEvents();

    // userFilesSection.innerHTML = `<iframe src="https://drive.google.com/embeddedfolderview?id=${docData.folderID}#list" style="width:100%; height:600px; border:0;"></iframe>`;
  } else {
    section.innerHTML = `
          <p style="text-align: center; margin-top: 140px; margin-bottom: 20px; color: red; font-weight: 900"> Utente non trovato. Riprova. </p>

          <form class="material-form">
              <div class="material-form__container">
              <input class="material-form__input" type="email" placeholder=" " id="input-email" pattern="[0-9a-zAZÑñ._@-]{10,50}" maxlength="50"/>
              <label class="material-form__label" for="input-email">Email </label>
              </div>
              <p id="login-button" onclick="checkUser();" class="material-form__p">Login</p>
          </form>
      `;
  }
}

function getDocRef(db, user) {
  window.docRef = db.collection("users").doc(user);
  return docRef;
}

function readDocRef(docRef) {
  docRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        window.docData = doc.data();
        console.log("Document data:", doc.data());
      } else {
        // doc.data() will be undefined in this case
        window.docData = null;
        console.log("No such document!");
      }
      refreshOnUserData(docData);
    })
    .catch((error) => {
      window.docData = null;
      console.log("Error getting document:", error);
      refreshOnUserData(docData);
    });
}

function checkUser() {
  user = document.getElementById("input-email").value;
  getDocRef(db, user);
  readDocRef(docRef);
}

// Keyboard Enter Event Listener
// Get the input field
var input = document.getElementById("input-email");

// Execute a function when the user presses a key on the keyboard
input.addEventListener("keypress", function (event) {
  // If the user presses the "Enter" key on the keyboard
  if (event.key === "Enter") {
    // Cancel the default action, if needed
    event.preventDefault();
    // Trigger the button element with a click
    document.getElementById("login-button").click();
  }
});

// CALENDAR HOOKS

function parseIcal(iCalendarData) {
  window.calData = ICAL.parse(iCalendarData);
  //window.vcalendar = new ICAL.Component(jcalData);
  //var json = vcalendar.toJSON();
  //var vevent = vcalendar.getFirstSubcomponent('vevent');
  //var summary = vevent.getFirstPropertyValue('summary');
  //console.log('Summary: ' + summary);
}

function getEventsInRange(calData, eventsRange) {
  // calData: raw data from iCal js library
  // eventsRange: indexes of first and final events ->[1, 100]

  events = [];
  range = [...Array(eventsRange[1] - eventsRange[0] + 1).keys()];

  // for cycle
  range.map((x) => {
    i = eventsRange[0] + x;
    var item = calData[2][i][1];
    // startTime
    var startTime_str = item[0][3];
    var startTime_date = new Date(startTime_str);
    var startTimeLocal_string = startTime_date.toLocaleString("IT-it");
    // endTime
    var endTime_str = item[1][3];
    var endTime_date = new Date(endTime_str);
    var endTimeLocal_string = endTime_date.toLocaleString("IT-it");
    // url/ user as in firestore
    var user_str = item[4][3];
    // description
    var description_str = item[6][3];
    // status
    var status_str = item[10][3]; // should expect "CONFIRMED"
    // title
    var title_str = item[11][3];

    event_obj = {
      startTimeStr: startTimeLocal_string,
      startTimeDate: startTime_date,
      startTimetime: startTime_date.getTime(),
      endTimeLocal_string: endTimeLocal_string,
      endTimeDate: endTime_date,
      endTimetime: endTime_date.getTime(),
      user: user_str,
      description: description_str,
      title: title_str,
    };
    events = [...events, event_obj];
  });
  return events;
}

function getUserLastNEvents(calData, N) {
  // calData: raw data from iCal js library
  // eventsRange: indexes of first and final events ->[1, 100]
  eventsRange = [1, 250]; // retrieve some events
  counter = 0;
  i = eventsRange[0];
  events = [];
  // while number of events that match the user is less than N
  while (counter < N && i < eventsRange[1]) {
    // cycle
    var item = calData[2][calData[2].length-i][1];
    // url/ user as in firestore
    var user_str = item[4][3];
    
    if (typeof user_str === 'string' || user_str instanceof String) {
    // it's a string
    }
    else {
    // it's something else
      user_str = '';
    }

    // if event match the user logged in ...
    if (user_str.localeCompare(user) == 0) {
      // startTime
      var startTime_str = item[0][3];
      var startTime_date = new Date(startTime_str);
      var startTimeLocal_string = startTime_date.toLocaleString("IT-it");
      // endTime
      var endTime_str = item[1][3];
      var endTime_date = new Date(endTime_str);
      var endTimeLocal_string = endTime_date.toLocaleString("IT-it");
      // description
      var description_str = item[6][3];
      // status
      var status_str = item[10][3]; // should expect "CONFIRMED"
      // title
      var title_str = item[11][3];

      event_obj = {
        startTimeStr: startTimeLocal_string,
        startTimeDate: startTime_date,
        startTimetime: startTime_date.getTime(),
        endTimeStr: endTimeLocal_string,
        endTimeDate: endTime_date,
        endTimetime: endTime_date.getTime(),
        user: user_str,
        description: description_str,
        status: status_str,
        title: title_str,
      };
      events = [...events, event_obj];
      counter = counter + 1;
    }
    i = i + 1; // update cycle index
  }
  
  events.sort(function (a, b) {
    return -a.startTimetime + b.startTimetime;
  });
  
  return events;
}

function writeEventsList(events) {
  lessonsContainer = document.getElementById("user-lessons");
  if (events.length != 0) {
    for (let i = events.length - 1; i >= 0; i--) {
      startStringLength = events[i].startTimeStr.length;
      endStringLength = events[i].endTimeStr.length;
      startString = events[i].startTimeStr.substring(
        startStringLength - 8,
        startStringLength - 3
      );
      endString = events[i].endTimeStr.substring(
        endStringLength - 8,
        endStringLength - 3
      );
      dateString = events[i].startTimeDate.toString();
      dayString = dateString.substring(8, 10);
      monthString = dateString.substring(4, 7);
      startTimetime = events[i].startTimetime;
      nowDate = new Date();
      currentTimetime = nowDate.getTime();
      color = "#adb5bd";

      if (currentTimetime <= startTimetime) {
        color = "#4B8EF1";
      }

      lessonsContainer.innerHTML += `<ul class="events__list">
        <li class="events__item">
            <div class="events__date" style="border-left-color: ${color};">
                <span class="events__day" style="color:${color};">${dayString}</span>
                <div class="events__month" style="color:${color};">${monthString}</div>
            </div>
            <p class="events__desc" style="color:${color};";">Ore ${startString} - ${endString}.</p>
        </li>
      </ul>`;
    }
  } else {
    lessonsContainer.innerHTML += `<ul class="events__list">
        <li class="events__item">
            <div class="events__date">
                <span class="events__day"></span>
                <div class="events__month"></div>
            </div>
            <p class="events__desc">Nessuna Lezione.</p>
        </li>
      </ul>`;
  }
}

function writeNextUserLessons() {
  events = getUserLastNEvents(calData, 5);
  writeEventsList(events);
}

var cors_api_url = "https://api.allorigins.win/get?url=";
var options = {
  method: "GET",
};

function doCORSRequest(options, printResult) {
  var x = new XMLHttpRequest();
  x.open(options.method, cors_api_url + options.url);
  x.onload = x.onerror = function () {
    printResult(
      options.method +
        " " +
        options.url +
        "\n" +
        x.status +
        " " +
        x.statusText +
        "\n\n" +
        (x.responseText || "")
    );
  };
  if (/^POST/i.test(options.method)) {
    x.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  }
  x.send(options.data);
}

// Bind event
function checkUserEvents() {
  var urlField =
    "https://calendar.google.com/calendar/ical/glripetizioni%40gmail.com/public/basic.ics";
  var dataField = {
    value: null,
  };
  doCORSRequest(
    {
      method: this.id === "post" ? "POST" : "GET",
      url: urlField,
      data: dataField.value,
    },
    function printResult(result) {
      stringArray = result.split("\n");
      strinArray = stringArray.splice(0, 3);
      stringArray = stringArray.join("\n");
      //console.log(stringArray);
      parseIcal(stringArray);
      writeNextUserLessons();
    }
  );
}
