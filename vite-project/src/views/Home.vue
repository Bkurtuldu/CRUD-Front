  <template>
    <div :class="['min-h-screen px-8 py-8 transition-colors duration-300', themeClass]">
      <div class="flex justify-between items-center mb-6">
        <img src="../assets/icon.png" class="w-12 h-12" alt="Logo" />
        <div class="relative" @click="toggleDropdown">
          <i class="fas fa-user-circle text-2xl cursor-pointer"></i>
          <div v-if="dropdownOpen" class="absolute right-0 mt-2 w-40 bg-white text-black rounded shadow-lg z-50">
            <router-link to="/account" class="block px-4 py-2 hover:bg-gray-200">My Account</router-link>
            <button @click="logout" class="w-full text-left px-4 py-2 hover:bg-gray-200">Logout</button>
          </div>
        </div>
      </div>

      <div class="md:hidden space-y-4">
        <ParameterCard
          v-for="param in parameters"
          :key="param.key"
          :param="param"
          @edit="openEditModal"
          @delete="openDeleteModal"
        />
      </div>

      <div class="hidden md:grid grid-cols-6 gap-4 text-sm">
        <div class="col-span-1 text-2xl text-gray-400">
          <div class="cursor-pointer" @click="sortBy('key')">
            Parameter Key <span>{{ getSortArrow('key') }}</span>
          </div>
        </div>
        <div class="col-span-1 text-2xl text-gray-400">
          <div class="cursor-pointer" @click="sortBy('value')">
            Value <span>{{ getSortArrow('value') }}</span>
          </div>
        </div>
        <div class="col-span-2 text-2xl text-gray-400">
          <div class="cursor-pointer" @click="sortBy('description')">
            Description <span>{{ getSortArrow('description') }}</span>
          </div>
        </div>
        <div class="col-span-1 text-2xl text-gray-400">
          <div class="cursor-pointer" @click="sortBy('create_date')">
            Create Date <span>{{ getSortArrow('create_date') }}</span>
          </div>
        </div>
        <div class="col-span-1"></div>

        <template v-for="param in sortedParameters" :key="param.key">
          <div class="col-span-1">
            <div>{{ param.key }}</div>
          </div>
          <div class="col-span-1">
            <div>{{ param.value }}</div>
          </div>
          <div class="col-span-2">
            <div>{{ param.description }}</div>
          </div>
          <div class="col-span-1">
            <div>{{ param.create_date }}</div>
          </div>
          <div class="col-span-1">
            <div class="space-x-4">
              <button class="bg-blue-500 px-5 py-1 rounded hover:bg-blue-700" @click="openEditModal(param)">Edit</button>
              <button class="bg-red-500 px-5 py-1 rounded hover:bg-red-700" @click="openDeleteModal(param)">Delete</button>
            </div>
          </div>
        </template>

        <div class="col-span-1 flex items-center">
          <input v-model="newParam.key" placeholder="New Parameter" :class="['p-2 rounded w-full border',themeClass]" />
        </div>
        <div class="col-span-1 flex items-center">
          <input v-model="newParam.value" placeholder="Value" :class="['p-2 rounded w-full border',themeClass]" />
        </div>
        <div class="col-span-3 flex items-center">
          <input v-model="newParam.description" placeholder="New Description" :class="['p-2 rounded w-full border',themeClass]" />
        </div>
        <div class="col-span-1 flex items-center justify-start space-x-2">
          <button class="bg-cyan-500 px-5 py-1 rounded hover:bg-cyan-700" @click="addParam">
            ADD 
          </button>
        </div>
      </div>
    </div>

    <div v-if="showEditModal" class="fixed inset-0 bg-black/30 z-50 flex items-center justify-center px-2 sm:px-4">
      <div class="bg-white text-black p-4 rounded shadow-lg w-full max-w-sm sm:max-w-md space-y-4 max-h-[90vh] overflow-y-auto">
        <h3 class="text-lg font-semibold mb-2">Edit Parameter: {{ editParamData.key }}</h3>
        <input v-model="editParamData.value" placeholder="Value" class="w-full p-2 border rounded" />
        <input v-model="editParamData.description" placeholder="Description" class="w-full p-2 border rounded" />
        <div class="flex items-center justify-between border rounded p-2 cursor-pointer hover:bg-gray-100" @click="showOverrides = !showOverrides">
          <span class="text-sm font-medium">Edit Country Overrides</span>
          <i :class="['fas', showOverrides ? 'fa-chevron-up' : 'fa-chevron-down']"></i>
        </div>

        <div v-if="showOverrides" class="mt-3 space-y-2">
          <div
            v-for="(override, index) in editParamData.overrides"
            :key="index"
            class="flex gap-2 items-center"
          >
            <input
              v-model="override.country"
              placeholder="Country Code (e.g. TR)"
              :class="[
                'w-1/3 p-2 border rounded',
                invalidOverrideIndexes.includes(index) ? 'border-red-500' : ''
              ]"
            />
            <input
              v-model="override.value"
              placeholder="Override Value"
              :class="[
                'w-1/3 p-2 border rounded',
                invalidOverrideIndexes.includes(index) ? 'border-red-500' : ''
              ]"
            />
            <button
              @click="removeOverride(index)"
              class="text-red-600 font-bold text-xl"
              title="Remove"
            >
              &times;
            </button>
          </div>

          <button
            @click="addOverride"
            class="mt-2 px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded"
          >
            + Add Override
          </button>
        </div>
        <div class="flex justify-end space-x-2 mt-4">
          <button @click="closeModals" class="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
          <button @click="handleEdit" class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded">Save</button>
        </div>
      </div>
    </div>


    <div v-if="showDeleteModal" class="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div class="bg-white text-black p-6 rounded shadow-lg w-full max-w-sm space-y-4">
        <h3 class="text-lg font-semibold mb-2">Delete "{{ deleteParamData.key }}"?</h3>
        <p class="text-sm">Are you sure you want to delete this parameter?</p>
        <div class="flex justify-end space-x-2 mt-4">
          <button @click="closeModals" class="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
          <button @click="handleDelete" class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded">Delete</button>
        </div>
      </div>
    </div>

    <div class="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 space-y-3 w-full max-w-sm">
      <transition-group name="fade" tag="div" class="flex flex-col space-y-2">
        <div
          v-for="(msg, index) in errors"
          :key="msg + index"
          class="bg-red-500 text-white px-4 py-3 rounded-lg shadow-md flex justify-between items-center"
        >
          <span class="text-sm">⚠️ {{ msg }}</span>
          <button @click="removeError(index)" class="text-white hover:text-gray-300 text-lg leading-none">✖</button>
        </div>
      </transition-group>
    </div>
  </template>

  <script setup lang="ts">
    const sortKey = ref('create_date')
    const sortOrder = ref<'asc' | 'desc'>('desc')

    import { computed, ref, onMounted, onUnmounted } from 'vue'
    import { getAuth, signOut } from 'firebase/auth'
    import { onSnapshot, collection } from 'firebase/firestore'
    import { db } from '../firebase'
    import ParameterCard from '../components/ParameterCard.vue'
    import { useRouter } from 'vue-router'
    import dayjs from 'dayjs'
    import customParseFormat from 'dayjs/plugin/customParseFormat'
    dayjs.extend(customParseFormat)
    import { useToasts } from '../useToasts'
    const { errors, addError, removeError } = useToasts()
    const showOverrides = ref(false)

    const parameters = ref<any[]>([])
    const newParam = ref({ key: '', value: '', description: '', create_date: '' })

    const API_URL = import.meta.env.VITE_API_URL
    const dropdownOpen = ref(false)
    const router = useRouter()

    const showEditModal = ref(false)

    const invalidOverrideIndexes = ref<number[]>([])

    const editParamData = ref<{
      key: string
      value: string
      description: string
      updatedAt: string
      overrides: any[]
    }>({
      key: '',
      value: '',
      description: '',
      updatedAt: '',
      overrides: []
    })

    const showDeleteModal = ref(false)
    const deleteParamData = ref({ key: '' })

    const themeClass = computed(() =>
      localStorage.getItem('theme') === 'dark'
        ? 'bg-gray-900 text-white'
        : 'bg-white text-gray-900'
    )

    // const fetchParams = async () => {
    //   try {
    //     const res = await fetch(`${API_URL}/config`, {
    //       headers: {
    //         'x-api-key': 'deneme',
    //       }
    //     })
    //     const data = await res.json()
    //     parameters.value = data
    //   } catch (err) {
    //     console.error('Failed to fetch parameters:', err)
    //   }
    // }

    const getToken = async (): Promise<string | null> => {
      const user = getAuth().currentUser
      return user ? await user.getIdToken() : null
    }

    const addParam = async () => {
      if (!newParam.value.key || !newParam.value.value) return

      try {
        const token = await getToken()
        const res = await fetch(`${API_URL}/config`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'x-api-key': import.meta.env.VITE_API_KEY
          },
          body: JSON.stringify(newParam.value)
        })

        if (res.ok) {
          newParam.value = { key: '', value: '', description: '', create_date: '' }
          //await fetchParams()
        } else {
          console.error('Add failed')
        }
      } catch (err) {
        console.error('Error adding parameter:', err)
      }
    }

    const toggleDropdown = () => {
      dropdownOpen.value = !dropdownOpen.value
    }

    const logout = async () => {
      try {
        await signOut(getAuth())
        router.push('/signin')
      } catch (err) {
        console.error('Logout error:', err)
      }
    }

    const sortedParameters = computed(() => {
      if (!sortKey.value) return parameters.value

      const sorted = [...parameters.value].sort((a, b) => {
        let valA = a[sortKey.value]
        let valB = b[sortKey.value]

        if (sortKey.value === 'create_date') {
          const format = 'DD/MM/YYYY HH:mm'
          const dA = dayjs(valA, format, true)
          const dB = dayjs(valB, format, true)
          if (!dA.isValid() || !dB.isValid()) return 0
          valA = dA.toDate()
          valB = dB.toDate()
        }

        if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1
        if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1
        return 0
      })

      return sorted
    })

    const sortBy = (key: string) => {
      if (sortKey.value === key) {
        sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
      } else {
        sortKey.value = key
        sortOrder.value = 'asc'
      }
    }

    const getSortArrow = (key: string) => {
      if (sortKey.value !== key) return ''
      return sortOrder.value === 'asc' ? '↑' : '↓'
    }

    const openEditModal = (param: any) => {
        editParamData.value = {
          key: param.key,
          value: param.value,
          description: param.description,
          updatedAt: param.updatedAt,
          overrides: param.countryOverrides || []
        }
      showEditModal.value = true
    }

    const handleEdit = async () => {
      invalidOverrideIndexes.value = []

      editParamData.value.overrides.forEach((override, index) => {
        if (!override.country || !override.value) {
          invalidOverrideIndexes.value.push(index)
        }
      })

      if (invalidOverrideIndexes.value.length > 0) {
        addError('Please fill in all override fields before saving.')
        return
      }
      try {
        const token = await getToken()
        const res = await fetch(`${API_URL}/config/${editParamData.value.key}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'x-api-key': import.meta.env.VITE_API_KEY
          },
          body: JSON.stringify({
            value: editParamData.value.value,
            description: editParamData.value.description,
            updatedAt: editParamData.value.updatedAt,
            countryOverrides: editParamData.value.overrides
          })
        })

        if (res.status === 409) {
          addError('This config was modified by another user. Changes are applied, please try again.')
          //await fetchParams();
          const latest = parameters.value.find(p => p.key === editParamData.value.key)
          editParamData.value = {
            key: latest.key,
            value: latest.value,
            description: latest.description,
            updatedAt: latest.updatedAt,
            overrides: latest.countryOverrides || []
          }
        } else if (!res.ok) {
          addError('Failed to update config')
        } else {
          //await fetchParams()
          closeModals()
        }
      } catch (err) {
        addError('Edit error:' + (err instanceof Error ? err.message : String(err)))
      }
    }

    const openDeleteModal = (param: any) => {
      deleteParamData.value = { key: param.key }
      showDeleteModal.value = true
    }

    const handleDelete = async () => {
      try {
        const token = await getToken()
        await fetch(`${API_URL}/config/${deleteParamData.value.key}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-api-key': import.meta.env.VITE_API_KEY
          }
        })
        closeModals()
        //await fetchParams()
      } catch (err) {
        console.error('Delete error:', err)
      }
    }

    const closeModals = () => {
      showEditModal.value = false
      showDeleteModal.value = false
      showOverrides.value = false
    }

    onMounted(() => {
      const configRef = collection(db, 'config')

      const unsubscribe = onSnapshot(configRef, (snapshot) => {
        const configList: any[] = []
        snapshot.forEach(doc => {
          configList.push({ id: doc.id, ...doc.data() })
        })
        parameters.value = configList
      })

      onUnmounted(() => unsubscribe())
    })

    const addOverride = () => {
      editParamData.value.overrides.push({ country: '', value: '' })
    }

    const removeOverride = (index: number) => {
      editParamData.value.overrides.splice(index, 1)
    }
  </script>
