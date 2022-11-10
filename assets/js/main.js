// testing
// user = "alessandrosaracino26@gmail.com";

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

function refreshOnUserData(docData) {
    section = document.getElementById("user-section");
  
    if (docData) {
      section.innerHTML = `
                <div class="container">
                <div class="row">
                  <div class="col-lg-8 offset-lg-2">
                    <div class="section-heading wow fadeInDown" data-wow-duration="1s" data-wow-delay="0.5s">
                      <h4>I tuoi <em>file</em></h4>
                      <img src="assets/images/heading-line-dec.png" alt="">
                    </div>
                  </div>
                </div>
              </div>
              <div class="container">
                <div id="user-files" class="row">
                  <!-- js script userFilesSection -->
                </div>
              </div>
                `;
  
      userFilesSection = document.getElementById("user-files");
      userFilesSection.innerHTML = `<iframe src="https://drive.google.com/embeddedfolderview?id=${docData.folderID}#grid" style="width:100%; height:600px; border:0;"></iframe>`;
    } else {
      section.innerHTML = `
          <p style="text-align: center; color: red; font-weight: 900"> Utente non trovato. Riprova. </p>

          <form class="material-form">
              <div class="material-form__container">
              <input class="material-form__input" type="email" placeholder=" " id="input-email" pattern="[0-9a-zAZÑñ._@-]{10,50}" maxlength="50"/>
              <label class="material-form__label" for="input-email">Email </label>
              </div>
              <p onclick="checkUser()" class="material-form__p">Login</p>
          </form>
      `;
    }
  };

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
