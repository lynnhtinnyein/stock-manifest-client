class Cipher {
    encrypt = (text: string) => {
        let result = '';
        for (let i = 0; i < text.length; i++) {
            const charCode = text.charCodeAt(i);
            const isEven = i % 2 === 0;
            const encryptedCharCode = isEven ? charCode + 1 : charCode - 1;
            result += String.fromCharCode(encryptedCharCode);
        }
        return result;
    };

    decrypt = (encryptedText: string) => {
        let result = '';
        for (let i = 0; i < encryptedText.length; i++) {
            const charCode = encryptedText.charCodeAt(i);
            const isEven = i % 2 === 0;
            const decryptedCharCode = isEven ? charCode - 1 : charCode + 1;
            result += String.fromCharCode(decryptedCharCode);
        }
        return result;
    };
}

export default Cipher;
