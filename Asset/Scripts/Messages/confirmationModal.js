/**
 * This file is responsible for managing the functionality of confirmation modal.
 */


/**
 * Components of the confirmation modal.
 */
const confirmationModal = new bootstrap.Modal('#confirmationModal');
const confirmationModalLbl = document.getElementById('confirmationModalLbl');
const confirmationModalBody = document.getElementById('confirmationModalBody');

/**
 * Other variables...
 */
const defaultConfirmationLbl = "Are you sure ?";
const defaultConfirmationBody = "Are you sure you want to proceed with the changes ?";

/**
 * Controlling functions
 */

/**
 * Function to open the confirmation modal
 * with default label and body.
 */
function openConfirmationModal() {
    openConfirmationModal(defaultConfirmationLbl, defaultConfirmationBody);
}

/**
 * Function to open the confirmation modal
 * with provided label and body.
 * 
 * @param {string} newLbl - string value of label
 * @param {string} newBody - string value of body
 * @returns - A promise to give response of the user
 */
function openConfirmationModal(newLbl, newBody) {
    changeConfirmationModalLbl(newLbl);
    changeConfirmationModalBody(newBody);
    confirmationModal.show();

    return new Promise((resolve) => {
        const confirmPositiveBtn = document.getElementById('confirmPositiveBtn');
        const confirmNegativeBtn = document.getElementById('confirmNegativeBtn');
        
        confirmPositiveBtn.onclick = () => {
            // Just for debugging ...
            // console.log("Clicked on Yes");
            closeConfirmationModal();
            resolve(true);
        };

        confirmNegativeBtn.onclick = () => {
            // Just for debugging ...
            // console.log("Clicked on No");
            closeConfirmationModal();
            resolve(false);
        };
    });
}

/**
 * Function to close the confirmation modal.
 */
function closeConfirmationModal() {
    confirmationModal.hide();
}

/**
 * Function to change the label of confirmation modal.
 * 
 * @param {string} newLbl - new string value of label
 */
function changeConfirmationModalLbl(newLbl) {
    confirmationModalLbl.innerText = newLbl;
}

/**
 * Function to change the label of confirmation modal.
 * 
 * @param {string} newBody - new string value of body
 */
function changeConfirmationModalBody(newBody) {
    confirmationModalBody.innerText = newBody;
}