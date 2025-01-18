/**
 * This file is responsible for managing the 
 * alert modal.
 */

/**
 * Components of the alert modal
 */
const alertModal = new bootstrap.Modal('#alertModal');
const alertModalLbl = document.getElementById('alertModalLbl');
const alertModalBody = document.getElementById('alertModalBody');

/**
 * Other variables
 */
const defaultAlertLbl = "Alert!";
const defaultAlertBody = "There is some alert!";

/**
 * Controlling functions
 */

/**
 * Function to open the alter modal with 
 * default label and body.
 */
function openAlertModal() {
    openAlertModal(defaultAlertLbl, defaultAlertBody);
}

/**
 * Function to open alert modal with provided
 * label and body.
 * 
 * @param {string} newLbl - string value of label
 * @param {string} newBody - string value of body
 */
function openAlertModal(newLbl, newBody) {
    changeAlertModalLbl(newLbl);
    changeAlertModalBody(newBody);
    alertModal.show();
}

/**
 * Function to close the alert modal.
 */
function closeAlertModal() {
    alertModal.hide();
}

/**
 * Function to change the label.
 * 
 * @param {string} newLbl - new string value of label
 */
function changeAlertModalLbl(newLbl) {
    alertModalLbl.innerText = newLbl;
}

/**
 * Function to change the body.
 * 
 * @param {string} newBody - new string value of body
 */
function changeAlertModalBody(newBody) {
    alertModalBody.innerText = newBody;
}