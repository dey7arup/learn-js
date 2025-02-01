const accountId = 23413                         //Initial Assigned of Value to Constant
let accountEmail = "arup@gmail.com"             //Variable Declaration - Using Let (only use Let)
var accountPassword = "1234"                    //Variable Declaration - Using var (scope issue - for multiple variables of same name)
accountCity = "Kolkata"                         //In Js variable can also be declared without mentioning any key word also - but not preffered to use
let accountState;                               //Declare Variable - But value is unknown - In JS, this value is stored as undefined.

// accountId = 23                               //Constant value cannot be changed - Not Allowed

accountEmail = "ad@ad.com"                      //Variable values can be changed - Allowed
accountPassword = "1221"                        
accountCity = "Bangalore"

/*
    Prefer not to use var, only use let to declare variable
    Because of Issue in Block Scope and Functional Scope
*/

console.log(accountId);

console.table([accountId,accountEmail,accountPassword,accountCity,accountState])

