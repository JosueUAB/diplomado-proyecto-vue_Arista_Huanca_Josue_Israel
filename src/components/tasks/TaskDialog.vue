<script setup lang="ts">
import type { CreateTaskDto, UpdateTaskDto, Task } from '@/interfaces/task.interface'
import { TaskService } from '@/services/task.service'
import { ref, watch } from 'vue'
import { useRequest } from '@/composables/useRequest'
import { useAlert } from '@/composables/useAlert'

const props = defineProps<{
  modelValue: boolean
  taskToEdit?: Task | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'saved'): void
}>()

const valid = ref(false)
const formData = ref<CreateTaskDto | UpdateTaskDto>({ name: '' })
const { run, loading } = useRequest()
const { open } = useAlert()

watch(
  () => props.taskToEdit,
  (newTask) => {
    if (newTask) {
      formData.value = { name: newTask.name, done: newTask.done }
    } else {
      formData.value = { name: '' }
    }
  },
  { immediate: true }
)

async function save() {
  if (!valid.value) return

  const action = props.taskToEdit
    ? () => TaskService.updateFull(props.taskToEdit!.id, formData.value)
    : () => TaskService.create(formData.value as CreateTaskDto)

  const res = await run(action)

  if (res) {
    open(props.taskToEdit ? 'Tarea actualizada' : 'Tarea creada', 'success')
    emit('saved')
    close()
  }
}

function close() {
  emit('update:modelValue', false)
}
</script>

<template>
  <v-dialog :model-value="modelValue" @update:model-value="close" max-width="500px">
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ taskToEdit ? 'Editar Tarea' : 'Nueva Tarea' }}</span>
      </v-card-title>

      <v-card-text>
        <v-form v-model="valid" @submit.prevent="save">
          <v-text-field
            v-model="formData.name"
            label="Nombre de la tarea"
            :rules="[(v) => !!v || 'El nombre es requerido']"
            required
            variant="outlined"
            autofocus
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="blue-darken-1" variant="text" @click="close"> Cancelar </v-btn>
        <v-btn
          color="blue-darken-1"
          variant="text"
          :loading="loading"
          :disabled="!valid"
          @click="save"
        >
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
