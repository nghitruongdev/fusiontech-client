/** @format */

/**
 * @deprecated use from validate-utils instead
 */
export const validatePhoneNumber = (phoneNum: string) => {
  const phone = phoneNum.trim()
  return phone.length === 10 && phone.charAt(0) === '0'
}
