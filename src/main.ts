import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@/styles/_index.scss'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'

import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import Tag from 'primevue/tag'
import InputText from 'primevue/inputtext'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue)

app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('Button', Button)
app.component('Dialog', Dialog)
app.component('Tag', Tag)
app.component('InputText', InputText)

app.mount('#app')