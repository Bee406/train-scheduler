//initialize firebase

var config = {
    apiKey: "AIzaSyANdvANux-R4XUrF33yvd_gRRNlkmtXTxc",
    authDomain: "train-scheduler-95bfc.firebaseapp.com",
    databaseURL: "https://train-scheduler-95bfc.firebaseio.com",
    projectId: "train-scheduler-95bfc",
    storageBucket: "train-scheduler-95bfc.appspot.com",
    messagingSenderId: "244231477279"
};
firebase.initializeApp(config);

var database = firebase.database();

$("#train-add").on("click", function () {
    event.preventDefault();
    var trainName = $("#train-name").val().trim();
    $("#train-name").val("");
    var trainDestination = $("#destination").val().trim();
    $("#destination").val("");
    var firstTrain = $("#first-train-time").val().trim();
    $("#first-train-time").val("");
    var trainFrequency = $("#frequency").val().trim();
    $("#frequency").val("");

    database.ref().push({
        name: trainName,
        destination: trainDestination,
        first: firstTrain,
        frequency: trainFrequency,

    });

});

database.ref().on("child_added", function (childSnapshot) {

    var trainName = childSnapshot.val().name;
    var firstTrain = childSnapshot.val().first;
    var trainDestination = childSnapshot.val().destination;
    var trainFrequency = childSnapshot.val().frequency;

    
    // First Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConverted = moment(firstTrain, "HH:mm").subtract(1, "years");
    console.log("First Time Converted: " + firstTimeConverted);

    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));

    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    var tRemainder = diffTime % trainFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var minutesAway = trainFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minutesAway);

    // Next Train
    var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm a");

    console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm"));


    var newRow = $("<tr>").append(
        $("<td>").text(trainName),
        $("<td>").text(trainDestination),
        $("<td>").text(trainFrequency),
        $("<td>").text(nextArrival),
        $("<td>").text(minutesAway),
        $("<td>").html("<button id = 'train-delete' type='button' class='btn btn-primary'>Delete This Train</button>")
    );
    $("#train-info").append(newRow);

}, function (errorObject) {
    console.log(errorObject.code);
});

$(document).on("click", "#train-delete", function() { 
    $(this).closest("tr").remove();
    database.ref($(this)).remove();
    
});
