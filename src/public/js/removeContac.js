function removeFriend() {
  $(".user-remove-contact").unbind("click").on("click", function () {
    let tagetId = $(this).data("uid");
    let userName = $(this).parent().find("div.user-name p").text();
    console.log(tagetId)

    Swal.fire({
      title: `Bạn có chắc chắn muốn xóa ${userName} này`,
      text: "Bạn hông thể hoàn tác",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2ECC71",
      cancelButtonColor: "#ff7675",
      cancelButtonText: "Xác nhận",
      cancelButtonText: "Hũy"
    }).then((result) => {
      if (!result.value) {
        return false;
      }
      $.ajax({
        url: "/contact/remove-friend",
        type: "delete",
        data: { uid: tagetId },
        success: function (data) {
          if (data.success) {
            $("#contacts").find(`ul li[data-uid=${tagetId}]`).remove();
            //count-contacts
            decreaseNumberNotifyContact("count-contacts");


            socket.emit("remove-friend", { contactId: tagetId });
            let checkActive = $("all-chat").find(`li[data-chat ==${tagetId}]`).hasClass("active");
            $("#contactsModal").modal("hide");
            $("#all-chat").find(`ul a[href="#uid_${tagetId}"]`).remove();
            $("#user-chat").find(`ul a[href="#uid_${tagetId}"]`).remove();
            $("#screen-chat").find(`div#to_${tagetId}`).remove();

            changeScreenChat();
            if (checkActive) {
              $("ul.people").find("a")[0].click();

            }
          }
        }
      });

    })
  });
}
socket.on("req-remove-friend", function (user) {
  let checkActive = $("all-chat").find(`li[data-chat ==${user.id}]`).hasClass("active");
  $("#contacts").find(`ul li[data-uid=${user.id}]`).remove();
  $("#contactsModal").modal("hide");
  $("#all-chat").find(`ul a[href="#uid_${user.id}"]`).remove();
  $("#user-chat").find(`ul a[href="#uid_${user.id}"]`).remove();
  $("#screen-chat").find(`div#to_${user.id}`).remove();
  if (checkActive) {
    $("ul.people").find("a")[0].click();

  }
  changeScreenChat();
  decreaseNumberNotifyContact("count-contacts");
});



$(document).ready(function () {
  removeFriend();

});