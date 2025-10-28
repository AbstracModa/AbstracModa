document.addEventListener('DOMContentLoaded', function() {
   const dropdown = document.querySelector('.dropdown');

const dropdownLink = dropdown.querySelector('a');
const dropdownContent = document.querySelector('.dropdown-menu'); 

dropdownLink.addEventListener('click', function(e) {
    e.preventDefault(); 
    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
});

window.addEventListener('click', function(e) {
    if (!dropdown.contains(e.target)) {
         dropdownContent.style.display = 'none';
    }
});
    const modal = document.getElementById('auth-modal');
    const loginToggle = document.getElementById('login-toggle');
    const closeBtn = document.querySelector('.close-btn');
    const registroForm = document.getElementById('registro-form');
    const loginForm = document.getElementById('login-form');
    const logoutBtn = document.getElementById('logout-btn');
    
    const loginView = document.getElementById('login-view');
    const registerView = document.getElementById('register-view');
    const showRegisterLink = document.getElementById('show-register');
    const showLoginLink = document.getElementById('show-login');
    
    const registroMsg = document.getElementById('registro-msg');
    const loginMsg = document.getElementById('login-msg');
    const authLink = document.getElementById('auth-link');
    const welcomeMessage = document.getElementById('welcome-message');
    const userEmailDisplay = document.getElementById('user-email-display');
    const logoutLink = document.getElementById('logout-link');

    const getUsuarios = () => {
        const usuariosJSON = localStorage.getItem('usuarios');
        return usuariosJSON ? JSON.parse(usuariosJSON) : [];
    };

    const updateUI = () => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {

            authLink.style.display = 'none';
            welcomeMessage.style.display = 'block';
            logoutLink.style.display = 'block';
            userEmailDisplay.textContent = JSON.parse(loggedInUser).email;
        } else {

            authLink.style.display = 'block';
            welcomeMessage.style.display = 'none';
            logoutLink.style.display = 'none';
        }
    };

    loginToggle.addEventListener('click', (e) => {
        e.preventDefault();
        modal.style.display = 'block';
        loginView.style.display = 'block';
        registerView.style.display = 'none';
        loginMsg.textContent = ''; 
        registroMsg.textContent = '';
        loginForm.reset();
        registroForm.reset();
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginView.style.display = 'none';
        registerView.style.display = 'block';
        loginMsg.textContent = '';
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginView.style.display = 'block';
        registerView.style.display = 'none';
        registroMsg.textContent = '';
    });

    registroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        let usuarios = getUsuarios();

        if (usuarios.some(u => u.email === email)) {
            registroMsg.textContent = '❌ Este correo ya está registrado.';
            registroMsg.style.color = 'red';
            return;
        }

        const nuevoUsuario = { email: email, password: password };
        usuarios.push(nuevoUsuario);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));

        registroMsg.textContent = '✅ ¡Registro exitoso! Ahora inicia sesión.';
        registroMsg.style.color = 'green';
        registroForm.reset(); 
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('log-email').value;
        const password = document.getElementById('log-password').value;
        const usuarios = getUsuarios();

        const usuarioEncontrado = usuarios.find(u => u.email === email && u.password === password);

        if (usuarioEncontrado) {
            loginMsg.textContent = '✅ Inicio de sesión exitoso.';
            loginMsg.style.color = 'green';
            localStorage.setItem('loggedInUser', JSON.stringify(usuarioEncontrado)); 
            
            setTimeout(() => {
                modal.style.display = 'none';
                updateUI();
            }, 500);
        } else {
            loginMsg.textContent = '❌ Credenciales incorrectas o usuario no encontrado.';
            loginMsg.style.color = 'red';
        }
    });

    logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.removeItem('loggedInUser'); 
        updateUI();
    });
    updateUI();
});

const cartEmptyView = document.getElementById('cart-empty-view');
const cartFilledView = document.getElementById('cart-filled-view');
const cartItemsList = document.getElementById('cart-items-list');
const subtotalDisplay = document.getElementById('subtotal-display');
const totalDisplay = document.getElementById('total-display');
const checkoutBtn = document.getElementById('checkout-btn');

const mockProducts = [
    { id: 1, name: 'Camisa Clásica Negra', price: 45.99, image: 'camisa-negra.jpg' },
    { id: 2, name: 'Pantalón Denim Ajustado', price: 79.50, image: 'pantalon-denim.jpg' }
];

function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUI() {
    const cart = getCart();
    let subtotal = 0;

    cartItemsList.innerHTML = '';

    if (cart.length === 0) {
        if (cartEmptyView) cartEmptyView.style.display = 'block';
        if (cartFilledView) cartFilledView.style.display = 'none';
        
    } else {
        if (cartEmptyView) cartEmptyView.style.display = 'none';
        if (cartFilledView) cartFilledView.style.display = 'block';

        cart.forEach(item => {
            const product = mockProducts.find(p => p.id === item.id);
            if (product) {
                const itemTotal = product.price * item.quantity;
                subtotal += itemTotal;

                const itemHTML = `
                    <div class="cart-item">
                        <img src="${product.image}" alt="${product.name}" class="cart-item-image">
                        <div class="cart-item-info">
                            <h4>${product.name}</h4>
                            <p>Cantidad: ${item.quantity} | Precio: ${itemTotal.toFixed(2)} €</p>
                        </div>
                        </div>
                `;
                cartItemsList.insertAdjacentHTML('beforeend', itemHTML);
            }
        });
    }

    if (subtotalDisplay) subtotalDisplay.textContent = `${subtotal.toFixed(2)} €`;
    if (totalDisplay) totalDisplay.textContent = `${subtotal.toFixed(2)} €`; 
}

window.addProductToCart = function(productId) {
    const cart = getCart();
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id: productId, quantity: 1 });
    }

    saveCart(cart);
    alert('✅ Producto añadido a la cesta!');
};

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function() {
        if (getCart().length > 0) {
            window.location.href = 'checkout.html';
        }
    });
}

if (document.body.classList.contains('cesta-page')) { 
    updateCartUI();
}

if (window.location.pathname.includes('cesta.html')) {
    document.body.classList.add('cesta-page');
}
updateCartUI();