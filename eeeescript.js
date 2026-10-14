/* =========================================
   1. DATOS DE PRODUCTOS
   Reemplazá "img" por la ruta de tus propias
   imágenes (por ejemplo "img/figura-1.jpg").
   Mientras tanto se muestra un color de fondo
   como placeholder.
   ========================================= */
const PRODUCTS = [
  { id: 1, name: "Figura Dragón Espiritual", category: "figuras", price: 32000, color: "#d62828" },
  { id: 2, name: "Figura Samurái Nocturno", category: "figuras", price: 28500, color: "#14120f" },
  { id: 3, name: "Póster Cerezos en Batalla", category: "posters", price: 6500, color: "#f4a100" },
  { id: 4, name: "Póster Ciudad Neón", category: "posters", price: 7200, color: "#6b6a63" },
  { id: 5, name: "Remera Kanji Rojo", category: "ropa", price: 18900, color: "#d62828" },
  { id: 6, name: "Buzo Oni Bordado", category: "ropa", price: 27500, color: "#14120f" },
  { id: 7, name: "Llavero Katana Mini", category: "accesorios", price: 4200, color: "#f4a100" },
  { id: 8, name: "Taza Máscara Kitsune", category: "accesorios", price: 8900, color: "#6b6a63" },
  { id: 9, name: "Mochila Tokyo Ronin", category: "accesorios", price: 34000, color: "#d62828" },
];

/* =========================================
   2. RENDERIZADO DE LA GRILLA
   ========================================= */
const grid = document.getElementById("productGrid");

function renderProducts(filter = "todos") {
  const list = filter === "todos"
    ? PRODUCTS
    : PRODUCTS.filter(p => p.category === filter);

  grid.innerHTML = list.map(p => `
    <article class="card">
      <div class="card__img" style="background-color:${p.color}">
        <span>Imagen del producto</span>
      </div>
      <div class="card__body">
        <p class="card__category">${p.category}</p>
        <h3 class="card__name">${p.name}</h3>
        <p class="card__price">$${p.price.toLocaleString("es-AR")}</p>
        <button class="card__add" data-id="${p.id}">Agregar</button>
      </div>
    </article>
  `).join("");
}

renderProducts();

/* =========================================
   3. FILTROS DE CATEGORÍA
   ========================================= */
const chips = document.querySelectorAll(".chip");

chips.forEach(chip => {
  chip.addEventListener("click", () => {
    chips.forEach(c => c.classList.remove("is-active"));
    chip.classList.add("is-active");
    renderProducts(chip.dataset.filter);
  });
});

/* =========================================
   4. CARRITO
   ========================================= */
let cart = JSON.parse(localStorage.getItem("cart")) || [];

const cartCount = document.getElementById("cartCount");
const cartList = document.getElementById("cartList");
const cartTotal = document.getElementById("cartTotal");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  cartCount.textContent = cart.length;

  cartList.innerHTML = cart.map((item, index) => `
    <li>
      <span>${item.name}</span>
      <span>$${item.price.toLocaleString("es-AR")}
        <button data-index="${index}" class="cart-remove" aria-label="Quitar">✕</button>
      </span>
    </li>
  `).join("");

  const total = cart.reduce((sum, item) => sum + item.price, 0);
  cartTotal.textContent = `$${total.toLocaleString("es-AR")}`;
}

function addToCart(name, price) {
  cart.push({ name, price });
  saveCart();
  renderCart();
}

// Agregar producto destacado
document.querySelector(".add-to-cart").addEventListener("click", (e) => {
  const btn = e.currentTarget;
  addToCart(btn.dataset.name, Number(btn.dataset.price));
});

// Agregar productos de la grilla (delegación de eventos, porque las
// tarjetas se generan dinámicamente)
grid.addEventListener("click", (e) => {
  if (!e.target.classList.contains("card__add")) return;
  const product = PRODUCTS.find(p => p.id === Number(e.target.dataset.id));
  addToCart(product.name, product.price);
});

// Quitar un producto del carrito
cartList.addEventListener("click", (e) => {
  if (!e.target.classList.contains("cart-remove")) return;
  cart.splice(Number(e.target.dataset.index), 1);
  saveCart();
  renderCart();
});

/* =========================================
   5. ABRIR / CERRAR PANEL DE CARRITO
   ========================================= */
function openCart() {
  cartPanel.classList.add("is-open");
  overlay.classList.add("is-open");
}
function closeCart() {
  cartPanel.classList.remove("is-open");
  overlay.classList.remove("is-open");
}

document.getElementById("cartBtn").addEventListener("click", openCart);
document.getElementById("cartClose").addEventListener("click", closeCart);
overlay.addEventListener("click", closeCart);

renderCart();
