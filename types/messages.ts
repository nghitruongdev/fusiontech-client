export const messages = {}

export const ERRORS = {
  users: {
    firstName: {
      required: 'Vui lòng nhập tên.',
    },
    lastName: {
      required: 'Vui lòng nhập họ.',
    },
    email: {
      required: 'Vui lòng nhập email.',
      exists: 'Địa chỉ email đã tồn tại.',
    },
    phoneNumber: {
      required: 'Vui lòng nhập số điện thoại.',
      exists: 'Số điện thoại đã tồn tại.',
    },
    age: {
      required: 'Vui lòng chọn ngày sinh.',
      valid: 'Độ tuổi hợp lệ từ 18 - 60.',
    },
  },
}
