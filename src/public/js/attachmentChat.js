function attachmentChat(divId) {
  $(`#attachment-chat-${divId}`).unbind("change").on("change", function () {
    let fileData = $(this).prop("files")[0];
    let limit = 1048576;//byte =1mb
    let targetId = $(this).data("chat");
    let isChatGroup = false;
    let messageFormData = new FormData();
    messageFormData.append("my-attachment-chat", fileData);
    messageFormData.append("uid", targetId);

    if ($(this).hasClass("chat-in-group")) {
      messageFormData.append("ischatGroup", true);
      isChatGroup = true;

    }
    $.ajax({
      url: "/messages/add-new-attachment",
      type: "post",
      cache: false,
      contentType: false,
      processData: false,
      data: messageFormData,
      success: function (data) {
        // console.log(data)
        let dataToEmit = {
          message: data.message,
        }
        let messageOfMe = $(`<div class="bubble me bubble-attachment-file" data-mess-id="${data.message._id}"></div>`);
        let attachmentChat = `<a href="data:${data.message.file.contentType}; 
        base64,${bufferTobase64(data.message.file.data.data)}"
        download="${data.message.file.fileName}">
        ${data.message.file.fileName}
    </a>`;
        if (isChatGroup) {
          // console.log(messageOfMe)
          let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small"
          title="${data.message.sender.name}"/>`;
          messageOfMe.html(`${senderAvatar} ${attachmentChat}`);
          // console.log(attachmentChat)
          increaseNumberMessageGroup(divId);

          dataToEmit.groupId = targetId;
        }
        else {
          messageOfMe.html(`${attachmentChat}`);
          dataToEmit.contactId = targetId;
        }
        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
        nineScrollRight(divId);
        $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html("Tệp đính kèm");
        $(`.person[data-chat=${divId}]`).on("ahihi.moveConversationToTheTop", function () {
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove);
          $(this).off("ahihi.moveConversationToTheTop");
        });
        $(`.person[data-chat=${divId}]`).trigger("ahihi.moveConversationToTheTop");
        socket.emit("chat-Attachment", dataToEmit);
      },
      error: function (error) {
        alertify.notify(error.responseText, 7);


      }
    });
  })
}
$(document).ready(function () {
  socket.on("req-chat-Attachment", function (response) {
    console.log(response)
    let divId = "";
    let messageOfYou = $(`<div class="bubble you bubble-attachment-file" data-mess-id="${response.massage._id}"></div>`);
    let attachmentChat = `<a href="data:${response.massage.file.contentType}; 
        base64,${bufferTobase64(response.massage.file.data.data)}"
        download="${response.massage.file.fileName}">
        ${response.massage.file.fileName}
    </a>`;
    if (response.curentGroupId) {
      divId = response.curentGroupId;
      let senderAvatar = `<img src="/images/users/${response.massage.sender.avatar}" class="avatar-small"
      title="${response.massage.sender.name}"/>`;
      messageOfYou.html(`${senderAvatar} ${attachmentChat}`);
      if (response.curentUserId !== $("#dropdown-navbar-user").data("uid")) {
        increaseNumberMessageGroup(divId);
      }
    }
    else {
      messageOfYou.html(attachmentChat);
      divId = response.curentUserId;

    }
    if (response.curentUserId !== $("#dropdown-navbar-user").data("uid")) {
      $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
      nineScrollRight(divId);
      $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime")
    }


  })

})