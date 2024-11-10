document.addEventListener('DOMContentLoaded', async () => {
    const apiUrl = 'https://v2.api.noroff.dev/rainy-days';
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        const products = data.data;

        // DISCOUNT
        const productContainer = document.getElementById('product-container');
        const feproduct = document.getElementById('femaleproduct');
        const menproduct = document.getElementById('maleproduct');
        const onSaleProducts = products.filter(product => product.onSale === true);

        onSaleProducts.forEach(product => {
            const productElement = `
                <div class="product">
                    <h2>${product.title}</h2>
                    <a href="Productpage.html" style="position: relative; display: inline-block;">
                        <img src="${product.image.url}" alt="${product.image.alt}">
                        <button onclick="addcart('${product.id}', '${product.image.url}', '${product.price}', '${product.title}')"
                                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;">
                        </button>
                    </a>                  
                    <p> $${product.price.toFixed(2)} <br><span style="text-decoration: line-through;">$${product.discountedPrice.toFixed(2)}</span> </p>
                    <button class="addtocart" onclick="addtoshoppingcart('${product.id}', '${product.image.url}', '${product.price}', '${product.title}')">ADD TO CART</button>
                </div>
            `;
            productContainer.innerHTML += productElement;
        });

        // FEMALE JACKETS
        const womanFilter = products.filter(product => product.gender === 'Female');

        womanFilter.forEach(product => {
            const femaleElement = `
                <div class="female">
                    <h2>${product.title}</h2>
                    <a href="Productpage.html" style="position: relative; display: inline-block;">
                        <img src="${product.image.url}" alt="${product.image.alt}">
                        <button onclick="addcart('${product.id}', '${product.image.url}', '${product.price}', '${product.title}')"
                                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;">
                        </button>
                    </a> 
                    <p> $${product.price.toFixed(2)} <br><span style="text-decoration: line-through;">
                    <button class="addtocart" onclick="addtoshoppingcart('${product.id}', '${product.image.url}', '${product.price}', '${product.title}')">ADD TO CART</button>
                </div>
            `;
            feproduct.innerHTML += femaleElement;
        });

        // MALE JACKETS
        const menFilter = products.filter(product => product.gender === 'Male');
        
        menFilter.forEach(product => {
            const maleElement = `
                <div class="male">
                    <h2>${product.title}</h2>
                    <a href="Productpage.html" style="position: relative; display: inline-block;">
                        <img src="${product.image.url}" alt="${product.image.alt}">
                        <button onclick="addcart('${product.id}', '${product.image.url}', '${product.price}', '${product.title}')"
                                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;">
                        </button>
                    </a> 
                    <p> $${product.price.toFixed(2)} <br><span style="text-decoration: line-through;">
                    <button class="addtocart" onclick="addtoshoppingcart('${product.id}', '${product.image.url}', '${product.price}', '${product.title}')">ADD TO CART</button>
                </div>
            `;
            menproduct.innerHTML += maleElement;
        });

    } catch (error) {
        console.error('Fetch problem:', error);
    }

    // Shopping cart page
    loadCart();
    updateCartIcon();
});

function addcart(id, imgUrl, price, title) {
    localStorage.setItem('selectedProduct', JSON.stringify({ id, imgUrl, price, title }));
    window.location.href = 'Productpage.html';
}

function addtoshoppingcart(id, imgUrl, price, title) {
    const product = { id, imgUrl, price: parseFloat(price), title, quantity: 1 };
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateTotalPrice();
    updateCartIcon();
    playNotificationSound();
}

function loadCart() {
    const cartContainer = document.getElementById('my-bag');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    cartContainer.innerHTML = '';

    cart.forEach((product, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';

        itemDiv.innerHTML = `
            <img src="${product.imgUrl}" alt="${product.title}" class="cart-img">
            <div class="cart-details">
                <h4>${product.title}</h4>
                <div class="cart-controls">
                    <span class="remove-icon" onclick="removeFromCart(${index})">
                        <i class="fa fa-trash"></i>
                    </span>
                    <input type="number" min="1" value="${product.quantity}" class="quantity-input" onchange="updateQuantity(${index}, this.value)">
                    <select class="size-select">
                        <option>XS</option>
                        <option>S</option>
                        <option>M</option>
                        <option>L</option>
                        <option>XL</option>
                    </select>
                </div>
            </div>
            <div class="cart-price">$${(product.price * product.quantity).toFixed(2)}</div>
        `;

        cartContainer.appendChild(itemDiv);
    });

    updateTotalPrice();
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
    updateCartIcon();
    removesound();
}

function updateQuantity(index, quantity) {
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart[index].quantity = parseInt(quantity) || 1;
    localStorage.setItem('cart', JSON.stringify(cart));
    loadCart();
}

function updateTotalPrice() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const total = cart.reduce((sum, product) => sum + (product.price * (product.quantity || 1)), 0);
    const totalPriceElement = document.getElementById('total-price');
    if (totalPriceElement) {
        totalPriceElement.textContent = `$${total.toFixed(2)}`;
    } else {
        console.error('Total price element not found');
    }
}

function updateCartIcon() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartIcon = document.getElementById('cart-icon').querySelector('i');

    if (cart.length > 0) {
        cartIcon.style.color = 'red';
    } else {
        cartIcon.style.color = 'black';
    }
}
window.addEventListener('storage', updateCartIcon);

function playNotificationSound() {
    const audio = new Audio('assets/sound/bing.mp3');
    audio.play().catch(error => console.error("Sound error:", error)); 
}

function removesound() {
    const audio = new Audio('assets/sound/bing.mp3');
    audio.play().catch(error => console.error("Sound error:", error)); 
}
