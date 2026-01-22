export interface Task {
  id: number
  userId: number
  name: string
  done: boolean
}

export interface CreateTaskDto {
  name: string
}

export interface UpdateTaskDto {
  name?: string
  done?: boolean
}
