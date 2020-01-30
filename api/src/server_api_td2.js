// TD2 Refactored to be launched in order to get Database Datas

const SSN = require("../../td1/Ferreira_Elodie/SSN.js")
const async = require('async');
const express = require('express');
const app = express();
const fetch = require("node-fetch");
var fs = require("fs");
const pays = fs.readFileSync("../_supports/pays.json");
var jsonContent = JSON.parse(pays);
const Ssn = require("./Ssn");
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : true
}));

let mongoose = require('mongoose');
let database = mongoose.connect("mongodb://localhost:27017/td3", {
    promiseLibrary: require('bluebird')

});

const Schema   = mongoose.Schema;



//-- Resources Schema

let peopleSchema = new mongoose.Schema({
                prenom: String,
                nomDeFamille: String,
                ssn: {
                    departement_nom : String,
                    departement_numero: String,
                    date_de_naissance: String,
                    commune_nom: String,
                    commune_numero: String,
                    sexe: String,
                    validite: Boolean,
                    ssn: String
                }
            });




mongoose.model('people', peopleSchema);


// ------------------------

// LIST ROUTE

// ------------------------

app.get("/people/",(req,res)=>{

    mongoose.model('people').find({}).then((result)=>{

        res.status(200).json(result)

    },(err)=>{

        res.status(400).json(err)

    })

});

app.get("/people/:idPeople",(req,res)=>{


    mongoose.model('people').findOne({_id: req.params.idPeople}).then((result)=>{

        res.status(200).json(result)

    },(err)=>{

        res.status(400).json(err)

    })

});



app.post("/people/",(req,res)=>{

    const myModel = mongoose.model('people', peopleSchema);

    let newpeople = new  myModel(req.body);
    

    newpeople.save().then((result)=>{

        res.status(200).json({result : result, people : newpeople});
        let ssn = new SSN.SSN(newpeople.SSN);
        console.log(ssn.gender);

    },(err)=>{
        res.status(400).json(err)

    })

});

app.delete("/people/:idPeople",(req,res)=>{

    mongoose.model('people').findOneAndRemove({_id: req.params.idPeople}).then((result)=>{

        res.status(200).json(result)

    },(err)=>{

        res.status(400).json(err)

    })

});

app.put("/people/:idPeople",(req,res)=>{

    mongoose.model('people').findOneAndUpdate({_id:req.params.idPeople},req.body).then((result)=>{

        res.status(200).json(result)

    },(err)=>{

        res.status(400).json(err)

    })

});
getDept = async function(ssn_obj) {
    var dept = "dpt"
    if(ssn_obj.birth_dept >= 96 && ssn_obj.birth_dept <= 99){
        return dept;
    }else {
        await fetch('https://geo.api.gouv.fr/departements/'+ssn_obj.birth_dept+'?fields=nom&format=json&geometry=centre')
            .then(res => res.json())
            .then(data => {
                Commune = ({ data });
                return Commune.data.nom;
            })
    }
}

toWebFormat = async function(obj){
    let ssn_obj = new SSN_validated(obj.ssn)
    let dept_ = ssn_obj.extractBirthPlace().dept;
    let comm = ssn_obj.extractBirthPlace().commune;
    console.log("dept:")
    console.log(comm)
    if(dept_>= 96 && dept_ <= 99) {
        console.log("i am not french")
        var dept="unknown";
        var commune="unkown"
        var country = jsonContent[comm];
    } else {
        var country = "France";
        var dept = await fetch('https://geo.api.gouv.fr/departements/'+dept_+ '?fields=nom&format=json&geometry=centre')
            .then(res => res.json())
            .then(data => {
                Commune = ({ data });
                return Commune.data.nom;
            });
        var commune = await fetch('https://geo.api.gouv.fr/communes/'+dept_+comm+
            '?fields=nom&format=json&geometry=centre')
            .then(res => res.json())
            .then(data => {
                Commune = ({ data });
                return Commune.data.nom;
            })

    }
    let toWeb = {
        "lastName": obj.prenom,
        "firstName": obj.nomDeFamille,
        "SSN": obj.ssn,
        "pays": country,
        "departement": dept,
        "Commune": commune,
    }
    console.log(toWeb);
    return toWeb;
};


app.get("/people_more_details/",(req,res)=>{
    mongoose.model('people').find({}).then((result)=>{
        let arrayPeople = [];
        async.each(result,async (people,callback) => {
            let updatedPeople = await toWebFormat(people);
            await arrayPeople.push(updatedPeople);
        },(err) => {
          if(err){
              console.log(err);
          }else {
              res.status(200).json(arrayPeople);
          }
        });
    },(err)=>{
        res.status(400).json(err)
    })
});



// ------------------------

// START SERVER

// ------------------------

app.listen(3025,function(){

    console.info('HTTP server started on port 3025');

});

/// SSN CLASS

class SSN_validated {
    constructor(secu) {
        this.secu_number = secu;
    }
    // ------------------------------------------------------------------------------------------------------------
    // VALIDITY STUFF
    // ------------------------------------------------------------------------------------------------------------
    isValid() {
        // ---- is Valid if enough char and key ok
        return this.controlSsnValue() && this.controlSsnKey();
    }
    /**
     * Private function to check value
     */
    controlSsnValue() {
        let regExpSsn = new RegExp("^" +
            "([1-37-8])" +
            "([0-9]{2})" +
            "(0[0-9]|[2-35-9][0-9]|[14][0-2])" +
            "((0[1-9]|[1-8][0-9]|9[0-69]|2[abAB])(00[1-9]|0[1-9][0-9]|[1-8][0-9]{2}|9[0-8][0-9]|990)|(9[78][0-9])(0[1-9]|[1-8][0-9]|90))" +
            "(00[1-9]|0[1-9][0-9]|[1-9][0-9]{2})" +
            "(0[1-9]|[1-8][0-9]|9[0-7])$");
        return regExpSsn.test(this.secu_number);
    }
    /**
     * Private function to check NIR
     */
    controlSsnKey() {
        // -- Extract classic information
        let myValue = this.secu_number.substr(0, 13);
        let myNir = this.secu_number.substr(13);
        // -- replace special value like corsica
        myValue.replace('2B', "18").replace("2A", "19");
        // -- transform as number
        let myNumber = +myValue;
        return (97 - (myNumber % 97) == +myNir);
    }
    // ------------------------------------------------------------------------------------------------------------
    // INFO STUFF
    // ------------------------------------------------------------------------------------------------------------
    getInfo() {
        return {
            sex: this.extractSex(),
            birthDate: this.extractbirthDate(),
            birthPlace: this.extractBirthPlace(),
            birthPosition: this.extractPosition()
        };
    }
    /**
     *
     */
    extractSex() {
        let sex = this.secu_number.substr(0, 1);
        return sex == "1" || sex == "3" || sex == "8" ? "Homme" : "Femme";
    }
    /**
     *
     */
    extractbirthDate() {
        // -- Build a date
        let month = +this.secu_number.substr(3, 2);
        // -- special case
        if (month == 62 || month == 63) {
            month = 1;
        }
        let birth = new Date(+this.secu_number.substr(1, 2), month);
        return birth;
    }
    /**
     *
     */
    extractBirthPlace() {
        let dept = +this.secu_number.substr(5, 2);
        // --- Case DOM TOM
        if (dept == 97 || dept == 98) {
            return {
                dept: this.secu_number.substr(5, 3),
                commune: this.secu_number.substr(8, 2),
            };
        }
        else if (dept == 99) {
            return {
                dept: 99,
                commune: this.secu_number.substr(7, 3)
            };
        }
        else {
            return {
                dept: this.secu_number.substr(5, 2),
                commune: this.secu_number.substr(7, 3),
            };
        }
    }
    /**
     *
     */
    extractPosition() {
        return +this.secu_number.substr(10, 3);
    }
}

