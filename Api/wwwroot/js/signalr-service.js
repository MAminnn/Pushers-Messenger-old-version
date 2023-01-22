var name = document.getElementById("UserName").innerHTML;
var connection = new signalR.HubConnectionBuilder().withUrl("/chat").build();

async function notify() {
    var audio = new Audio('/sounds/message_tone (online-audio-converter.com).wav');
    audio.play();
}


connection.start().then(function () {
    $("#send-message").click(function () {

        sendMessage(name, connection);
    })
    connection.invoke("ConnectedUser", name);
});



connection.on("ReceiveMessage", function (pname, pmessage, cid) {
    ReceiveMessage(name, pname, pmessage, cid);
    scrollToEnd();
})
connection.on("ReceiveSticker", function (stickergroup, stickername, pname, cid) {

    console.log(stickergroup);
    console.log(stickername);
    console.log(cid);
    console.log(pname);
    ReceiveSticker(stickergroup, name, pname, stickername, cid);
    scrollToEnd();
});
connection.on("ReceiveReplyMessage", function (name, message, authorReplyMessage, replyMessage, cid) {
    ReceiveReplyMessage(name, message, authorReplyMessage, replyMessage, cid);
    scrollToEnd();
});
connection.on("ReceiveReplySticker", function (stickergroup, stickername, name, message, authorReplyMessage) {
    ReceiveReplySticker(stickergroup, stickername, name, message, authorReplyMessage);
    scrollToEnd();
});
connection.on("ReceiveReplyMessageToSticker", function (stickerUri, name, message, authorReplyMessage, cid) {
    ReceiveReplyMessageToSticker(stickerUri, name, message, authorReplyMessage, cid);
    scrollToEnd();
});

// Users status
connection.on("UserDisconnected", function (connectionIds) {

    if (connectionIds.length !== 1) {
        let allClients = document.getElementById("contacts");
        allClients.innerHTML = "<div class='contact hover-bg-overlay' onclick='SelectContact(" + 'all' + ")'>همه</div>"
        for (var connectionid of connectionIds) {

            allClients.innerHTML += "<div class='contact hover-bg-overlay' onclick='SelectContact(" + '"' + connectionid.connectionId.toString() + '"' + "," + '"' + connectionid.userName + '"' + ")'>" + connectionid.userName + "</div>";

        }
    }

});
connection.on("UserConnected", function (connectionIds) {

    if (connectionIds.length !== 1) {
        let allClients = document.getElementById("contacts");
        allClients.innerHTML = "<div class='contact hover-bg-overlay' onclick='SelectContact(" + '"all"' + ")'>همه</div>"
        for (var connectionid of connectionIds) {
            allClients.innerHTML += "<div class='contact hover-bg-overlay' onclick='SelectContact(" + '"' + connectionid.connectionId.toString() + '"' + "," + '"' + connectionid.userName + '"' + ")'>" + connectionid.userName + "</div>";

        }
    }

});






function ReceiveMessage(name, pname, pmessage, cid) {
    let NOW_TIME = new Date().toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
    });
    if (name === pname) {

        $("#main").append("<div class='chat-message this-user'><p id='message'>" + pmessage + "</p><div class='time'>" + NOW_TIME + "</div></div>");
    }

    else {
        if (!isWindowBlur) {
            notify();
        }

        if (cid !== undefined) {
            for (var i = 0; i < messages.length; i++) {
                if (messages[i].cid === cid) {
                    messages[i].chats += "<div class='chat-message'><div class='tools'><button class= 'font-icon no-outline hover-bg-difference' onclick = 'delCurrMessage(this)' >&#xE74D;</button ><button class='font-icon no-outline hover-bg-difference' onclick='replyCurrMessage(this)'>&#xE97A;</button></div ><div class = 'author'>" + pname + "</div><p id='message'><div class='normalmsg'>" + pmessage + "</div></p><div class='time'>" + NOW_TIME + "</div></div>"
                    if (contact == cid) { $("#main").append("<div class='chat-message'><div class='tools'><button class= 'font-icon no-outline hover-bg-difference' onclick = 'delCurrMessage(this)' >&#xE74D;</button ><button class='font-icon no-outline hover-bg-difference' onclick='replyCurrMessage(this)'>&#xE97A;</button></div ><div class = 'author'>" + pname + "</div><p id='message'><div class='normalmsg'>" + pmessage + "</div></p><div class='time'>" + NOW_TIME + "</div></div>"); }
                    else {
                        if ($("#unread-count").html() !== undefined) {
                            $("#unread-count").html(Number($("#unread-count").html()) + 1)
                            return
                        }
                        $("#unread-count").html("1");
                        return
                    }
                    return;
                }
            }
            messages.push({ cid: cid, chats: "<div class='chat-message'><div class='tools'><button class= 'font-icon no-outline hover-bg-difference' onclick = 'delCurrMessage(this)' >&#xE74D;</button ><button class='font-icon no-outline hover-bg-difference' onclick='replyCurrMessage(this)'>&#xE97A;</button></div ><div class = 'author'>" + pname + "</div><p id='message'><div class='normalmsg'>" + pmessage + "</div></p><div class='time'>" + NOW_TIME + "</div></div>" });
            if (contact == cid) { $("#main").append("<div class='chat-message'><div class='tools'><button class= 'font-icon no-outline hover-bg-difference' onclick = 'delCurrMessage(this)' >&#xE74D;</button ><button class='font-icon no-outline hover-bg-difference' onclick='replyCurrMessage(this)'>&#xE97A;</button></div ><div class = 'author'>" + pname + "</div><p id='message'><div class='normalmsg'>" + pmessage + "</div></p><div class='time'>" + NOW_TIME + "</div></div>"); } else {
                console.log($("#unread-count").innerHTML);
                if ($("#unread-count").innerHTML !== undefined) {
                    $("#unread-count").innerHTML.html(Number($("#unread-count").html()) + 1)
                    return;
                }
                $("#unread-count").html("1");
                return
            }
            return;
        }
        if (allindex !== null) messages[allindex].chats += "<div class='chat-message'><div class='tools'><button class= 'font-icon no-outline hover-bg-difference' onclick = 'delCurrMessage(this)' >&#xE74D;</button ><button class='font-icon no-outline hover-bg-difference' onclick='replyCurrMessage(this)'>&#xE97A;</button></div ><div class = 'author'>" + pname + "</div><p id='message'><div class='normalmsg'>" + pmessage + "</div></p><div class='time'>" + NOW_TIME + "</div></div>";
        if (contact == "all") $("#main").append("<div class='chat-message'><div class='tools'><button class= 'font-icon no-outline hover-bg-difference' onclick = 'delCurrMessage(this)' >&#xE74D;</button ><button class='font-icon no-outline hover-bg-difference' onclick='replyCurrMessage(this)'>&#xE97A;</button></div ><div class = 'author'>" + pname + "</div><p id='message'><div class='normalmsg'>" + pmessage + "</div></p><div class='time'>" + NOW_TIME + "</div></div>");
        return
    }
}

function ReceiveSticker(stickergroup, name, pname, stickername, cid) {
    let NOW_TIME = new Date().toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
    });

    if (pname == name) {
        $("#main").append("<div class='chat-message this-user'> <img src=/stickers/" + stickergroup + "/" + stickername + " alt='sticker' class='sticker'/> <div class='time'> " + NOW_TIME + " </div> </div>");
    }
    else {
        if (!isWindowBlur) {
            notify();
        }
        if (cid !== undefined) {
            for (var i = 0; i < messages.length; i++) {
                if (messages[i].cid === cid) {
                    messages[i].chats += "<div class='chat-message'> <div class='tools'><button class='font-icon no-outline hover-bg-difference' onclick='delCurrMessage(this)'>&#xE74D;</button><button class='font-icon no-outline hover-bg-difference' onclick='replyCurrSticker(this)'>&#xE97A;</button></div> <div class='author'>" + pname + "</div> <img src=/stickers/" + stickergroup + "/" + stickername + " alt='sticker' class='sticker'> <div class='time'>" + NOW_TIME + "</div> </div>"
                    if (contact == cid) { $("#main").append("<div class='chat-message'> <div class='tools'><button class='font-icon no-outline hover-bg-difference' onclick='delCurrMessage(this)'>&#xE74D;</button><button class='font-icon no-outline hover-bg-difference' onclick='replyCurrSticker(this)'>&#xE97A;</button></div> <div class='author'>" + pname + "</div> <img src=/stickers/" + stickergroup + "/" + stickername + " alt='sticker' class='sticker'> <div class='time'>" + NOW_TIME + "</div> </div>"); } else {
                        if ($("#updates-count").innerHTML !== undefined) {
                            $("#updates-count").innerHTML = Number($("#updates-count").html()) + 1
                            return
                        }
                        $("#updates-count").innerHTML = 1
                        return
                    }
                    return;
                }
            }
            messages.push({ cid: cid, chats: "<div class='chat-message'> <div class='tools'><button class='font-icon no-outline hover-bg-difference' onclick='delCurrMessage(this)'>&#xE74D;</button><button class='font-icon no-outline hover-bg-difference' onclick='replyCurrSticker(this)'>&#xE97A;</button></div> <div class='author'>" + pname + "</div> <img src=/stickers/" + stickergroup + "/" + stickername + " alt='sticker' class='sticker'> <div class='time'>" + NOW_TIME + "</div> </div>" });
            if (contact == cid) { $("#main").append("<div class='chat-message'> <div class='tools'><button class='font-icon no-outline hover-bg-difference' onclick='delCurrMessage(this)'>&#xE74D;</button><button class='font-icon no-outline hover-bg-difference' onclick='replyCurrSticker(this)'>&#xE97A;</button></div> <div class='author'>" + pname + "</div> <img src=/stickers/" + stickergroup + "/" + stickername + " alt='sticker' class='sticker'> <div class='time'>" + NOW_TIME + "</div> </div>"); } else {
                if ($("#updates-count").innerHTML !== undefined) {
                    $("#updates-count").innerHTML = Number($("#updates-count").html()) + 1
                    return
                }
                $("#updates-count").innerHTML = 1
                return
            };
            return;
        }
        if (allindex !== null) messages[allindex].chats += "<div class='chat-message'> <div class='tools'><button class='font-icon no-outline hover-bg-difference' onclick='delCurrMessage(this)'>&#xE74D;</button><button class='font-icon no-outline hover-bg-difference' onclick='replyCurrSticker(this)'>&#xE97A;</button></div> <div class='author'>" + pname + "</div> <img src=/stickers/" + stickergroup + "/" + stickername + " alt='sticker' class='sticker'> <div class='time'>" + NOW_TIME + "</div> </div>";
        if (contact == "all") { $("#main").append("<div class='chat-message'> <div class='tools'><button class='font-icon no-outline hover-bg-difference' onclick='delCurrMessage(this)'>&#xE74D;</button><button class='font-icon no-outline hover-bg-difference' onclick='replyCurrSticker(this)'>&#xE97A;</button></div> <div class='author'>" + pname + "</div> <img src=/stickers/" + stickergroup + "/" + stickername + " alt='sticker' class='sticker'> <div class='time'>" + NOW_TIME + "</div> </div>") }
        return
    }
}

function ReceiveReplyMessage(pname, pmessage, authorReplyMessage, replyMessage, cid) {

    let NOW_TIME = new Date().toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
    });
    if (name === pname) {

        $("#main").append("<div class='chat-message this-user'><div class='reply'><div class= 'author' > " + authorReplyMessage + "</div><div class='message'>" + replyMessage + "</div></div>" + pmessage + "<div class='time'>" + NOW_TIME + "</div></div>");
    }

    else {
        if (!isWindowBlur) {
            notify();
        }
        if (cid !== undefined) {
            for (var i = 0; i < messages.length; i++) {
                if (messages[i].cid === cid) {
                    messages[i].chats += "<div class='chat-message'><div class='tools'><button class='font-icon no-outline hover-bg-difference' onclick='delCurrMessage(this)'>&#xE74D;</button><button class='font-icon no-outline hover-bg-difference' onclick='replyCurrMessage(this)'>&#xE97A;</button></div><div class='author'>" + pname + "</div><div class='reply'><div class='author'>" + authorReplyMessage + "</div><div class='message'>" + replyMessage + "</div></div><div class='normalmsg'>" + pmessage + "</div><div class='time'>" + NOW_TIME + "</div></div>"
                    if (contact == cid) $("#main").append("<div class='chat-message'><div class='tools'><button class='font-icon no-outline hover-bg-difference' onclick='delCurrMessage(this)'>&#xE74D;</button><button class='font-icon no-outline hover-bg-difference' onclick='replyCurrMessage(this)'>&#xE97A;</button></div><div class='author'>" + pname + "</div><div class='reply'><div class='author'>" + authorReplyMessage + "</div><div class='message'>" + replyMessage + "</div></div><div class ='normalmsg'>" + pmessage + "</div><div class='time'>" + NOW_TIME + "</div></div>");
                    return;
                }
            }
            messages.push({ cid: cid, chats: "<div class='chat-message'><div class='tools'><button class='font-icon no-outline hover-bg-difference' onclick='delCurrMessage(this)'>&#xE74D;</button><button class='font-icon no-outline hover-bg-difference' onclick='replyCurrMessage(this)'>&#xE97A;</button></div><div class='author'>" + pname + "</div><div class='reply'><div class='author'>" + authorReplyMessage + "</div><div class='message'>" + replyMessage + "</div></div><div class ='normalmsg'>" + pmessage + "</div><div class='time'>" + NOW_TIME + "</div></div>" });
            if (contact == cid) { $("#main").append("<div class='chat-message'><div class='tools'><button class='font-icon no-outline hover-bg-difference' onclick='delCurrMessage(this)'>&#xE74D;</button><button class='font-icon no-outline hover-bg-difference' onclick='replyCurrMessage(this)'>&#xE97A;</button></div><div class='author'>" + pname + "</div><div class='reply'><div class='author'>" + authorReplyMessage + "</div><div class='message'>" + replyMessage + "</div></div><div class ='normalmsg'>" + pmessage + "</div><div class='time'>" + NOW_TIME + "</div></div>") } else {
                if ($("#updates-count").innerHTML !== undefined) {
                    $("#updates-count").innerHTML = Number($("#updates-count").html()) + 1
                    return
                }
                $("#updates-count").innerHTML = 1
                return
            };
            return;
        }
        if (allindex !== null) messages[allindex].chats += "<div class='chat-message'><div class='tools'><button class='font-icon no-outline hover-bg-difference' onclick='delCurrMessage(this)'>&#xE74D;</button><button class='font-icon no-outline hover-bg-difference' onclick='replyCurrMessage(this)'>&#xE97A;</button></div><div class='author'>" + pname + "</div><div class='reply'><div class='author'>" + authorReplyMessage + "</div><div class='message'>" + replyMessage + "</div></div><div class ='normalmsg'>" + pmessage + "</div><div class='time'>" + NOW_TIME + "</div></div>";
        if (contact == "all") { $("#main").append("<div class='chat-message'><div class='tools'><button class='font-icon no-outline hover-bg-difference' onclick='delCurrMessage(this)'>&#xE74D;</button><button class='font-icon no-outline hover-bg-difference' onclick='replyCurrMessage(this)'>&#xE97A;</button></div><div class='author'>" + pname + "</div><div class='reply'><div class='author'>" + authorReplyMessage + "</div><div class='message'>" + replyMessage + "</div></div><div class ='normalmsg'>" + pmessage + "</div><div class='time'>" + NOW_TIME + "</div></div>") } else {
            if ($("#updates-count").innerHTML !== undefined) {
                $("#updates-count").innerHTML = Number($("#updates-count").html()) + 1
                return
            }
            $("#updates-count").innerHTML = 1
            return
        };
        return
        $("#main").append("<div class='chat-message'><div class='tools'><button class='font-icon no-outline hover-bg-difference' onclick='delCurrMessage(this)'>&#xE74D;</button><button class='font-icon no-outline hover-bg-difference' onclick='replyCurrMessage(this)'>&#xE97A;</button></div><div class='author'>" + pname + "</div><div class='reply'><div class='author'>" + authorReplyMessage + "</div><div class='message'>" + replyMessage + "</div></div><div class ='normalmsg'>" + pmessage + "</div><div class='time'>" + NOW_TIME + "</div></div>");
    }
    isReplyOn = 1;
}

function ReceiveReplySticker(stickergroup, stickername, pname, authorReplyMessage, replyMessage) {

    let NOW_TIME = new Date().toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
    });
    if (pname === this.name) {

        $("#main").append("<div class='chat-message this-user'><div class='reply'><div class='author'>" + authorReplyMessage + "</div><div>" + replyMessage + "</div></div><img src='/stickers/" + stickergroup + "/" + stickername + "' alt='sticker' class='sticker'><div class='time'>" + NOW_TIME + "</div></div>");
    }

    else {
        if (!isWindowBlur) {
            notify();
        }
        $("#main").append("<div class='chat-message'><div class='tools'><button class='font-icon no-outline hover-bg-difference' onclick='delCurrMessage(this)'>&#xE74D;</button><button class='font-icon no-outline hover-bg-difference' onclick='replyCurrMessage(this)'>&#xE97A;</button></div><div class='author'>" + pname + "</div><div class='reply'><div class='author'>" + authorReplyMessage + "</div><div>" + replyMessage + "</div></div><img src='/stickers/" + stickergroup + "/" + stickername + "' alt='sticker' class='sticker'><div class='time'>" + NOW_TIME + "</div></div>");
    }
    isReplyOn = 1;
}

function ReceiveReplyMessageToSticker(stickerUri, pname, message, authorReplyMessage, cid) {

    let NOW_TIME = new Date().toLocaleTimeString("fa-IR", {
        hour: "2-digit",
        minute: "2-digit",
    });
    if (pname === this.name) {

        $("#main").append("<div class='chat-message this-user'><div class='reply'><div class='author'>" + authorReplyMessage + "</div><img src='" + stickerUri + "' alt='sticker' class='sticker'></div>" + message + "<div class='time'>" + NOW_TIME + "</div></div>");
    }

    else {
        if (!isWindowBlur) {
            notify();
        }
        $("#main").append("<div class='chat-message'><div class='tools'><button class='font-icon no-outline hover-bg-difference' onclick='delCurrMessage(this)'>&#xE74D;</button><button class='font-icon no-outline hover-bg-difference' onclick='replyCurrMessage(this)'>&#xE97A;</button></div><div class='author'>" + pname + "</div><div class='reply'><div class='author'>" + authorReplyMessage + "</div><img src='" + stickerUri + "' alt='sticker' class='sticker'></div>" + message + "<div class='time'>" + NOW_TIME + "</div></div>");
    }
    isReplyOn = 1;
}