/// <reference path="jquery.d.ts" />
/// <reference path="knockout.d.ts" />
/**
* Returns a random integer between min and max
* Using Math.round() will give you a non-uniform distribution!
*/
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var Model = (function () {
    function Model() {
        var _this = this;
        this.Problem = ko.observable('');
        this.Response = ko.observable('');
        this.Answer = '';
        this.IsIncorrect = ko.observable(true);
        this.IsCorrect = ko.observable(false);
        this.Mode = ko.observable('addition');
        this.AverageTime = ko.observable('Not measured');
        this.BigNumbers = ko.observable(false);
        this.start = Date.now();
        this.lags = [];
        this.Mode.subscribe(function () {
            return _this.Reset();
        });
        this.BigNumbers.subscribe(function () {
            return _this.Reset();
        });
    }
    Model.prototype.CheckResponse = function () {
        var _this = this;
        var lag = Date.now() - this.start;
        if (this.lags.length >= 3) {
            this.lags.shift();
        }
        this.lags.push(lag);
        this.IsCorrect(this.Response().toUpperCase() == this.Answer);
        this.IsIncorrect(this.Response().toUpperCase() != this.Answer);
        this.Response(this.Answer);
        this.AverageTime(sprintf("%.3f seconds", this.lags.reduce(function (a, b) {
            return a + b;
        }) / this.lags.length / 1000));
        setTimeout(function () {
            return _this.Reset();
        }, 800);
    };
    Model.prototype.Reset = function () {
        this.IsCorrect(false);
        this.IsIncorrect(false);
        var left = getRandomInt(1, this.BigNumbers() ? 256 : 16);
        var right = getRandomInt(1, this.BigNumbers() ? 256 : 16);
        var op = this.Mode() == 'addition' ? "+" : "x";
        this.Problem(sprintf("%X %s %X =", left, op, right));
        this.Answer = sprintf("%X", this.Mode() == 'addition' ? left + right : left * right);
        this.Response('');
        $('#mainInput').focus();
        this.start = Date.now();
    };
    return Model;
})();

var m = new Model();
$(function () {
    m.Reset();
    ko.applyBindings(m);
});
