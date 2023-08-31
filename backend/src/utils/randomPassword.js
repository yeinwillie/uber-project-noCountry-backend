// Generar clave de recuperacion aleatoria

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
  function getRandomUpperCaseLetter() {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomIndex = getRandomNumber(0, alphabet.length - 1);
    return alphabet.charAt(randomIndex);
  }
  
  function getRandomLowerCaseLetter() {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const randomIndex = getRandomNumber(0, alphabet.length - 1);
    return alphabet.charAt(randomIndex);
  }
  
  function generateRandomPassword() {
    let password = '';
    for (let i = 0; i < 6; i++) {
      password += getRandomNumber(0, 9); // 6 números aleatorios
    }
  
    password += getRandomUpperCaseLetter(); // 1 letra mayúscula al azar
    password += getRandomLowerCaseLetter(); // 1 letra minúscula al azar
  
    return password;
  }
  
 
export default  generateRandomPassword;