function markAllNotify(tagetUser) {
  $.ajax({
    url: "/notifycation/mark-all",
    type: "put",
    data: { tagetUser: tagetUser },
    success: function (result) {
      if (result) {
        tagetUser.forEach(function (uid) {
          $(".noti_content").find(`div[data-uid= ${uid}]`).removeClass("notif-readed-false");
          $("ul.list-notifycations").find(`li>div[data-uid= ${uid}]`).removeClass("div.notif-readed-false");
        });
        decreaseNumberNoti("noti_counter", tagetUser.length);
      }
    },



  });
}

$(document).ready(function () {
  $("#popup-mark-notif-as-read").bind("click", function () {
    let tagetUser = [];
    $(".noti_content").find("div.notif-readed-false").each(function (index, notif) {
      tagetUser.push($(notif).data("uid"));
    });
    if (!tagetUser) {
      alertify.notify("Bạn đọc hết rồi !", "error", 7);
      return false;
    }
    markAllNotify(tagetUser)
  });

  $("#modal-mark-notif-as-read").bind("click", function () {
    let tagetUser = [];
    $("ul.list-notifycations").find("li>div.notif-readed-false").each(function (index, notif) {
      tagetUser.push($(notif).data("uid"));
    });
    if (!tagetUser) {
      alertify.notify("Bạn đọc hết rồi !", "error", 7);
      return false;
    }
    markAllNotify(tagetUser);
  });
});