export default interface IcatRemitente {
    nombre: string;           // Nombre de la entidad
    id: number;
    fechaCreacion: Date;    // Fecha en la que se creó el registro
    fechaModificacion?: Date; // Fecha de la última modificación (opcional)
    usuarioCreacion: string; // Usuario que creó el registro
    usuarioModificacion?: string; // Usuario que modificó el registro (opcional)
    estatus: boolean;       // Indica si el registro está activo o inactivo
}
