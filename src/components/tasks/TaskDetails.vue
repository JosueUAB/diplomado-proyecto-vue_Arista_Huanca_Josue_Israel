<script setup lang="ts">
import type { Task } from '@/interfaces/task.interface'
import { TaskService } from '@/services/task.service'
import { useRequest } from '@/composables/useRequest'
import Swal from 'sweetalert2'

const props = defineProps<{
  modelValue: boolean
  task: Task | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'edit', task: Task): void
  (e: 'deleted'): void
  (e: 'status-changed'): void
}>()

const { run } = useRequest()

function close() {
  emit('update:modelValue', false)
}

function onEdit() {
  if (props.task) {
    emit('edit', props.task)
    close()
  }
}

async function onDelete() {
  if (!props.task) return

  const result = await Swal.fire({
    title: '¿Estás seguro?',
    text: "No podrás revertir esta acción",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  })

  if (result.isConfirmed) {
    await run(() => TaskService.delete(props.task!.id))
    emit('deleted')
    close()
    Swal.fire('Eliminado!', 'La tarea ha sido eliminada.', 'success')
  }
}

async function toggleStatus() {
  if (!props.task) return
  await run(() => TaskService.updateStatus(props.task!.id, { done: !props.task!.done }))
  emit('status-changed')
  close()
}
</script>

<template>
  <v-dialog :model-value="modelValue" @update:model-value="close" max-width="500px">
    <v-card v-if="task" class="elevation-10 rounded-lg">
      <v-card-title class="bg-primary text-white d-flex justify-space-between align-center py-3">
        <span class="text-h6 font-weight-bold">Detalles de la Tarea</span>
        <v-btn icon="mdi-close" variant="text" density="compact" color="white" @click="close" />
      </v-card-title>

      <v-card-text class="pt-6">
        <v-row no-gutters>
          <v-col cols="12" class="mb-4">
             <div class="text-caption text-medium-emphasis">ID de Tarea</div>
             <div class="text-h6 text-primary">#{{ task.id }}</div>
          </v-col>

          <v-col cols="12" class="mb-4">
            <div class="text-caption text-medium-emphasis">Nombre</div>
            <div class="text-body-1 font-weight-medium">{{ task.name }}</div>
          </v-col>

          <v-col cols="12">
            <div class="text-caption text-medium-emphasis mb-1">Estado Actual</div>
            <v-chip
              :color="task.done ? 'success' : 'warning'"
              class="font-weight-bold text-uppercase"
              variant="elevated"
            >
              <v-icon start>{{ task.done ? 'mdi-check-circle' : 'mdi-clock-outline' }}</v-icon>
              {{ task.done ? 'Finalizada' : 'Pendiente' }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4 bg-grey-lighten-5">
        <v-btn
            color="grey-darken-1"
            variant="text"
            prepend-icon="mdi-close"
            @click="close"
        >
          Cerrar
        </v-btn>

        <v-spacer />

        <v-btn
          :color="task.done ? 'warning' : 'success'"
          variant="tonal"
          :prepend-icon="task.done ? 'mdi-backup-restore' : 'mdi-check'"
          @click="toggleStatus"
          class="mr-2"
        >
          {{ task.done ? 'Reabrir' : 'Completar' }}
        </v-btn>

        <v-btn
          color="info"
          variant="elevated"
          prepend-icon="mdi-pencil"
          @click="onEdit"
          class="mr-2"
        >
          Editar
        </v-btn>

        <v-btn
          color="error"
          variant="elevated"
          icon="mdi-delete"
          @click="onDelete"
          density="comfortable"
        >
           <v-tooltip activator="parent" location="top">Eliminar</v-tooltip>
           <v-icon>mdi-delete</v-icon>
        </v-btn>

      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style>
.swal2-container {
  z-index: 3000 !important;
}
</style>
