import { defineStore } from 'pinia'
import { auth } from '../firebase'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
  }),
  actions: {
    async login(email: string, password: string) {
      const result = await signInWithEmailAndPassword(auth, email, password)
      this.user = result.user
    },
    async logout() {
      await signOut(auth)
      this.user = null
    },
    init() {
      onAuthStateChanged(auth, (user) => {
        this.user = user
      })
    },
    async getIdToken(): Promise<string | null> {
      return await this.user?.getIdToken() || null
    }
  },
})
