
function approveResquesContactRecieved() {
  $(".user-approve-request-contact-received").unbind("click").on("click", function () {
    let tagetId = $(this).data("uid");
    let tagetName = $(this).parent().find("div.user-name>p").text().trim();
    let tagetAvatar = $(this).parent().find("div.user-avatar>img").attr("src");

    // console.log(tagetId)
    $.ajax({
      url: "/contact/approve-received",
      type: "put",
      data: { uid: tagetId },
      success: function (data) {
        if (data.success) {
          let userInfo = $("#request-contact-received").find(`ul li[data-uid= ${tagetId}]`);
          $(userInfo).find("div.user-approve-request-contact-received").remove();
          $(userInfo).find("div.user-remove-request-contact-received").remove();
          $(userInfo).find("div.contactPanel")
            .append(`
                                            <div class="user-talk" data-uid="${tagetId}">
                                                  Trò chuyện
                                              </div>
                                              <div class="user-remove-contact action-danger" data-uid="${tagetId}">
                                                  Xóa liên hệ
                                              </div>
          
          `);
          let userInfoHTML = userInfo.get(0).outerHTML;
          $("#contacts").find("ul").prepend(userInfoHTML);
          $(userInfo).remove();
          increaseNumberNotifyContact("count-contactsx");
          // decreaseNumberNotifyContact("count-request-contact-received");
          // decreaseNumberNoti("noti_contact_counter", 1);
          removeFriend();


          socket.emit("approve-request-contact-received", { contactId: tagetId });

          // $("#contactsModal").modal("hide");
          let subName = tagetName;
          if (subName.length > 15) {
            subName = subName.substr(0, 14);
          }

          let leftSideData = `
          <a href="#uid_${tagetId}" class="room-chat"
          data-target="#to_${tagetId}">
          <li class="person" data-chat="${tagetId}">
              <div class="left-avatar">
                  <div class="dot"></div>
                  <img src="${tagetAvatar}" alt="">
              </div>
              <span class="name">
                  ${tagetName}
              </span>
              <span class="time">
                  
              </span>
              <span class="preview">
                 
              </span>
          </li>
      </a>
          `;
          $("#all-chat").find("ul").prepend(leftSideData);
          $("#user-chat").find("ul").prepend(leftSideData);



          let rightSideData = `<div class="right tab-pane" data-chat="${tagetId}"
          id="to_${tagetId}">
          <div class="top">
              <span>To: <span class="name">
              ${tagetName}
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
                  <a href="#imagesModal_${tagetId}" id="show-images" data-toggle="modal">
                      Hình ảnh
                      <i class="fa fa-photo"></i>
                  </a>
              </span>
          </div>
          <div class="content-chat">
              <div class="chat" data-chat="${tagetId}">
              </div>
          </div>
          <div class="write" data-chat="${tagetId}">
              <input type="text" class="write-chat" id="write-chat-${tagetId}"
                  data-chat="${tagetId}">
              <div class="icons">
                  <a href="#" class="icon-chat" data-chat="${tagetId}"><i
                          class="fa fa-smile-o"></i></a>
                  <label for="image-chat-${tagetId}">
                      <input type="file" id="image-chat-${tagetId}" name="my-image-chat"
                          class="image-chat" data-chat="${tagetId}">
                      <i class="fa fa-photo"></i>
                  </label>
                  <label for="attachment-chat-${tagetId}">
                      <input type="file" id="attachment-chat-${tagetId}"
                          name="my-attachment-chat" class="attachment-chat"
                          data-chat="${tagetId}">
                      <i class="fa fa-paperclip"></i>
                  </label>
                  <a href="javascript:void(0)" id="video-chat-${tagetId}" class="video-chat"
                      data-chat="${tagetId}">
                      <i class="fa fa-video-camera"></i>
                  </a>

              </div>
          </div>
      </div>`;
          $("#screen-chat").prepend(rightSideData);

          changeScreenChat();


        }
      }


    });
  });
}
socket.on("response-approve-request-contact-received", function (user) {
  let notif = `<div class="notif-readed-false" data-uid="${user.id}">
  <img class="avatar-small" src="/images/users/${user.avatar}"
      alt="">
  <strong>${user.userName}</strong> Đã chấp nhận lời mời kết bạn của bạn!
</div>`;
  $(".noti_content").prepend(notif);
  $("ul.list-notifycations").prepend(`<li>${notif}</li>`);
  decreaseNumberNoti("noti_contact_counter", 1);
  increaseNumberNoti("noti_counter", 1);

  increaseNumberNotifyContact("count-contactsx");
  decreaseNumberNotifyContact("count-request-contact-sent");
  $("#request-contact-sent").find(`ul li[data-uid =${user.id}]`).remove();
  $("#find-user").find(`ul li[data-uid =${user.id}]`).remove();

  let userInfoHTML = `
  <li class="_contactList" data-uid="${user.id}">
  <div class="contactPanel">
      <div class="user-avatar">
          <img src="/images/users/${user.avatar}" alt="">
      </div>
      <div class="user-name">
          <p>
          ${user.userName}
          </p>
      </div>
      <br>
      <div class="user-address">
          <span>&nbsp ${user.address}</span>
      </div>
      <div class="user-talk" data-uid="${user.id}">
          Trò chuyện
      </div>
      <div class="user-remove-contact action-danger" data-uid="${user.id}">
          Xóa liên hệ
      </div>
  </div>
</li>
  `;



  $("#contacts").find("ul").prepend(userInfoHTML);



  removeFriend();



  // $("#contactsModal").modal("hide");
  let subName = user.userName;
  if (subName.length > 15) {
    subName = subName.substr(0, 14);
  }

  let leftSideData = `
  <a href="#uid_${user.id}" class="room-chat"
  data-target="#to_${user.id}">
  <li class="person" data-chat="${user.id}">
      <div class="left-avatar">
          <div class="dot"></div>
          <img src="images/users/${user.avatar}" alt="">
      </div>
      <span class="name">
          ${user.userName}
      </span>
      <span class="time">
          
      </span>
      <span class="preview">
         
      </span>
  </li>
</a>
  `;
  $("#all-chat").find("ul").prepend(leftSideData);
  $("#user-chat").find("ul").prepend(leftSideData);



  let rightSideData = `<div class="right tab-pane" data-chat="${user.id}"
  id="to_${user.id}">
  <div class="top">
      <span>To: <span class="name">
      ${user.userName}
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
          <a href="#imagesModal_${user.id}" id="show-images" data-toggle="modal">
              Hình ảnh
              <i class="fa fa-photo"></i>
          </a>
      </span>
  </div>
  <div class="content-chat">
      <div class="chat" data-chat="${user.id}">
      </div>
  </div>
  <div class="write" data-chat="${user.id}">
      <input type="text" class="write-chat" id="write-chat-${user.id}"
          data-chat="${user.id}">
      <div class="icons">
          <a href="#" class="icon-chat" data-chat="${user.id}"><i
                  class="fa fa-smile-o"></i></a>
          <label for="image-chat-${user.id}">
              <input type="file" id="image-chat-${user.id}" name="my-image-chat"
                  class="image-chat" data-chat="${user.id}">
              <i class="fa fa-photo"></i>
          </label>
          <label for="attachment-chat-${user.id}">
              <input type="file" id="attachment-chat-${user.id}"
                  name="my-attachment-chat" class="attachment-chat"
                  data-chat="${user.id}">
              <i class="fa fa-paperclip"></i>
          </label>
          <a href="javascript:void(0)" id="video-chat-${user.id}" class="video-chat"
              data-chat="${user.id}">
              <i class="fa fa-video-camera"></i>
          </a>

      </div>
  </div>
</div>`;
  $("#screen-chat").prepend(rightSideData);

  changeScreenChat();



});



$(document).ready(function () {
  approveResquesContactRecieved();

});
