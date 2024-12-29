const confirmationModal = new bootstrap.Modal('#confirmationModal');
const confirmationModalLbl = document.getElementById('confirmationModalLbl');
const confirmationModalBody = document.getElementById('confirmationModalBody');

const defaultConfirmationLbl = "Are you sure ?";
const defaultConfirmationBody = "Are you sure you want to proceed with the changes ?";

function openConfirmationModal() {
    openConfirmationModal(defaultConfirmationLbl, defaultConfirmationBody);
}

function openConfirmationModal(newLbl, newBody) {
    changeConfirmationModalLbl(newLbl);
    changeConfirmationModalBody(newBody);
    confirmationModal.show();

    return new Promise((resolve) => {
        const confirmPositiveBtn = document.getElementById('confirmPositiveBtn');
        const confirmNegativeBtn = document.getElementById('confirmNegativeBtn');
        
        confirmPositiveBtn.onclick = () => {
            // Just for debugging ...
            console.log("Clicked on Yes");
            closeConfirmationModal();
            resolve(true);
        };

        confirmNegativeBtn.onclick = () => {
             // Just for debugging ...
            console.log("Clicked on No");
            closeConfirmationModal();
            resolve(false);
        };
    });
}

function closeConfirmationModal() {
    confirmationModal.hide();
}

function changeConfirmationModalLbl(newLbl) {
    confirmationModalLbl.innerText = newLbl;
}

function changeConfirmationModalBody(newBody) {
    confirmationModalBody.innerText = newBody;
}