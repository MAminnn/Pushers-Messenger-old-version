let isReplyOn = 1;
let replyMessage;
let isWindowBlur = false;
var messages = [];
var contact = "all";
var allindex = null;

document.onkeyup = (e) => {
    if (e.ctrlKey && e.key === "Delete") $("#clear-history-button").click();
};
$("textarea[name=message]")[0].onkeyup = (e) => {
    /* check ctrl + enter */
    if (e.ctrlKey && e.key === "Enter") {
        $("#send-message").click();
        return;
    }

    /* auto row for textarea */
    const textarea = $("textarea[name=message]")[0];
    let row = textarea.value.split("\n").length;
    if (row > 5) row = 5;
    textarea.setAttribute("rows", row.toString());
};

/* functions */

/* clears all messages */
function clearHistory() {
    $("#main")[0].innerHTML = "";
}

/* scrolls to the end */
function scrollToEnd() {
    const mainWrapper = $("#main-wrapper");
    mainWrapper.scrollTop(mainWrapper[0].scrollHeight);
}

/* send message */
function sendMessage(name, connection) {
    let textarea = $("textarea[name=message]")[0];

    if (textarea.value.trim() === "") {
        textarea.value = "";
        textarea.focus();
        textarea.setAttribute("rows", "1");
        return;
    }

    /* send the message here */
    let message = textarea.value.trim().replaceAll("\n", "<br />");
    /* your code here ... */

    if (isReplyOn === 2) {
        if (contact !== "all") {

            connection.invoke("SnedReplyMessage_pv", contact, name, message, replyMessage.replyMessageAuthor, replyMessage.replyMessage);
        }
        else {
            connection.invoke("SnedReplyMessage", name, message, replyMessage.replyMessageAuthor, replyMessage.replyMessage).catch(function () {
                console.log("connection lost");

                connection = new signalR.HubConnectionBuilder().withUrl("/chat").build();

            });
        }
    }
    else if (isReplyOn === 1) {

        if (contact !== "all") {
            connection.invoke("SendMessage_pv", contact, name, message).catch(function () {
                console.log("connection lost");

                connection = new signalR.HubConnectionBuilder().withUrl("/chat").build();

            });
        }
        else {
            connection.invoke("SendMessage", name, message).catch(function (e) {
                console.log("connection lost");

                connection = new signalR.HubConnectionBuilder().withUrl("/chat").build();

            });
        }
    }
    else if (isReplyOn == 3) {

        if (contact !== "all") {
            connection.invoke("SnedReplyMessageToSticker_pv", contact, replyMessage.replyStickerUri, name, message, replyMessage.replyMessageAuthor).catch(function () {
                console.log("connection lost");

                connection = new signalR.HubConnectionBuilder().withUrl("/chat").build();

            });
        }
        else {
            connection.invoke("SnedReplyMessageToSticker", replyMessage.replyStickerUri, name, message, replyMessage.replyMessageAuthor).catch(function (e) {
                console.log("connection lost");

                connection = new signalR.HubConnectionBuilder().withUrl("/chat").build();
            });
        }
    }


    /* up to here */

    textarea.value = "";
    textarea.placeholder = "پیامی بنویسید ...";
    textarea.focus();
    textarea.setAttribute("rows", "1");
}
/* open / close sticker box */
function OCStickerBox() {
    const stickerBox = $("#sticker-picker-wrapper")[0];

    if (stickerBox.style.display === "block") stickerBox.style.display = "none"; else stickerBox.style.display = "block";
}

function OCContacts() {
    const contactBox = $("#contacts-wrapper");
    if (contactBox.css("display") === "block") contactBox.css("display", "none"); else contactBox.css("display", "block");
}

function SelectContact(connectionId, username) {
    if (connectionId !== "all") {
        $("#other-user").css("display", "block");
        $("#other-user-name").html(username);
    }
    else {
        console.log("haji");
        $("#other-user").css("display", "none");
    }

    let conidindex = null;
    allindex = null;
    for (var i = 0; i < messages.length; i++) {
        if (messages[i].cid === connectionId) {
            conidindex = i;
        }
    }
    for (var i = 0; i < messages.length; i++) {
        if (messages[i].cid === "all") {
            allindex = i;
        }
    }

    //contacts box
    const contactBox = $("#contacts-wrapper");

    if (connectionId === contact) {
        if (contactBox.css("display") === "none") contactBox.css("display", "block"); else contactBox.css("display", "none");
        return;
    }

    if (connectionId === "all") {
        for (var i = 0; i < messages.length; i++) {
            if (contact === messages[i].cid) {
                messages[i].chats = document.getElementById("main").innerHTML;
                document.getElementById("main").innerHTML = messages[allindex].chats
                contact = "all";
                if (contactBox.css("display") === "none") contactBox.css("display", "block"); else contactBox.css("display", "none");
                return;
            }
        }
        messages.push({ cid: contact, chats: document.getElementById("main").innerHTML });
        document.getElementById("main").innerHTML = messages[allindex].chats
        contact = "all";
        if (contactBox.css("display") === "none") contactBox.css("display", "block"); else contactBox.css("display", "none");
        return;
    }

    if (contact === "all") {
        let isExsits = false
        for (var i = 0; i < messages.length; i++) {
            if (messages[i].cid === "all") {
                isExsits = true;
            }
        }

        if (!isExsits) {
            messages.push({ cid: "all", chats: document.getElementById("main").innerHTML });

            if (conidindex !== null) {
                document.getElementById("main").innerHTML = messages[conidindex].chats;
                contact = connectionId.toString();
                if (contactBox.css("display") === "none") contactBox.css("display", "block"); else contactBox.css("display", "none");
                return;
            }

            document.getElementById("main").innerHTML = null;
            contact = connectionId.toString();
            if (contactBox.css("display") === "none") contactBox.css("display", "block"); else contactBox.css("display", "none");
            return;

        }
        else {

            if (conidindex != null) {

                messages[allindex] = { cid: "all", chats: document.getElementById("main").innerHTML }
                document.getElementById("main").innerHTML = messages[conidindex].chats;
                contact = connectionId.toString();
                if (contactBox.css("display") === "none") contactBox.css("display", "block"); else contactBox.css("display", "none");
                return;
            }

            for (var i = 0; i < length; i++) {

            }

        }

        contact = connectionId.toString();
        if (contactBox.css("display") === "none") contactBox.css("display", "block"); else contactBox.css("display", "none");
        return;
    }
    //select pv
    //update current contact
    let isExists = false;

    for (var i = 0; i < messages.length; i++) {
        if (messages[i].cid === contact) {
            isExists = true;
            messages[i].chats = document.getElementById("main").innerHTML;
        }
    }

    //end update current contact
    //show selected contact chats

    if (conidindex != null) {
        if (!isExists) {
            messages.push({ cid: contact, chats: document.getElementById("main").innerHTML })
        }
        document.getElementById("main").innerHTML = messages[conidindex].chats;
        contact = connectionId.toString();
        if (contactBox.css("display") === "none") contactBox.css("display", "block"); else contactBox.css("display", "none");
        return;
    }

    // if contact and connectionId were new 
    messages.push({ cid: contact, chats: document.getElementById("main").innerHTML })
    contact = connectionId;
    document.getElementById("main").innerHTML = null;

    contact = connectionId.toString();
    if (contactBox.css("display") === "none") contactBox.css("display", "block"); else contactBox.css("display", "none");

}

/* send sticker */
function sendSticker(stickergroup, stickername) {
    if (contact !== "all") {
        connection.invoke("SnedSticker_pv", contact, stickergroup, stickername.toString(), name).catch(function () {
            console.log("connection lost");
            setTimeout(2000, function () {
                connection = new signalR.HubConnectionBuilder().withUrl("/chat").build();
            });
        });
        OCStickerBox();
        return;
    }
    if (isReplyOn === 2) {

        connection.invoke("SnedReplySticker", stickergroup, stickername.toString(), name, replyMessage.replyMessageAuthor, replyMessage.replyMessage).catch(function () {
            console.log("connection lost");
            setTimeout(2000, function () {
                connection = new signalR.HubConnectionBuilder().withUrl("/chat").build();
            });
        });
    }
    else if (isReplyOn === 1) {
        connection.invoke("SendSticker", stickergroup, stickername.toString(), name).catch(function () {
            console.log("connection lost");
            setTimeout(2000, function () {
                connection = new signalR.HubConnectionBuilder().withUrl("/chat").build();
            });
        });
    }
    OCStickerBox();
}

/* delete this message */
function delCurrMessage(elem) {
    elem.parentElement.parentElement.remove();
}

/* edit this message */
function editCurrMessage() {

}

/* reply to this message */
function replyCurrMessage(elem) {
    isReplyOn = 2;
    let newPH;
    try {
        newPH = elem.parentElement.parentElement.getElementsByClassName("author")[0].innerHTML;
    } catch (e) {
        newPH = "خودتان";
    }
    replyMessage = {
        replyMessageAuthor: newPH,
        replyMessage: elem.parentElement.parentElement.getElementsByClassName("normalmsg")[0].innerHTML
    };

    $("textarea[name=message]")[0].focus();
    $("textarea[name=message]").attr("placeholder", "پاسخ به " + newPH + " ...");
}
window.onblur = () => {
    isWindowBlur = true;
};
window.onfocus = () => {
    isWindowBlur = false;
}
function replyCurrSticker(elem) {

    isReplyOn = 3;
    let newPH;
    try {
        newPH = elem.parentElement.parentElement.getElementsByClassName("author")[0].innerHTML;
    } catch (e) {
        newPH = "خودتان";
    }
    replyMessage = {
        replyMessageAuthor: newPH,
        replyStickerUri: elem.parentElement.parentElement.getElementsByClassName("sticker")[0].src.toString()
    };
    $("textarea[name=message]")[0].focus();
    $("textarea[name=message]").attr("placeholder", "پاسخ به " + newPH + " ...");

}
function OCBackPicker() {
    const backgroundPicker = $("#background-picker-wrapper");
    if (backgroundPicker.css("display") === "block") backgroundPicker.css("display", "none"); else backgroundPicker.css("display", "block");
}
function changeBackground(img) {
    const body = $("body")[0];

    if (img === "default") {
        body.style.backgroundImage = "none";
        $("html")[0].setAttribute("class", "theme-light default");
        return;
    }
    $("html")[0].setAttribute("class", "theme-light");
    body.style.backgroundImage = `url("${img.src}")`;
}
