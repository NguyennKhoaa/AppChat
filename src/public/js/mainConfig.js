const socket = io();

function nineScrollLeft() {
  $('.left').niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
}
function flashMasterNotify() {
  let notify = $(".master-success-message").text();
  if (notify.length) {
    alertify.notify(notify, "success", 7);
  }
}
function bufferTobase64(buffer) {
  return btoa(
    new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), "")
  );
}

function changeTypeChat() {
  $("#select-type-chat").bind("change", function () {
    let optionSelected = $("option:selected", this);
    optionSelected.tab("show");
    if ($(this).val() === "user-chat") {
      $(".create-group-chat").hide();
    }
    else {
      $(".create-group-chat").show();
    }
  });
}
function changeScreenChat() {
  $(".room-chat").unbind("click").on("click", function () {

    let divId = $(this).find("li").data("chat");
    $(".person").removeClass("active");
    $(`.preson[data-chat=${divId}]`).addClass("active");
    $(this).tab("show");

    nineScrollRight(divId);
    enableEmojioneArea(divId);

    imageChat(divId);
    attachmentChat(divId);
    videoChat(divId);

  });
}
function nineScrollRight(divId) {
  $(`.right .chat[data-chat=${divId}]`).niceScroll({
    smoothscroll: true,
    horizrailenabled: false,
    cursorcolor: '#ECECEC',
    cursorwidth: '7px',
    scrollspeed: 50
  });
  $(`.right .chat[data-chat=${divId}]`).scrollTop($(`.right .chat[data-chat=${divId}]`)[0].scrollHeight);
}

function enableEmojioneArea(divId) {
  $(`#write-chat-${divId}`).emojioneArea({
    standalone: false,
    pickerPosition: 'top',
    filtersPosition: 'bottom',
    tones: false,
    autocomplete: false,
    inline: true,
    hidePickerOnBlur: true,
    search: false,
    shortnames: false,
    events: {
      keyup: function (editor, event) {
        $(`#write-chat-${divId}`).val(this.getText());
      },
      click: function () {
        typingOn(divId);
        textAndEmojiChat(divId);

      },
      blur: function () {
        typingOff(divId);
      }
    },
  });
  $('.icon-chat').bind('click', function (event) {
    event.preventDefault();
    $('.emojionearea-button').click();
    $('.emojionearea-editor').focus();
  });
}

function spinLoaded() {
  $('#loader').css('display', 'none');
}

function spinLoading() {
  $('#loader').css('display', 'block');
}

function ajaxLoading() {
  $(document)
    .ajaxStart(function () {
      spinLoading();
    })
    .ajaxStop(function () {
      spinLoaded();
    });
}

function showModalContacts() {
  $('#show-modal-contacts').click(function () {
    $(this).find('.noti_contact_counter').fadeOut('slow');
  });
}

function configNotification() {
  $('#noti_Button').click(function () {
    $('#notifications').fadeToggle('fast', 'linear');
    // $('.noti_counter').fadeOut('slow');
    return false;
  });
  $(".main-conten").click(function () {
    $('#notifications').fadeOut('fast', 'linear');
  });
}

function gridPhotos(layoutNumber) {
  let countRows = Math.ceil($('#imagesModal').find('div.all-images>img').length / layoutNumber);
  let layoutStr = new Array(countRows).fill(layoutNumber).join("");
  $('#imagesModal').find('div.all-images').photosetGrid({
    highresLinks: true,
    rel: 'withhearts-gallery',
    gutter: '2px',
    layout: layoutStr,
    onComplete: function () {
      $('.all-images').css({
        'visibility': 'visible'
      });
      $('.all-images a').colorbox({
        photo: true,
        scalePhotos: true,
        maxHeight: '90%',
        maxWidth: '90%'
      });
    }
  });
}





$(document).ready(function () {
  // Hide s??? th??ng b??o tr??n ?????u icon m??? modal contact
  showModalContacts();

  // B???t t???t popup notification
  configNotification();

  // C???u h??nh thanh cu???n
  nineScrollLeft();
  // nineScrollRight();


  // Icon loading khi ch???y ajax
  ajaxLoading();

  // Hi???n th??? button m??? modal t???o nh??m tr?? chuy???n
  // showButtonGroupChat();

  // Hi???n th??? h??nh ???nh grid slide trong modal t???t c??? ???nh, tham s??? truy???n v??o l?? s??? ???nh ???????c hi???n th??? tr??n 1 h??ng.
  // Tham s??? ch??? ???????c ph??p trong kho???ng t??? 1 ?????n 5
  gridPhotos(5);

  // Th??m ng?????i d??ng v??o danh s??ch li???t k?? tr?????c khi t???o nh??m tr?? chuy???n

  flashMasterNotify();

  // thay doi kieu tro chuyen
  changeTypeChat();
  //thaydoimanhinhchat
  changeScreenChat();

  $("ul.people").find("a")[0].click();
  $("#video-chat-group").bind("click", function () {
    alertify.notify("S??? c???p nh???t ??? phi??n b???n t???i", "info", 7);
  })

});
