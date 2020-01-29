import {Ssn} from "./Ssn";

export class Person {
    
    public prenom:string;
    public nomDeFamille:string;
    public ssn : Ssn;

    constructor(prenom : string, nomDeFamille: string){
        this.prenom = prenom;
        this.nomDeFamille = nomDeFamille;
    }

    setSSN(ssn: Ssn) {
        this.ssn = ssn;
    }
}

