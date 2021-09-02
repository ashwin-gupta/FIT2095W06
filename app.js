const express = require('express');
const app = express();

const moment = require('moment');

const mongoose = require('mongoose');
const url = 'mongodb://localhost:27017/W06Lab';

const Doctor = require('./models/doctors');
const Patient = require('./models/patients');
const path = require('path');

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

app.use(express.static("public/img"));
app.use(express.static("public/css"));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/newDoctor", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "newDoctor.html"));

});

app.get("/listDoctors", (req, res) => {

    Doctor.find({}, function (err, docs) {
        if (err) {
            console.log(err);
            return;
        }

        console.log(docs);

        res.render("listDoctors", {
            docDb: docs
        });

    });

});

app.post("/addNewDoctor", (req, res) => {
    let newDoc = req.body;

    let aDoc = new Doctor({
        name: {
            firstName: newDoc.firstName,
            lastName: newDoc.lastName
        },
        birthDate: newDoc.birthDate,
        address: {
            state: newDoc.state,
            suburb: newDoc.suburb,
            street: newDoc.street,
            unit: newDoc.unit
        },
        numPatients: newDoc.numPatients
    });

    aDoc.save(function (err) {
        if (err) {
            res.sendFile(path.join(__dirname, "views", "invalid.html"));
            console.log(err);
            return;
        }
        
        renderDoctors(res);
    });



});

app.post("/addNewPatient", (req, res) => {
    let newPatient = req.body;


    let aPatient = new Patient({
        fullname: newPatient.fullname,
        doctor: newPatient.docID,
        age: newPatient.age,
        caseDesc: newPatient.desc
    });

    if(newPatient.date) {
        aPatient.visitDate = newPatient.date
    }


    aPatient.save(function (err, docs) {
        if (err) {
            res.sendFile(path.join(__dirname, "views", "invalid.html"));
            console.log(err);
            return;
        }
        console.log(docs);

        Doctor.updateOne({
            '_id': newPatient.docID
        }, {
            $inc: {
                'numPatients': 1
            }
        }, function (err, res) {
            if (err) {
                console.log(err);
            }

            console.log(res);
        });


        renderPatients(res);
    });



});

app.get("/listPatients", (req, res) => {
    renderPatients(res);
});

app.get("/newPatient", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "newPatient.html"));
});

app.get("/updateDoctor", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "updateDoctor.html"));
});

app.get("/deletePatient", (req, res) => {
    res.sendFile(path.join(__dirname, "views", "deletePatient.html"));
});

app.post("/deletePatientAction", (req, res) => {
    let fullname = req.body.fullName;

    Patient.deleteOne({
        'fullname': fullname
    }, function (err, doc) {
        if (err) {
            console.log(err);
            res.sendFile(path.join(__dirname, "views", "invalid.html"));
            return;
        }

        console.log(doc);
        renderPatients(res);
        
    });

    
});

app.post("/updateDocPatients", (req, res) => {

    const newPatient = req.body;

    Doctor.updateOne({
        '_id': newPatient.docID
    }, {
        $set: {
            'numPatients': newPatient.numPatients
        }
    }, function (err, doc) {
        if (err) {
            console.log(err);
            res.sendFile(path.join(__dirname, "views", "invalid.html"));
            return;
        }


        renderDoctors(res);
    });
})



mongoose.connect(url, function (err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log("Successfully Connected");

});


function renderPatients(res) {
    Patient.find({}).populate('doctor').exec(function (err, docs) {
        res.render("listPatients", {
            patDb: docs
        });
    });
}

function renderDoctors(res) {

    Doctor.find({}, function (err, docs) {
        if (err) {
            console.log(err);
            return;
        }

        console.log(docs);

        res.render("listDoctors", {
            docDb: docs,
        });

    });

}

app.listen(8080);