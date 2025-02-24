let settingsObj = {
    keyBindings: {
        chkBoxId: "enableKeyBindings",
        isEnabled: false,
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

        default: {
            keyText = document.getElementById("key_enableKeyBindingForUnselectTool");
            keyText.innerText = key;
            settingsObj.keyBindings.unselectTool.code = key;
        }
        break;
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

        default: {
           settingsObj.keyBindings.unselectTool.isEnabled = document.getElementById("enableKeyBindingForUnselectTool").checked;
        }
        break;
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

function saveSettings() {
    // Store a JSON object (convert to string first)
    localStorage.setItem("AristaLabRequestorAppSettings", JSON.stringify(settingsObj));
    console.log("Data written to local storage.");

    openAlertModal("Success!","Settings has been saved for later use!");
}

function loadSettings() {
    // Read and parse a JSON object
    const appSettings = localStorage.getItem("AristaLabRequestorAppSettings");
    if (appSettings) {
        settingsObj = JSON.parse(appSettings);
        console.log("App Settings:", settingsObj);

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

    } else {
        console.log("No app settings data found.");
    }
}

window.addEventListener("keydown", (event)=>{
    console.log("Clicked : "+event.code);
    if (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA" || settingsModalIsOpen) {
        console.log("Ignoring keydown - Input is focused");
        return;  // Ignore keydown event
    }

    if (settingsObj.keyBindings.isEnabled) {
        console.log("key binding is enabled.");

        switch(event.code) {
            case settingsObj.keyBindings.selectNodeTool.code: {
                console.log("inside select node tool");
                if (settingsObj.keyBindings.selectNodeTool.isEnabled) {
                    console.log("key binding is enabled")
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
        }
    }
});