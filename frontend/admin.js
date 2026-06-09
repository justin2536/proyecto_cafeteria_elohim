// Base de datos simulada inicial si el LocalStorage está limpio
const productosIniciales = [
    { id: "1", nombre: "Café Capuchino", precio: 65, stock: 12, imagen: "imagen/capuchino.jpg" },
    { id: "2", nombre: "Sanduich", precio: 85, stock: 3, imagen: "imagen/sandui.jpg" },
    { id: "3", nombre: "Croissants", precio: 60, stock: 15, imagen: "imagen/Croissants Sans Beurre aux Pépites de Chocolat - Plat et Recette.jpg" },
    { id: "4", nombre: "Nacatamal", precio: 60, stock: 1, imagen: "imagen/nacatamal.jpg" }
];

let productos = JSON.parse(localStorage.getItem('db-productos')) || productosIniciales;
let mensajes = JSON.parse(localStorage.getItem('db-mensajes')) || [
    { nombre: "Jus", correo: "justinpantoja200@gmail.com", sugerencia: "Sale lirol Pizza y Mortal?." }
];

document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================
       1. CAMBIO DE PESTAÑAS (NAVEGACIÓN)
       ========================================== */
    const itemsMenu = document.querySelectorAll('.tab-menu');
    const secciones = document.querySelectorAll('.tab-section');
    const tituloPrincipal = document.getElementById('main-title');

    itemsMenu.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Cambiar clase activa en el menú lateral
            itemsMenu.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Ocultar todas las secciones y mostrar la elegida
            secciones.forEach(sec => sec.classList.remove('active'));
            const targetTab = item.getAttribute('data-tab');
            document.getElementById(targetTab).classList.add('active');

            // Cambiar el título superior para que sepa dónde está parado
            if(targetTab === 'tab-dashboard') tituloPrincipal.innerText = "Panel de Control";
            if(targetTab === 'tab-productos') tituloPrincipal.innerText = "Catálogo de Cafetería";
            if(targetTab === 'tab-mensajes') tituloPrincipal.innerText = "Buzón de Sugerencias";
        });
    });

    /* ==========================================
       2. CONTROL DEL FORMULARIO DE PRODUCTOS
       ========================================== */
    const btnMostrarForm = document.getElementById('btn-mostrar-formulario');
    const contenedorForm = document.getElementById('contenedor-formulario');
    const btnCancelarForm = document.getElementById('btn-cancelar');
    const formProducto = document.getElementById('form-producto');

    if(btnMostrarForm && contenedorForm) {
        btnMostrarForm.addEventListener('click', () => {
            document.getElementById('form-titulo').innerText = "Añadir Nuevo Producto";
            document.getElementById('prod-index').value = "";
            formProducto.reset();
            contenedorForm.style.display = "block";
        });
    }

    if(btnCancelarForm && contenedorForm) {
        btnCancelarForm.addEventListener('click', () => {
            contenedorForm.style.display = "none";
            formProducto.reset();
        });
    }

    if(formProducto) {
        formProducto.addEventListener('submit', (e) => {
            e.preventDefault();

            const index = document.getElementById('prod-index').value;
            const nombre = document.getElementById('prod-nombre').value;
            const precio = parseFloat(document.getElementById('prod-precio').value);
            const stock = parseInt(document.getElementById('prod-stock').value);
            const imagen = document.getElementById('prod-imagen').value;

            if(index === "") {
                // AGREGAR NUEVO
                const nuevoId = Date.now().toString();
                productos.push({ id: nuevoId, nombre, precio, stock, imagen });
                alert(`¡${nombre} agregado exitosamente, bro!`);
            } else {
                // EDITAR EXISTENTE
                productos[index] = { ...productos[index], nombre, precio, stock, imagen };
                alert(`¡${nombre} modificado correctamente!`);
            }

            localStorage.setItem('db-productos', JSON.stringify(productos));
            contenedorForm.style.display = "none";
            formProducto.reset();
            renderizarTodo();
        });
    }

    // Dibujar los datos en pantalla al cargar por primera vez
    renderizarTodo();
});

/* ==========================================
   4. RENDERIZACIÓN DE TABLAS Y TARJETAS
   ========================================== */
function renderizarTodo() {
    // A) Actualizar tarjetas numéricas superiores
    const totalProd = productos.length;
    const stockTotal = productos.reduce((acc, item) => acc + item.stock, 0);
    const alertasTotal = productos.filter(item => item.stock < 5).length;

    if(document.getElementById('dash-total-productos')) document.getElementById('dash-total-productos').innerText = totalProd;
    if(document.getElementById('dash-stock-total')) document.getElementById('dash-stock-total').innerText = stockTotal;
    if(document.getElementById('dash-productos-alerta')) document.getElementById('dash-productos-alerta').innerText = alertasTotal;

    // B) Pintar Tabla 1: Inventario General (Dashboard)
    const tbodyInventario = document.getElementById('tabla-inventario-cuerpo');
    if(tbodyInventario) {
        tbodyInventario.innerHTML = '';
        productos.forEach(item => {
            let badgeClass = "status-ok";
            let estadoTexto = "Estable";

            if(item.stock === 0) {
                badgeClass = "status-empty";
                estadoTexto = "Agotado";
            } else if(item.stock < 5) {
                badgeClass = "status-alert";
                estadoTexto = "Por Agotarse";
            }

            tbodyInventario.innerHTML += `
                <tr>
                    <td><img src="${item.imagen}" class="img-tabla" alt="${item.nombre}"></td>
                    <td style="font-weight: bold; color: #4b2c0c;">${item.nombre}</td>
                    <td>C$ ${item.precio}.00</td>
                    <td style="font-weight: bold;">${item.stock} u</td>
                    <td><span class="badge-status ${badgeClass}">${estadoTexto}</span></td>
                </tr>
            `;
        });
    }

    // C) Pintar Tabla 2: Catálogo con Modificaciones (CRUD)
    const tbodyCatalogo = document.getElementById('tabla-catalogo-cuerpo');
    if(tbodyCatalogo) {
        tbodyCatalogo.innerHTML = '';
        productos.forEach((item, index) => {
            tbodyCatalogo.innerHTML += `
                <tr>
                    <td><img src="${item.imagen}" class="img-tabla" alt="${item.nombre}"></td>
                    <td style="font-weight: bold;">${item.nombre}</td>
                    <td>C$ ${item.precio}.00</td>
                    <td>${item.stock} unidades</td>
                    <td>
                        <button class="btn-admin btn-editar" onclick="activarEdicion(${index})">Editar</button>
                        <button class="btn-admin btn-eliminar" onclick="eliminarDelCatalogo(${index})">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    }


    const tbodyMensajes = document.getElementById('tabla-mensajes-cuerpo');
    if(tbodyMensajes) {
        tbodyMensajes.innerHTML = '';
        if(mensajes.length === 0) {
            tbodyMensajes.innerHTML = `<tr><td colspan="4" style="text-align: center; color: #888; padding: 20px;">El buzón está vacío, bro.</td></tr>`;
            return;
        }
        mensajes.forEach((msg, index) => {
            tbodyMensajes.innerHTML += `
                <tr>
                    <td style="font-weight: bold; color: #4b2c0c;">${msg.nombre}</td>
                    <td><a href="mailto:${msg.correo}" style="color:#8d4700; text-decoration:none;">${msg.correo}</a></td>
                    <td style="font-style: italic;">"${msg.sugerencia}"</td>
                    <td><button class="btn-admin btn-eliminar" onclick="borrarMensaje(${index})" style="padding: 5px 10px; font-size:0.8rem;">Leído</button></td>
                </tr>
            `;
        });
    }
}

/* ==========================================
   5. INTERACCIONES DEL SISTEMA (CRUD GLOBAL)
   ========================================== */
window.activarEdicion = function(index) {
    const prod = productos[index];
    document.getElementById('form-titulo').innerText = `Editando: ${prod.nombre}`;
    document.getElementById('prod-index').value = index;
    document.getElementById('prod-nombre').value = prod.nombre;
    document.getElementById('prod-precio').value = prod.precio;
    document.getElementById('prod-stock').value = prod.stock;
    document.getElementById('prod-imagen').value = prod.imagen;

    document.getElementById('contenedor-formulario').style.display = "block";
    document.getElementById('contenedor-formulario').scrollIntoView({ behavior: 'smooth' });
};

window.eliminarDelCatalogo = function(index) {
    if(confirm(`¿Estás seguro de que querés borrar "${productos[index].nombre}" del menú, bro?`)) {
        productos.splice(index, 1);
        localStorage.setItem('db-productos', JSON.stringify(productos));
        renderizarTodo();
    }
};

window.borrarMensaje = function(index) {
    mensajes.splice(index, 1);
    localStorage.setItem('db-mensajes', JSON.stringify(mensajes));
    renderizarTodo();
};