
function increaseNumberNotifyContact(className) {
  let currenValue = +$(`.${className}`).find("em").text();
  currenValue += 1;
  if (currenValue === 0) {
    $(`.${className}`).html("0");

  } else {
    $(`.${className}`).html(`<em>${currenValue}</em>`)
  }
}
function addContact() {
  $(".user-add-new-contact").bind("click", function () {
    let tagetId = $(this).data("uid");
    // console.log(tagetId)
    $.post("/contact/add-new", { uid: tagetId }, function (data) {
      if (data.success == true) {
        $("#find-user").find(`div.user-add-new-contact[data-uid=${tagetId}]`).hide();
        $("#find-user").find(`div.user-remove-request-contact[data-uid=${tagetId}]`).css("display", "inline-block");
        //dong kb hien huy kb
        increaseNumberNotifyContact("count-request-contact-sent");

        increaseNumberNoti("noti_contact_counter", 1); //js/caculateNotifi
        let userInfo = $("#find-user").find(`ul li[data-uid = ${tagetId}]`).get(0).outerHTML;
        $("#request-contact-sent").find("ul").prepend(userInfo);
        removeResquesContact();
        socket.emit("add-new-contact", { contactId: tagetId });
      }
    })
  })
}
socket.on("req-add-new-contact", function (user) {
  let notif = `<div class="notif-readed-false" data-uid="${user.id}">
            <img class="avatar-small" src="/images/users/${user.avatar}"
                alt="">
            <strong>${user.userName}</strong> đã gửi cho bạn một lời mời kết bạn!
          </div>`;
  $(".noti_content").prepend(notif);
  $("ul.list-notifycations").prepend(`<li>${notif}</li>`)
  increaseNumberNotifyContact("count-request-contact-received");
  increaseNumberNoti("noti_contact_counter", 1);
  increaseNumberNoti("noti_counter", 1);
  let userInfo = `
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
                              <span></span>
                          </div>
                          <div class="user-approve-request-contact-received" data-uid="${user.id}">
                              Chấp nhận
                          </div>
                          <div class="user-remove-request-contact-received action-danger"
                              data-uid="${user.id}">
                              Xóa yêu cầu
                          </div>
                      </div>
                    </li>
                    `;
  $("#request-contact-received").find("ul").prepend(userInfo);
  removeResquesContactRecieved();
  approveResquesContactRecieved();
});