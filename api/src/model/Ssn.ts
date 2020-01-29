import * as fetch from "node-fetch";

export class Ssn {
    private departement_nom : string;
    private departement_numero: string;
    private date_de_naissance: string;
    private commune_nom: string;
    private commune_numero: string;
    private sexe: string;
    private ssn: string;
    
    constructor(ssn : string) {
        this.ssn = ssn;
        if(!this.isValide())
            throw new Error("SSN non valide");
    }
    
    // ------------------------------------------------------------------------------------------------------------
    // Methode de validation
    // ------------------------------------------------------------------------------------------------------------
    public isValide() {
        // ---- is Valid if enough char and key ok
        return this.controleValeurSsn() && this.ControleClefSsn();
    }
    
    private controleValeurSsn() {
        let regExpSsn = new RegExp("^" +
            "([1-37-8])" +
            "([0-9]{2})" +
            "(0[0-9]|[2-35-9][0-9]|[14][0-2])" +
            "((0[1-9]|[1-8][0-9]|9[0-69]|2[abAB])(00[1-9]|0[1-9][0-9]|[1-8][0-9]{2}|9[0-8][0-9]|990)|(9[78][0-9])(0[1-9]|[1-8][0-9]|90))" +
            "(00[1-9]|0[1-9][0-9]|[1-9][0-9]{2})" +
            "(0[1-9]|[1-8][0-9]|9[0-7])$");
        return regExpSsn.test(this.ssn);
    }

    private ControleClefSsn() {
        // -- Extract classic information
        let myValue = this.ssn.substr(0, 13);
        let myNir = this.ssn.substr(13);
        // -- replace special value like corsica
        myValue.replace('2B', "18").replace("2A", "19");
        // -- transform as number
        let myNumber = +myValue;
        return (97 - (myNumber % 97) == +myNir);
    }
    
    // ------------------------------------------------------------------------------------------------------------
    // methode des information
    // ------------------------------------------------------------------------------------------------------------
    public async getInfo() {
        let data = await this.getCommuneDepartement();
        this.sexe = this.GetSexe();
        this.date_de_naissance = this.getDateDeNaissance()
        this.departement_nom = data.departement_nom;
        this.departement_numero = data.departement_numero;
    }

    public GetSexe() {
        let sexe = this.ssn.substr(0, 1);
        return sexe == "1" || sexe == "3" || sexe == "8" ? "Homme" : "Femme";
    }

    private getDateDeNaissance() {

       let month = +this.ssn.substr(3, 2);
       console.log(month);

       if (month == 62 || month == 63) {
           month = 1;
       }
       let birth = new Date(+this.ssn.substr(1, 2), month);
       return `${birth.getMonth()}/${birth.getFullYear()}`
    }

    private async getDepartement(dept:string) {
        return await fetch('https://geo.api.gouv.fr/departements/'+dept+'?fields=nom&format=json&geometry=centre')
            .then(res => res.json())
            .then(data => {
                let Commune = ({ data });
                return Commune.data.nom;
            })
    }

    private async getCommuneDepartement() {
        let dept = +this.ssn.substr(5, 2);
        let data = {
            departement_nom: null,
            departement_numero: null,
            commune_numero: null,
            commune_nom: null,
            pays: null
        };

        // --- Case DOM TOM
        if (dept == 97 || dept == 98) {
            data.departement_numero = this.ssn.substr(5, 3);
            data.commune_numero = this.ssn.substr(8, 2);
            return data;
        }
        else if (dept == 99) {
            data.departement_nom = "Etranger";
            data.pays = this.ssn.substr(7, 3);
            return data;
        }
        else {
            let nom = await this.getDepartement(this.ssn.substr(5, 2));
            data.departement_nom = name;
            data.departement_numero = this.ssn.substr(5, 3);
            data.commune_numero = this.ssn.substr(7, 3); //verifier si bon nombre
            data.commune_nom = null;
            return data;
        }
    }

    public async toString() {
        let obj = await this.getInfo();
        return `Sexe: ${this.sexe} 
         Date de naissance: ${this.date_de_naissance}
         Nom du Departement ${this.departement_nom}
         Numero du departement ${this.departement_numero}
         Nom de commune ${this.commune_nom}
         Numero de la commune ${this.commune_numero}`
    }
}
