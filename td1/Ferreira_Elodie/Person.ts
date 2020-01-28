import {SSN} from "./SSN";

class Person {
    public firstName:string;
    public name:string;
    public ssn : SSN;
    constructor(firstName : string, name: string, ssn: SSN){
        this.firstName = firstName;
        this.name = name;
        this.ssn = ssn;
    }
}

