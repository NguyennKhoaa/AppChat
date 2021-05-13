function increaseNumberNoti(className, number) {
  let currenValue = +$(`.${className}`).text();
  currenValue += number;
  if (currenValue === 0) {
    $(`.${className}`).css("display", "none").html("");

  } else {
    $(`.${className}`).css("display", "block").html(currenValue)
  }
}
function decreaseNumberNoti(className, number) {
  let currenValue = +$(`.${className}`).text();
  currenValue -= number;
  if (currenValue === 0) {
    $(`.${className}`).css("display", "none").html("");

  } else {
    $(`.${className}`).css("display", "block").html(currenValue)
  }
}