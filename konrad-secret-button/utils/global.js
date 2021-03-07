// HELLO YES I KNOW
// this is a super messy way to store global variables, normally I would use configuration files or redux 
// but this is just super fast to throw together


let min = 1;
let max = 1000;
let guesses = 10;
var fs = require('fs');

// able to update min and max values for secret via an app page
export const setGlobal = (_min, _max) => {
    min = Number.parseInt(_min);
    max = Number.parseInt(_max);

    // maximum number of guesses will always me minimum binary tree depth based on count of possible values as nodes
    guesses = Math.round(Math.log2(_max - _min + 1));
};

export const global = () => {

    return ({ min, max, guesses })
}

export const getGlobal = () => {
    let json = require('./global.json');
    console.log(json, 'the json obj');
}