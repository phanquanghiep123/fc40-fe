/**
 * Kiểm tra xem có Khay sọt đã chọn quá 1 khay sọt giống nhau
 */
export const validateBaskets = data => {
  if (
    data &&
    ((data.basketCode1 && data.basketCode1 === data.basketCode2) ||
      (data.basketCode1 && data.basketCode1 === data.basketCode3) ||
      (data.basketCode2 && data.basketCode2 === data.basketCode3))
  ) {
    return false;
  }
  return true;
};
