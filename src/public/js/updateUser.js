let userAvatar = null;
let userInfo = {};
let originAvataSrc = null;
let originUserInfo = {};
let userUpdatePass = {};


function updateUserInFo() {
  $("#input-change-avatar").bind("change", function () {
    let fileData = $(this).prop("files")[0];
    let math = ["image/png", "image/jpg", "image/jpeg"];
    let limit = 1048576;//byte =1mb


    if ($.inArray(fileData.type, math) === -1) {


      alertify.notify("kiểu file không hợp lệ, chỉ chấp nhận jpg", "error", 7);
      $(this).val(null)
      return false;

    }

    if (fileData.size > limit) {
      alertify.notify("Ảnh tối đa cho phép 1mb", "error", 7);
      $(this).val(null)
      return false;

    }


    if (typeof (FileReader) != "undefined") {
      let imagePriview = $("#image-edit-profile");
      imagePriview.empty();
      let fileReader = new FileReader();
      fileReader.onload = function (element) {
        $("<img>", {
          "src": element.target.result,
          "class": "avatar img-circle",
          "id": "user-modal-avatar",
          "alt": "avatar"
        }).appendTo(imagePriview);
      }
      imagePriview.show();
      fileReader.readAsDataURL(fileData);
      let formdata = new FormData();
      formdata.append("avatar", fileData);
      userAvatar = formdata;
    }
    else {
      alertify.notify("Trinh duyệt không hỗ trợ FileReader", "error", 7);
    }

  });
  $("#nameID").bind("change", function () {
    let userName = $(this).val();
    let regusernames = new RegExp("^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$");
    if (!regusernames.test(userName || userName.length < 3 || userName.length > 30)) {
      alertify.notify("Name giới hạn trong 3-17 kí tự không chứa kí tự đặt biệt.", "error", 7);
      $(this).val(originUserInfo.userName);
      delete userInfo.userName;
      return false;
    }
    userInfo.userName = userName;

  });
  $("#genderIDm").bind("click", function () {
    let gender = $(this).val();
    if (gender !== "male") {
      alertify.notify("Sao sai được, chào hacker!", "error", 7);
      $(this).val(originUserInfo.gender);
      delete userInfo.gender;
      return false;
    }
    userInfo.gender = gender;

  });
  $("#genderIDf").bind("click", function () {
    let gender = $(this).val();
    if (gender !== "female") {
      alertify.notify("Sao sai được, chào hacker!", "error", 7);
      $(this).val(originUserInfo.gender);
      delete userInfo.gender;
      return false;
    }
    userInfo.gender = gender;

  });
  $("#addressID").bind("change", function () {
    let address = $(this).val();
    if (address.length < 3 || address.length > 30) {
      alertify.notify("Địa chỉ giới hạng trong 50 kí tự", "error", 7);
      $(this).val(originUserInfo.address);
      delete userInfo.address;
      return false;
    }
    userInfo.address = address;

  });
  $("#phoneID").bind("change", function () {
    let phone = $(this).val();
    let regexphone = new RegExp("^(0)[0-9]{9,10}$");
    if (!regexphone.test(phone)) {
      alertify.notify("Số điện thoại Việt Nam bắt đầu bằng số 0 giới hạn trong 10 11 kí tự", "error", 7);
      $(this).val(originUserInfo.phone);
      delete userInfo.phone;
      return false;
    }
    userInfo.phone = phone;

  });
  $("#txtOldPass").bind("change", function () {
    let passwordOld = $(this).val();
    if (passwordOld.length < 8) {
      alertify.notify("Mật khẫu chứa ít nhất 8 kí tự", "error", 7);
      $(this).val(null);
      delete userUpdatePass.passwordOld;
      return false;
    }
    userUpdatePass.passwordOld = passwordOld;

  });
  $("#txtNewPass").bind("change", function () {
    let passwordNew = $(this).val();
    if (passwordNew.length < 8) {
      alertify.notify("Mật khẫu chứa ít nhất 8 kí tự", "error", 7);
      $(this).val(null);
      delete userUpdatePass.passwordNew;
      return false;
    }
    userUpdatePass.passwordNew = passwordNew;

  });
  $("#txtNewPassCF").bind("change", function () {
    let passwordNewCF = $(this).val();
    if (!userUpdatePass.passwordNew) {
      alertify.notify("Cần nhập mật khẫu mới", "error", 7);
      $(this).val(null);
      delete userUpdatePass.passwordNewCF;
      return false;
    }
    // if (!userUpdatePass.passwordNew !== passwordNewCF) {
    //   alertify.notify("Nhập đúng với mật khẫu mới", "error", 7);
    //   $(this).val(null);
    //   delete userUpdatePass.passwordNewCF;
    //   return false;
    // }

    userUpdatePass.passwordNewCF = passwordNewCF;

  });

}

function callUpdaterUserPass() {
  $.ajax({
    url: "/user/update-password",
    type: "put",
    data: userUpdatePass,
    success: function (result) {
      $(".user-modal-password-alert-success").find("span").text(result.message);
      $(".user-modal-password-alert-success").css("display", "block");
      $("#input-cancel").click();
    },
    error: function (error) {
      console.log(error)
      $(".user-modal-password-alert-error").find("span").text(error.responseText);
      $(".user-modal-password-alert-error").css("display", "block");
      $("#btnCancelPass").click();


    }
  });
}



function callUpdateAvatar() {
  $.ajax({
    url: "/user/update-avatar",
    type: "put",
    cache: false,
    contentType: false,
    processData: false,
    data: userAvatar,
    success: function (result) {
      $(".user-modal-alert-success").find("span").text(result.message);
      $(".user-modal-alert-success").css("display", "block");
      $("#avatar-navbar-small").attr("src", result.imgSrc);
      originAvataSrc = result.imgSrc;
      $("#input-cancel").click();
    },
    error: function (error) {
      console.log(error)
      $(".user-modal-alert-error").find("span").text(error.responseText);
      $(".user-modal-alert-error").css("display", "block");
      $("#input-cancel").click();


    }
  });
}
function callUpdatInfo() {
  $.ajax({
    url: "/user/update-info",
    type: "put",
    data: userInfo,
    success: function (result) {
      $(".user-modal-alert-success").find("span").text(result.message);
      $(".user-modal-alert-success").css("display", "block");

      originUserInfo = Object.assign(originUserInfo, userInfo);

      $("#navUserName").text(originUserInfo.userName);
      $("#input-cancel").click();
    },
    error: function (error) {
      console.log(error)
      $(".user-modal-alert-error").find("span").text(error.responseText);
      $(".user-modal-alert-error").css("display", "block");
      $("#input-cancel").click();


    }
  });
}

$(document).ready(function () {

  originAvataSrc = $("#user-modal-avatar").attr("src");

  originUserInfo = {
    userName: $("#nameID").val(),
    gender: ($("#genderIDm").is(":checked")) ? $("#genderIDm").val() : $("#genderIDf").val(),
    address: $("#adressID").val(),
    phone: $("#phoneID").val()
  }




  updateUserInFo();

  $("#input-btn-update-user").bind("click", function () {
    if ($.isEmptyObject(userInfo) && !userAvatar) {
      alertify.notify("Thay đổi thông tin trước khi cập nhật", "error", 7);
      return false;
    }
    if (userAvatar) {
      callUpdateAvatar();
    }
    if (!$.isEmptyObject(userInfo)) {
      callUpdatInfo();
    }
  });
  $("#input-cancel").bind("click", function () {
    userAvatar = null;
    userInfo = {};
    $("#user-modal-avatar").attr("src", originAvataSrc);

    $("#nameID").val(originUserInfo.userName);
    (originUserInfo.gender === "male") ? $("#genderIDm").click() : $("#genderIDf").click();
    $("#adressID").val(originUserInfo.address);
    $("#phoneID").val(originUserInfo.phone);
  });
  $("#btnUpdatePass").bind("click", function () {
    if (!userUpdatePass.passwordNew || !userUpdatePass.passwordOld || !userUpdatePass.passwordNewCF) {
      alertify.notify("Nhập đầy đủ thông tin", "error", 7);
      return false;
    }
    callUpdaterUserPass();
  });
  $("#btnCancelPass").bind("click", function () {
    userUpdatePass = {};
    $("#txtOldPass").val(null);
    $("#txtNewPass").val(null);
    $("#txtNewPassCF").val(null);
  });

}); 