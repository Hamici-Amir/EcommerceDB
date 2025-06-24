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
    
    // Mot de passe admin (en production, ceci devrait être sécurisé côté serveur)
    const ADMIN_PASSWORD = "admin123";
    
    // Produits pour téléphones et accessoires avec URLs d'images en ligne
    let products = [
        // Téléphones
        {
            id: 1,
            title: "Samsung Galaxy A54 5G",
            price: 45000,
            image: "https://images.samsung.com/is/image/samsung/p6pim/ae_ar/sm-a546elgdmea/gallery/ae-ar-galaxy-a54-5g-sm-a546-sm-a546elgdmea-thumb-535790255?$480_480_PNG$",
            category: "telephones",
            brand: "samsung",
            description_fr: "Smartphone Samsung avec écran Super AMOLED 6.4 pouces et caméra 50MP.",
            description_ar: "هاتف ذكي من سامسونغ بشاشة Super AMOLED 6.4 بوصة وكاميرا 50 ميجابكسل."
        },
        {
            id: 2,
            title: "POCO X5 Pro 5G",
            price: 38000,
            image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj5RftcOj7TttFDyzhtnXWLMJsj8UeEC4TXHQlGxWObcpIP33Zs6xg_w-THDX58IT45mfH86l_zNH2rL3B21bbMz5pr3P4JnSJd-9TGJ_3B-aFc64dpEsCYD5jw5kFVUNvvgaX8iJFxaJG8MuRwQnaN_VMhDQy3eMK4muMkQDoqkpS27g8INPz-U1-2/s1920/x5%20pro%205g0000.png",
            category: "telephones",
            brand: "poco",
            description_fr: "Smartphone gaming avec processeur Snapdragon 778G et écran 120Hz.",
            description_ar: "هاتف ذكي للألعاب بمعالج Snapdragon 778G وشاشة 120Hz."
        },
        {
            id: 3,
            title: "Redmi Note 12 Pro",
            price: 32000,
            image: "https://iphoneprixalgerie.com/img/product/13/main.jpg",
            category: "telephones",
            brand: "redmi",
            description_fr: "Smartphone avec caméra 108MP et charge rapide 67W.",
            description_ar: "هاتف ذكي بكاميرا 108 ميجابكسل وشحن سريع 67 واط."
        },
        {
            id: 4,
            title: "OPPO Reno 8T",
            price: 42000,
            image: "https://www.greentelcom.ph/wp-content/uploads/2023/11/phone-template-13.png",
            category: "telephones",
            brand: "oppo",
            description_fr: "Design élégant avec caméra portrait 2MP et écran AMOLED.",
            description_ar: "تصميم أنيق بكاميرا بورتريه 2 ميجابكسل وشاشة AMOLED."
        },
        {
            id: 5,
            title: "Vivo Y36",
            price: 28000,
            image: "https://www.almumtaz.com.pk/wp-content/uploads/2024/03/Vivo-Y36-256GB-Built-in-8GB-RAM-5.webp",
            category: "telephones",
            brand: "vivo",
            description_fr: "Smartphone avec batterie 5000mAh et design moderne.",
            description_ar: "هاتف ذكي ببطارية 5000 مللي أمبير وتصميم عصري."
        },
        {
            id: 6,
            title: "Honor X9a",
            price: 39000,
            image: "https://majidmobileshop.com/wp-content/uploads/2023/05/HONOR-X9a.webp",
            category: "telephones",
            brand: "honor",
            description_fr: "Écran incurvé 6.67 pouces avec caméra 64MP.",
            description_ar: "شاشة منحنية 6.67 بوصة مع كاميرا 64 ميجابكسل."
        },
        {
            id: 7,
            title: "Realme 11 Pro",
            price: 35000,
            image: "https://brothers-phone.com/wp-content/uploads/2024/11/Images-site-8.png",
            category: "telephones",
            brand: "realme",
            description_fr: "Performance élevée avec MediaTek Dimensity 7050.",
            description_ar: "أداء عالي مع MediaTek Dimensity 7050."
        },
        {
            id: 8,
            title: "Infinix Note 30 VIP",
            price: 30000,
            image: "https://global.pro.infinixmobility.com/media/wysiwyg/X6710_NOTE_30_VIP_Racing_Edition_base4_family_series.png",
            category: "telephones",
            brand: "infinix",
            description_fr: "Charge sans fil 68W et écran AMOLED 120Hz.",
            description_ar: "شحن لاسلكي 68 واط وشاشة AMOLED 120Hz."
        },
        
        // Accessoires
        {
            id: 9,
            title: "Écouteurs sans fil HOCO EQ1",
            price: 3500,
            image: "https://www.hoco-algerie.com/wp-content/uploads/2024/01/Hd5151e24c4ba4b4ca950f594b7b4efeca.webp",
            category: "accessoires",
            brand: "generic",
            description_fr: "Écouteurs sans fil avec réduction de bruit active.",
            description_ar: "سماعات لاسلكية مع إلغاء الضوضاء النشط."
        },
        {
            id: 10,
            title: "Chargeur USB-C 65W - Samsung - Amento - Charge rapide - Adaptateur Trio - Noir - Cdiscount Téléphonie",
            price: 2800,
            image: "https://www.cdiscount.com/pdt2/2/2/3/1/700x700/rnc1703296514223/rw/samsung-65w-amento-super-fast-chargeur-usb-c-pour.jpg",
            category: "accessoires",
            brand: "generic",
            description_fr: "Chargeur USB-C compatible avec la plupart des smartphones.",
            description_ar: "شاحن USB-C متوافق مع معظم الهواتف الذكية."
        },
        {
            id: 11,
            title: "3x Protection écran 9H + 1x Coque iPhone Pro 15 transparente",
            price: 1200,
            image: "https://res.cloudinary.com/subtel/image/upload/h_700/q_auto:low,f_auto/b5jp23tlosxdetcmjfdz.jpg",
            category: "accessoires",
            brand: "generic",
            description_fr: "Protection anti-choc avec design transparent.",
            description_ar: "حماية ضد الصدمات بتصميم شفاف."
        },
        {
            id: 12,
            title: "Pack protection coque transparente+verre trempé pour Samsung Galaxy A14 4G/5G",
            price: 1800,
            image: "https://www.metronic.com/29999-large_default/pack-protection-coque-transparenteverre-trempe-pour-samsung-galaxy-a14-4g-5g.jpg",
            category: "accessoires",
            brand: "generic",
            description_fr: "Support magnétique 360° pour tableau de bord.",
            description_ar: "حامل مغناطيسي 360 درجة للوحة القيادة."
        },
        {
            id: 13,
            title: "Powerbank 20000mAh HOCO J87A Noir",
            price: 4200,
            image: "https://dz.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/28/7245/1.jpg?7747",
            category: "accessoires",
            brand: "generic",
            description_fr: "Batterie externe avec charge rapide et affichage LED.",
            description_ar: "بطارية خارجية مع شحن سريع وشاشة LED."
        },
        {
            id: 14,
            title: "Câble USB-C Hoco X50",
            price: 800,
            image: "https://hozsklad.ua/images/products/MIA-6931474734235_2.jpg",
            category: "accessoires",
            brand: "generic",
            description_fr: "Câble renforcé 2 mètres avec connecteurs dorés.",
            description_ar: "كابل معزز 2 متر مع موصلات ذهبية."
        },
        {
            id: 15,
            title: "Verre Trempé 9H",
            price: 600,
            image: "https://www.piecetelephone.fr/4550-large_default/verre-trempe-9h-pour-iphone-44s.jpg",
            category: "accessoires",
            brand: "generic",
            description_fr: "Protection d'écran ultra-résistante avec installation facile.",
            description_ar: "حماية شاشة فائقة المقاومة مع تركيب سهل."
        }
    ];

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
            <img src="${product.image}" alt="${product.title}" class="admin-product-image">
            <h3 class="admin-product-title">${product.title}</h3>
            <p class="admin-product-price">${product.price.toLocaleString()} DA</p>
            <span class="admin-product-category">${product.category === 'telephones' ? 'Téléphone' : 'Accessoire'}</span>
            <div class="admin-product-actions">
                <button class="btn-edit" data-id="${product.id}">Modifier</button>
                <button class="btn-delete" data-id="${product.id}">Supprimer</button>
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
    const productId = parseInt(e.target.getAttribute('data-id'));
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
        products = products.filter(p => p.id !== productId);
        displayAdminProducts();
        displayProducts(); // Rafraîchir aussi l'affichage principal
        showNotification('Produit supprimé avec succès', 'success');
    }
}

// Fonction pour modifier un produit
function editProduct(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
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
        productGrid.innerHTML = "";
        productsToShow.forEach(product => {
            const productElement = document.createElement("div");
            productElement.classList.add("product-card");
            productElement.setAttribute("data-category", product.category);
            productElement.setAttribute("data-brand", product.brand);
            
            productElement.innerHTML = `
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-price">${product.price.toLocaleString()} DA</p>
                    <button class="add-to-cart" data-id="${product.id}">Ajouter au panier</button>
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
        const productId = parseInt(e.target.getAttribute("data-id"));
        const product = products.find(p => p.id === productId);
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
                <img src="${item.image}" alt="${item.title}" class="cart-item-img" loading="lazy">
                <div class="cart-item-details">
                    <h4 class="cart-item-title">${item.title}</h4>
                    <p class="cart-item-price">${item.price.toLocaleString()} DA</p>
                    <div class="cart-item-actions">
                        <button class="cart-item-remove" data-id="${item.id}" title="Supprimer du panier">
                            <i class="fas fa-trash"></i> Supprimer
                        </button>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-id="${item.id}" title="Diminuer la quantité">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus" data-id="${item.id}" title="Augmenter la quantité">+</button>
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
        const productId = parseInt(e.target.getAttribute("data-id"));
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
        const productId = parseInt(e.target.getAttribute("data-id"));
        const item = cart.find(item => item.id === productId);
        item.quantity += 1;
        updateCart();
    }
    
    // Supprimer un article avec confirmation
    function removeItem(e) {
        const productId = parseInt(e.target.getAttribute("data-id"));
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
    
    // Initialiser
    initHeroSlideshow();
    initAdmin();
    initFilters();
    displayProducts();
    updateCart();
});

