/// <reference path="jquery.d.ts" />
/// <reference path="knockout.d.ts" />

/**
 * Returns a random integer between min and max
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

declare var sprintf;

class Model {
    Problem: KnockoutObservable<string> = ko.observable('');
    Response: KnockoutObservable<string> = ko.observable('');
    Answer: string = '';
    IsIncorrect = ko.observable(true);
    IsCorrect = ko.observable(false);
    Mode = ko.observable('addition');
    BigNumbers = ko.observable(false);
    constructor() {
        this.Mode.subscribe(() => this.Reset());
        this.BigNumbers.subscribe(() => this.Reset());
    }
    CheckResponse() {
        this.IsCorrect(this.Response().toUpperCase() == this.Answer);
        this.IsIncorrect(this.Response().toUpperCase() != this.Answer);  
        this.Response(this.Answer); 
        setTimeout(() => this.Reset(), 800);
    }
    Reset() {
        this.IsCorrect(false);
        this.IsIncorrect(false);
        var left = getRandomInt(1, this.BigNumbers() ? 256 : 16);
        var right = getRandomInt(1, this.BigNumbers() ? 256 : 16);
        var op = this.Mode() == 'addition' ? "+" : "x";
        this.Problem(sprintf("%X %s %X =", left, op, right));
        this.Answer = sprintf("%X", this.Mode() == 'addition' ? left + right : left * right);
        this.Response('');
    }
}

var m = new Model();
$(() => {
    m.Reset();
    ko.applyBindings(m);
});