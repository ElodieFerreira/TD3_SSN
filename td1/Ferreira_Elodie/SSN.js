"use strict";
exports.__esModule = true;
var reg = /^([123478])(\d{2})(0[1-9]|1[0-2]|62|63)(\d{2}|2[AB])(\d{3})(\d{3})([0-9][0-7])$/;
var gender;
var SSN = /** @class */ (function () {
    function SSN(ssn) {
        this.ssn = ssn;
        var table_results = "not correct";
        if (reg.test(ssn)) {
            var table_results_1 = ssn.match(reg);
            console.log(table_results_1);
            this.gender = +table_results_1[1];
            this.birth_year = +table_results_1[2];
            this.birth_month = +table_results_1[3];
            this.birth_dept = table_results_1[4];
            this.birth_commune = table_results_1[5];
            this.order = +table_results_1[6];
            this.key = +table_results_1[7];
            this.validate = true;
        }
        else {
            this.validate = false;
        }
    }
    ;
    SSN.prototype.checKey = function () {
        var key_to_obtain = 97 - (this.gender + this.birth_year + this.birth_month + this.birth_dept + this.birth_commune + this.order % 97);
        return this.key == key_to_obtain;
    };
    return SSN;
}());
exports.SSN = SSN;
