# Proyecto Final: Gestión de Tareas con Vue.js

**Diplomado Desarrollo Web Full Stack - Módulo 3**

**Estudiante:** Josue Israel Arista Huanca

---

##  Descripción del Proyecto
Este proyecto es una aplicación web dinámica diseñada para la gestión integral del ciclo de vida de tareas (CRUD). Implementa una arquitectura reactiva con Vue 3, componentes modulares, y manejo avanzado de eventos y estados.

La aplicación permite a los usuarios gestionar sus tareas diarias de manera eficiente, con funcionalidades como creación, edición en tiempo real, eliminación segura y seguimiento de estado (Pendiente/Finalizada).

##  Funcionalidades Principales
* **Gestión de Sesiones:** Registro e inicio de sesión de usuarios.
* **CRUD de Tareas:** Crear, Leer, Actualizar y Eliminar tareas.
* **Interfaz Dinámica:** `DataTable` con ordenamiento, búsqueda y paginación.
* **Feedback Visual:** Indicadores de estado, tooltips y alertas interactivas (SweetAlert2).

## Guía de Uso

1. **Autenticación**:
   - Al iniciar la aplicación, serás redirigido al **Login**.
   - Si no tienes cuenta, ve a la opción "Registrarse" y crea un nuevo usuario.
   - Ingresa con tus credenciales.

2. **Panel de Tareas**:
   - Una vez logueado, accederás automáticamente al módulo de **Tareas**.
   - Aquí verás tu lista de tareas personales.

3. **Gestión de Tareas**:
   - **Crear**: Usa el botón "Agregar Tarea" para insertar un nuevo ítem.
   - **Ver Detalles**: Haz clic en el ícono del "Ojo" para ver la información completa.
   - **Editar**: Puedes editar el nombre desde la tabla o desde la vista de detalles.
   - **Cambiar Estado**: Usa el interruptor (switch) en la tabla o el botón en detalles para alternar entre "Pendiente" y "Finalizada".
   - **Eliminar**: Haz clic en el ícono de "Papelera". Se te pedirá confirmación por seguridad.

## Configuración e Instalación

### Requisitos Previos
- Node.js (v16 o superior)
- npm

### Pasos de Instalación

1. **Instalar dependencias:**
   ```sh
   npm install
   ```

2. **Configurar Entorno:**
   Asegúrate de que el archivo `.env` en la raíz tenga la siguiente configuración:
   ```properties
   VITE_API_URL=https://carlos-trigo.onrender.com/api
   ```

3. **Compilar y Recargar en Desarrollo:**
   ```sh
   npm run dev
   ```

4. **Verificación  y Build para Producción:**
   ```sh
   npm run build
   ```

---

## 🔌 Especificaciones Técnicas (API)
El frontend se comunica con los siguientes endpoints REST:

* `GET /api/tasks`: Obtener listado de tareas.
* `POST /api/tasks`: Crear nueva tarea.
* `GET /api/tasks/{id}`: Obtener detalle de una tarea.
* `PUT /api/tasks/{id}`: Actualizar tarea completa (Nombre).
* `PATCH /api/tasks/{id}`: Actualizar estado (Done).
* `DELETE /api/tasks/{id}`: Eliminar tarea.
