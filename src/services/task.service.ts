import type { ParamsDataTable } from '@/interfaces/datatable.interface'
import type { CreateTaskDto, Task, UpdateTaskDto } from '@/interfaces/task.interface'
import api from '@/api/axios'

export class TaskService {
  static async gellAll(params: ParamsDataTable) {
    const { data } = await api.get<{ data: Task[]; total: number }>('/tasks', { params })
    return data
  }

  static async getById(id: number) {
    const { data } = await api.get<Task>(`/tasks/${id}`)
    return data
  }

  static async create(payload: CreateTaskDto) {
    const { data } = await api.post<Task>('/tasks', payload)
    return data
  }

  static async updateFull(id: number, payload: UpdateTaskDto) {
    const { data } = await api.put<Task>(`/tasks/${id}`, payload)
    return data
  }

  static async updateStatus(id: number, payload: UpdateTaskDto) {
    const { data } = await api.patch<number[]>(`/tasks/${id}`, payload)
    return data
  }

  static async delete(id: number) {
    await api.delete(`/tasks/${id}`)
  }
}
