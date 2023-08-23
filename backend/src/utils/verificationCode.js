function generateRandomCode(length) {
    const characters = '0123456789';
    return Array.from({ length }, () => characters[Math.floor(Math.random() * characters.length)])
      .reduce((code, digit) => code + digit, '');
  }
  
 export default generateRandomCode;