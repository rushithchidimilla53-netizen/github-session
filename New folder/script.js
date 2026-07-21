let products = [
{id:1,name:"Paper Bags Pack",price:199,img:"https://images.unsplash.com/photo-1606813907291-d86efa9b94db",rating:4},
{id:2,name:"Compostable Boxes",price:299,img:"https://images.unsplash.com/photo-1585386959984-a415522316f9",rating:5},
{id:3,name:"T-Shirt",price:500,img:"https://images.unsplash.com/photo-1600180758890-6b94519a8ba6",rating:3},
{id:4,name:"Reusable Packaging Kit",price:399,img:"https://images.unsplash.com/photo-1615486363973-0fcb9e7b9d3e",rating:4},
{id:5,name:"Shirt",price:1000,img:"https://images.unsplash.com/photo-1598033129183-c4f50c736f10",rating:5},
{id:6,name:"Eco Tape",price:99,img:"https://images.unsplash.com/photo-1586075010923-2dd4570fb338",rating:3},
{id:7,name:"Cloth Bags",price:349,img:"https://images.unsplash.com/photo-1593032465171-8f5b4f3d06c3",rating:4},
{id:8,name:"Cycle",price:3000,img:"https://images.unsplash.com/photo-1621972750749-0fbb1abb7736",rating:5},
{id:9,name:"Corrugated Box",price:279,img:"https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d",rating:4},
{id:10,name:"Snikers",price:1500,img:"https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb",rating:4}
];

let cart = {};
let orders = JSON.parse(localStorage.getItem("orders")) || [];
let currentOrder = null;

const productsDiv = document.getElementById("products");

function signup(){ localStorage.setItem(user.value, pass.value); msg.innerText="Account created!"; }


function login(){
  let storedPass = localStorage.getItem(user.value);

  // If user not registered
  if(!storedPass){
    msg.innerText = "❌ Please signup first!";
    return;
  }

  
  if(storedPass !== pass.value){
    msg.innerText = "❌ Wrong password!";
    return;
  }

  
  nav.style.display="flex";
  show("home");
  loadProducts(products);
}


user.oninput = pass.oninput = () => msg.innerText="";

function logout(){ location.reload(); }

function show(id){
  document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function loadProducts(list){
  productsDiv.innerHTML="";
  list.forEach(p=>{
    let stars = "⭐".repeat(p.rating);
    productsDiv.innerHTML+=`
    <div class="card" id="card-${p.id}">
      <img src="${p.img}">
      <h4>${p.name}</h4>
      <div class="stars">${stars}</div>
      <p>₹${p.price}</p>
      <button onclick="addCart(${p.id})">Add to Cart</button>
    </div>`;
  });
}

function search(v){
  let filtered = products.filter(p=>p.name.toLowerCase().includes(v.toLowerCase()));
  loadProducts(filtered);
}

function addCart(id){
  cart[id]=(cart[id]||0)+1;

  let sound = document.getElementById("clickSound");
  sound.currentTime = 0;
  sound.play().catch(()=>{});

  if(navigator.vibrate){ navigator.vibrate(100); }

  let card = document.getElementById("card-" + id);
  card.classList.add("added");
  setTimeout(()=>card.classList.remove("added"),400);
}

function inc(id){ cart[id]++; showCart(); }
function dec(id){ cart[id]--; if(cart[id]<=0) delete cart[id]; showCart(); }

function showCart(){
  show("cart");
  let div = document.getElementById("cartItems");
  div.innerHTML="";
  let total = 0;

  for(let id in cart){
    let p = products.find(x=>x.id==id);
    total += p.price * cart[id];

    div.innerHTML += `
      <div class="cart-item">
        <img src="${p.img}">
        <div style="flex:1;">
          ${p.name}<br>₹${p.price}
        </div>
        <div class="qty">
          <button onclick="dec(${id})">-</button>
          ${cart[id]}
          <button onclick="inc(${id})">+</button>
        </div>
        <div>₹${p.price * cart[id]}</div>
      </div>`;
  }

  totalText.innerText="Total: ₹"+total;
}

function goToCheckout(){
  if(Object.keys(cart).length === 0){ alert("Cart is empty!"); return; }
  show("checkout");
}
window.onload = function () {
    alert("Welcome to our store!");
};

function goToPayment(){
  let n = document.getElementById("name").value.trim();
  let ph = document.getElementById("phone").value.trim();
  let ad = document.getElementById("address").value.trim();

  if(n === "" || ph === "" || ad === ""){
    alert("Fill all details!");
    return;
  }

  currentOrder = { items: cart, name:n, phone:ph, address:ad };
  show("payment");
}

function changePayment(){
  let method = paymentMethod.value;
  let box = paymentDetails;

  if(method==="UPI"){ box.innerHTML=`<input placeholder="Enter UPI ID">`; }
  else if(method==="CARD"){
    box.innerHTML=`<input placeholder="Card Number"><input placeholder="Expiry"><input placeholder="CVV">`;
  } else { box.innerHTML=`<p>Pay on delivery</p>`; }
}

function confirmPayment(){
  currentOrder.payment = paymentMethod.value;
  orders.push(currentOrder);
  localStorage.setItem("orders", JSON.stringify(orders));
  alert("Order placed successfully 🎉");
  cart = {};
  show("home");
}s