// Seleccionar elementos del DOM
const input = document.getElementById("input");
const button = document.getElementById("input-btn");
const list = document.getElementById("list");
const totalElement = document.getElementById("total");
const completasElement = document.getElementById("completas");
const incompletasElement = document.getElementById("incompletas");

let tareas = [];

// Función para cargar tareas desde localStorage
function cargarTareas() {
    const tareasGuardadas = localStorage.getItem("tareas");
    if (tareasGuardadas) {
        tareas = JSON.parse(tareasGuardadas);
    }
}

// Función para guardar tareas en localStorage
function guardarTareas() {
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

// Función para actualizar la lista de tareas en el DOM
function actualizarLista() {
    list.innerHTML = ""; // Limpiar la lista actual

    // Contadores iniciales
    let completas = 0;

    tareas.forEach((tarea, index) => {
        const li = document.createElement("li");
        li.className = "list-item";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.className = "casilla";
        checkbox.checked = tarea.completada;
        
        const p = document.createElement("p");
        p.className = "actividad";
        p.textContent = tarea.nombre;

        // Aplicar estilos iniciales si la tarea está completada
        if (tarea.completada) {
            li.style.background = "light-dark(var(--color-cuar-light), var(--color-cuar-dark))";
            p.style.textDecoration = "line-through";
            completas++; // Incrementar el contador de completas
        }

        // Actualizar el estado de la tarea
        checkbox.addEventListener("change", () => {
            tarea.completada = checkbox.checked;

            // Actualizar estilos según el estado de la tarea
            if (tarea.completada) {
                p.style.textDecoration = "line-through"; // Aplicar línea a través del texto
                li.style.background = "light-dark(var(--color-cuar-light), var(--color-cuar-dark))";
            } else {
                li.style.background = ""; // Restablecer color si no está completada
                p.style.textDecoration = ""; // Quitar línea a través del texto
            }

            guardarTareas(); // Guardar cambios
            actualizarContadores(); // Actualizar contadores después de cambiar el estado
        });

        const deleteButton = document.createElement("button");
        deleteButton.className = "item-btn-delete";
        
        // Eliminar tarea
        deleteButton.addEventListener("click", () => {
            tareas.splice(index, 1);
            guardarTareas(); // Guardar cambios
            actualizarContadores(); // Actualizar contadores después de eliminar
            actualizarLista(); // Volver a actualizar la lista
        });

        const svgIcon = `
            <svg class="item-btn-delete-icom" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6"/>
            </svg>
        `;
        deleteButton.innerHTML = svgIcon;

        li.appendChild(checkbox);
        li.appendChild(p);
        li.appendChild(deleteButton);
        
        list.appendChild(li);
    });

    actualizarContadores(completas); // Pasar el conteo correcto a la función de contadores
}

// Función para actualizar contadores de tareas
function actualizarContadores() {
    const total = tareas.length; // Total de tareas

    let completas = tareas.filter(tarea => tarea.completada).length; // **Calcular completas directamente**
    
    completasElement.textContent = `Completed: ${completas}`; // Mostrar el número de completas directamente
    incompletasElement.textContent = `Incompleted: ${total - completas}`; // Calcular incompletas directamente

    totalElement.textContent = `Total: ${total}`; // Mostrar total directamente

    // Asegurarse que no muestre NaN si no hay tareas
    if (total === 0) { 
        incompletasElement.textContent = `Incompleted: 0`; 
    }
}

// Agregar nueva tarea
button.addEventListener("click", () => {
    const nuevaTareaNombre = input.value.trim();
    if (nuevaTareaNombre) {
        tareas.push({ nombre: nuevaTareaNombre, completada: false });
        input.value = ""; // Limpiar el campo de entrada
        guardarTareas(); // Guardar cambios en localStorage
        actualizarLista(); // Actualizar la lista después de agregar una nueva tarea
    }
});

// Habilitar el botón solo si hay texto en el input
input.addEventListener("input", () => {
    button.disabled = !input.value.trim();
});

// Inicializar la lista al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarTareas(); // Cargar tareas desde localStorage al inicio
    actualizarLista(); // Actualizar la lista para mostrar las tareas cargadas
});