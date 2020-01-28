import {SSN} from "./SSN";
export interface IPerson {
    firstName : string,
    lastName : string,
    ssn:  string,
}

var person1 : IPerson = {
    firstName: "Laetitia",
    lastName: "Not OKAY",
    ssn: "298069152102373",
}


var person2 : IPerson = {
    firstName: "Elodie",
    lastName: "Not OKAY",
    ssn: "298031300512252"
}

var person3 : IPerson = {
    firstName: "Sarah",
    lastName: "Not OKAY",
    ssn: "498031300512252"
}

var persons: Array<IPerson> = [];
persons[0] = person1;
persons[1] = person2;
persons[2] = person3;

persons.forEach(person => new SSN(person.ssn));
