import { ref } from 'vue'

const errors = ref<string[]>([])

export const useToasts = () => {
  const addError = (msg: string) => {
    errors.value.push(msg)
    setTimeout(() => {
      const index = errors.value.indexOf(msg)
      if (index !== -1) errors.value.splice(index, 1)
    }, 3000)
  }

  const removeError = (index: number) => {
    errors.value.splice(index, 1)
  }

  return { errors, addError, removeError }
}
