// authentication process
// var fbauth = firebase.auth(fb)
//     .signInAnonymously()
//     .catch(function (error) {

//         // Handle errors here
//         var errorCode = error.code;
//         var errorMessage = error.message;

//         console.log(errorCode);
//         console.log(errorMessage);

//     });

function writeEntry(pathstr, values) {
    var tstmp = new firebase.firestore.Timestamp.now();
    var entry = db.collection("sessions").doc((tstmp.seconds).toString()).set({
        category: playback.category,
        d: pathstr,
        timestamp: tstmp,
        values: values
    })
}

// this method gets a reference of the document on the server
function getLastEntries() {

    db.collection("sessions").where("category", "==", playback.category).limit(10).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // push path data 
                curves_data.push(doc.data());
            });
        })
        .catch(function (error) {
            console.log("Error getting entries: ", error);
        });

}


// TO-DO: get the category the result page is showing
function getAverages(arrayName) {
    db.collection("sessions").where("category", "==", playback.category).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                arrayName.push(doc.data().values);
            });
        })
        .catch(function (error) {
            console.log("Error getting averages: ", error);
        });
}


// gets average of same index among many arrays
function getContentAverage(arr, index) {
    if (index > 0 && index < 6) {
        var outputArr = [];

        arr.forEach((entry) => {
            outputArr.push(entry[index]);
        });
        var result = ((outputArr) => {
            var avg = 0;
            for (i = 0; i < outputArr.length; i++) {
                avg += parseFloat(outputArr[i]);
            }
            return (avg / arr.length).toFixed(2);
        })(outputArr);
    } else return false;

    return result;
}