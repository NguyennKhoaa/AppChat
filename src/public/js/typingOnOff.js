function typingOn(divId) {
  let targetId = $(`#write-chat-${divId}`).data("chat");
  if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
    socket.emit("user-is-typing", {
      groupId: targetId
    })

  } else {
    socket.emit("user-is-typing", {
      contactId: targetId
    })
  }
}
function typingOff(divId) {
  let targetId = $(`#write-chat-${divId}`).data("chat");
  if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
    socket.emit("user-is-not-typing", {
      groupId: targetId
    })

  } else {
    socket.emit("user-is-not-typing", {
      contactId: targetId
    })
  }
}
$(document).ready(function () {
  socket.on("req-user-is-typing", function (response) {
    let messageTyping = `<div class="bubble you bubble-typing-gif">
      <img src ="/images/chat/typing.gif"/>
    </div>`;
    if (response.curentGroupId) {
      if (response.curentUserId !== $("#dropdown-navbar-user").data("uid")) {
        let check = $(`.chat[data-chat=${response.curentGroupId}]`).find("div.bubble-typing-gif");
        if (check.length) {
          return false;
        }
        $(`.chat[data-chat=${response.curentGroupId}]`).append(messageTyping);
        nineScrollRight(response.curentGroupId);
      }
    } else {
      let check = $(`.chat[data-chat=${response.curentUserId}]`).find("div.bubble-typing-gif");
      if (check.length) {
        return false;
      }
      $(`.chat[data-chat=${response.curentUserId}]`).append(messageTyping);
      nineScrollRight(response.curentUserId);
    }
  });

  socket.on("req-user-is-not-typing", function (response) {
    if (response.curentGroupId) {
      if (response.curentUserId !== $("#dropdown-navbar-user").data("uid")) {
        $(`.chat[data-chat=${response.curentGroupId}]`).find("div.bubble-typing-gif").remove();
        nineScrollRight(response.curentGroupId);
      }
    } else {
      $(`.chat[data-chat=${response.curentUserId}]`).find("div.bubble-typing-gif").remove();
      nineScrollRight(response.curentUserId);
    }
  });

})