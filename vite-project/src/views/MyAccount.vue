<template>
  <div :class="['min-h-screen py-10 flex justify-center', themeClass]">
    <div class="fixed top-6 left-6 cursor-pointer flex items-center text-blue-400 hover:text-blue-600 z-50" @click="router.push('/')">
      <i class="fas fa-arrow-left mr-2"></i>
      <span>Back</span>
    </div>

    <div class="w-full max-w-md px-4 space-y-6 text-center">
      <h2 class="text-2xl font-bold">My Account</h2>

      <div>
        <label class="block mb-1 text-sm text-left">Email</label>
        <input :value="email" disabled :class="['w-full px-4 py-3 rounded border text-center', themeClass]" />
      </div>

      <div class="flex items-center justify-between">
        <span>Password</span>
        <button @click="showPasswordModal = true" class="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white">
          Change Password
        </button>
      </div>

      <div class="flex items-center justify-between">
        <span>Dark Theme</span>
        <button
          @click="toggleTheme"
          :class="[
            'w-12 h-6 rounded-full flex items-center transition duration-300 focus:outline-none',
            isDark ? 'bg-blue-600' : 'bg-gray-400'
          ]"
        >
          <span
            :class="[
              'w-5 h-5 bg-white rounded-full shadow transform transition duration-300',
              isDark ? 'translate-x-6' : 'translate-x-1'
            ]"
          ></span>
        </button>
      </div>
    </div>

    <!-- Password Modal -->
    <div v-if="showPasswordModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
      <div class="bg-white text-black p-6 rounded shadow-lg w-full max-w-md space-y-4">
        <h3 class="text-lg font-semibold mb-2">Change Password</h3>
        <input v-model="currentPassword" type="password" placeholder="Current Password" class="w-full p-2 border rounded" />
        <input v-model="newPassword" type="password" placeholder="New Password" class="w-full p-2 border rounded" />
        <input v-model="confirmPassword" type="password" placeholder="Confirm New Password" class="w-full p-2 border rounded" />
        <div class="flex justify-end space-x-2 mt-4">
          <button @click="showPasswordModal = false" class="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
          <button @click="changePassword" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { useRouter } from 'vue-router'
const router = useRouter()

const auth = getAuth()
const user = auth.currentUser

const displayName = ref('')
const email = ref('')
const isDark = ref(true)

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const showPasswordModal = ref(false)

onMounted(() => {
  if (user) {
    displayName.value = user.displayName || ''
    email.value = user.email || ''
    isDark.value = localStorage.getItem('theme') === 'dark'
  }
})

const themeClass = computed(() =>
    isDark.value
    ? 'bg-gray-900 text-white'
    : 'bg-white text-gray-900'
)

const toggleTheme = () => {
  isDark.value = !isDark.value
  const root = document.documentElement
  if (isDark.value) {
    root.classList.add('dark')
    localStorage.setItem('theme', 'dark')
  } else {
    root.classList.remove('dark')
    localStorage.setItem('theme', 'light')
  }
}

const changePassword = async () => {
  if (!user) return

  if (newPassword.value !== confirmPassword.value) {
    alert('Passwords do not match')
    return
  }

  try {
    const credential = EmailAuthProvider.credential(user.email || '', currentPassword.value)
    await reauthenticateWithCredential(user, credential)
    await updatePassword(user, newPassword.value)
    alert('Password changed successfully!')
    showPasswordModal.value = false

    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''
  } catch (err: any) {
    alert('Error: ' + err.message)
  }
}
</script>
