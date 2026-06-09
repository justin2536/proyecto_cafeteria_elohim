// CARRUSEL // 
        const slides = document.querySelectorAll('.slide-item');
        let currentSlide = 0;
        const slideInterval = 4000; // Tiempo en milisegundos (4 segundos por foto)

        function nextSlide() {
            // Quitamos la clase activa al slide actual
            slides[currentSlide].classList.remove('active');
            
            // Calculamos el índice del siguiente slide
            currentSlide = (currentSlide + 1) % slides.length;


// Añadimos la clase activa al nuevo slide
slides[currentSlide].classList.add('active'); 
            

}

// Ejecuta la función automáticamente cada 4 segundos
        setInterval(nextSlide, slideInterval);


// Carrito // 

document.addEventListener('DOMContentLoaded', () => {
    
    const botonesAgregar = document.querySelectorAll('.btn-agregar');

    if (botonesAgregar.length > 0) {
        botonesAgregar.forEach(boton => {
            boton.addEventListener('click', (e) => {
                // Captura el nombre del café para el mensaje en pantalla
                const nombreProducto = e.target.getAttribute('data-nombre');
                
                alert(`¡Excelente elección! Añadiendo "${nombreProducto}" a tu orden. Vamos al carrito...`);
                
                window.location.href = 'carrito.html';
                // carrito.html para que funcione en celular
            });
        });
    }


    const itemsCarrito = document.querySelectorAll('.producto-carrito-item');

    if (itemsCarrito.length > 0) {
        itemsCarrito.forEach(item => {
            // Buscamos los botones de cantidad dentro de ESTE producto
            const botonesContador = item.querySelectorAll('.btn-cantidad');
            
            // El primer botón siempre será el "-" y el segundo será el "+"
            const btnMenos = botonesContador[0];
            const btnMas = botonesContador[1];
            
            const inputCantidad = item.querySelector('.input-cantidad');
            const btnEliminar = item.querySelector('.btn-eliminar');

            // --- BOTÓN MÁS (+) ---
            if (btnMas && inputCantidad) {
                btnMas.addEventListener('click', () => {
                    let actual = parseInt(inputCantidad.value) || 1;
                    inputCantidad.value = actual + 1; // Sube de 1 en 1
                });
            }

            // --- BOTÓN MENOS (-) ---
            if (btnMenos && inputCantidad) {
                btnMenos.addEventListener('click', () => {
                    let actual = parseInt(inputCantidad.value) || 1;
                    if (actual > 1) {
                        inputCantidad.value = actual - 1; // Baja de 1 en 1
                    } else {
                        // Si la cantidad es 1 y le dan a restar, borramos el producto por completo
                        item.remove();
                        verificarCarritoVacio();
                    }
                });
            }

            // --- BOTÓN QUITAR O ELIMINAR (X) ---
            if (btnEliminar) {
                btnEliminar.addEventListener('click', () => {
                    item.remove(); // Quita la tarjeta de la pantalla de una vez
                    verificarCarritoVacio();
                });
            }
        });
    }
});

/* 
 Muestra un mensaje si borrás todos los productos  */
function verificarCarritoVacio() {
    const restantes = document.querySelectorAll('.producto-carrito-item');
    const contenedorProductos = document.querySelector('.carrito-productos');
    
    // Si ya no queda ninguna tarjeta de producto en pantalla, ponemos el aviso
    if (restantes.length === 0 && contenedorProductos) {
        contenedorProductos.innerHTML = `
            <p style="color: #4a2c11; font-weight: bold; padding: 20px; text-align: center;">
                Tu carrito está vacío, bro. ¡Explora nuestros productos!
            </p>`;
    }
}





// consideracion // 
// EL ARREGLO: Intenta leer si ya había productos guardados en el navegador. Si no hay nada, empieza en 0 (vacío [])
let carrito = JSON.parse(localStorage.getItem('carrito-cafe')) || [];

document.addEventListener('DOMContentLoaded', () => {
    
    /* 
       1. EN LAS PÁGINAS DE PRODUCTOS (cafe.html, postre.html, antojo.html) */
    const botonesAgregar = document.querySelectorAll('.btn-agregar');

    if (botonesAgregar.length > 0) {
        botonesAgregar.forEach(boton => {
            boton.addEventListener('click', (e) => {
                const id = e.target.getAttribute('data-id');
                const nombre = e.target.getAttribute('data-nombre');
                const precio = parseFloat(e.target.getAttribute('data-precio'));
                
                // Buscamos la imagen que está dentro de la misma tarjeta del producto
                const tarjeta = e.target.closest('.producto-card');
                const imagen = tarjeta.querySelector('.producto-img').getAttribute('src');

                // Llamamos a la función para meterlo al arreglo
                meterProductoAlArreglo(id, nombre, precio, imagen);
            });
        });
    }

    /* 
       2. EN LA PÁGINA DEL CARRITO (carrito.html)  */
    // Si el navegador encuentra la sección del carrito, dibuja los productos que existan
    if (document.querySelector('.carrito-productos')) {
        dibujarCarritoEnPantalla();
    }
});


// Función para agregar el producto a la lista
function meterProductoAlArreglo(id, nombre, precio, imagen) {
    // Verificamos si ese producto ya está en el arreglo
    const existe = carrito.find(item => item.nombre === nombre);

    if (existe) {
        // Si ya está, solo le sumamos 1 a la cantidad
        existe.cantidad++;
    } else {
        // Si es nuevo, creamos un objeto y lo empujamos (.push) al arreglo con cantidad 1
        carrito.push({ id, nombre, precio, imagen, cantidad: 1 });
    }

    // Guardamos el arreglo en la memoria temporal del navegador para que no se borre al cambiar de página
    localStorage.setItem('carrito-cafe', JSON.stringify(carrito));
    
    alert(`¡${nombre} añadido al carrito con éxito!`);
    window.location.href = '/carrito'; // Redirigimos al carrito
}


function dibujarCarritoEnPantalla() {
    const contenedorProductos = document.querySelector('.carrito-productos');
    const txtTotal = document.getElementById('total-pago');
    
    if (!contenedorProductos) return;
    
    contenedorProductos.innerHTML = ''; // Limpiamos el contenedor para actualizar de cero

    // Si el arreglo está en 0 vací0, muestra el mensaje de carrito vacío
    if (carrito.length === 0) {
        contenedorProductos.innerHTML = `<p style="color: #4a2c11; font-weight: bold; padding: 20px; text-align: center;">Tu carrito está vacío, bro. ¡Explora nuestros productos!</p>`;
        if (txtTotal) txtTotal.innerText = 'C$ 0.00';
        return;
    }

    let cuentaTotal = 0;


    carrito.forEach((item, posicion) => {
        const subtotalIndividual = item.precio * item.cantidad;
        cuentaTotal += subtotalIndividual;

        const fila = document.createElement('div');
        fila.classList.add('producto-carrito-item');
        fila.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}" class="producto-carrito-img">
            <div class="producto-carrito-info">
                <h3>${item.nombre}</h3>
                <p class="producto-categoria">Precio: C$ ${item.precio}.00</p>
                <span class="producto-precio">Subtotal: C$ ${subtotalIndividual}.00</span>
            </div>
            <div class="producto-carrito-quantity" style="display: flex; align-items: center; background: #f1f1f1; border-radius: 20px; padding: 2px;">
                <button class="btn-cantidad" onclick="cambiarCantidadArreglo(${posicion}, -1)" style="background:none; border:none; width:30px; height:30px; font-weight:bold; cursor:pointer;">-</button>
                <input type="number" value="${item.cantidad}" style="width:30px; text-align:center; border:none; background:none; font-weight:bold;" readonly>
                <button class="btn-cantidad" onclick="cambiarCantidadArreglo(${posicion}, 1)" style="background:none; border:none; width:30px; height:30px; font-weight:bold; cursor:pointer;">+</button>
            </div>
            <button class="btn-eliminar" onclick="eliminarDelArreglo(${posicion})" style="background:#ffeded; border:none; color:#e74c3c; width:35px; height:35px; border-radius:50%; cursor:pointer; font-size:1.2rem; margin-left:15px;">&times;</button>
        `;
        contenedorProductos.appendChild(fila);
    });

    // Colocamos la suma de todo en el precio final
    if (txtTotal) {
        txtTotal.innerText = `C$ ${cuentaTotal}.00`;
    }
}

window.cambiarCantidadArreglo = function(posicion, cambio) {
    carrito[posicion].cantidad += cambio;
    
    // Si la cantidad llega a menos de 1, se borra del arreglo automáticamente
    if (carrito[posicion].cantidad < 1) {
        eliminarDelArreglo(posicion);
        return;
    }
    
    actualizarMemoriaYPantalla();
};

window.eliminarDelArreglo = function(posicion) {
    carrito.splice(posicion, 1); // El método .splice quita el elemento del arreglo permanentemente
    actualizarMemoriaYPantalla();
};

// Función para ahorrar código: guarda en el navegador y vuelve a pintar la pantalla
function actualizarMemoriaYPantalla() {
    localStorage.setItem('carrito-cafe', JSON.stringify(carrito));
    dibujarCarritoEnPantalla();
}

// Simular el botón final de proceder al pago
const btnPago = document.querySelector('.btn-proceder-pago');
if (btnPago) {
    btnPago.addEventListener('click', () => {
        alert("¡Compra simulada con éxito en Casa Elohim!");
        carrito = []; // Vaciamos el arreglo por completo
        localStorage.removeItem('carrito-cafe'); // Limpiamos la memoria
       window.location.href = 'http://localhost:3000/inicio_pagina'; 
    });
}






function dibujarCarritoEnPantalla() {
    const contenedorProductos = document.querySelector('.carrito-productos');
    const txtProductosSeleccionados = document.getElementById('total-pago');
    const txtTotalFinal = document.getElementById('total-neto-final'); // El nuevo ID de abajo
    
    if (!contenedorProductos) return;
    
    contenedorProductos.innerHTML = ''; // Limpiamos el contenedor para actualizar de cero

    // Si el arreglo está vacío
    if (carrito.length === 0) {
        contenedorProductos.innerHTML = `<p style="color: #4a2c11; font-weight: bold; padding: 20px; text-align: center;">Tu carrito está vacío, bro. ¡Explora nuestros productos!</p>`;
        if (txtProductosSeleccionados) txtProductosSeleccionados.innerText = 'C$ 0.00';
        if (txtTotalFinal) txtTotalFinal.innerText = 'C$ 0.00';
        return;
    }

    let cuentaTotal = 0;

    // Recorremos el arreglo para pintar cada producto
    carrito.forEach((item, posicion) => {
        const subtotalIndividual = item.precio * item.cantidad;
        cuentaTotal += subtotalIndividual;

        const fila = document.createElement('div');
        fila.classList.add('producto-carrito-item');
        fila.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}" class="producto-carrito-img">
            <div class="producto-carrito-info">
                <h3>${item.nombre}</h3>
                <p class="producto-categoria">Precio: C$ ${item.precio}.00</p>
                <span class="producto-precio">Subtotal: C$ ${subtotalIndividual}.00</span>
            </div>
            <div class="producto-carrito-quantity" style="display: flex; align-items: center; background: #f1f1f1; border-radius: 20px; padding: 2px;">
                <button class="btn-cantidad" onclick="cambiarCantidadArreglo(${posicion}, -1)" style="background:none; border:none; width:30px; height:30px; font-weight:bold; cursor:pointer;">-</button>
                <input type="number" value="${item.cantidad}" style="width:30px; text-align:center; border:none; background:none; font-weight:bold;" readonly>
                <button class="btn-cantidad" onclick="cambiarCantidadArreglo(${posicion}, 1)" style="background:none; border:none; width:30px; height:30px; font-weight:bold; cursor:pointer;">+</button>
            </div>
            <button class="btn-eliminar" onclick="eliminarDelArreglo(${posicion})" style="background:#ffeded; border:none; color:#e74c3c; width:35px; height:35px; border-radius:50%; cursor:pointer; font-size:1.2rem; margin-left:15px;">&times;</button>
        `;
        contenedorProductos.appendChild(fila);
    });

    if (txtProductosSeleccionados) {
        txtProductosSeleccionados.innerText = `C$ ${cuentaTotal}.00`;
    }
    if (txtTotalFinal) {
        txtTotalFinal.innerText = `C$ ${cuentaTotal}.00`; // Ahora el total grande sí va a cambiar en vivo
    }
}