export default interface IcatFolioFCF {
    nombre: string;           // Nombre de la entidad
    id: number;
    cantidadFCF: number;
    inicioFCF: number;
    folioFCF: number;
    assignedFolio: string;
    fechaCreacion: Date;    // Fecha en la que se creó el registro
    fechaModificacion?: Date; // Fecha de la última modificación (opcional)
    usuarioCreacion: string; // Usuario que creó el registro
    usuarioModificacion?: string; // Usuario que modificó el registro (opcional)
    estatus: boolean;       // true es folio libre.
}
