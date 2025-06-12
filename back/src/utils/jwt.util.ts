//import config from 'config'
import jwt from 'jsonwebtoken'

export default class JWTUtil {
    // revisar por que no la encuentra en config
    //private secret = `${config.get('jwt.accessTokenSecret')}`
    private secret = '0d7c5c5f-768c-4d98-8900-13aadaa21937'

    async generateToken(payload: any) {
        const token = jwt.sign(payload, this.secret, { expiresIn: '30d', algorithm: 'HS256' });
        return token
    }

    //Valida el tiempo de vida del token o si el token es correcto y se decodifica
    async decodeToken(token: string) {
        try {
            console.log("(antes de decoded) Se recibe token: ", token)
            if (!token) {
                console.log("No se recibio token")
                return false;
            }
            const decoded = jwt.verify(token.replace("Bearer ", ""), this.secret, { algorithms: ['HS256'] })
            console.log("decoded: ", decoded)
            return decoded;
        } catch (error: any) {
            if (error.name === 'TokenExpiredError') {
                console.error("Token ha expirado");
                return false
            } else {
                console.error("Token inválido:", error.message);
            }
        }
    }

    //Validar el tiempo de vida del token
    async tokenExp(token: string) {
        const payload64 = token.split('.')[1];
        const payload = JSON.parse(atob(payload64));
        const currentDate = Math.floor(Date.now() / 1000);
        const { exp } = payload;
        return exp > currentDate;
    }
}