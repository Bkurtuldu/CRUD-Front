<template>
  <div class="min-h-screen bg-gray-900 flex flex-col justify-center items-center px-4">

    <div class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-3 w-full max-w-sm">
    <transition-group
    name="fade"
    tag="div"
    class="flex flex-col space-y-2"
    >
    <div
        v-for="(msg, index) in errors"
        :key="msg + index"
        class="bg-red-500 text-white px-4 py-3 rounded-lg shadow-md flex justify-between items-center"
    >
        <span class="text-sm">⚠️ {{ msg }}</span>
        <button
        @click="removeError(index)"
        class="text-white hover:text-gray-300 text-lg leading-none"
        >
        ✖
        </button>
    </div>
    </transition-group>
    </div>

    <img src="../assets/icon.png" alt="Logo" class="w-32 h-32 mb-6" />

    <div class="w-full max-w-md bg-gray-800 rounded-lg shadow-lg p-6 space-y-4">
      <h2 class="text-center text-xl font-semibold text-gray-300">Please sign in</h2>
      <form novalidate @submit.prevent="submit">
        <div class="space-y-4">
          <div>
            <label class="sr-only">Email</label>
            <input
              v-model="email"
              type="email"
              placeholder="E‑mail address"
              class="w-full px-4 py-2 bg-gray-700 text-gray-200 placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          <div>
            <label class="sr-only">Password</label>
            <input
              v-model="password"
              type="password"
              placeholder="Password"
              class="w-full px-4 py-2 bg-gray-700 text-gray-200 placeholder-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          class="mt-6 w-full py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium rounded"
        >
          Sign in
        </button>
      </form>
    </div>

    <footer class="mt-8 text-gray-500 text-sm">Codeway © {{ new Date().getFullYear() }}</footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useToasts } from '../useToasts'
const { errors, addError, removeError } = useToasts()

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')

const submit = async () => {
  errors.value = []

  if (!email.value || !/^\S+@\S+\.\S+$/.test(email.value)) {
    addError('Valid email required')
  }

  if (!password.value) {
    addError('Password required')
  }

  if (errors.value.length === 0) {
    try {
      await authStore.login(email.value, password.value)
      router.push('/')
    } catch (e: any) {
      addError('Login failed: ' + (e?.message || 'Unknown error'))
    }
  }
}
localStorage.setItem('theme', 'dark')
</script>


<style scoped>
    .fade-enter-active,
    .fade-leave-active {
    transition: opacity 0.4s ease, transform 0.3s ease;
    }

    .fade-enter-from,
    .fade-leave-to {
    opacity: 0;
    transform: translateY(-8px);
    }
</style>
