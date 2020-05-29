// check if product list has at least one valid product
export function isValidProductList(products) {
  if (!Array.isArray(products)) return false;

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < products.length; i++) {
    if (isObjectWithValidProperty(products[i])) return true;
  }

  return false;
}

// check if an object has at least one truthy property
export function isObjectWithValidProperty(obj) {
  if (!isObject(obj)) return false;

  const keys = Object.keys(obj);

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < keys.length; i++) {
    if (obj[keys[i]]) return true;
  }

  return false;
}

export function isObject(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]';
}
