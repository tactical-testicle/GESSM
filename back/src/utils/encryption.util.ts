import bcrypt from 'bcryptjs'

export default class Encription {
    private algorithm: string
    private keySave: string
    constructor(){
        this.algorithm = config.get('key.algorithm') as string
        this.keySave = config.get('key.secret') as string
    }

    async encryptPassword(password: string){
        const generateIv = bcrypt.randomBytes(16)
        const keyBuffer = Buffer.from(this.keySave, 'hex')

        const cipher = bcrypt.createCipheriv(this.algorithm, keyBuffer,generateIv)
        let encrypted = cipher.update(password)

        encrypted = Buffer.concat([encrypted, cipher.final()])
        return {
            iv: generateIv.toString('hex'),
            encryptedData: encrypted.toString('hex')
        }
    }

    // cuando sobre tiempo: modificar tipo dato any
    async decryptPassword(user: any, passwordUser: string){
        try {
            const ivBuffer = Buffer.from(user.salt as string, 'hex');
            const encryptedText = Buffer.from(user.password as string, 'hex');
            const keyBuffer = Buffer.from(this.keySave, 'hex');

            let decipher = bcrypt.createDecipheriv(this.algorithm, keyBuffer, ivBuffer);

            let decrypted = decipher.update(encryptedText)
            decrypted = Buffer.concat([decrypted, decipher.final()]);
            
            return decrypted.toString() === passwordUser;
        } catch (error) {
            throw error;
        }
    }
}