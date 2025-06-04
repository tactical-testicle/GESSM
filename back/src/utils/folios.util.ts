export class FoliosUtils {
    constructor() {}
  
    async arrayDestinatarios(destinatarios: any[]): Promise<string[] | false> {
      try {
        // Se espera que cada destinatario tenga una propiedad 'id' (tipo string o number)
        const ids = destinatarios.map((destinatario) => destinatario.id?.toString());
        
        if (!ids || ids.length === 0 || ids.includes(undefined)) {
          return false;
        }
  
        return ids;
      } catch (error) {
        console.error("[folios.util/arrayDestinatarios] Error:", error);
        return false;
      }
    }
  }