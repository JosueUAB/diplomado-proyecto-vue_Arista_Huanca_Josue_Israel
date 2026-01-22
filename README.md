# 📝 Proyecto Final: Gestión de Tareas (To-Do List) con Vue.js 3

Este proyecto es una aplicación web dinámica diseñada para la gestión integral del ciclo de vida de tareas (CRUD). Implementa una arquitectura reactiva conectada a una API REST profesional, permitiendo el control total sobre las actividades del usuario.

## 🚀 Funcionalidades Requeridas
El sistema permite gestionar las tareas mediante las siguientes acciones integradas con el Backend:

* **Visualización:** Listado dinámico de tareas con opciones de edición y eliminación.
* **Creación:** Formulario para añadir nuevas tareas a la base de datos.
* **Edición:** Capacidad de modificar el nombre o contenido de tareas existentes.
* **Gestión de Estado:** Alternancia entre estados "Pendiente" y "Finalizada" con estilos visuales diferenciados.
* **Eliminación:** Borrado individual de tareas de la lista.

## 🛠️ Especificaciones Técnicas de la API
Para asegurar la correcta integración, el frontend consume los siguientes endpoints:

### 1. Obtener Tareas (`GET /api/tasks`)
**Respuesta exitosa (200 OK):**
```json
{
  "total": 1,
  "page": 1,
  "data": [
    {
      "id": 38,
      "name": "Estudiar Vue.js",
      "done": false
    }
  ]
}
```

### 2. Crear Tarea (`POST /api/tasks`)
**Cuerpo de la petición (JSON):**
```json
{ "name": "Nueva Tarea" }
```
**Respuesta:** Retorna el objeto creado con su `id` y `userId` asignado.

### 3. Actualizar Estado (`PATCH /api/tasks/{id}`)
**Cuerpo de la petición (JSON):**
```json
{ "done": true }
```
**Respuesta:** `[1]` (Indica que un registro fue actualizado correctamente).

### 4. Eliminar Tarea (`DELETE /api/tasks/{id}`)
**Respuesta:** `204 No Content` (La tarea ha sido eliminada exitosamente).

## 📦 Configuración del Entorno

1. **Variables Globales:**
Asegúrate de tener tu archivo `.env` configurado en la raíz con la URL base:
`VITE_API_URL=https://carlos-trigo.onrender.com/api`

2. **Instalación:**
```bash
npm install
```

3. **Desarrollo:**
```bash
npm run dev
```
