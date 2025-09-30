export function useValidationErrors(errorMessage) {
    const cleaned = errorMessage.replace(/^Validation error:\s*/, "")
    const parts = cleaned.split(/\s*,\s*/)
    const errors = {}
    parts.forEach(part => {
        const [field, ...rest] = part.trim().split(" ")
        const cleanField = field.replace(/^"|"$/g, '')
        errors[cleanField] = rest.join(" ")
    })
    return errors;
}