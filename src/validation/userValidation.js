import { check } from "express-validator/check";
import { transValidation } from "../../lang/vi"
let updateInfo = [
  check("userName", transValidation.update_Name).optional()
    .isLength({ min: 3, max: 17 }).matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/),
  check("gender", transValidation.update_Gender).optional()
    .isIn(["male", "female"]),
  check("address", transValidation.update_address).optional().isLength({ min: 3, max: 30 }),

  check("phone", transValidation.update_Phone).optional().matches(/^(0)[0-9]{9,10}$/),



];
module.exports = {
  updateInfo: updateInfo
}