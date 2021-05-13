
function textAndEmojiChat(divId) {
  $(".emojionearea").unbind("keyup").on("keyup", function (e) {
    let currentEmojiTextArea = $(this);
    if (e.which === 13) {
      let targetId = $(`#write-chat-${divId}`).data("chat");
      let messageVal = $(`#write-chat-${divId}`).val();
      if (!targetId.length || !messageVal.length) {
        return false;
      }
      let dataChat = {
        uid: targetId,
        messageVal: messageVal
      };
      if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
        dataChat.isChatGroup = true;
      }

      // console.log(dataChat)

      $.post("/messages/add-text-emoji", dataChat, function (data) {
        // console.log(data)
        let dataToEmit = {
          message: data.message,
        }

        // console.log(data)
        let messageOfMe = $(`<div class="bubble me" data-mess-id="${data.message._id}"></div>`);
        let messageText = messageOfMe.text(data.message.text);
        if (dataChat.isChatGroup) {
          let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small"
          title="${data.message.sender.name}"/>`;
          messageOfMe.html(`${data.message.text}`);

          increaseNumberMessageGroup(divId);

          dataToEmit.groupId = targetId;
        }
        else {
          dataToEmit.contactId = targetId;
        }
        // let converEmoi 
        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
        nineScrollRight(divId);
        $(`#write-chat-${divId}`).val("");
        currentEmojiTextArea.find(".emojionearea-editor").text("");
        $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html(data.message.text);

        $(`.person[data-chat=${divId}]`).on("ahihi.moveConversationToTheTop", function () {
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove);
          $(this).off("ahihi.moveConversationToTheTop");
        });
        $(`.person[data-chat=${divId}]`).trigger("ahihi.moveConversationToTheTop");



        // console.log(dataToEmit)
        socket.emit("chat-text-emoji", dataToEmit);
      }).fail(function (res) {
        console.log(res.error)
      });

    }

  });
}

$(document).ready(function () {
  socket.on("req-chat-text-emoji", function (response) {
    let divId = "";
    console.log(response)
    let messageOfYou = $(`<div class="bubble you" data-mess-id="${response.massage._id}"></div>`);
    let messageText = messageOfYou.text(response.massage.text);
    if (response.curentGroupId) {

      divId = response.curentGroupId;
      let senderAvatar = `<img src="/images/users/${response.massage.sender.avatar}" class="avatar-small"
      title="${response.massage.sender.name}"/>`;
      messageOfYou.html(`${senderAvatar} ${response.massage.text}`);


      if (response.curentUserId !== $("#dropdown-navbar-user").data("uid")) {
        increaseNumberMessageGroup(divId);
      }
    }
    else {
      divId = response.curentUserId;
      // messageOfYou.text(response.messages.text);
    }

    if (response.curentUserId !== $("#dropdown-navbar-user").data("uid")) {
      $(`.right .chat[data-chat=${divId}]`).append(messageText);
      nineScrollRight(divId);
      $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime")
    }


    $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.massage.createAt).locale("vi").startOf("seconds").fromNow());
    $(`.person[data-chat=${divId}]`).find("span.preview").html(response.massage.text);




    $(`.person[data-chat=${divId}]`).on("ahihi.moveConversationToTheTop", function () {
      let dataToMove = $(this).parent();
      $(this).closest("ul").prepend(dataToMove);
      $(this).off("ahihi.moveConversationToTheTop");
    });
    $(`.person[data-chat=${divId}]`).trigger("ahihi.moveConversationToTheTop");

  });
})