function showError(inputId, errorId, message) {
    var input = document.getElementById(inputId);
    var error = document.getElementById(errorId);

    if (!input || !error) return;

    if (message) {
        input.classList.add("cd-input-error");
        error.textContent = message;
    } else {
        input.classList.remove("cd-input-error");
        error.textContent = "";
    }
}

function isEmail(value) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(value);
}

function validateLoginForm() {
    var emailInput = document.getElementById("Email");
    var passwordInput = document.getElementById("Password");
    if (!emailInput || !passwordInput) {
        return true;
    }

    var email = emailInput.value.trim();
    var password = passwordInput.value.trim();
    var isValid = true;

    if (email === "") {
        showError("Email", "EmailError", "Email is required.");
        isValid = false;
    } else if (!isEmail(email)) {
        showError("Email", "EmailError", "Please enter a valid email.");
        isValid = false;
    } else {
        showError("Email", "EmailError", "");
    }

    if (password === "") {
        showError("Password", "PasswordError", "Password is required.");
        isValid = false;
    } else if (password.length < 6) {
        showError("Password", "PasswordError", "Password must be at least 6 characters.");
        isValid = false;
    } else {
        showError("Password", "PasswordError", "");
    }

    return isValid;
}

function validateRegisterForm() {
    var fullNameInput = document.getElementById("FullName");
    var emailInput = document.getElementById("RegEmail");
    var phoneInput = document.getElementById("Phone");
    var passwordInput = document.getElementById("RegPassword");
    var confirmPasswordInput = document.getElementById("ConfirmPassword");

    if (!fullNameInput || !emailInput || !phoneInput || !passwordInput || !confirmPasswordInput) {
        return true;
    }

    var fullName = fullNameInput.value.trim();
    var email = emailInput.value.trim();
    var phone = phoneInput.value.trim();
    var password = passwordInput.value.trim();
    var confirmPassword = confirmPasswordInput.value.trim();

    var isValid = true;

    if (fullName === "") {
        showError("FullName", "FullNameError", "Full name is required.");
        isValid = false;
    } else {
        showError("FullName", "FullNameError", "");
    }

    if (email === "") {
        showError("RegEmail", "RegEmailError", "Email is required.");
        isValid = false;
    } else if (!isEmail(email)) {
        showError("RegEmail", "RegEmailError", "Please enter a valid email.");
        isValid = false;
    } else {
        showError("RegEmail", "RegEmailError", "");
    }

    if (phone === "") {
        showError("Phone", "PhoneError", "Phone number is required.");
        isValid = false;
    } else if (phone.length < 7) {
        showError("Phone", "PhoneError", "Please enter a valid phone number.");
        isValid = false;
    } else {
        showError("Phone", "PhoneError", "");
    }

    if (password === "") {
        showError("RegPassword", "RegPasswordError", "Password is required.");
        isValid = false;
    } else if (password.length < 6) {
        showError("RegPassword", "RegPasswordError", "Password must be at least 6 characters.");
        isValid = false;
    } else {
        showError("RegPassword", "RegPasswordError", "");
    }

    if (confirmPassword === "") {
        showError("ConfirmPassword", "ConfirmPasswordError", "Please confirm your password.");
        isValid = false;
    } else if (confirmPassword !== password) {
        showError("ConfirmPassword", "ConfirmPasswordError", "Passwords do not match.");
        isValid = false;
    } else {
        showError("ConfirmPassword", "ConfirmPasswordError", "");
    }

    return isValid;
}

// CART (UI ONLY)
const CD_CART_KEY = "cd_cart_v1";
const CD_COUPON_KEY = "cd_coupon_v1";

function cdGetCart() {
    try {
        const raw = localStorage.getItem(CD_CART_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function cdSaveCart(cart) {
    localStorage.setItem(CD_CART_KEY, JSON.stringify(cart));
}

function cdFormatMoney(value) {
    const n = Number(value) || 0;
    return "₹" + n.toFixed(0);
}

function cdCalc(cart) {
    const subtotal = cart.reduce((sum, it) => sum + (Number(it.price) || 0) * (Number(it.qty) || 0), 0);
    const coupon = (localStorage.getItem(CD_COUPON_KEY) || "").trim();
    const discount = coupon.toUpperCase() === "CAFE50" ? 50 : 0;
    const taxable = Math.max(0, subtotal - discount);
    const tax = taxable * 0.05;
    const total = taxable + tax;
    return { subtotal, discount, tax, total, coupon };
}

function cdUpsertItem(item) {
    const cart = cdGetCart();
    const key = (item.name || "").toLowerCase();
    const existing = cart.find(x => (x.name || "").toLowerCase() === key);
    if (existing) {
        existing.qty = (Number(existing.qty) || 0) + 1;
    } else {
        cart.push({
            name: item.name || "Item",
            price: Number(item.price) || 0,
            image: item.image || "",
            qty: 1
        });
    }
    cdSaveCart(cart);
}

function cdSetQty(name, qty) {
    const cart = cdGetCart();
    const key = (name || "").toLowerCase();
    const next = cart
        .map(x => (x.name || "").toLowerCase() === key ? { ...x, qty: Math.max(1, Number(qty) || 1) } : x)
        .filter(x => (Number(x.qty) || 0) > 0);
    cdSaveCart(next);
}

function cdRemoveItem(name) {
    const cart = cdGetCart();
    const key = (name || "").toLowerCase();
    const next = cart.filter(x => (x.name || "").toLowerCase() !== key);
    cdSaveCart(next);
}

function cdRenderCart() {
    const root = document.getElementById("cd-cart-items");
    if (!root) return;

    const cart = cdGetCart();
    if (cart.length === 0) {
        root.innerHTML = `
            <div class="cd-cart-empty">
                <div class="cd-cart-empty-title">Your cart is empty</div>
                <div class="cd-cart-empty-text">Add items from the menu to see them here.</div>
            </div>
        `;
    } else {
        root.innerHTML = cart.map(it => {
            const safeName = String(it.name || "");
            const img = it.image ? `<img class="cd-cart-thumb" src="${it.image}" alt="${safeName}" />` : `<div class="cd-cart-thumb cd-cart-thumb--placeholder"></div>`;
            const qty = Math.max(1, Number(it.qty) || 1);
            const price = Number(it.price) || 0;
            return `
                <div class="cd-cart-item" data-item="${safeName}">
                    ${img}
                    <div class="cd-cart-item-main">
                        <div class="cd-cart-item-name">${safeName}</div>
                        <div class="cd-cart-item-meta">Hot • Medium • Oat Milk</div>
                    </div>
                    <div class="cd-cart-qty">
                        <button type="button" class="cd-qty-btn" data-qty="-1" aria-label="Decrease quantity">−</button>
                        <div class="cd-qty-value">${qty}</div>
                        <button type="button" class="cd-qty-btn" data-qty="1" aria-label="Increase quantity">+</button>
                    </div>
                    <div class="cd-cart-item-price">${cdFormatMoney(price * qty)}</div>
                    <button type="button" class="cd-cart-remove" aria-label="Remove item">Remove</button>
                </div>
            `;
        }).join("");
    }

    const { subtotal, discount, tax, total } = cdCalc(cdGetCart());
    const elSubtotal = document.getElementById("cd-summary-subtotal");
    const elDiscount = document.getElementById("cd-summary-discount");
    const elTax = document.getElementById("cd-summary-tax");
    const elTotal = document.getElementById("cd-summary-total");
    if (elSubtotal) elSubtotal.textContent = cdFormatMoney(subtotal);
    if (elDiscount) elDiscount.textContent = discount ? ("-" + cdFormatMoney(discount)) : cdFormatMoney(0);
    if (elTax) elTax.textContent = "₹" + tax.toFixed(2);
    if (elTotal) elTotal.textContent = "₹" + total.toFixed(2);
}

function cdRenderCheckout() {
    const list = document.getElementById("cd-checkout-items");
    if (!list) return;

    const cart = cdGetCart();
    if (cart.length === 0) {
        list.innerHTML = `<div class="cd-checkout-empty">No items in cart.</div>`;
    } else {
        list.innerHTML = cart.map(it => {
            const name = String(it.name || "");
            const qty = Math.max(1, Number(it.qty) || 1);
            const price = Number(it.price) || 0;
            const img = it.image ? `<img class="cd-checkout-thumb" src="${it.image}" alt="${name}" />` : `<div class="cd-checkout-thumb cd-checkout-thumb--placeholder"></div>`;
            return `
                <div class="cd-checkout-line">
                    ${img}
                    <div class="cd-checkout-line-main">
                        <div class="cd-checkout-line-name">${name}</div>
                        <div class="cd-checkout-line-qty">Qty: ${qty}</div>
                    </div>
                    <div class="cd-checkout-line-price">${cdFormatMoney(price * qty)}</div>
                </div>
            `;
        }).join("");
    }

    const { subtotal, tax, total } = cdCalc(cart);
    const elSubtotal = document.getElementById("cd-checkout-subtotal");
    const elTax = document.getElementById("cd-checkout-tax");
    const elTotal = document.getElementById("cd-checkout-total");
    const elPay = document.getElementById("cd-checkout-pay-amount");
    if (elSubtotal) elSubtotal.textContent = cdFormatMoney(subtotal);
    if (elTax) elTax.textContent = "₹" + tax.toFixed(2);
    if (elTotal) elTotal.textContent = "₹" + total.toFixed(2);
    if (elPay) elPay.textContent = "₹" + total.toFixed(2);
}

document.addEventListener("click", function (e) {
    const addBtn = e.target && e.target.closest ? e.target.closest(".add-btn") : null;
    if (addBtn && addBtn.dataset) {
        const name = addBtn.dataset.name || "";
        const price = addBtn.dataset.price || "0";
        const image = addBtn.dataset.image || "";
        cdUpsertItem({ name, price, image });
        window.location.href = "/Cart";
        return;
    }

    const qtyBtn = e.target && e.target.closest ? e.target.closest(".cd-qty-btn") : null;
    if (qtyBtn) {
        const row = qtyBtn.closest(".cd-cart-item");
        if (!row) return;
        const name = row.getAttribute("data-item") || "";
        const delta = Number(qtyBtn.getAttribute("data-qty")) || 0;
        const cart = cdGetCart();
        const it = cart.find(x => (x.name || "").toLowerCase() === name.toLowerCase());
        if (!it) return;
        const nextQty = Math.max(1, (Number(it.qty) || 1) + delta);
        cdSetQty(name, nextQty);
        cdRenderCart();
        return;
    }

    const removeBtn = e.target && e.target.closest ? e.target.closest(".cd-cart-remove") : null;
    if (removeBtn) {
        const row = removeBtn.closest(".cd-cart-item");
        if (!row) return;
        const name = row.getAttribute("data-item") || "";
        cdRemoveItem(name);
        cdRenderCart();
        return;
    }

    const payBtn = e.target && e.target.closest ? e.target.closest("#cd-pay-now") : null;
    if (payBtn) {
        const cart = cdGetCart();
        if (!cart || cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        const firstName = (document.getElementById('FirstName') || {}).value || '';
        const lastName  = (document.getElementById('LastName')  || {}).value || '';
        const customer  = (firstName + ' ' + lastName).trim() || 'Guest';

        const itemsStr = cart.map(it => {
            const qty = Math.max(1, Number(it.qty) || 1);
            return qty + 'x ' + (it.name || 'Item');
        }).join(', ');

        const { total } = cdCalc(cart);

        const ORDERS_KEY = 'cd_orders_v1';
        let orders = [];
        try {
            const raw = localStorage.getItem(ORDERS_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            orders = Array.isArray(parsed) ? parsed : [];
        } catch (err) {}

        const nextNum = 1000 + orders.length + 1;
        const orderId = '#ORD-' + nextNum;

        orders.push({
            id:       orderId,
            customer: customer,
            items:    itemsStr,
            total:    '₹' + Math.round(total),
            status:   'Completed',
            date:     new Date().toLocaleString('en-IN')
        });

        try { localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); } catch (err) {}

        // Clear cart
        cdSaveCart([]);

        // Toast notification
        const toast = document.createElement('div');
        toast.style.cssText = 'position:fixed;top:24px;right:24px;background:#3b2418;color:#fff;padding:1rem 1.5rem;border-radius:12px;font-size:0.95rem;z-index:99999;box-shadow:0 8px 32px rgba(0,0,0,0.18);';
        toast.innerHTML = '✅ Order <strong>' + orderId + '</strong> placed! Thank you, ' + (firstName || 'Guest') + '!';
        document.body.appendChild(toast);

        setTimeout(function () {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s';
            setTimeout(function () {
                if (toast.parentElement) toast.parentElement.removeChild(toast);
                window.location.href = '/';
            }, 600);
        }, 2500);
        return;
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const apply = document.getElementById("cd-apply-coupon");
    if (apply) {
        apply.addEventListener("click", function () {
            const input = document.getElementById("cd-coupon-code");
            const code = input ? String(input.value || "").trim() : "";
            localStorage.setItem(CD_COUPON_KEY, code);
            cdRenderCart();
        });
    }

    cdRenderCart();
    cdRenderCheckout();
});

