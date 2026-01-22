<script setup lang="ts">
import { useDataTable } from '@/composables/useDataTable'
import { TaskService } from '@/services/task.service'
import type { Task } from '@/interfaces/task.interface'
import { ref } from 'vue'
import { useRequest } from '@/composables/useRequest'
import { useAlert } from '@/composables/useAlert'

// Composable de DataTable
const { items, totalItems, loading, search, itemsPerPage, loadItems, refresh } =
  useDataTable<Task>(TaskService.gellAll)

// Headers para la tabla
const headers = [
  { title: 'ID', key: 'id', align: 'start' as const },
  { title: 'Nombre', key: 'name', align: 'start' as const },
  { title: 'Estado', key: 'done', align: 'center' as const },
  { title: 'Acciones', key: 'actions', align: 'end' as const, sortable: false },
]

// Estado del formulario
const dialog = ref(false)
const valid = ref(false)
const editedItem = ref<Partial<Task>>({ name: '' })
const isEditing = ref(false)

// Composable de Request y Alert
const { run, loading: loadingAction } = useRequest()
const { open } = useAlert()

function newTask() {
  editedItem.value = { name: '' }
  isEditing.value = false
  dialog.value = true
}

function editItem(item: Task) {
  editedItem.value = { ...item }
  isEditing.value = true
  dialog.value = true
}

async function save() {
  if (!valid.value) return

  const action = isEditing.value
    ? () => TaskService.update(editedItem.value.id!, { name: editedItem.value.name })
    : () => TaskService.create({ name: editedItem.value.name! })

  const res = await run(action)

  if (res) {
    open(isEditing.value ? 'Tarea actualizada' : 'Tarea creada', 'success')
    dialog.value = false
    refresh()
  }
}

async function deleteItem(item: Task) {
  if (!confirm('¿Estás seguro de eliminar esta tarea?')) return

  await run(() => TaskService.delete(item.id))
  open('Tarea eliminada', 'success')
  refresh()
}

async function toggleStatus(item: Task) {
  await run(() => TaskService.update(item.id, { done: !item.done }))
  item.done = !item.done // Optimistic update
}
</script>

<template>
  <v-card flat>
    <template #title>
      <div class="d-flex align-center justify-space-between w-100">
        <span class="text-h6">Gestión de tareas</span>
        <v-btn color="primary" @click="newTask">
          <v-icon icon="mdi-plus" start />
          Agregar Tarea
        </v-btn>
      </div>
    </template>

    <v-card-text>
      <v-text-field
        v-model="search"
        label="Buscar por tarea..."
        prepend-inner-icon="mdi-magnify"
        density="compact"
        variant="outlined"
        clearable
        hide-details
        class="mb-4"
      />

      <v-data-table-server
        v-model:items-per-page="itemsPerPage"
        :headers="headers"
        :items="items"
        :items-length="totalItems"
        :loading="loading"
        :search="search"
        @update:options="loadItems"
      >
        <!-- Columna Estado -->
        <template #[`item.done`]="{ item }">
          <v-chip
            :color="item.done ? 'success' : 'warning'"
            size="small"
            class="text-uppercase font-weight-bold"
            @click="toggleStatus(item)"
          >
            {{ item.done ? 'Finalizada' : 'Pendiente' }}
          </v-chip>
        </template>

        <!-- Columna Acciones -->
        <template #[`item.actions`]="{ item }">
          <v-btn
            icon="mdi-pencil"
            size="small"
            color="info"
            variant="text"
            @click="editItem(item)"
          />
          <v-btn
            icon="mdi-delete"
            size="small"
            color="error"
            variant="text"
            @click="deleteItem(item)"
          />
        </template>
      </v-data-table-server>
    </v-card-text>

    <!-- Dialogo Crear/Editar -->
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ isEditing ? 'Editar Tarea' : 'Nueva Tarea' }}</span>
        </v-card-title>

        <v-card-text>
          <v-form v-model="valid" @submit.prevent="save">
            <v-text-field
              v-model="editedItem.name"
              label="Nombre de la tarea"
              :rules="[(v) => !!v || 'El nombre es requerido']"
              required
              variant="outlined"
            />
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="blue-darken-1" variant="text" @click="dialog = false"> Cancelar </v-btn>
          <v-btn
            color="blue-darken-1"
            variant="text"
            :loading="loadingAction"
            :disabled="!valid"
            @click="save"
          >
            Guardar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>
