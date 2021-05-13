export const transValidation = {
  email_incorrect: "Email phải có dạng .......@gmal.com",
  gender_incorrect: "Ũa tại sao lại bị sai được ! hack à ~~",
  password_incorrect: "ít nhất 8 kí tự, thích nhập gì cũng được hết ",
  password_confirmation_incorrect: "nhập lại mật khẫu cho cẩn thận .",
  update_Name: "Name giới hạn trong 3-17 kí tự không chứa kí tự đặt biệt. ",
  update_Gender: "Sao sai được, chào hacker!",
  update_address: "Địa chỉ giới hạng trong 50 kí tự",
  update_Phone: "Số điện thoại Việt Nam bắt đầu bằng số 0 giới hạn trong 10 11 kí tự",

};
export const transErrors = {
  acount_in_use: "Email đã được xử dụng.",
  acount_removed: "Tài khoản đã bị khóa",
  acount_not_active: "Tài khoản chưa được active ",
  token_underfine: "Token không tồn tại!",
  login_false: "Sai tài khoản hoặc mật khẫu",
  server_err: "Server có vấn đề xin quay lại sau",
  avatar_type: "Kiểu file không hợp lệ",
  account_undefine: "Tài khoản không tồn tại",
  pass_fail: "Mật khẫu hiện tại không đúng"

}
export const transSuccess = {
  userCreated: (userEmail) => {
    return `Tài khoản <strong>${userEmail}</strong> đã được tạo, vui lòng kiểm tra email`;
  },
  update_true: "Cập nhật dữ liệu thành công "
  ,
  Acount_Active: "Tài khoản đã được kích hoạt thành công ",
  logout_success: "Đăng xuất thành công"
  ,
  login_true: (username) => {
    return `Hế Lô ${username}`;
  },
  login_Admin: (username) => {
    return `Chào admin ${username}`;
  }
};
export const transMail = {
  subject: "NORAPP: Xác nhận kích hoạt tài khoản",
  template: (link) => {
    return `
      <h2>Bạn nhân được mail kích hoạt</h2>
      <h3> Vui lòng click vào liên kết để xác nhận tài khoản </h3>
      <h3> <a href="${link}" target="blank" >${link}</a> </h3>
    `;
  },
  sendFail: "có vấn trong quá trình gởi email"
};