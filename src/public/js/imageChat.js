
function imageChat(divId) {
  $(`#image-chat-${divId}`).unbind("change").on("change", function () {
    let fileData = $(this).prop("files")[0];
    let math = ["image/png", "image/jpg", "image/jpeg"];
    let limit = 1048576;//byte =1mb


    if ($.inArray(fileData.type, math) === -1) {


      alertify.notify("kiểu file không hợp lệ, chỉ chấp nhận jpg", "error", 7);
      $(this).val(null)
      return false;

    }
    let targetId = $(this).data("chat");
    let isChatGroup = false;
    let messageFormData = new FormData();
    messageFormData.append("my-image-chat", fileData);
    messageFormData.append("uid", targetId);

    if ($(this).hasClass("chat-in-group")) {
      messageFormData.append("ischatGroup", true);
      isChatGroup = true;

    }

    $.ajax({
      url: "/messages/add-new-image",
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
        let messageOfMe = $(`<div class="bubble me bubble-image-file" data-mess-id="${data.message._id}"></div>`);
        let imageChat = `<img src="data:${data.message.file.contentType}; base64, ${bufferTobase64(data.message.file.data.data)}" class="show-image-chat">`
        if (isChatGroup) {
          // console.log(messageOfMe)
          let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small"
          title="${data.message.sender.name}"/>`;
          messageOfMe.html(`${senderAvatar} ${imageChat}`);
          // console.log(imageChat)
          increaseNumberMessageGroup(divId);

          dataToEmit.groupId = targetId;
        }
        else {
          messageOfMe.html(`${imageChat}`);
          dataToEmit.contactId = targetId;
        }
        $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
        nineScrollRight(divId);
        $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html("Hình ảnh ");
        $(`.person[data-chat=${divId}]`).on("ahihi.moveConversationToTheTop", function () {
          let dataToMove = $(this).parent();
          $(this).closest("ul").prepend(dataToMove);
          $(this).off("ahihi.moveConversationToTheTop");
        });
        $(`.person[data-chat=${divId}]`).trigger("ahihi.moveConversationToTheTop");
        socket.emit("chat-Image", dataToEmit);

      },
      error: function (error) {
        alertify.notify(error, 7);


      }
    });

  });
}
$(document).ready(function () {
  socket.on("req-chat-Image", function (response) {
    console.log(response)
    let divId = "";
    let messageOfYou = $(`<div class="bubble you bubble-image-file" data-mess-id="${response.massage._id}"></div>`);
    let imageChat = `<img src="data:${response.massage.file.contentType}; base64, ${bufferTobase64(response.massage.file.data.data)}" class="show-image-chat">`
    // messageOfYou.html(`${imageChat}`);
    if (response.curentGroupId) {
      divId = response.curentGroupId;
      let senderAvatar = `<img src="/images/users/${response.massage.sender.avatar}" class="avatar-small"
      title="${response.massage.sender.name}"/>`;
      messageOfYou.html(`${senderAvatar} ${imageChat}`);
      if (response.curentUserId !== $("#dropdown-navbar-user").data("uid")) {
        increaseNumberMessageGroup(divId);
      }
    }
    else {
      messageOfYou.html(imageChat);
      divId = response.curentUserId;

    }
    if (response.curentUserId !== $("#dropdown-navbar-user").data("uid")) {
      $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
      nineScrollRight(divId);
      $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime")
    }


  })

})