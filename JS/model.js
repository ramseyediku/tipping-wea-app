class Model {

    constructor() {
        this.amount = 0;
        this.tipValue = 1;
        this.roundValue = 1;
        this.finalResult = 0;
        this.currentHomeCurrency = "GBP";
        this.currentVisitingCurrency = "GBP";
        this.currentHomeCurrencySymbol = "£";
        this.homeCurrencySuffix = false;
        this.currentAwayCurrencySymbol = "£";
        this.awayCurrencySuffix = false;
        this.convRate = 0;
    }


    getAmount(amount) {
        this.amount = amount;
    }

    getTip(tip) {
        localStorage.setItem("savedTip", this.tip);
        this.tipValue = tip;
    }

    getRound(round) {
        localStorage.setItem("savedRoundVal", this.round);
        this.roundValue = round;
    }

    getAwayCurrency(awayCurrency) {
        localStorage.setItem("awayCurrency", awayCurrency);
        this.currentVisitingCurrency = awayCurrency;
    }

    getHomeCurrency(homeCurrency) {
        localStorage.setItem("homeCurrency", homeCurrency);
        this.currentHomeCurrency = homeCurrency;
    }

    getSavedTip() {
        if (localStorage.getItem("savedTip") === null || localStorage.getItem("savedTip") === undefined) {
            return this.tipValue;
        } else {
            this.tipValue = localStorage.getItem("savedTip");
            return localStorage.getItem("savedTip");
        }
    }

    getSavedRound() {
        if (localStorage.getItem("savedRoundVal") === null || localStorage.getItem("savedRoundVal") === undefined) {
            return this.roundValue;
        } else {
            this.roundValue = localStorage.getItem("savedRoundVal");
            return localStorage.getItem("savedRoundVal");
        }
    }


    getSavedHomeCurrency() {
        if (localStorage["homeCurrency"] === null || localStorage["homeCurrency"] === undefined) {
            return this.currentHomeCurrency;
        } else {
            this.currentHomeCurrency = localStorage.getItem("homeCurrency");
            return this.currentHomeCurrency;
        }
    }

    getSavedAwayCurrency() {
        if (localStorage["awayCurrency"] === null || localStorage["awayCurrency"] === undefined) {
         
            return this.currentVisitingCurrency;
           
        } else {
            this.currentVisitingCurrency = localStorage.getItem("awayCurrency");
            return this.currentVisitingCurrency;
        }
    }

    saveTip(tip) {
        localStorage.setItem("savedTip", tip);
    }

    saveRound(round) {
        localStorage.setItem("savedRoundVal", round);
    }
    
    saveCurrencies(awayCurrency,homeCurrency) {
        localStorage.setItem("homeCurrency", homeCurrency);
        localStorage.setItem("awayCurrency", awayCurrency);
    }

    getRoundRows(awayCurrency, handler) {
        let req = new XMLHttpRequest();
        
        req.addEventListener("load", function() {
            let obj = JSON.parse(req.responseText);
            let roundVals = ["1","5","10","20"];
            if (obj.suffix == true) {
                for (let i = 0; i < roundVals.length; i++) roundVals[i] = roundVals[i] + obj.symbol;
            } else {
                for (let i = 0; i < roundVals.length; i++) roundVals[i] = obj.symbol + roundVals[i];
            }
            
            handler(roundVals);
        });

        req.open("GET", `https://devweb2021.cis.strath.ac.uk/~aes02112/ecb/?info=${awayCurrency}`, true);
        req.send();
    }

    resetAmount() {
        this.amount = 0;
    }

    _getHomeCurrencySymbol(homeCurrency, handler) {
        let req = new XMLHttpRequest();

        req.addEventListener("load", function() {
            let obj = JSON.parse(req.responseText);            
            handler(obj.symbol, obj.suffix);
        });

        req.open("GET", `https://devweb2021.cis.strath.ac.uk/~aes02112/ecb/?info=${homeCurrency}`, false);
        req.send();
    }

    _getAwayCurrencySymbol(awayCurrency, handler) {
        let req = new XMLHttpRequest();

        req.addEventListener("load", function() {
            let obj = JSON.parse(req.responseText);            
            handler(obj.symbol,obj.suffix);
        });

        req.open("GET", `https://devweb2021.cis.strath.ac.uk/~aes02112/ecb/?info=${awayCurrency}`, false);
        req.send();
    }   

    _getConvRate(awayCurrency, homeCurrency, handler) {
        let req = new XMLHttpRequest();
        req.addEventListener("load", function() {
            let obj = JSON.parse(req.responseText);            
            handler(obj.rate);
        });

        req.open("GET", `https://devweb2021.cis.strath.ac.uk/~aes02112/ecb/?from=${awayCurrency}&to=${homeCurrency}`, false);
        req.send();
    }

    _setAwayCurrencySymbol(symbol,suffix) {
        this.currentAwayCurrencySymbol = symbol;
        this.awayCurrencySuffix = suffix;
    }

    _setHomeCurrencySymbol(symbol,suffix) {
        this.currentHomeCurrencySymbol = symbol;
        this.homeCurrencySuffix = suffix;
    }

    _setConvRate (rate) {
        this.convRate = rate;   
    }
    

    getFinalResult(noOfPeople) {   
        if (this.amount === 0) return "You must type in a valid amount.";
        // fetch currencies information
        this._getAwayCurrencySymbol(this.currentVisitingCurrency, (symbol,suffix) => {
            this._setAwayCurrencySymbol(symbol,suffix);
        });

        this._getHomeCurrencySymbol(this.currentHomeCurrency, (symbol,suffix) => {
            this._setHomeCurrencySymbol(symbol,suffix);
        });

        this._getConvRate(this.currentVisitingCurrency, this.currentHomeCurrency, (rate) => {
            this._setConvRate(rate);
        });

        let resultString;
        let result = (this.amount / noOfPeople).toFixed(2); // price with no tip
        let tippedResult = result * this.tipValue; // price with tip
        let roundResult = Math.ceil(tippedResult / this.roundValue)*this.roundValue; // price with tip rounded up
        let convRoundResult = Math.round(roundResult * this.convRate);
        let totalTip = (roundResult - result).toFixed(2); // total tip amount
        let percentIncrease = Math.ceil(((roundResult / result)*100)-100); // % increase from price to ceilined price (with tip)      


        if (this.awayCurrencySuffix === true) {
            result = result + this.currentAwayCurrencySymbol;
            tippedResult = tippedResult + this.currentAwayCurrencySymbol;
            roundResult = roundResult + this.currentAwayCurrencySymbol;
            totalTip = totalTip + this.currentHomeCurrencySymbol;
            convRoundResult = convRoundResult + this.currentAwayCurrencySymbol;
    
        } else {
            totalTip = this.currentAwayCurrencySymbol + totalTip;
            result = this.currentAwayCurrencySymbol + result;
            tippedResult = this.currentAwayCurrencySymbol + tippedResult;
            convRoundResult =  this.currentHomeCurrencySymbol + convRoundResult;
            roundResult = this.currentAwayCurrencySymbol + roundResult;

        }

        if (this.tipValue == 1) {
            resultString = this.amount + " split " + noOfPeople + " ways is " + result  + " each. Rounding to the nearest" + 
            " " + this.roundValue + " gives " + roundResult +  " (approx  " + convRoundResult + ") " + " each.";
        } else {
            resultString = this.amount + " split " + noOfPeople + " ways is " + result  + " each. Adding a tip and rounding to nearest" + 
            " " + this.roundValue + " gives " + roundResult + " (approx  " + convRoundResult + ") " + " each, including a tip of " + totalTip +
            " or " + percentIncrease + "% once rounded up.";
        }

    
        return resultString;
    }

}