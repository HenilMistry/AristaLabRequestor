let settingsObj = {
    version: "v4.0",
    keyBindings: {
        chkBoxId: "enableKeyBindings",
        isEnabled: true,
        selectNodeTool: {
            isEnabled: false,
            code: "KeyN",
            chkBoxId: "enableKeyBindingForNodeTool",
            keyBindingId: "key_enableKeyBindingForNodeTool"
        },
        selectConnectionTool: {
            isEnabled: false,
            code: "KeyC",
            chkBoxId: "enableKeyBindingForConnectionTool",
            keyBindingId: "key_enableKeyBindingForConnectionTool"
        },
        openSettings: {
            isEnabled: false,
            code: "KeyS",
            chkBoxId: "enableKeyBindingForSettings",
            keyBindingId: "key_enableKeyBindingForSettings"
        },
        generateCode: {
            isEnabled: false,
            code: "KeyG",
            chkBoxId: "enableKeyBindingForGenerateCode",
            keyBindingId: "key_enableKeyBindingForGenerateCode"
        },
        unselectTool: {
            isEnabled: false,
            code: "Escape",
            chkBoxId: "enableKeyBindingForUnselectTool",
            keyBindingId: "key_enableKeyBindingForUnselectTool"
        },
        saveTopology: {
            isEnabled: true,
            code: "KeyQ",
            chkBoxId: "enableKeyBindingForSaveTopology",
            keyBindingId: "key_enableKeyBindingForSaveTopology"
        }
    },
    canvasUtilities: {
        chkBoxId: "enableCanvasUtilities",
        isEnabled: false,
        customNodeDut: {
            isEnabled: false,
            url: "./Asset/Icons/DutImg.png",
            chkBoxId: "enableCustomNodeImage",
            imgPreviewId: "img_node"
        },
        customNodeIxia: {
            isEnabled: false,
            url: "./Asset/Icons/IxiaImg.png",
            chkBoxId: "enableCustomIxiaImage",
            imgPreviewId: "img_ixia"
        }
    },
    topologyConfiguration: {
        codeFormat: "Lab Request - SysTest"
    }
}

const settingsModal = new bootstrap.Modal('#settingsModal');

let settingsAlertBox = document.getElementById("settingsAlertBox");
let keyText = null;
let settingsModalIsOpen = false;

function openSettingsModal() {
    settingsModalIsOpen = true;
    settingsModal.show();
}

function closeSettingsModal() {
    settingsModalIsOpen = false;
    settingsModal.hide();
}

function showSettingAlert() {
    settingsAlertBox = document.getElementById("settingsAlertBox");
    settingsAlertBox.style.display = "block";
}

function hideSettingAlert() {
    settingsAlertBox = document.getElementById("settingsAlertBox");
    settingsAlertBox.style.display = "none";
}

function getKeyFromUser() {
    return new Promise((resolve) => {
        document.addEventListener("keydown", function something (event) {
            document.removeEventListener("keydown", something);
            resolve(event.code);
        })
    });
}

async function changeKeyBinding(forWhat) {
    showSettingAlert();
    let key = await getKeyFromUser();

    if (hasDuplicateKeyBinding(key)) {
        // console.log("Showing error");
        openAlertModal("Duplicate Key Binding!","Key Binding Already Exist, Please try again with different binding.");
        hideSettingAlert();
        return;
    }
    // console.log("I don't want to show");

    switch(forWhat) {
        case "forNode": {
            keyText = document.getElementById("key_enableKeyBindingForNodeTool");
            keyText.innerText = key;
            settingsObj.keyBindings.selectNodeTool.code = key;
        }
        break;

        case "forConnection": {
            keyText = document.getElementById("key_enableKeyBindingForConnectionTool");
            keyText.innerText = key;
            settingsObj.keyBindings.selectConnectionTool.code = key;
        }
        break;

        case "forSetting": {
            keyText = document.getElementById("key_enableKeyBindingForSettings");
            keyText.innerText = key;
            settingsObj.keyBindings.openSettings.code = key;
        }
        break;

        case "forCode": {
            keyText = document.getElementById("key_enableKeyBindingForGenerateCode");
            keyText.innerText = key;
            settingsObj.keyBindings.generateCode.code = key;
        }
        break;

        case "default": {
            keyText = document.getElementById("key_enableKeyBindingForUnselectTool");
            keyText.innerText = key;
            settingsObj.keyBindings.unselectTool.code = key;
        }
        break;

        case "forSaveTopology": {
            keyText = document.getElementById("key_enableKeyBindingForSaveTopology");
            keyText.innerText = key;
            settingsObj.keyBindings.saveTopology.code = key;
        }
        break;

        default: {
            openAlertModal("Error!", "No such key setting "+forWhat+" has been found!");
        }
    }

    hideSettingAlert();
}

function changeCustomImage(ofWhat) {
    let fileInput, img;
    if (ofWhat == "forNodeIxia") {
        fileInput = document.getElementById("fileInputForNodeIxia");
        fileInput.click();
        img = document.getElementById("img_ixia");
    } else {
        fileInput = document.getElementById("fileInputForNodeDut");
        fileInput.click();
        img = document.getElementById("img_node");
    }

    fileInput.addEventListener("change", function() {
        if (fileInput.files.length > 0) {
            let file = fileInput.files[0];
            
            const reader = new FileReader();
            reader.onload = function (e) {
                if (ofWhat == "forNodeIxia") {
                    settingsObj.canvasUtilities.customNodeIxia.url = e.target.result;
                } else {
                    settingsObj.canvasUtilities.customNodeDut.url = e.target.result;
                }
            };
            reader.readAsDataURL(file);
            
            let url = URL.createObjectURL(file);
            
            img.src = url;
            img.style.display = "block";
        }
    });
}

function hasDuplicateKeyBinding(incomingKey) {
    // console.log("Incoming Key : "+incomingKey);
    let hasDuplicate = false;
    Object.entries(settingsObj.keyBindings).forEach(([key, value])=> {
        if (key != "isEnabled") {
            // console.log(value.code);
            // console.log("Comparision "+(value.code===incomingKey));
            if (value.code === incomingKey) {
                hasDuplicate = true;
            }
        }
    });
    return hasDuplicate;
}

function enableKeyBinding(forWhat) {
    switch(forWhat) {
        case "forAll": {
            settingsObj.keyBindings.isEnabled = document.getElementById("enableKeyBindings").checked;
        }
        break;

        case "forNode": {
            settingsObj.keyBindings.selectNodeTool.isEnabled = document.getElementById("enableKeyBindingForNodeTool").checked;
        }
        break;

        case "forConnection": {
            settingsObj.keyBindings.selectConnectionTool.isEnabled = document.getElementById("enableKeyBindingForConnectionTool").checked;
        }
        break;

        case "forSetting": {
           settingsObj.keyBindings.openSettings.isEnabled = document.getElementById("enableKeyBindingForSettings").checked;
        }
        break;

        case "forCode": {
           settingsObj.keyBindings.generateCode.isEnabled = document.getElementById("enableKeyBindingForGenerateCode").checked;
        }
        break;

        case "default": {
           settingsObj.keyBindings.unselectTool.isEnabled = document.getElementById("enableKeyBindingForUnselectTool").checked;
        }
        break;

        case "forSaveTopology": {
            settingsObj.keyBindings.saveTopology.isEnabled = document.getElementById("enableKeyBindingForSaveTopology").checked;
        }
        break;

        default: {
            openAlertModal("Error!", "No such key binding "+forWhat+" has been found!");
        }
    }
}

function enableCustomImage(forWhat) {
    switch(forWhat) {
        case "forAll": {
            settingsObj.canvasUtilities.isEnabled = document.getElementById("enableCanvasUtilities").checked;
        }
        break;

        case "forNodeDut": {
            settingsObj.canvasUtilities.customNodeDut.isEnabled = document.getElementById("enableCustomNodeImage").checked;
        }
        break;

        case "forNodeIxia": {
            settingsObj.canvasUtilities.customNodeIxia.isEnabled = document.getElementById("enableCustomIxiaImage").checked;
        }
        break;
    }
    console.log(settingsObj);
}

function changeCodeFormat(format) {
    settingsObj.topologyConfiguration.codeFormat = format;
}

function saveSettings(message = "Settings has been saved for later use!") {
    // Store a JSON object (convert to string first)
    localStorage.setItem("AristaLabRequestorAppSettings", JSON.stringify(settingsObj));
    console.log("Data written to local storage.");

    openAlertModal("Success!", message);
}

function loadSettings() {
    // Read and parse a JSON object
    const appSettings = localStorage.getItem("AristaLabRequestorAppSettings");
    if (appSettings) {
        user_settingsObj = JSON.parse(appSettings);
        if (user_settingsObj['version'] == undefined || user_settingsObj.version != settingsObj.version) {
            localStorage.clear();
            saveSettings("We've cleared your settings to ensure compatibility with the latest version of the app.");
            loadSettings();
            console.log("setting new local storage!");
        } else {
            settingsObj = user_settingsObj;
        }

        // gui adjust according to app settings...
        Object.entries(settingsObj.keyBindings).forEach(([key, value])=> {
            if (key != "isEnabled") {
                if (key == "chkBoxId") {
                    document.getElementById(value).checked = settingsObj.keyBindings.isEnabled;
                } else {
                    document.getElementById(value.chkBoxId).checked = value.isEnabled;
                    document.getElementById(value.keyBindingId).innerText = value.code;
                }
            }
        });

        Object.entries(settingsObj.canvasUtilities).forEach(([key, value]) => {
            if (key != "isEnabled") {
                if (key == "chkBoxId") {
                    document.getElementById(value).checked = settingsObj.canvasUtilities.isEnabled;
                } else {
                    document.getElementById(value.chkBoxId).checked = value.isEnabled;
                    document.getElementById(value.imgPreviewId).src = value.url;
                }
            }
        });

        if (settingsObj.topologyConfiguration.codeFormat == "Lab Request - SysTest") {
            document.getElementById("requestSystest").checked = true;
            document.getElementById("requestAct").checked = false;
        } else {
            document.getElementById("requestSystest").checked = false;
            document.getElementById("requestAct").checked = true;
        }

    } else {
        console.log("No app settings data found.");
    }
}

window.addEventListener("keydown", (event)=>{
    console.log("Clicked : "+event.code);
    if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || settingsModalIsOpen) {
        return;  // Ignore keydown event
    }

    if (settingsObj.keyBindings.isEnabled) {
        switch(event.code) {
            case settingsObj.keyBindings.selectNodeTool.code: {
                if (settingsObj.keyBindings.selectNodeTool.isEnabled) {
                    selectTool(Tools.NODE);
                }
            }
            break;
            
            case settingsObj.keyBindings.selectConnectionTool.code: {
                if (settingsObj.keyBindings.selectConnectionTool.isEnabled) {
                    selectTool(Tools.CONNECTION);
                }
            }
            break;

            case settingsObj.keyBindings.openSettings.code: {
                if (settingsObj.keyBindings.openSettings.isEnabled) {
                    openSettingsModal();
                }
            }
            break;

            case settingsObj.keyBindings.generateCode.code: {
                if (settingsObj.keyBindings.generateCode.isEnabled) {
                    GenerateCode();
                }
            }
            break;

            case settingsObj.keyBindings.unselectTool.code: {
                if (settingsObj.keyBindings.unselectTool.isEnabled) {
                    selectTool(null);
                }
            }
            break;

            case settingsObj.keyBindings.saveTopology.code: {
                if(settingsObj.keyBindings.saveTopology.isEnabled) {
                    openSaveTopologyModal();
                }
            }
            break;
        }
    }
});