import crypto from 'crypto'
import config from 'config'

export default class Encription {

    private algorithm: string
    private keySave: string
    constructor() {
        // debo cambiar esto para que lo jale del config
        this.algorithm = config.has('key.algorithm') ? config.get('key.algorithm') : 'aes-256-cbc';
        this.keySave = config.has('key.secret') ? config.get('key.secret') : '52d726b159902f9884b2e95dfcb028ce8d7aa51865f1fb5daa105dc30120cddf';
    }

    async encryptPassword(password: string) {
        const generateIv = crypto.randomBytes(16)
        const keyBuffer = Buffer.from(this.keySave, 'hex')
        const cipher = crypto.createCipheriv(this.algorithm, keyBuffer, generateIv)
        let encrypted = cipher.update(password)

        encrypted = Buffer.concat([encrypted, cipher.final()])
        return {
            iv: generateIv.toString('hex'),
            encryptedData: encrypted.toString('hex')
        }
    }

    // cuando sobre tiempo: modificar tipo dato any
    async decryptPassword(user: any, passwordUser: string) {
        try {
            const ivBuffer = Buffer.from(user.salt as string, 'hex');
            const encryptedText = Buffer.from(user.password as string, 'hex');
            const keyBuffer = Buffer.from(this.keySave, 'hex');

            let decipher = crypto.createDecipheriv(this.algorithm, keyBuffer, ivBuffer);

            let decrypted = decipher.update(encryptedText)
            decrypted = Buffer.concat([decrypted, decipher.final()]);

            return decrypted.toString() === passwordUser;
        } catch (error) {
            throw error;
        }
    }
}