
function removeResquesContact() {
  $(".user-remove-request-contact").unbind("click").on("click", function () {
    let tagetId = $(this).data("uid");
    // console.log(tagetId)
    $.ajax({
      url: "/contact/remove",
      type: "delete",
      data: { uid: tagetId },
      success: function (data) {
        if (data.success) {
          $("#find-user").find(`div.user-remove-request-contact[data-uid=${tagetId}]`).hide();
          $("#find-user").find(`div.user-add-new-contact[data-uid=${tagetId}]`).css("display", "inline-block");
          decreaseNumberNotifyContact("count-request-contact-sent");
          decreaseNumberNoti("noti_contact_counter", 1);
          $("#request-contact-sent").find(`li[data-uid=${tagetId}]`).remove();
          socket.emit("remove-request-contact", { contactId: tagetId });
        }
      }


    });
  });
}
socket.on("req-remove-request-contact", function (user) {
  $(".noti_content").find(`div[data-uid=${user.id}]`).remove();//indexchinh
  $("ul.list-notifycations").find(`li>div[data-uid=${user.id}]`).parent().remove();

  // $("#request-contact-sent").find(`li[data-uid]=${tagetId}`).remove(); 
  $("#request-contact-received").find(`li[data-uid=${user.id}]`).remove();
  decreaseNumberNotifyContact("count-request-contact-received");
  decreaseNumberNoti("noti_contact_counter", 1);
  decreaseNumberNoti("noti_counter", 1);
});


$(document).ready(function () {
  removeResquesContact();

});