export function isValidFullName(name) {
    const regex = /^[A-Za-z]+(?: [A-Za-z]+)$/; // only 2 words, letters + single space
    return regex.test(name.trim());
  }
  