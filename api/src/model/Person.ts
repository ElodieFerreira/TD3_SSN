import {Ssn} from "./Ssn";

export class Person {
    
    public firstName:string;
    public name:string;
    public ssn : Ssn;

    constructor(firstName : string, name: string){
        this.firstName = firstName;
        this.name = name;
    }

    setSSN(ssn: Ssn) {
        this.ssn = ssn;
    }
}

