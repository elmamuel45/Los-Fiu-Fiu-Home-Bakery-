// Base de datos de Productos (Basado en Los Fiu Fiu Home Bakery)
const products = [
  {
    id: 1,
    name: "Carlota de Café 9 oz",
    category: "tres-leches",
    price: 230,
    description: "Capas suaves y cremosas con delicioso sabor a café, acompañadas de galletas de vainilla. ¡El antojo perfecto para los amantes del café!",
    image: "imagenes/Vaso Gourmet Tres Leches.jpg",
    badge: "Más Vendido 🔥"
  },
  {
    id: 2,
    name: "Brownie con Crema 9 oz",
    category: "carlotas",
    price: 180,
    description: "Trocitos de brownie de chocolate mezclados con suave crema sabor vainilla y crujientes pedacitos de Oreo. ¡La combinación perfecta para satisfacer tu antojo dulce! ",
    image: "imagenes/Copa Cookies & Cream.jpg",
    badge: "Especialidad 🍪"
  },
  {
    id: 3,
    name: "Flan de Coco",
    category: "carlotas",
    price: 280,
    description: "Delicioso flan de coco natural, suave y cremoso, con un irresistible toque de dulce de leche. ¡Un capricho dulce que se disfruta hasta el último bocado!",
    image: "imagenes/Flan de Coco & Dulce de Leche.jpg",
    badge: "Favorito 🌟"
  },
  {
    id: 4,
    name: "Bizcocho de Chocolate con Dulce de Leche",
    category: "carlotas",
    price: 280,
    description: "Bizcocho de puro cacao (chocolate), relleno de dulce de leche y cubierto con trocitos de Oreo. ¡Puro placer en cada bocado!",
    image: "imagenes/Slice Fudge & Caramel.jpg"
  },
  {
    id: 5,
    name: "Tres Leches de Coco",
    category: "carlotas",
    price: 380,
    description: "Bizcocho bañado en una irresistible mezcla de tres leches, crema de coco y leche de coco, coronado con una suave cobertura cremosa. ¡Un bocado de puro placer tropical!",
    image: "imagenes/1. Tres Leches Tradicional XL.jpg"
  },
  {
    id: 6,
    name: "Choco flan",
    category: "combos",
    price: 280,
    description: "La combinación perfecta que enamora: una base de suave y húmedo bizcocho de chocolate intenso coronado con un sedeciente y cremoso flan de vainilla casero",
    image: "imagenes/chocoflam.png",
    badge: "Ahorra 🎁"
  },
  {
    id: 7,
    name: "Carlota de Chinola",
    category: "tres-leches",
    price: 280,
    description: "Deliciosa crema de chinola con capas de galletas de vainilla. ¡Cremosa, dulce y llena de sabor tropical!",
    image: "imagenes/Carlota de Chinola.jpeg",
    badge: "Especialidad 🍊"
  },
  {
    id: 7,
    name: "Cheesecake de Chinola",
    category: "combos",
    price: 380,
    description: "Cremoso cheesecake de queso crema y crema de leche, elaborado con chinola para un toque tropical irresistible",
    image: "imagenes/Cheesecake de Chinola.jpeg",
    badge: "Ahorra 🎁"
  }
];

// Estado del Carrito
let cart = [];

// Configuración de WhatsApp
const WHATSAPP_NUMBER = "8292847313"; // Sustituye por el número telefónico real con código de país

// Elementos del DOM
const productsGrid = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const filterButtons = document.querySelectorAll('.btn-filter');
const cartBadge = document.getElementById('cartBadge');
const cartItemsContainer = document.getElementById('cartItemsContainer');
const cartTotal = document.getElementById('cartTotal');
const btnSendWhatsapp = document.getElementById('btnSendWhatsapp');
const deliveryTypeSelect = document.getElementById('deliveryType');
const addressGroup = document.getElementById('addressGroup');

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  renderProducts(products);
  setupEvents();
});

// Renderizar Productos
function renderProducts(items) {
  productsGrid.innerHTML = '';
  
  if (items.length === 0) {
    productsGrid.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="fs-5 text-muted">No encontramos postres que coincidan con tu búsqueda 🥣</p>
      </div>`;
    return;
  }

  items.forEach(product => {
    const col = document.createElement('div');
    col.className = 'col-md-6 col-lg-4';
    col.innerHTML = `
      <div class="card product-card h-100 shadow-sm">
        <div class="product-card-img-wrapper">
          <img src="${product.image}" alt="${product.name}" loading="lazy">
          ${product.badge ? `<span class="badge bg-danger position-absolute top-0 start-0 m-3 px-3 py-2 rounded-pill">${product.badge}</span>` : ''}
          <div class="product-price-tag">RD$ ${product.price.toFixed(2)}</div>
        </div>
        <div class="card-body d-flex flex-column justify-content-between p-4">
          <div>
            <h5 class="fw-bold mb-2">${product.name}</h5>
            <p class="text-muted small mb-3">${product.description}</p>
          </div>
          <button onclick="addToCart(${product.id})" class="btn btn-pink rounded-pill w-100 py-2">
            <i class="fa-solid fa-plus me-1"></i> Agregar al Pedido
          </button>
        </div>
      </div>
    `;
    productsGrid.appendChild(col);
  });
}

// Agregar al Carrito
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  updateCartUI();
  showToast();
}

// Modificar Cantidades
function changeQuantity(productId, delta) {
  const item = cart.find(p => p.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(p => p.id !== productId);
  }
  updateCartUI();
}

// Actualizar Interfaz del Carrito
function updateCartUI() {
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Badge
  if (totalItems > 0) {
    cartBadge.textContent = totalItems;
    cartBadge.classList.remove('d-none');
  } else {
    cartBadge.classList.add('d-none');
  }

  // Items Modal
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = `
      <div class="text-center py-4">
        <div class="fs-1 text-muted mb-2">🛒</div>
        <p class="text-muted mb-0">Tu carrito está vacío. ¡Agrega tus antojos favoritos!</p>
      </div>`;
    btnSendWhatsapp.disabled = true;
  } else {
    btnSendWhatsapp.disabled = false;
    cartItemsContainer.innerHTML = cart.map(item => `
      <div class="cart-item-row">
        <div class="d-flex align-items-center gap-3">
          <img src="${item.image}" alt="${item.name}" class="cart-item-img">
          <div>
            <strong class="d-block">${item.name}</strong>
            <small class="text-muted">RD$ ${item.price.toFixed(2)} c/u</small>
          </div>
        </div>
        <div class="d-flex align-items-center gap-3">
          <div class="qty-control">
            <button class="qty-btn" onclick="changeQuantity(${item.id}, -1)">-</button>
            <span class="fw-bold px-1">${item.quantity}</span>
            <button class="qty-btn" onclick="changeQuantity(${item.id}, 1)">+</button>
          </div>
          <span class="fw-bold">RD$ ${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      </div>
    `).join('');
  }

  cartTotal.textContent = `RD$ ${totalPrice.toFixed(2)}`;
}

// Mostrar Notificación Toast
function showToast() {
  const toastEl = document.getElementById('addToCartToast');
  const toast = new bootstrap.Toast(toastEl, { delay: 2000 });
  toast.show();
}

// Configuración de Eventos de la Interfaz
function setupEvents() {
  // Búsqueda
  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = products.filter(p => 
      p.name.toLowerCase().includes(term) || 
      p.description.toLowerCase().includes(term)
    );
    renderProducts(filtered);
  });

  // Filtro por Categorías
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filter = btn.dataset.filter;
      if (filter === 'all') {
        renderProducts(products);
      } else {
        const filtered = products.filter(p => p.category === filter);
        renderProducts(filtered);
      }
    });
  });

  // Alternar campo de dirección según el tipo de entrega
  deliveryTypeSelect.addEventListener('change', (e) => {
    if (e.target.value === 'pickup') {
      addressGroup.style.display = 'none';
    } else {
      addressGroup.style.display = 'block';
    }
  });

  // Formatear y Enviar Orden a WhatsApp
  btnSendWhatsapp.addEventListener('click', () => {
    const name = document.getElementById('custName').value.trim();
    const phone = document.getElementById('custPhone').value.trim();
    const delivery = deliveryTypeSelect.value;
    const address = document.getElementById('custAddress').value.trim();
    const notes = document.getElementById('custNotes').value.trim();

    if (!name || !phone) {
      alert('Por favor completa tu nombre y número de contacto.');
      return;
    }

    if (delivery === 'delivery' && !address) {
      alert('Por favor ingresa la dirección de entrega.');
      return;
    }

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    // Construcción del mensaje con formato Markdown para WhatsApp
    let message = `*¡HOLA LOS FIU FIU! QUIERO HACER UN PEDIDO* 🍰✨\n\n`;
    message += `👤 *Cliente:* ${name}\n`;
    message += `📞 *Teléfono:* ${phone}\n`;
    message += `🛵 *Tipo de Entrega:* ${delivery === 'delivery' ? 'Envío a Domicilio' : 'Retiro en Tienda (Pick Up)'}\n`;
    if (delivery === 'delivery') {
      message += `📍 *Dirección:* ${address}\n`;
    }
    if (notes) {
      message += `📝 *Notas:* ${notes}\n`;
    }
    
    message += `\n--- *DETALLE DEL PEDIDO* ---\n`;
    cart.forEach(item => {
      message += `• ${item.quantity}x ${item.name} - RD$ ${(item.price * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\n💰 *TOTAL A PAGAR:* RD$ ${totalPrice.toFixed(2)}\n\n`;
    message += `¡Quedo a la espera de la confirmación y datos para el pago! 🙏`;

    // Codificación para URL y apertura de WhatsApp
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  });
}