import {Ssn} from "../lecellier_laetitia/Ssn";
const reg = /^([123478])(\d{2})(0[1-9]|1[0-2]|62|63)(\d{2}|2[AB])(\d{3})(\d{3})([0-9][0-7])$/;
let gender;

export class SSN {
    private gender:number;
    private birth_year:number;
    private birth_month:number;
    private birth_dept:number;
    private birth_commune:number;
    private order:number;
    private key:number;
    public validate: boolean;
    constructor(private ssn: string) {
        let table_results = "not correct";
        if(reg.test(ssn)) {
            let table_results = ssn.match(reg);
            console.log(table_results);
            this.gender = +table_results[1];
            this.birth_year = +table_results[2];
            this.birth_month = +table_results[3];
            this.birth_dept = +table_results[4];
            this.birth_commune = +table_results[5];
            this.order = +table_results[6];
            this.key = +table_results[7];
            this.validate=true;
            console.log("SSN Correct");
        } else {
            this.validate=false;
            console.log("SSN Incorrect");
        }
    };

    public checKey(): boolean {
        let key_to_obtain= 97-(this.gender+this.birth_year+this.birth_month+this.birth_dept+this.birth_commune+this.order%97);
        return this.key==key_to_obtain;
    }


}