
function removeResquesContactRecieved() {
  $(".user-remove-request-contact-received").unbind("click").on("click", function () {
    let tagetId = $(this).data("uid");
    // console.log(tagetId)
    $.ajax({
      url: "/contact/remove-received",
      type: "delete",
      data: { uid: tagetId },
      success: function (data) {
        if (data.success) {

          // $(".noti_content").find(`div[data-uid=${user.id}]`).remove();//indexchinh

          // $("ul.list-notifycations").find(`li>div[data-uid=${user.id}]`).parent().remove();
          decreaseNumberNotifyContact("count-request-contact-received");
          decreaseNumberNoti("noti_contact_counter", 1);


          $("#request-contact-received").find(`li[data-uid=${tagetId}]`).remove();

          socket.emit("remove-request-contact-received", { contactId: tagetId });
        }
      }


    });
  });
}
socket.on("req-remove-request-contact-received", function (user) {



  $("#find-user").find(`div.user-remove-request-contact[data-uid=${user.id}]`).hide();

  $("#find-user").find(`div.user-add-new-contact[data-uid=${user.id}]`).css("display", "inline-block");



  $("#request-contact-sent").find(`li[data-uid=${user.id}]`).remove();

  // $("#request-contact-sent").find(`li[data-uid]=${tagetId}`).remove(); 

  decreaseNumberNotifyContact("count-request-contact-sent");
  decreaseNumberNoti("noti_contact_counter", 1);
  // decreaseNumberNoti("noti_counter", 1);
});


$(document).ready(function () {
  removeResquesContactRecieved();

});