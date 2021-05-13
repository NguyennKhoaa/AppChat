//st1
socket.on("server-send-list-user-online", function (listUserIds) {
  listUserIds.forEach(id => {
    $(`.person[data-chat=${id}]`).find("div.dot").addClass("online");
    $(`.person[data-chat=${id}]`).find("img").addClass("avatar-online");
  });
});
//st2
socket.on("sever-send-when-new-user-online", function (id) {
  $(`.person[data-chat=${id}]`).find("div.dot").addClass("online");
  $(`.person[data-chat=${id}]`).find("img").addClass("avatar-online");
});
//st3


socket.on("sever-send-when-new-user-offline", function (id) {
  $(`.person[data-chat=${id}]`).find("div.dot").removeClass("online");
  $(`.person[data-chat=${id}]`).find("img").removeClass("avatar-online");
});
