"use strict";       //treat all JS code as newer version -irreversible change - once declared it is same for total file

//alert("3+3")      //this alert syntax is not present in nodejs, it is separate in nodejs than js engine in browser

/* 
code readibility - Importance

console.log(3
    +
    3)              //code readibility should be high. Not Preffered
console.log(3+3)    //Ok code readibility

console.log(3+3);    console.log("Arup")    //here ; is necessary between 2 console statements but Low Code Readibility
console.log(3+3)     //Ok code readibility
console.log("Arup")
*/

let name = "Arup"       //String datatype
let age = 25            //Number datatype
let isLoggedIn = false  //Boolean datatype

// Premitive DataTypes:
    // number => 2 to power 53
    // bigint
    // string => "" or '' prefer to use ""
    // boolean => true/false eg: UserLoggedIn, CreditInfoAvailable, ReponseServerReceived
    // null => standalone value => represents to empty value but it is not undefined
    // undefined => when value is not assigned to a variable
    // symbol => unique -> find the uniquness of a component in React

// Object:

console.log(typeof undefined);  // Type: Undefined
console.log(typeof null);       //Type: Object -> Null is Object datatype

