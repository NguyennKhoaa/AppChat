function videoChat(divId) {
  $(`#video-chat-${divId}`).unbind("click").on("click", function () {
    let targetId = $(this).data("chat");
    let callerName = $("#navUserName").text().trim();
    let dataToEmit = {
      listenerId: targetId,
      callerName: callerName
    }
    console.log(dataToEmit)
  });
}
$(document).ready(function () {

})