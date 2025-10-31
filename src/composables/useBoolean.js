// composables/useBoolean.js
import { computed } from 'vue'

export function useBoolean() {
  const toBoolean = (value) => {
    if (typeof value === 'boolean') return value
    if (typeof value === 'string') return value === 'true'
    return Boolean(value)
  }
  
  const createBooleanRef = (value) => {
    return computed(() => toBoolean(value))
  }
  
  return {
    toBoolean,
    createBooleanRef
  }
}