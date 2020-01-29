import * as fetch from "node-fetch";
export class Ssn {
    private commune_nom : string;
    private secu_number: string;

    constructor(secu_number : string) {
        this.secu_number = secu_number;
    }
    
    // ------------------------------------------------------------------------------------------------------------
    // VALIDITY STUFF
    // ------------------------------------------------------------------------------------------------------------
    public isValid() {
        // ---- is Valid if enough char and key ok
        return this.controlSsnValue() && this.controlSsnKey();
    }
    
    /**
     * Function to check value
     */
    private controlSsnValue() {
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
     * Function to check NIR
     */
    private controlSsnKey() {
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
    public async getInfo() {
        return {
            sex: this.extractSex(),
            birthDate: this.extractbirthDate(),
            birthPlace: await this.extractBirthPlace(),
            birthPosition: this.extractPosition()
        };
    }

    public extractSex() {
        let sex = this.secu_number.substr(0, 1);
        return sex == "1" || sex == "3" || sex == "8" ? "Homme" : "Femme";
    }

    public extractbirthDate() {
        // -- Build a date
        let month = +this.secu_number.substr(3, 2);
        console.log(month);
        // -- special case
        if (month == 62 || month == 63) {
            month = 1;
        }
        let birth = new Date(+this.secu_number.substr(1, 2), month);
        return `${birth.getMonth()}/${birth.getFullYear()}`
    }

    public async getDept(dept:string) {
        this.commune_nom = await fetch('https://geo.api.gouv.fr/departements/'+dept+'?fields=nom&format=json&geometry=centre')
            .then(res => res.json())
            .then(data => {
                let Commune = ({ data });
                return Commune.data.nom;
            })
        console.log(this.commune_nom);

    }


    public async extractBirthPlace() {
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
                dept: "Etranger",
                pays: this.secu_number.substr(7, 3)
            };
        }
        else {
            await this.getDept(this.secu_number.substr(5, 2));
            return {
                dept: this.commune_nom,
                commune: this.secu_number.substr(7, 3)
            };
        }
    }

    public extractPosition() {
        return +this.secu_number.substr(10, 3);
    }

    public async toString() {
        let obj = await this.getInfo();
        return `Sex: ${obj.sex} 
         Birthdate: ${obj.birthDate},
         BirthRegion ${obj.birthPlace.dept},
         BirthPosition: ${obj.birthPosition},`
    }
}
