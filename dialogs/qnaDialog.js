// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { MessageFactory } = require('botbuilder');
const { QnAServiceHelper } = require('../helpers/qnAServiceHelper');
const { CardHelper } = require('../helpers/cardHelper');
const { FunctionDialogBase } = require('./functionDialogBase');

class QnADialog extends FunctionDialogBase {
    
    constructor() {
        super('qnaDialog');
    }

    async processAsync(oldState, activity) {

        var newState = null;
        var outputActivity = null;
        var query = activity.text;
        var qnaResult = await QnAServiceHelper.queryQnAService(query, oldState);
        var cleanedObject = cleanQna(qnaResult[0]);        

        if (isVideoMessage(cleanedObject)) {
            cleanedObject.type = 1;
        } else {
            cleanedObject.type = 0;
        }
        outputActivity = JSON.stringify(cleanedObject);
        console.log('Answer: ' + outputActivity);

        return [newState, outputActivity, null];
    }
}

function cleanQna(qnaObject) {
    delete qnaObject.questions;
    delete qnaObject.source;
    delete qnaObject.score;
    delete qnaObject.id;
    return qnaObject;
}

function isVideoMessage(qnaObject) {
    const metadata = qnaObject.metadata;
    var item;
    for (item of metadata) {
        if (item.name === 'id') return true;
    }
    return false;
}

module.exports.QnADialog = QnADialog;
