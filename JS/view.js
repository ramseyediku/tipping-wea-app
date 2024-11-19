class View {

    constructor() {
        this.inputScreen = document.querySelector(".input-screen"); 
        this.resultScreen = document.querySelector(".result-screen");
        this.cancelButton = document.querySelector(".cancel");
        this.keypadButtons = document.querySelectorAll(".number");
        this.tipOptions = document.querySelectorAll(".tipValues");
        this.roundOptions = document.querySelectorAll(".round-vals");
        this.noOfPeopleButtons = document.querySelectorAll(".people");
        this.homeCurrencySelector = document.querySelector('[name="homeCurrencySelector"]');
        this.awayCurrencySelector = document.querySelector('[name="awayCurrencySelector"]');
        this.homeCurrencyOptions = this.homeCurrencySelector.querySelectorAll(".currency");
        this.awayCurrencyOptions = this.awayCurrencySelector.querySelectorAll(".currency");
        this.settingsToggle = document.querySelector(".nav-icon"); this.settingsToggle.addEventListener("click", this._openNav);
        this.settingsClose = document.querySelector("#close-icon"); this.settingsClose.addEventListener("click", this._closeNav);
    }

    setDOMHandler(handler) {
        document.addEventListener('DOMContentLoaded', handler);
    }

    setDefaultTip(savedTip) {
        for (let i = 0; i < this.tipOptions.length; i++) {
            if (this.tipOptions[i].value == savedTip) {
                this.tipOptions[i].checked = true;
                this._buttonPressed(this.tipOptions[i]);
            }
        }
    }

    setDefaultRound(savedRound) {
        for (let i = 0; i < this.roundOptions.length; i++) {
            if (this.roundOptions[i].value == savedRound) {
                this.roundOptions[i].checked = true;
                this._buttonPressed(this.roundOptions[i]);
            }
        }
    }

    setDefaultCurrencies(savedHomeCurrency, savedAwayCurrency) {
        for (let i = 0; i < this.homeCurrencyOptions.length; i++) {
            if (this.homeCurrencyOptions[i].value === savedHomeCurrency) {
                this.homeCurrencySelector.value = savedHomeCurrency;
            }

            if (this.awayCurrencyOptions[i].value === savedAwayCurrency) {
                this.awayCurrencySelector.value = savedAwayCurrency;
            }
            
        }
    }


    bindGetAmount(handler) {
        this.keypadButtons.forEach(keypadButton => keypadButton.addEventListener("touchstart", () => {
            this._buttonPressed(keypadButton);
            (this.inputScreen.innerHTML === "0") ? this.inputScreen.innerHTML = keypadButton.innerHTML : this.inputScreen.innerHTML += keypadButton.innerHTML;
            handler(this.inputScreen.innerHTML);
        }));
        
        this.keypadButtons.forEach(keypadButton => keypadButton.addEventListener("touchend", () => {
            this._buttonReleased(keypadButton);
        }));   

    }

    bindCancelButton(handler) {
        this.cancelButton.addEventListener("touchstart",() => {
            this.cancelButton.style.opacity = 0.8;
            this._wipeScreens(this.inputScreen,this.resultScreen);
            handler();
        });

        this.cancelButton.addEventListener("touchend", () => {
            this.cancelButton.style.opacity = 1;
        }); 
    }


    bindGetTip(handler) {
        this.tipOptions.forEach(tipOption => tipOption.addEventListener("touchstart", () => {
            for (let i = 0; i < this.tipOptions.length; i++) this._buttonReleased(this.tipOptions[i]);
            this._buttonPressed(tipOption);   
            this.tip = tipOption.value;        
            handler(this.tip);
        }));
    }

    bindGetRound(handler) {
        this.roundOptions.forEach(roundOption => roundOption.addEventListener("touchstart", () => {
            for (let i = 0; i < this.roundOptions.length; i++) this._buttonReleased(this.roundOptions[i]);
            this._buttonPressed(roundOption);  
            this.round = roundOption.value;
            handler(this.round);
        }));
    }

    bindGetHomeCurrency(handler) {        
        this.homeCurrencySelector.addEventListener("change", () => {
            handler(this.homeCurrencySelector.value);
        });
    }

    bindGetAwayCurrency(handler) {
        this.awayCurrencySelector.addEventListener("change", () => {
            handler(this.awayCurrencySelector.value);
        });
    }

    bindGetFinalResult(handler) {
        this.noOfPeopleButtons.forEach(noOfPeopleButton => noOfPeopleButton.addEventListener("touchstart", () => {
            let noOfPeople = parseInt(noOfPeopleButton.innerHTML.slice(0,1));    
            this._buttonPressed(noOfPeopleButton);
            handler(noOfPeople);
        }));

        this.noOfPeopleButtons.forEach(noOfPeopleButton => noOfPeopleButton.addEventListener("touchend", () => {
            this._buttonReleased(noOfPeopleButton);
        }));        
    }

    printFinalResult(string) {
        this.resultScreen.innerHTML = string;
        this.resultScreen.style.color = "white";
    }

    renderRoundButton(roundValsArray) {
        for (let i = 0; i < this.roundOptions.length; i++) {
            this.roundOptions[i].innerHTML = roundValsArray[i];            
        }
    }

    _openNav() {
        this.currencyNavBar = document.querySelector(".currency-nav");
        this.currencyNavBar.style.visibility = "visible";
    } 

    _closeNav() {
        this.currencyNavBar = document.querySelector(".currency-nav");
        this.currencyNavBar.style.visibility =  "hidden";
    }

    _buttonPressed(button) {
        button.classList.add("pressed"); 
        button.classList.add("removeShadow"); 
    }

    _buttonReleased(button) {
        button.classList.remove("pressed"); 
        button.classList.remove("removeShadow"); 
    }

    _wipeScreens() {
        this.inputScreen.innerHTML = "0";
        this.resultScreen.innerHTML = "Bill result...";
        this.resultScreen.style.color = "grey";
    }
}