export default interface IUser{
    name: string
    ficha: number
    password: string
    status: string
    role: string
    nivel: string
    salt: string
    gerencia: string
    subgerencia: string
    superintendencia: string
    rubrica: string
    fechaCreacion: Date           // Fecha de creación del registro
    usuarioCreacion: string          // Usuario que creó el registro
    fechaActualizacion: Date,        // Fecha de la última actualización
    usuarioActualizacion: string,     // Usuario que lo modificó
    id?: number;
    email: string,
    phone: number
}