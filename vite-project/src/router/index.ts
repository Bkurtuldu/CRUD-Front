import { createRouter, createWebHistory } from 'vue-router'
import SignIn from '../views/SignIn.vue'
import Home from '../views/Home.vue'
import MyAccount from '../views/MyAccount.vue'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

const routes = [
  { path: '/', name: 'Home', component: Home, meta: { requiresAuth: true } },
  { path: '/signin', name: 'SignIn', component: SignIn },
  { path: '/account', name: 'MyAccount', component: MyAccount, meta: { requiresAuth: true } }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

let isAuthResolved = false

router.beforeEach((to, _from, next) => {
  if (isAuthResolved) {
    proceed()
  } else {
    const unsubscribe = onAuthStateChanged(auth, () => {
      isAuthResolved = true
      unsubscribe()
      proceed()
    })
  }

  function proceed() {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const user = auth.currentUser

    if (requiresAuth && !user) {
      next('/signin')
    } else if (to.path === '/signin' && user) {
      next('/')
    } else {
      next()
    }
  }
})

export default router
