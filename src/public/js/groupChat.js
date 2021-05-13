// groupChat
function addFriendsToGroup() {
  $("ul#group-chat-friends").find("div.add-user").bind("click", function () {
    let uid = $(this).data("uid");
    $(this).remove();
    let html = $("ul#group-chat-friends").find("div[data-uid=" + uid + "]").html();

    let promise = new Promise(function (resolve, reject) {
      $("ul#friends-added").append(html);
      $("#groupChatModal .list-user-added").show();
      resolve(true);
    });
    promise.then(function (success) {
      $("ul#group-chat-friends").find("div[data-uid=" + uid + "]").remove();
    });
  });
}

function cancelCreateGroup() {
  $("#btn-cancel-group-chat").bind("click", function () {
    $("#groupChatModal .list-user-added").hide();
    if ($("ul#friends-added>li").length) {
      $("ul#friends-added>li").each(function (index) {
        $(this).remove();
      });
    }
  });
}
function callSearchFriends(e) {
  if (e.which === 13 || e.type == "click") {
    let keyword = $("#input-search-friends-to-add-group-chat").val();
    if (!keyword.length) {
      alertify.notify("Nhập thông tin cần tìm", "error", 7);
      return false;
    }
    $.get(`/contact/find-friends/${keyword}`, function (data) {
      $("ul#group-chat-friends").html(data);
      // console.log(data);
      addFriendsToGroup();

      // Action hủy việc tạo nhóm trò chuyện
      cancelCreateGroup();
    })
  }
}
function callCreateGroupChat() {
  $("#btn-create-group-chat").unbind("click").on("click", function () {
    let countUsers = $("ul#friends-added").find("li");
    if (countUsers.length < 2) {
      alertify.notify("@@ tối thiểu 2 người để thêm vào nhóm", "error", 7);
      return false;
    }
    let groupChatName = $("#input-name-group-chat").val();
    if (groupChatName.length < 1) {
      alertify.notify("@@ Tên phải dài hơn 1 kí tự", "error", 7);
      return false;
    }
    let arrIds = [];
    $("ul#friends-added").find("li").each(function (index, item) {
      arrIds.push({ "userID": $(item).data("uid") });
    });
    Swal.fire({
      title: `Bạn có chắc chắn muốn tạo cuộc trò chuyện`,
      type: "info",
      showCancelButton: true,
      confirmButtonColor: "#2ECC71",
      cancelButtonColor: "#ff7675",
      cancelButtonText: "Xác nhận",
      cancelButtonText: "Hũy"
    }).then((result) => {
      if (!result.value) {
        return false;
      }
      $.post("/group-chat/add-new", {
        arrIds: arrIds,
        groupChatName: groupChatName
      }, function (data) {
        $("#input-name-group-chat").val("");
        $("#btn-cancel-group-chat").click();
        $("#groupChatModal").modal("hide");
        let subGroupChatName = data.groupChat.name;
        if (subGroupChatName.length > 15) {
          subGroupChatName = subGroupChatName.substr(0, 14);
        }
        let leftSideData = `<a href="#uid_${data.groupChat._id}" class="room-chat"
                                data-target="#to_${data.groupChat._id}">
                                <li class="person group-chat" data-chat="${data.groupChat._id}">
                                    <div class="left-avatar">
                                        <img src="/images/users/GroupSmall.png" alt="">
                                    </div>
                                    <span class="name">
                                        <span class="group-chat-name">
                                        ${subGroupChatName}
                                                      </span></span>
                                                  <span class="time">
                                                  </span>
                                                  <span class="preview">
                                                            </span>
                                                            </li>
                                                            </a>`;


        $("#all-chat").find("ul").prepend(leftSideData);
        $("#group-chat").find("ul").prepend(leftSideData);

        let rightSideData = ` <div class="right tab-pane" data-chat="${data.groupChat._id}"
        id="to_${data.groupChat._id}">
        <div class="top">
            <span>To: <span class="name">
                   ${data.groupChat.name}
                </span></span>
            <span class="chat-menu-right">
                <a href="#attachmentsModal" id="show-attachments" data-toggle="modal">
                    Tệp đính kèm
                    <i class="fa fa-paperclip"></i>
                </a>
            </span>
            <span class="chat-menu-right">
                <a href="javascript:void(0)">&nbsp;</a>
            </span>
            <span class="chat-menu-right">
                <a href="#imagesModal_${data.groupChat._id}" id="show-images" data-toggle="modal">
                    Hình ảnh
                    <i class="fa fa-photo"></i>
                </a>
            </span>
            <span class="chat-menu-right">
                <a href="javascript:void(0)">&nbsp;</a>
            </span>
            <span class="chat-menu-right">
                <a href="javascript:void(0)" id="number-members" data-toggle="modal">
                    <span class="show-number-members">
                    ${data.groupChat.userAmount}
                    </span>
                    <i class="fa fa-users"></i>
                </a>
            </span>
            <span class="chat-menu-right">
                <a href="javascript:void(0)">&nbsp;</a>
            </span>
            <span class="chat-menu-right">
                <a href="javascript:void(0)" id="number-messages" data-toggle="modal">
                    <span class="show-number-messages">
                    ${data.groupChat.messagerAmount}
                    </span>
                    <i class="fa fa-comments-o"></i>
                </a>
            </span>
        </div>
        <div class="content-chat">
            <div class="chat" data-chat="${data.groupChat._id}">
                
            </div>
        </div>
        <div class="write" data-chat="${data.groupChat._id}">
            <input type="text" class="write-chat  chat-in-group" id="write-chat-${data.groupChat._id}"
                data-chat="${data.groupChat._id}">
            <div class="icons">
                <a href="#" class="icon-chat" data-chat="${data.groupChat._id}"><i
                        class="fa fa-smile-o"></i></a>
                <label for="image-chat-${data.groupChat._id}">
                    <input type="file" id="image-chat-${data.groupChat._id}" name="my-image-chat"
                        class="image-chat chat-in-group" data-chat="${data.groupChat._id}">
                    <i class="fa fa-photo"></i>
                </label>
                <label for="attachment-chat-${data.groupChat._id}">
                    <input type="file" id="attachment-chat-${data.groupChat._id}" name="my-attachment-chat"
                        class="attachment-chat chat-in-group" data-chat="${data.groupChat._id}">
                    <i class="fa fa-paperclip"></i>
                </label>
                <a href="javascript:void(0)" id="video-chat-group">
                    <i class="fa fa-video-camera"></i>
                </a>

            </div>
        </div>
    </div>`;
        $("#screen-chat").prepend(rightSideData);

        changeScreenChat();

        socket.emit("add-Group-Chat", { groupChat: data.groupChat });

      })
        .fail(function (req) {
          alertify.notify(req.responseText, "error", 7);
        })

    })



  })
}


$(document).ready(function () {
  $("#input-search-friends-to-add-group-chat").bind("keypress", callSearchFriends);
  $("#btn-search-friends-to-add-group-chat").bind("click", callSearchFriends);
  callCreateGroupChat();
  socket.on("req-add-Group-Chat", function (response) {


    let subGroupChatName = response.groupChat.name;
    if (subGroupChatName.length > 15) {
      subGroupChatName = subGroupChatName.substr(0, 14);
    }
    let leftSideData = `<a href="#uid_${response.groupChat._id}" class="room-chat"
                            data-target="#to_${response.groupChat._id}">
                            <li class="person group-chat" data-chat="${response.groupChat._id}">
                                <div class="left-avatar">
                                    <img src="/images/users/GroupSmall.png" alt="">
                                </div>
                                <span class="name">
                                    <span class="group-chat-name">
                                    ${subGroupChatName}
                                                  </span></span>
                                              <span class="time">
                                              </span>
                                              <span class="preview">
                                                        </span>
                                                        </li>
                                                        </a>`;


    $("#all-chat").find("ul").prepend(leftSideData);
    $("#group-chat").find("ul").prepend(leftSideData);

    let rightSideData = ` <div class="right tab-pane" data-chat="${response.groupChat._id}"
    id="to_${response.groupChat._id}">
    <div class="top">
        <span>To: <span class="name">
               ${response.groupChat.name}
            </span></span>
        <span class="chat-menu-right">
            <a href="#attachmentsModal" id="show-attachments" data-toggle="modal">
                Tệp đính kèm
                <i class="fa fa-paperclip"></i>
            </a>
        </span>
        <span class="chat-menu-right">
            <a href="javascript:void(0)">&nbsp;</a>
        </span>
        <span class="chat-menu-right">
            <a href="#imagesModal_${response.groupChat._id}" id="show-images" data-toggle="modal">
                Hình ảnh
                <i class="fa fa-photo"></i>
            </a>
        </span>
        <span class="chat-menu-right">
            <a href="javascript:void(0)">&nbsp;</a>
        </span>
        <span class="chat-menu-right">
            <a href="javascript:void(0)" id="number-members" data-toggle="modal">
                <span class="show-number-members">
                ${response.groupChat.userAmount}
                </span>
                <i class="fa fa-users"></i>
            </a>
        </span>
        <span class="chat-menu-right">
            <a href="javascript:void(0)">&nbsp;</a>
        </span>
        <span class="chat-menu-right">
            <a href="javascript:void(0)" id="number-messages" data-toggle="modal">
                <span class="show-number-messages">
                ${response.groupChat.messagerAmount}
                </span>
                <i class="fa fa-comments-o"></i>
            </a>
        </span>
    </div>
    <div class="content-chat">
        <div class="chat" data-chat="${response.groupChat._id}">
            
        </div>
    </div>
    <div class="write" data-chat="${response.groupChat._id}">
        <input type="text" class="write-chat  chat-in-group" id="write-chat-${response.groupChat._id}"
            data-chat="${response.groupChat._id}">
        <div class="icons">
            <a href="#" class="icon-chat" data-chat="${response.groupChat._id}"><i
                    class="fa fa-smile-o"></i></a>
            <label for="image-chat-${response.groupChat._id}">
                <input type="file" id="image-chat-${response.groupChat._id}" name="my-image-chat"
                    class="image-chat chat-in-group" data-chat="${response.groupChat._id}">
                <i class="fa fa-photo"></i>
            </label>
            <label for="attachment-chat-${response.groupChat._id}">
                <input type="file" id="attachment-chat-${response.groupChat._id}" name="my-attachment-chat"
                    class="attachment-chat chat-in-group" data-chat="${response.groupChat._id}">
                <i class="fa fa-paperclip"></i>
            </label>
            <a href="javascript:void(0)" id="video-chat-group">
                <i class="fa fa-video-camera"></i>
            </a>

        </div>
    </div>
</div>`;
    $("#screen-chat").prepend(rightSideData);

    changeScreenChat();
    socket.emit("member-recivied-group-chat", { groupChatId: response.groupChat._id });
  });
});