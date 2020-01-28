"use strict";
exports.__esModule = true;
var SSN_1 = require("./SSN");
var person1 = {
    firstName: "Laetitia",
    lastName: "Not OKAY",
    ssn: "298069152102373"
};
var person2 = {
    firstName: "Elodie",
    lastName: "Not OKAY",
    ssn: "298031300512252"
};
var person3 = {
    firstName: "Sarah",
    lastName: "Not OKAY",
    ssn: "498031300512252"
};
var persons = [];
persons[0] = person1;
persons[1] = person2;
persons[2] = person3;
persons.forEach(function (person) { return new SSN_1.SSN(person.ssn); });
