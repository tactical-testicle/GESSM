export default interface IFolio {
    tipoFolio: number;               // ID del tipo de folio (clave foránea)
    tipoFolioString?: string;        // Nombre del tipo de folio (opcional, útil si haces JOIN)
    fechaDocto: Date;                // Fecha en la que se crea el documento
    noConsecutivo: number;           // Número consecutivo del documento
    folioFCFp?: number;              // Puede ser opcional si no siempre existe
    isFolioFCF: boolean;             // Indica si es FCF
    noOficio: string;                // Número de oficio del documento
    asunto: string;                  // Asunto relacionado con el documento
    subgerencia: number;            // ID o nombre de subgerencia, según modelo relacional
    superintendencia: number;       // ID o nombre de superintendencia
    antecedentes: string;           // Información de antecedentes
    noAcuerdosGESSM: string;        // Número de acuerdos de GESSM
    anexos: boolean;                // Indica si hay anexos
    destinatarios: number[];        // Lista de IDs de destinatarios
    remitente: string;              // ID del remitente
    observaciones: string;          // Observaciones generales
    rubricasElaboracion: string[];  // Lista de rúbricas (puede ser texto o nombres)
    fechaCreacion: Date;            // Fecha de creación del registro
    usuarioCreacion: string;        // Ficha o ID del usuario que lo creó
    fechaActualizacion?: Date;      // Fecha de la última actualización 
    usuarioActualizacion?: string;  // Ficha o ID del usuario que lo modificó
    status: string;                 // Estado (por ejemplo: active/inactive)
    tema: string;                   // Tema relacionado
    tramitado: boolean;             // Si el documento fue tramitado
    fichaPoder?: number;            // Ficha delegada (opcional)
    serieDocumental: string;        // ID de la serie documental
    id: number;
}