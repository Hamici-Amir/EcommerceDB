document.addEventListener("DOMContentLoaded", function() {
    // Variables
    const cartIcon = document.getElementById("cart-icon");
    const cartOverlay = document.getElementById("cart-overlay");
    const closeCart = document.getElementById("close-cart");
    const cartContent = document.getElementById("cart-content");
    const cartTotal = document.getElementById("cart-total");
    const cartCount = document.querySelector(".cart-count");
    const checkoutBtn = document.getElementById("checkout-btn");
    const checkoutOverlay = document.getElementById("checkout-overlay");
    const closeCheckout = document.getElementById("close-checkout");
    const productGrid = document.getElementById("product-grid");
    const orderItems = document.getElementById("order-items");
    const orderSubtotal = document.getElementById("order-subtotal");
    const orderShipping = document.getElementById("order-shipping");
    const orderTotal = document.getElementById("order-total");
    const checkoutForm = document.getElementById("checkout-form");
    
    // Variables admin
    const adminBtn = document.getElementById("admin-btn");
    const adminOverlay = document.getElementById("admin-overlay");
    const closeAdmin = document.getElementById("close-admin");
    const adminLogin = document.getElementById("admin-login");
    const adminPanel = document.getElementById("admin-panel");
    const adminLoginForm = document.getElementById("admin-login-form");
    const addProductForm = document.getElementById("add-product-form");
    const cancelAdd = document.getElementById("cancel-add");
    
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let nextProductId = 16; // ID pour les nouveaux produits
    let products = []; // Initialize as empty array - will be populated from API
    
    // Mot de passe admin (en production, ceci devrait être sécurisé côté serveur)
    const ADMIN_PASSWORD = "admin123";
    
    // Fetch products from API
    async function fetchProducts() {
        try {
            const response = await fetch('/api/products');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            products = data;
            console.log('Products loaded from API:', products.length);
            
            // Initialize the page after products are loaded
            displayProducts();
            updateCart();
        } catch (error) {
            console.error('Error fetching products:', error);
            showNotification('Erreur lors du chargement des produits', 'error');
            
            // Fallback: use empty array or show error message
            products = [];
            displayProducts();
        }
    }

    // Images pour le slideshow hero avec URLs en ligne
    const heroImages = [
        "/polygonal-3d-smartphone-gps-navigation-location-app-travelling-concept-phone-navigator-pin-dark-blue-background-smart-technology-digital-illustration.jpg",
       "/aug_4_01.jpg",
        "/SL-091319-23410-49.jpg",
        "/woman-using-her-smartphone-while-home.jpg",
    ];

    // Initialiser le slideshow hero
    function initHeroSlideshow() {
        const heroSlideshow = document.querySelector('.hero-slideshow');
        if (!heroSlideshow) return;

        heroImages.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.classList.add('hero-slide');
            slide.style.backgroundImage = `url(${image})`;
            if (index === 0) slide.classList.add('active');
            heroSlideshow.appendChild(slide);
        });

        // Auto-rotation des slides
        let currentSlide = 0;
        setInterval(() => {
            const slides = document.querySelectorAll('.hero-slide');
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 4000);
    }

    // Gestion de l'administration
    function initAdmin() {
        // Ouvrir le panneau admin
        adminBtn.addEventListener("click", () => {
            adminOverlay.classList.add("active");
            adminLogin.style.display = "block";
            adminPanel.style.display = "none";
             displayAdminProducts();
        });

        function displayAdminProducts() {
    const adminProductsGrid = document.getElementById('admin-products-grid');
    if (!adminProductsGrid) return;
    
    adminProductsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productElement = document.createElement('div');
        productElement.className = 'admin-product-card';
        productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="admin-product-image">
            <h3 class="admin-product-title">${product.name}</h3>
            <p class="admin-product-price">${product.price.toLocaleString()} DA</p>
            <span class="admin-product-category">${product.category === 'telephones' ? 'Téléphone' : 'Accessoire'}</span>
            <div class="admin-product-actions">
                <button class="btn-edit" data-id="${product._id}">Modifier</button>
                <button class="btn-delete" data-id="${product._id}">Supprimer</button>
            </div>
        `;
        adminProductsGrid.appendChild(productElement);
    });
    
    // Gestion des boutons de suppression
    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', deleteProduct);
    });
    
    // Gestion des boutons de modification
    document.querySelectorAll('.btn-edit').forEach(button => {
        button.addEventListener('click', editProduct);
    });
}

// Fonction pour supprimer un produit
function deleteProduct(e) {
    const productId = e.target.getAttribute('data-id');
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        products = products.filter(p => p.id !== productId);
        displayAdminProducts();
        displayProducts(); // Rafraîchir aussi l'affichage principal
        showNotification('Produit supprimé avec succès', 'success');
    }
}

// Fonction pour modifier un produit
function editProduct(e) {
    const productId = e.target.getAttribute('data-id');
    const product = products.find(p => p.id === productId);
    
    if (product) {
        // Remplir le formulaire avec les données du produit
        document.getElementById('product-title').value = product.title;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-image').value = product.image;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-brand').value = product.brand;
        document.getElementById('product-description').value = product.description_fr;
        document.getElementById('product-description-ar').value = product.description_ar;
        
        // Stocker l'ID du produit en cours de modification
        document.getElementById('add-product-form').dataset.editingId = productId;
        
        // Changer le texte du bouton
        document.querySelector('#add-product-form .btn-primary').textContent = 'Mettre à jour';
        
        // Scroll vers le formulaire
        document.getElementById('product-title').scrollIntoView({ behavior: 'smooth' });
    }
}

// Modifiez la fonction addNewProduct pour gérer aussi les modifications
function addNewProduct() {
    const editingId = document.getElementById('add-product-form').dataset.editingId;
    const productData = {
        id: editingId ? parseInt(editingId) : nextProductId++,
        title: document.getElementById('product-title').value.trim(),
        price: parseInt(document.getElementById('product-price').value),
        image: document.getElementById('product-image').value.trim(),
        category: document.getElementById('product-category').value,
        brand: document.getElementById('product-brand').value,
        description_fr: document.getElementById('product-description').value.trim(),
        description_ar: document.getElementById('product-description-ar').value.trim()
    };
    
    if (editingId) {
        // Mise à jour du produit existant
        const index = products.findIndex(p => p.id === parseInt(editingId));
        if (index !== -1) {
            products[index] = productData;
            showNotification('Produit mis à jour avec succès', 'success');
        }
    } else {
        // Ajout d'un nouveau produit
        products.push(productData);
        showNotification('Produit ajouté avec succès', 'success');
    }
    
    // Réinitialiser le formulaire
    document.getElementById('add-product-form').reset();
    delete document.getElementById('add-product-form').dataset.editingId;
    document.querySelector('#add-product-form .btn-primary').textContent = 'Ajouter le produit';
    
    // Rafraîchir les affichages
    displayAdminProducts();
    displayProducts();
}
        // Fermer le panneau admin
        closeAdmin.addEventListener("click", () => {
            adminOverlay.classList.remove("active");
            resetAdminForms();
        });

        // Fermer en cliquant à l'extérieur
        adminOverlay.addEventListener("click", (e) => {
            if (e.target === adminOverlay) {
                adminOverlay.classList.remove("active");
                resetAdminForms();
            }
        });

        // Connexion admin
        adminLoginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const password = document.getElementById("admin-password").value;
            
            if (password === ADMIN_PASSWORD) {
                adminLogin.style.display = "none";
                adminPanel.style.display = "block";
                document.getElementById("admin-password").value = "";
            } else {
                showNotification("Mot de passe incorrect", "error");
                document.getElementById("admin-password").value = "";
            }
        });

        // Ajout de produit
        addProductForm.addEventListener("submit", (e) => {
            e.preventDefault();
            addNewProduct();
        });

        // Annuler l'ajout
        cancelAdd.addEventListener("click", () => {
            adminOverlay.classList.remove("active");
            resetAdminForms();
        });
    }

    function resetAdminForms() {
        document.getElementById("admin-password").value = "";
        addProductForm.reset();
        adminLogin.style.display = "block";
        adminPanel.style.display = "none";
    }

    function addNewProduct() {
        const newProduct = {
            id: nextProductId++,
            title: document.getElementById("product-title").value.trim(),
            price: parseInt(document.getElementById("product-price").value),
            image: document.getElementById("product-image").value.trim(),
            category: document.getElementById("product-category").value,
            brand: document.getElementById("product-brand").value,
            description_fr: document.getElementById("product-description").value.trim(),
            description_ar: document.getElementById("product-description-ar").value.trim()        
        };

// ✅ Envoi vers NocoDB
fetch("https://app.nocodb.com/api/v2/tables/moglpcewom1mcvs/records", {
    method: "POST",
    headers: {
        "accept": "application/json",
        "xc-token": "wa1ZuJvRaByRkaRle72BEom2kkK2k8v-jonsAzyX",
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        fields: {
            title: newProduct.title,
            price: newProduct.price,
            image: newProduct.image,
            category: newProduct.category
        }
    })
})
.then(response => response.json())
.then(data => {
    console.log("✅ Produit enregistré dans NocoDB :", data);
})
.catch(error => {
    console.error("❌ Erreur d'enregistrement NocoDB :", error);
});




        // Ajouter le produit à la liste
        products.push(newProduct);
        
        // Rafraîchir l'affichage des produits
        displayProducts();
        
        // Fermer le panneau admin
        adminOverlay.classList.remove("active");
        resetAdminForms();
        
        // Notification de succès
        showNotification("Produit ajouté avec succès!", "success");
        
        // Scroll vers la section produits
        document.getElementById('produits').scrollIntoView({ behavior: 'smooth' });
    }

    // Filtrage des produits
    function filterProducts(category = 'all', brand = 'all') {
        let filteredProducts = products;
        
        if (category !== 'all') {
            filteredProducts = filteredProducts.filter(product => product.category === category);
        }
        
        if (brand !== 'all') {
            filteredProducts = filteredProducts.filter(product => product.brand === brand);
        }
        
        displayProducts(filteredProducts);
    }

    // Afficher les produits
    function displayProducts(productsToShow = products) {
        if (!productGrid) return;
        
        productGrid.innerHTML = "";
        
        // Show loading message if no products
        if (productsToShow.length === 0) {
            productGrid.innerHTML = '<div class="loading-message">Chargement des produits...</div>';
            return;
        }
        
        productsToShow.forEach(product => {
            const productElement = document.createElement("div");
            productElement.classList.add("product-card");
            productElement.setAttribute("data-category", product.category);
            productElement.setAttribute("data-brand", product.brand);

            productElement.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">${product.price.toLocaleString()} DA</p>
                    <button class="add-to-cart" data-id="${product._id}">Ajouter au panier</button>
                </div>
            `;
            productGrid.appendChild(productElement);
        });
        
        // Gestion des boutons "Ajouter au panier"
        document.querySelectorAll(".add-to-cart").forEach(button => {
            button.addEventListener("click", addToCart);
        });
    }

    // Gestion des filtres
    function initFilters() {
        // Filtres par catégorie
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.getAttribute('data-filter');
                filterProducts(filter);
            });
        });

        // Filtres par catégorie (boutons de catégorie)
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                filterProducts(filter);
                
                // Mettre à jour les filtres actifs
                filterBtns.forEach(b => b.classList.remove('active'));
                const correspondingFilter = document.querySelector(`[data-filter="${filter}"]`);
                if (correspondingFilter) correspondingFilter.classList.add('active');
                
                // Scroll vers la section produits
                document.getElementById('produits').scrollIntoView({ behavior: 'smooth' });
            });
        });

        // Filtres par marque
        const brandItems = document.querySelectorAll('.brand-item');
        brandItems.forEach(item => {
            item.addEventListener('click', () => {
                const brand = item.getAttribute('data-brand');
                filterProducts('all', brand);
                
                // Scroll vers la section produits
                document.getElementById('produits').scrollIntoView({ behavior: 'smooth' });
            });
        });
    }
    
    // Ajouter au panier
    function addToCart(e) {
        const productId = e.target.getAttribute("data-id");
        const product = products.find(p => p._id === productId);
        console.log('Adding', productId);
        if (!product) {
            showNotification("Produit non trouvé", "error");
            return;
        }
        
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                ...product,
                quantity: 1
            });
        }
        
        updateCart();
        showNotification("Produit ajouté au panier", "success");
        cartOverlay.classList.add("active");
    }
    
    // Afficher les notifications
    function showNotification(message, type = "success") {
        const notification = document.createElement("div");
        notification.textContent = message;
        
        const bgColor = type === "success" 
            ? "linear-gradient(135deg, #10b981, #059669)"
            : "linear-gradient(135deg, #ef4444, #dc2626)";
            
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 15px 25px;
            border-radius: 12px;
            z-index: 1000;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
            font-weight: 600;
            box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = "1";
            notification.style.transform = "translateX(0)";
        }, 10);
        
        setTimeout(() => {
            notification.style.opacity = "0";
            notification.style.transform = "translateX(100px)";
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Mettre à jour le panier
    function updateCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCartItems();
        updateCartTotal();
        updateCartCount();
    }
    
    // Afficher les articles du panier
    function renderCartItems() {
        cartContent.innerHTML = "";
        
        if (cart.length === 0) {
            cartContent.innerHTML = "<p class=\"empty-cart\">Votre panier est vide</p>";
            return;
        }
        
        cart.forEach(item => {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img" loading="lazy">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p class="cart-item-price">${item.price.toLocaleString()} DA</p>
                    <div class="cart-item-actions">
                        <button class="cart-item-remove" data-id="${item._id}" title="Supprimer du panier">
                            <i class="fas fa-trash"></i> Supprimer
                        </button>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-id="${item._id}" title="Diminuer la quantité">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus" data-id="${item._id}" title="Augmenter la quantité">+</button>
                        </div>
                    </div>
                </div>
            `;
            cartContent.appendChild(cartItem);
        });
        
        // Gestion des boutons de quantité et suppression
        document.querySelectorAll(".quantity-btn.minus").forEach(button => {
            button.addEventListener("click", decreaseQuantity);
        });
        
        document.querySelectorAll(".quantity-btn.plus").forEach(button => {
            button.addEventListener("click", increaseQuantity);
        });
        
        document.querySelectorAll(".cart-item-remove").forEach(button => {
            button.addEventListener("click", removeItem);
        });
    }
    
    // Diminuer la quantité
    function decreaseQuantity(e) {
        const productId = e.target.getAttribute("data-id");
        const item = cart.find(item => item.id === productId);
        
        if (item.quantity > 1) {
            item.quantity -= 1;
        } else {
            cart = cart.filter(item => item.id !== productId);
        }
        
        updateCart();
    }
    
    // Augmenter la quantité
    function increaseQuantity(e) {
        const productId = e.target.getAttribute("data-id");
        const item = cart.find(item => item._id === productId);
        item.quantity += 1;
        updateCart();
    }
    
    // Supprimer un article avec confirmation
    function removeItem(e) {
        const productId = e.target.getAttribute("data-id");
        const item = cart.find(item => item.id === productId);
        
        if (confirm(`Êtes-vous sûr de vouloir supprimer "${item.title}" du panier ?`)) {
            cart = cart.filter(item => item.id !== productId);
            updateCart();
            showNotification("Produit supprimé du panier", "error");
        }
    }
    
    // Mettre à jour le total du panier
    function updateCartTotal() {
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        cartTotal.textContent = total.toLocaleString() + " DA";
    }
    
    // Mettre à jour le compteur du panier
    function updateCartCount() {
        const count = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = count;
    }
    
    // Afficher le formulaire de commande
    function showCheckoutForm() {
        if (cart.length === 0) {
            showNotification("Votre panier est vide", "error");
            return;
        }
        
        renderOrderSummary();
        checkoutOverlay.classList.add("active");
    }
    
    // Afficher le récapitulatif de commande
    function renderOrderSummary() {
        orderItems.innerHTML = "";
        
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shipping = 500; // Frais de livraison fixes
        const total = subtotal + shipping;
        
        cart.forEach(item => {
            const orderItem = document.createElement("div");
            orderItem.classList.add("order-item");
            orderItem.innerHTML = `
                <span>${item.title} x ${item.quantity}</span>
                <span>${(item.price * item.quantity).toLocaleString()} DA</span>
            `;
            orderItems.appendChild(orderItem);
        });
        
        orderSubtotal.textContent = subtotal.toLocaleString() + " DA";
        orderShipping.textContent = shipping.toLocaleString() + " DA";
        orderTotal.textContent = total.toLocaleString() + " DA";
    }

    // Soumettre le formulaire de commande
    function submitOrder(e) {
        e.preventDefault();
        
        showNotification("Commande passée avec succès! Merci pour votre achat.", "success");
        
        // Vider le panier
        cart = [];
        updateCart();
        
        // Fermer les overlays
        cartOverlay.classList.remove("active");
        checkoutOverlay.classList.remove("active");
    }
    
    // Menu mobile
    const hamburger = document.querySelector(".hamburger");
    const navLinks = document.querySelector(".nav-links");
    
    if (hamburger && navLinks) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navLinks.classList.toggle("active");
        });
        
        // Fermer le menu mobile quand on clique sur un lien
        document.querySelectorAll(".nav-links a").forEach(link => {
            link.addEventListener("click", () => {
                hamburger.classList.remove("active");
                navLinks.classList.remove("active");
            });
        });
    }
    
    // Événements
    if (cartIcon) {
        cartIcon.addEventListener("click", () => {
            cartOverlay.classList.add("active");
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener("click", () => {
            cartOverlay.classList.remove("active");
        });
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", showCheckoutForm);
    }
    
    if (closeCheckout) {
        closeCheckout.addEventListener("click", () => {
            checkoutOverlay.classList.remove("active");
        });
    }
    
    if (checkoutForm) {
        checkoutForm.addEventListener("submit", submitOrder);
    }
    
    // Fermer les overlays quand on clique à l'extérieur
    if (cartOverlay) {
        cartOverlay.addEventListener("click", (e) => {
            if (e.target === cartOverlay) {
                cartOverlay.classList.remove("active");
            }
        });
    }
    
    if (checkoutOverlay) {
        checkoutOverlay.addEventListener("click", (e) => {
            if (e.target === checkoutOverlay) {
                checkoutOverlay.classList.remove("active");
            }
        });
    }
    
    // Smooth scrolling pour les liens de navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Initialiser - Fetch products first, then initialize other components
    initHeroSlideshow();
    initAdmin();
    initFilters();
    
    // Fetch products from API and initialize the page
    fetchProducts();
});