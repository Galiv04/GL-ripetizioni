// testing
user = "galiv04@gmail.com";

// Firebase

var firebaseConfig = {
  apiKey: "AIzaSyB8zIm4HC6LeLgLbU5qlYgNNe0aEPHes8Y",
  authDomain: "calen-dard.firebaseapp.com",
  projectId: "calen-dard",
  storageBucket: "calen-dard.appspot.com",
  messagingSenderId: "555896146781",
  appId: "1:555896146781:web:9aa4f28c385a9b13c436b4",
  measurementId: "G-S99YQ4L3CQ",
};
// Initialize Firebase
fb = firebase.initializeApp(firebaseConfig);
firebase.analytics();

db = firebase.firestore();

// data init

window.currentMonthEvents = [];

// Function Utilities

compare = function (a, b) {
  if (parseInt(a.day) < parseInt(b.day)) {
    return -1;
  }
  if (parseInt(a.day) > parseInt(b.day)) {
    return 1;
  }
  return 0;
};

orderCurrentMonthEvents = function (currentMonthEvents) {
  currentMonthEvents.sort(compare);
};

clearVariables = function () {
  currentMonthEvents = [];

  // newEvent and modal inputs
  eventNameInput = document.getElementById("event-name");
  eventNameInput.value = null;
  startDatetimePickerInput = document.getElementById("start-datetime-picker");
  startDatetimePickerInput.value = null;
  endDatetimePickerInput = document.getElementById("end-datetime-picker");
  endDatetimePickerInput.value = null;
  eventNoteInput = document.getElementById("event-note");
  eventNoteInput.value = " ";
  eventColorInput = document.getElementById("color-1");
  eventColorInput.checked = true;
  newEvent = {};
};
getDayString = function (day) {
  switch (day) {
    case 0:
      return "Sun";
    case 1:
      return "Mon";
    case 2:
      return "Tue";
    case 3:
      return "Wed";
    case 4:
      return "Thu";
    case 5:
      return "Fri";
    case 6:
      return "Sat";
    default:
      break;
  }
};
getMonthString = function (month) {
  switch (month) {
    case 0:
      return "January";
    case 1:
      return "February";
    case 2:
      return "March";
    case 3:
      return "April";
    case 4:
      return "May";
    case 5:
      return "June";
    case 6:
      return "July";
    case 7:
      return "August";
    case 8:
      return "September";
    case 9:
      return "October";
    case 10:
      return "November";
    case 11:
      return "December";
    default:
      break;
  }
};
getDayOfMonth = function (day, month, year) {
  return (d = new Date(year, month, day));
};

convertDatetimeToHuman = function (datetimeString) {
  d = new Date(datetimeString);

  // day = d.getDate();
  // month = getMonthString(d.getMonth());
  // monthNumber = d.getMonth();
  // year = d.getFullYear();
  // hours = d.getHours();
  // minutes = d.getMinutes();
  //fbTimestampSeconds = d.getTime() / 1000; //seconds

  return (dateTime = {
    day: d.getDate(),
    month: getMonthString(d.getMonth()),
    monthNumber: d.getMonth(),
    year: d.getFullYear(),
    hours: d.getHours(),
    minutes: d.getMinutes(),
    fbTimestampSeconds: d.getTime() / 1000,
  });
};

// Functions
function prevYear() {
  year = year - 1;
  refreshCalendar();
}
function nextYear() {
  year = year + 1;
  refreshCalendar();
}
function prevMonth() {
  month = month - 1;
  if (month == -1) {
    month = 11;
    year = year - 1;
  }
  refreshCalendar();
}
function nextMonth() {
  month = month + 1;
  if (month == 12) {
    month = 0;
    year = year + 1;
  }
  refreshCalendar();
}
function writeCalendar() {
  // Write days of previous month
  for (let i = firstDayOfCurrentMonthNumber - 1; i > -7; i--) {
    dateNumber =
      lastDayOfPreviousMonthDate + i - firstDayOfCurrentMonthNumber + 1;
    document.getElementById("d" + i).innerHTML = dateNumber;

    document.getElementById("d" + i + "-props").className =
      "calendar-table__col calendar-table__inactive";
  }

  // Write days of current month
  for (
    let i = firstDayOfCurrentMonthNumber;
    i < lastDayOfCurrentMonthDate + firstDayOfCurrentMonthNumber;
    i++
  ) {
    dateNumber = i + 1 - firstDayOfCurrentMonthNumber;
    document.getElementById("d" + i).innerHTML = dateNumber;
    document.getElementById("d" + i + "-props").className =
      "calendar-table__col ";

    // Today
    if (
      today.getDate() == dateNumber &&
      year == today.getFullYear() &&
      month == today.getMonth()
    ) {
      document.getElementById("d" + i + "-props").className =
        "calendar-table__col calendar-table__today";
    }

    // write list of upcoming events shown at the bottom of the calendar
    upcomingEventsList = document.getElementById("upcoming-events-list");
    upcomingEventsList.innerHTML = "";

    currentMonthEvents.forEach((e) => {
      // add color on day number and event listener
      if (e.day == dateNumber) {
        e.events.forEach((event) => {
          dayId = "d" + i;
          el = document.getElementById(dayId + "-props");
          // add event color
          el.classList.add("calendar-table__event-" + event.color);
          // add listener for modal with day events
          el.addEventListener("click", (e, el) => {
            showDayEventsBtn(i);
          });

          console.log(event);
        });
      }

      //write list at bottom of calendar only for events after today
      if (e.day >= today.getDate()) {
        e.events.forEach((event) => {
          //data processing
          humanStartDate = convertDatetimeToHuman(
            event.startDate.toDate().toString()
          );
          humanEndDate = convertDatetimeToHuman(
            event.endDate.toDate().toString()
          );

          startHours = humanStartDate.hours.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
          });
          endHours = humanEndDate.hours.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
          });
          startMinutes = humanStartDate.minutes.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
          });
          endMinutes = humanEndDate.minutes.toLocaleString("en-US", {
            minimumIntegerDigits: 2,
            useGrouping: false,
          });

          // update upcoming events list
          upcomingEventsList.innerHTML =
            upcomingEventsList.innerHTML +
            `<li class="events__item-${event.color}">
              <div class="events__item--left">
                <span class="events__name">${event.name}</span>
                <span class="events__date">${
                  humanStartDate.month.slice(0, 3) +
                  " " +
                  humanStartDate.day +
                  "  to  " +
                  humanEndDate.month.slice(0, 3) +
                  " " +
                  humanEndDate.day
                }</span>
                <br/>
                <span class="events__date">${event.note}</span>
              </div>
              <span class="events__tag">${startHours}:${startMinutes}  ${endHours}:${endMinutes}</span>
            </li>`;
        });
      }
    });
  }

  // Write days of next month
  for (
    let i = lastDayOfCurrentMonthDate + firstDayOfCurrentMonthNumber;
    i < 43;
    i++
  ) {
    dateNumber =
      i - (lastDayOfCurrentMonthDate + firstDayOfCurrentMonthNumber) + 1;
    document.getElementById("d" + i).innerHTML = dateNumber;
    document.getElementById("d" + i + "-props").className =
      "calendar-table__col calendar-table__inactive";
  }
}
function refreshCalendar() {
  // Define useful variables
  window.monthString = getMonthString(month);

  window.titleYear = document.getElementById("title-year");
  titleYear.innerHTML = year;

  window.titleMonth = document.getElementById("title-month");
  titleMonth.innerHTML = monthString;

  window.firstDayOfCurrentMonth = getDayOfMonth(1, month, year);
  window.firstDayOfCurrentMonthNumber = firstDayOfCurrentMonth.getDay(); //0-6

  window.lastDayOfPreviousMonth = getDayOfMonth(0, month, year);
  window.lastDayOfPreviousMonthDate = lastDayOfPreviousMonth.getDate(); //1-31

  window.lastDayOfCurrentMonth = getDayOfMonth(0, month + 1, year);
  window.lastDayOfCurrentMonthDate = lastDayOfCurrentMonth.getDate(); //1-31

  // get data from firestore

  ref = db
    .collection("usersEvents")
    .doc(user)
    .collection("years")
    .doc(year.toString())
    .collection("months")
    .doc(monthString.toLowerCase())
    .collection("days");

  ref
    .get()
    .then((querySnapshot) => {
      // console.log(querySnapshot.docs.length);
      if (querySnapshot.docs.length != 0) {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          data = doc.data();
          element = { day: doc.id, ...data };
          currentMonthEvents.push(element);
          orderCurrentMonthEvents(currentMonthEvents);
        });
      } else {
        currentMonthEvents = [];
      }
      console.log("Current Month Events:", currentMonthEvents);
      writeCalendar();
    })
    .catch((error) => {
      console.log("Error getting documents: ", error);
      currentMonthEvents = [];
      writeCalendar();
    });
  clearVariables();
}

// Run On Page Load
window.onload = function () {
  window.today = new Date();
  window.year = today.getFullYear();
  window.month = today.getMonth();
  window.day = today.getDay();

  refreshCalendar();
};

// Add new event
function updateEventData() {} //TBD

function addNewEvent() {
  // check variables
  if (
    newEvent.name &&
    newEvent.startDate &&
    newEvent.endDate /*add better check */
  ) {
    docRef = db
      .collection("usersEvents")
      .doc(user)
      .collection("years")
      .doc(newEvent.startDate.year.toString()) //year
      .collection("months")
      .doc(newEvent.startDate.month.toLowerCase()) //monthString
      .collection("days")
      .doc(newEvent.startDate.day.toString());

    docRef.get().then((doc) => {
      console.log(doc.exists);
      if (doc.exists) {
        thisEvent = {
          name: newEvent.name,
          startDate: new firebase.firestore.Timestamp(
            newEvent.startDate.fbTimestampSeconds,
            0
          ),
          endDate: new firebase.firestore.Timestamp(
            newEvent.endDate.fbTimestampSeconds,
            0
          ),
          note: newEvent.note,
          color: newEvent.color,
        };
        data = doc.data();
        events = data.events; //current events
        events.push(thisEvent); //updated events

        docRef
          .set({
            events: events,
          })
          .then(() => {
            console.log("Successfully added event to db");
            closeModalEvent();
            refreshCalendar();
          })
          .catch((error) => {
            console.error("Error adding new event: ", error);
            closeModalEvent();
            refreshCalendar();
          });
      } else {
        docRef
          .set({
            events: [
              {
                name: newEvent.name,
                startDate: new firebase.firestore.Timestamp(
                  newEvent.startDate.fbTimestampSeconds,
                  0
                ),
                endDate: new firebase.firestore.Timestamp(
                  newEvent.endDate.fbTimestampSeconds,
                  0
                ),
                note: newEvent.note,
                color: newEvent.color,
              },
            ],
          })
          .then(() => {
            console.log("Successfully added event to db");
            closeModalEvent();
            refreshCalendar();
          })
          .catch((error) => {
            console.error("Error adding new event: ", error);
            closeModalEvent();
            refreshCalendar();
          });
      }
    });
  } else {
    return;
  }
}

function newEventBtn() {
  console.log("addEvent clicked");
  document.querySelector("#modal-container").classList.add("addEvent");

  // Standard parameters needed for New Event Creation
  window.newEvent = {
    name: undefined,
    startDate: undefined,
    endDate: undefined,
    note: " ",
    color: "color-1",
  };
  console.log("New Event:", newEvent);
}

function closeModalEvent() {
  document.getElementById("modal-container").classList.add("out");
  setTimeout(function () {
    document.getElementById("modal-container").classList.remove("out");
    document.getElementById("modal-container").classList.remove("addEvent");
    console.log("modal closed");
  }, 200);
}

function setNewEventName(e) {
  newEvent.name = e;
  console.log("New Event:", newEvent);
}

function selectNewEventDatetime(e, type) {
  if (type == "start") {
    newEvent.startDate = convertDatetimeToHuman(e);
  } else {
    newEvent.endDate = convertDatetimeToHuman(e);
  }
  console.log("New Event:", newEvent);
}

function setNewEventNote(e) {
  newEvent.note = e;
  console.log("New Event:", newEvent);
}

function setNewEventCategory(e) {
  newEvent.color = e;
  console.log("New Event:", newEvent);
}

// removeListEvents
function removeListEvents(day, month, year, event) {
  // find index of element to remove
  for (let i = 0; i < currentMonthEvents.length; i++) {
    if (currentMonthEvents[i].day == day) {
      indexToRemove = currentMonthEvents[i].events.indexOf(event);
      console.log(indexToRemove);
      updatedEvents = currentMonthEvents[i].events;
      updatedEvents.splice(indexToRemove, 1);
      console.log(updatedEvents);

      docRef = db
        .collection("usersEvents")
        .doc(user)
        .collection("years")
        .doc(year.toString()) //year
        .collection("months")
        .doc(month.toLowerCase()) //monthString
        .collection("days")
        .doc(day.toString());

      //remove event
      docRef
        .set({
          events: updatedEvents,
        })
        .then(() => {
          console.log("Successfully removed event from db");
          closeDayEventsModal();
          refreshCalendar();
        })
        .catch((error) => {
          console.error("Error removing event: ", error);
          closeDayEventsModal();
          refreshCalendar();
        });
    }
  }
}

// show and edit day events modal
function showDayEventsBtn(i) {
  dayId = "d" + i;
  console.log("show day " + dayId + " event clicked");
  document
    .querySelector("#day-events-modal-container")
    .classList.add("showEvents");

  // fill modal information
  dayEventsModalTitle = document.getElementById("day-events-modal-title");
  selectedDayNumber = document.getElementById(dayId).innerText;
  console.log(dayId);
  dayEventsModalTitle.innerHTML =
    selectedDayNumber + " " + monthString + " " + year;

  // list of events shown in the modal
  list = document.getElementById("day-events-list");
  list.innerHTML = "";

  currentMonthEvents.forEach((e) => {
    // console.log(e);
    if (e.day == selectedDayNumber) {
      e.events.forEach((event) => {
        //data processing
        humanStartDate = convertDatetimeToHuman(
          event.startDate.toDate().toString()
        );
        humanEndDate = convertDatetimeToHuman(
          event.endDate.toDate().toString()
        );

        startHours = humanStartDate.hours.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        });
        endHours = humanEndDate.hours.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        });
        startMinutes = humanStartDate.minutes.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        });
        endMinutes = humanEndDate.minutes.toLocaleString("en-US", {
          minimumIntegerDigits: 2,
          useGrouping: false,
        });

        // update day list
        list.innerHTML =
          list.innerHTML +
          `<button onclick="removeListEvents(humanStartDate.day, humanStartDate.month, humanStartDate.year, event )" style="transform: translate(-15px,-10px) scale(1.5); float: right;" > <ion-icon name="close-circle"></ion-icon> </button>
          <li class="events__item-${event.color}">
          <div class="events__item--left">
            <span class="events__name">${event.name}</span>
            <span class="events__date">${
              humanStartDate.month.slice(0, 3) +
              " " +
              humanStartDate.day +
              "  to  " +
              humanEndDate.month.slice(0, 3) +
              " " +
              humanEndDate.day
            }</span>
            <br/>
            <span class="events__date">${event.note}</span>
          </div>
          <span class="events__tag">${startHours}:${startMinutes}  ${endHours}:${endMinutes}</span>
        </li>`;
      });
    }
  });
}
function closeDayEventsModal() {
  document.getElementById("day-events-modal-container").classList.add("out");
  setTimeout(function () {
    document
      .getElementById("day-events-modal-container")
      .classList.remove("out");
    document
      .getElementById("day-events-modal-container")
      .classList.remove("showEvents");
    console.log("modal closed");
  }, 200);
}
