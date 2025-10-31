export function useValidationErrors(errorMessage) {
    
    // Remove aspas dos campos e formata as mensagens
    const parts = errorMessage.split(/\s*,\s*/);
    const errors = {};
    
    parts.forEach(part => {
        // Encontra o campo entre aspas e a mensagem
        const match = part.match(/^"([^"]+)"\s+(.+)$/);
        
        if (match) {
            const field = match[1]; // campo sem aspas
            const message = match[2]; // mensagem completa
            
            // Converte para português e formata
            const formattedMessage = formatMessage(message);
            errors[field] = formattedMessage;
        } else {
            // Fallback para partes que não seguem o padrão
            console.warn('Could not parse error part:', part);
        }
    });
    
    return errors;
}

function formatMessage(message) {
    const translations = {
        'is not allowed to be empty': 'não pode estar vazio',
        'must be a number': 'deve ser um número',
        'must be a boolean': 'deve ser verdadeiro ou falso',
        'is required': 'é obrigatório'
    };
    
    let formatted = message;
    
    // Aplica as traduções
    Object.entries(translations).forEach(([en, pt]) => {
        formatted = formatted.replace(en, pt);
    });
    
    return formatted;
}