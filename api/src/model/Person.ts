import {Ssn} from "./Ssn";

export class Person {
    
    public firstName:string;
    public name:string;
    public ssn : Ssn;

    constructor(firstName : string, name: string, ssn: Ssn){
        this.firstName = firstName;
        this.name = name;
        this.ssn = ssn;
    }
}

