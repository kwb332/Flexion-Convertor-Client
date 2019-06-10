// This will validate the input entered in the form by user

export const checkValid = (value, rules) => {

  let isValid = true;

  if (rules.required) {
    isValid = value.trim() !== '' && isValid;
  }

  if (rules.minLength) {
    isValid = value.length >= rules.minLength && isValid;
  }

  if (rules.isEmail) {
    const pattern = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/;
    isValid = pattern.test(value) && isValid
  }


  if (rules.isNumber) {
    const pattern = /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/
    isValid = pattern.test(value) && isValid
  }

  if (rules.isAlpha) {
    const pattern = /^[A-Za-z]+$/;
    isValid = (pattern.test(value.trim()) && isValid)
  }

  return isValid;
}
