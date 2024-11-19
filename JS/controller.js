/* jshint browser: true */
'use strict'; // remove before deployment
/* global Model, View */

const model = new Model();
const view = new View();

view.setDOMHandler(() => {

    view.setDefaultTip(model.getSavedTip());
    view.setDefaultRound(model.getSavedRound());
    view.setDefaultCurrencies(model.getSavedHomeCurrency(), model.getSavedAwayCurrency());

    model.getRoundRows(model.getSavedAwayCurrency(), (roundVals) => {
        view.renderRoundButton(roundVals);
    });
    
    view.bindGetTip((tip) => {
        model.getTip(tip);
        model.saveTip(tip);
    });
    
    view.bindGetRound((round) => {
        model.getRound(round);
        model.saveRound(round);
    });

    view.bindGetAmount((amount) => {
        model.getAmount(amount);
    });

    view.bindCancelButton(() => {
        model.resetAmount();
    });

    view.bindGetHomeCurrency((homeCurrency) => {
        model.getHomeCurrency(homeCurrency);
    });

    view.bindGetAwayCurrency((awayCurrency) => {
        model.getAwayCurrency(awayCurrency);
        model.getRoundRows(awayCurrency, (roundVals) => {  
            view.renderRoundButton(roundVals);
        });
    });


    view.bindGetHomeCurrency((homeCurrency) => {
        model.getHomeCurrency(homeCurrency);
    });

    
    view.bindGetFinalResult((noOfPeople) => {
        view.printFinalResult(model.getFinalResult(noOfPeople));
    });

 
});

