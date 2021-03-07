import { global } from "./global";

// generate a secret password between designated min and max
export function getRandomInt() {
    return Math.floor(Math.random() * (global().max - global().min)) + global().min;
}