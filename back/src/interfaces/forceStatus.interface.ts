export default interface IForceStatus {
    usuarioId: number;           // Nombre de la entidad
    incidenciaId:  number;  // Para saber si cuenta o no, para saber si estan presentes
    fecha: Date;
    observaciones: string;
    fechaCreacion: Date;    // Fecha en la que se creó el registro
    fechaModificacion?: Date; // Fecha de la última modificación (opcional)
    usuarioCreacion: string; // Usuario que creó el registro
    usuarioModificacion?: string; // Usuario que modificó el registro (opcional)
    estatus: boolean;       // Indica si el registro está activo o inactivo
    id?: number;
}
