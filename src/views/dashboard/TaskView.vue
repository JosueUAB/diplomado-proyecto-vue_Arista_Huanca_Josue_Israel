<script setup lang="ts">
import { useDataTable } from '@/composables/useDataTable'
import { TaskService } from '@/services/task.service'
import type { Task } from '@/interfaces/task.interface'
import { ref } from 'vue'
import { useRequest } from '@/composables/useRequest'

import TaskDialog from '@/components/tasks/TaskDialog.vue'
import TaskDetails from '@/components/tasks/TaskDetails.vue'
import Swal from 'sweetalert2'

// Composable de DataTable
const { items, totalItems, loading, search, itemsPerPage, loadItems, refresh } =
  useDataTable<Task>(TaskService.gellAll)

// Headers para la tabla
const headers = [
  { title: '#', key: 'index', align: 'start' as const, sortable: false },
  { title: 'Nombre', key: 'name', align: 'start' as const },
  { title: 'Estado', key: 'done', align: 'center' as const },
  { title: 'Acciones', key: 'actions', align: 'end' as const, sortable: false },
]

// Estado del formulario y detalles
const dialog = ref(false)
const detailsDialog = ref(false)
const taskToEdit = ref<Task | null>(null)
const taskToView = ref<Task | null>(null)

// Composable de Request y Alert
const { run } = useRequest()

function newTask() {
  taskToEdit.value = null
  dialog.value = true
}

function editItem(item: Task) {
  taskToEdit.value = item
  dialog.value = true
}

function viewDetails(item: Task) {
  taskToView.value = item
  detailsDialog.value = true
}

function onEditFromDetails(item: Task) {
  editItem(item)
}

async function deleteItem(item: Task) {
  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: "No podrás revertir esta acción de eliminar la tarea: " + item.name,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
      await run(() => TaskService.delete(item.id))
      Swal.fire('Eliminado!', 'La tarea ha sido eliminada.', 'success')
      refresh()
  }
}

async function toggleStatus(item: Task) {
  await run(() => TaskService.updateStatus(item.id, { done: item.done }))
  // No need for manual toggle if v-model handles it, but optimistic UI might need care.
  // Actually v-switch updates the model. If api fails we should revert.
  // For now simple implementation.
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
        class="elevation-2 rounded-lg header-bold"
        hover
        @update:options="loadItems"
      >
        <!-- Columna # (Indice secuencial) -->
        <template #[`item.index`]="{ index }">
            <span class="font-weight-bold text-grey-darken-2">{{ index + 1 }}</span>
        </template>

        <!-- Columna Nombre -->
        <template #[`item.name`]="{ item }">
          <span class="text-body-1">{{ item.name }}</span>
        </template>

        <!-- Columna Estado (Switch) -->
        <template #[`item.done`]="{ item }">
          <div class="d-flex justify-center">
             <v-switch
                v-model="item.done"
                :color="item.done ? 'success' : 'error'"
                hide-details
                inset
                density="compact"
                @update:model-value="toggleStatus(item)"
             >
                <template #label>
                    <v-chip
                      :color="item.done ? 'success' : 'error'"
                      size="small"
                      class="font-weight-bold text-uppercase ml-2"
                      variant="tonal"
                    >
                        {{ item.done ? 'Finalizada' : 'Pendiente' }}
                    </v-chip>
                </template>
             </v-switch>
          </div>
        </template>

        <!-- Columna Acciones -->
        <template #[`item.actions`]="{ item }">
          <div class="d-flex justify-end gap-2">
            <v-btn
                icon="mdi-eye"
                size="small"
                color="primary"
                variant="text"
                class="mr-1"
                @click="viewDetails(item)"
            >
                <v-tooltip activator="parent" location="top">Ver detalles</v-tooltip>
                <v-icon>mdi-eye</v-icon>
            </v-btn>

            <v-btn
                icon="mdi-pencil"
                size="small"
                color="info"
                variant="text"
                class="mr-1"
                @click="editItem(item)"
            >
                <v-tooltip activator="parent" location="top">Editar tarea</v-tooltip>
                <v-icon>mdi-pencil</v-icon>
            </v-btn>

            <v-btn
                icon="mdi-delete"
                size="small"
                color="error"
                variant="text"
                @click="deleteItem(item)"
            >
                <v-tooltip activator="parent" location="top">Eliminar tarea</v-tooltip>
                <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </template>
      </v-data-table-server>
    </v-card-text>

    <!-- Dialogo Reutilizable Crear/Editar -->
    <TaskDialog v-model="dialog" :task-to-edit="taskToEdit" @saved="refresh" />

    <!-- Dialogo Detalles -->
    <TaskDetails
        v-model="detailsDialog"
        :task="taskToView"
        @edit="onEditFromDetails"
        @deleted="refresh"
        @status-changed="refresh"
    />
  </v-card>
</template>

<style scoped>
.header-bold :deep(thead th) {
  font-weight: 900 !important;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-size: 0.85rem;
}
</style>
