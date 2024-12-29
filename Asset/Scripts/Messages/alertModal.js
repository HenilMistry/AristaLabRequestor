const alertModal = new bootstrap.Modal('#alertModal');
const alertModalLbl = document.getElementById('alertModalLbl');
const alertModalBody = document.getElementById('alertModalBody');

const defaultAlertLbl = "Alert!";
const defaultAlertBody = "There is some alert!";

function openAlertModal() {
    openAlertModal(defaultAlertLbl, defaultAlertBody);
}

function openAlertModal(newLbl, newBody) {
    changeAlertModalLbl(newLbl);
    changeAlertModalBody(newBody);
    alertModal.show();
}

function closeAlertModal() {
    alertModal.hide();
}

function changeAlertModalLbl(newLbl) {
    alertModalLbl.innerText = newLbl;
}

function changeAlertModalBody(newBody) {
    alertModalBody.innerText = newBody;
}