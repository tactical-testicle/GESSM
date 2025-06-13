export class FoliosUtils {
    constructor() {}
  
    async arrayDestinatarios(destinatarios: any[]): Promise<string[] | false> {
      try {
        console.log("llego el array de destinatarios con id: ", destinatarios)
        const ids = destinatarios.map((destinatario) => destinatario.id);
        
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