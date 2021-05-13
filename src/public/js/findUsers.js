function callFindUsers(e) {
  if (e.which === 13 || e.type == "click") {
    let keyword = $("#txtFindUsers").val();
    if (!keyword.length) {
      alertify.notify("Nhập thông tin cần tìm", "error", 7);
      return false;
    }
    $.get(`/contact/find-users/${keyword}`, function (data) {
      $("#find-user ul").html(data);
      // console.log(data);
      addContact();//add contact
      removeResquesContact();
    })
  }
}



$(document).ready(function () {
  $("#txtFindUsers").bind("keypress", callFindUsers);
  $("#btnFindUsers").bind("click", callFindUsers);
});