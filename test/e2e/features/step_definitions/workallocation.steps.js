
const taskListPage = require('../pageObjects/workAllocation/taskListPage');
const taskAssignmentPage = require('../pageObjects/workAllocation/taskAssignmentPage');
const taskActionPage = require('../pageObjects/workAllocation/taskActionPage');


const taskmanagerPage = require('../pageObjects/workAllocation/taskManagerPage');
var { defineSupportCode } = require('cucumber');

const reportLogger = require('../../support/reportLogger');
const Browserutil = require('../../../ngIntegration/util/browserUtil');
const BrowserWaits = require('../../support/customWaits');
const SoftAssert = require('../../../ngIntegration/util/softAssert');
const taskManagerPage = require('../pageObjects/workAllocation/taskManagerPage');

defineSupportCode(function ({ And, But, Given, Then, When }) {

    Then('I see Task list sub navigation tabs', async function () {
        expect(await taskListPage.amOnPage(), "Task list sub navigation tabs not present").to.be.true;
    });

    Then('I see Task manager page displayed', async function () {
        expect(await taskmanagerPage.amOnPage(), "Task manager page not displayed").to.be.true;
    });
 
    Then('I see Task list table', async function () {
        expect(await taskListPage.isTableDisplayed(), "Task list table is not present").to.be.true;
    });

    Then('I see Task list My tasks table displaying some tasks', async function () { 
        await BrowserWaits.retryWithActionCallback(async () => {
            expect(await taskListPage.getTaskListCountInTable(), "Task list has no rows displayed ").to.be.greaterThan(0);
        });
    });

    Then('I see Task list Available tasks table displaying some tasks', async function () {
        await BrowserWaits.retryWithActionCallback(async () => {
            expect(await taskListPage.getTaskListCountInTable(), "Task list has no rows displayed ").to.be.greaterThan(0);
        });
    });


    Then('I see Task manager table displaying some tasks', async function () {
        await BrowserWaits.retryWithActionCallback(async () => {
            expect(await taskListPage.getTaskListCountInTable(), "Task list has no rows displayed ").to.be.greaterThan(0);
        });
    });


    When('I click sub navigation tab Available tasks', async function () {
        await taskListPage.clickAvailableTasks(); 
     });

    When('I click sub navigation tab My tasks', async function () {
        await taskListPage.clickMyTasks(); 
    });


    Then('I see Available tasks page displayed', async function () {
        expect(await taskListPage.isAvailableTasksDisplayed(), "Task list Available tasks page is not present").to.be.true;
    });


    Then('I see My tasks page displayed', async function () {
        expect(await taskListPage.isMyTasksDisplayed(), "Task list My Tasks page is not present").to.be.true;
    });

    When('I click manage link for first task', async function() {
        await taskListPage.clickManageLinkForTaskAt(1);
    });

    Given('I note task id from table at position {int} with reference {string} to track', async function(ttaskAtpos, taskIdReference){
        const caseRefenceVal = await taskListPage.getColumnValueForTaskAt('Case reference',1);
        scenarioData[taskIdReference] = caseRefenceVal; 
    });

    Then('I see task action links', async function(actionsTable){
        const actionRows = actionsTable.hashes();
        for (const actionRow of actionRows){
            const action = actionRow.action;
            expect(await taskListPage.isTaskActionPresent(action), `Task action "${action} ${JSON.stringify(actionRow,2)}" is not displayed`).to.be.true;
        } 
    });
  

    When('I click task action {string}', async function(taskAction){
        await taskListPage.clickTaskAction(taskAction); 
    });

    Then('I see task action suceess confirmation banner', async function(){
       expect(await taskListPage.isBannerMessageDisplayed(),"Message banner not displayed").to.be.true;
        const messages = await taskListPage.getBannerMessagesDisplayed();
        const isSuccessDidplayed =  await taskListPage.isBannermessageWithTextDisplayed("You've assigned yourself a task. It's available in My tasks");
        expect(isSuccessDidplayed, "Success message expected is not displayed in :  " + JSON.stringify(messages)).to.be.true;
       
    });

    When('I click My tasks tab', async function(){
        await taskListPage.clickMyTasks();
    });

    Then('I see task id with reference {string} displayed in table', async function(taskIdReference){
        expect(await taskListPage.getTaskRowWithColumnValue(scenarioData[taskIdReference])).to.not.equal(-1);
    });

    When('I claim available task and note taskId wuth reference {string}', async function(taskIdReference){
       const tasksCount = await taskListPage.getTaskListCountInTable();
        reportLogger.AddMessage("Total tasks listed  " + tasksCount);

        for (let i = 1; i <= tasksCount; i++){
            const isActionBarDisplayed = await taskListPage.isTaskActionBarDisplayedForAtPos(i);
            if (!isActionBarDisplayed){
                await taskListPage.clickManageLinkForTaskAt(i);
            }
            scenarioData[taskIdReference] = await taskListPage.getColumnValueForTaskAt('Case reference',i);
            expect(await taskListPage.isTaskActionBarDisplayedForAtPos(i), "Task actions row not displayed for task at row "+i).to.be.true;
            await taskListPage.clickTaskAction("Assign to me");
            expect(await taskListPage.isBannerMessageDisplayed(), "Message banner not displayed").to.be.true;
            const messages = await taskListPage.getBannerMessagesDisplayed();
            const isMessageDisplayed = await taskListPage.isBannermessageWithTextDisplayed("You've assigned yourself a task. It's available in My tasks");
            // expect(messages, "Success message expected is not displayed in :  " + JSON.stringify(messages)).to.include("You've assigned yourself a task. It's available in My tasks");


            if (isMessageDisplayed){
                reportLogger.AddMessage("Action to claim (Assign to me) is success for task at row: " + i);
                break;
            }else{
                reportLogger.AddMessage("Action to clain (Assign to me) returned not success : "+JSON.stringify(messages));
            }

       }
    });

    When('I Unclaim my task and note taskId with reference {string}', async function (taskIdReference) {
        const tasksCount = await taskListPage.getTaskListCountInTable();
        reportLogger.AddMessage("Total tasks listed  " + tasksCount);

        for (let i = 1; i <= tasksCount; i++) {
           
            await BrowserWaits.retryWithActionCallback(async () => {
                const isActionBarDisplayed = await taskListPage.isTaskActionBarDisplayedForAtPos(i);
                if (!isActionBarDisplayed) {
                    await taskListPage.clickManageLinkForTaskAt(i);
                }
                scenarioData[taskIdReference] = await taskListPage.getColumnValueForTaskAt('Case reference', i);

                expect(await taskListPage.isTaskActionBarDisplayedForAtPos(i), "Task actions row not displayed for task at row " + i).to.be.true;
                await taskListPage.clickTaskAction("Unassign task");
                expect(await taskActionPage.amOnPage(), "Unassign task page not displayed").to.be.true;
            }, "Action to navigate to Unassign task page");


            await taskActionPage.clickUnassignBtn();
            const messages = await taskActionPage.getBannerMessagesDisplayed();


            if (await taskListPage.isMyTasksDisplayed()) {
                reportLogger.AddMessage("Action to Unclaim (Unassign task) is success for task at row: " + i+ JSON.stringify(messages));
                break;
            } else {
                reportLogger.AddMessage("Action to Unclaim (Unassign task)  not success : " + JSON.stringify(messages));
            }

        }
    });

    Then('I see task page for action type {string}', async function(actionType){
        if (actionType.toUpperCase() === "ASSIGNMENT"){
            expect(await taskAssignmentPage.amOnPage(), "Task assignment page not displayed").to.be.true;
        } else if (actionType.toUpperCase() === "ACTION"){
            expect(await taskActionPage.amOnPage(), "Task action page not displayed").to.be.true;
        }else{
            throw new Error("TEST error: unrecognised task action type supplied " + actionType);
        }
    });

    Then('I validate action type {string} for task action {string} page content', async function (actionType, action){
        const softAssert = new SoftAssert(this);
        if (actionType.toUpperCase() === "ASSIGNMENT") {
            await taskAssignmentPage.validatePageContentForAction(action,softAssert);
        } else if (actionType.toUpperCase() === "ACTION") {
            await taskActionPage.validatePageContentForAction(action,softAssert);
        } else {
            throw new Error("TEST error: unrecognised task action type supplied " + actionType);
        }
    });


    When('I perform task {string} submit for {string}', async function (actionType, action){
        
        if (actionType.toUpperCase() === "ASSIGNMENT") {
            await taskAssignmentPage.selectLocationAtpos(1);
            await taskAssignmentPage.selectcaseworkerAtpos(2);
            await taskAssignmentPage.clickSubmitBtn(action);
        } else if (actionType.toUpperCase() === "ACTION") {
            await taskActionPage.clickSubmitBtn(action);
        } else {
            throw new Error("TEST error: unrecognised task action type supplied " + actionType);
        }
    });

    When('I perform task {string} cancel for {string}', async function (actionType, action) {

        if (actionType.toUpperCase() === "ASSIGNMENT") {
         
            await taskAssignmentPage.clickCancelBtn();
        } else if (actionType.toUpperCase() === "ACTION") {
            await taskAction.clickCancelBtn();
        } else {
            throw new Error("TEST error: unrecognised task action type supplied " + actionType);
        }
    });

    Then('I validate My tasks message banner displays {string}', async function(bannermessage){
       const displayedMessages = await taskListPage.getBannerMessagesDisplayed();
        const messagesMathcing = displayedMessages.filter(msg => msg.includes(bannermessage));
        expect(messagesMathcing.length > 0, `${bannermessage} is not in displayed message ${displayedMessages}`).to.be.true;
    });

    Then('I validate Task manager message banner displays {string}', async function (bannermessage) {
        const displayedMessages = await taskManagerPage.getBannerMessagesDisplayed();
        const messagesMathcing = displayedMessages.filter(msg => msg.includes(bannermessage));
        expect(messagesMathcing.length > 0, `${bannermessage} is not in displayed message ${displayedMessages}`).to.be.true;
    });

    Then('I validate My tasks message banner not displayed', async function(){
        const displayedMessages = await taskListPage.isBannerMessageDisplayed();
        expect(await taskListPage.isBannerMessageDisplayed(), `Message displayed is displayed message `).to.be.false;
    });

    Then('I validate Task manager message banner not displayed', async function () {
        const displayedMessages = await taskManagerPage.isBannerMessageDisplayed();
        expect(await taskListPage.isBannerMessageDisplayed(), `Message displayed is displayed message `).to.be.false;
    });

    Then('I validate task one click action landing on {string} page and message displayed {string}', async function(landingPage, messageDisplayed){
        await BrowserWaits.waitForSeconds(2);
        landingPage = landingPage.toUpperCase();
        if (landingPage.toUpperCase() == " "){

        }
    });
});

