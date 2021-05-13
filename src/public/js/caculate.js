function increaseNumberNotifyContact(className) {
  let currenValue = +$(`.${className}`).find("em").text();
  currenValue += 1;
  if (currenValue === 0) {
    $(`.${className}`).html("");

  } else {
    $(`.${className}`).html(`<em>${currenValue}</em>`);
  }
}
function decreaseNumberNotifyContact(className) {
  let currenValue = +$(`.${className}`).find("em").text();
  currenValue -= 1;
  if (currenValue === 0) {
    $(`.${className}`).html("");

  } else {
    $(`.${className}`).html(`(<em>${currenValue}</em>)`)
  }
}