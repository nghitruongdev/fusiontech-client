/** @format */

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
  brands: {
    name: {
      required: 'Yêu cầu nhập tên thương hiệu',
      exists: 'Thương hiệu này đã tồn tại.',
    },
    slug: {
      required: 'Yêu cầu nhập đường dẫn slug',
      exists: 'Đường dẫn này đã tồn tại',
    },
  },
  vouchers: {
    code: {
      required: 'Yêu cầu nhập code voucher',
      exists: 'Code này đã tồn tại.',
    },
  },
  categories: {
    name: {
      required: 'Yêu cầu nhập tên danh mục',
      exists: 'Tên này đã tồn tại',
    },
  },
  products: {
    name: {
      required: 'Yêu cầu nhập tên sản phẩm',
      exists: 'Tên này đã tồn tại',
    },
    slug: {
      exists: 'Đường dẫn này đã tồn tại',
    },
  },
}
