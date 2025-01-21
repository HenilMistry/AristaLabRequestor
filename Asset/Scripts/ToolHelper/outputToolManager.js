/**
 * This file responsible for managing the output
 * modal, where you'll see the output of the t-
 * opology that you have configured.
 */

/**
 * components of the output modal...
 */
const outputModal = new bootstrap.Modal('#outputModal');
const outputModalBody = document.getElementById("outputModalBody");
let finalOutput = undefined;

/**
 * Controlling functions...
 */

/**
 * This function will open the output modal and show
 * the output on the screen.
 * 
 * @param {string} output - The final output in string format.
 */
function openOutputModal(output) {
    finalOutput = output;
    outputModalBody.innerText = output;
    outputModal.show();
}

/**
 * This function will close the output modal.
 */
function closeOutputModal() {
    outputModalBody.innerText = "";
    outputModal.hide();
}

/**
 * This function will copy the output to the clip-
 * board.
 */
function copyOutput() {
    if (finalOutput != undefined) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(finalOutput)
              .then(() => {
                openAlertModal("Lab Requestor", "Output copied to clipboard!");
                // Just for debugging...
                // console.log("Text copied to clipboard successfully!");
              })
              .catch(err => {
                openAlertModal("Lab Requestor", "Failed to copy output!");
                // Just for debugging... 
                // console.error("Failed to copy text to clipboard:", err);
              });
        } else {
            openAlertModal("Lab Requestor", "Clipboard api not supported in this browser!");
            // Just for debugging... 
            // console.error("Clipboard API not supported in this browser.");
        }
    } else {
        openAlertModal("Lab Requestor", "Please click to generate output first!");
    }
}