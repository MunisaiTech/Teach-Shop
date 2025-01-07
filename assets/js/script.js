let productData=[];
let flag=true;
let localData=[];
let cartData=JSON.parse(localStorage.getItem('cartData')) || [];
let cartCount=cartData.length;
// let count=1;

function updateCartCount(){
    document.getElementById('count').innerHTML=`Cart(${cartCount})`
}
updateCartCount();


async function getData(){
    try{
    const res=await fetch("https://fakestoreapi.com/products");
    const data=await res.json();
     productData=data;
     displayData(productData);
     localStorage.setItem('apiData',JSON.stringify(data));
     flag=false;
    console.log(productData);
    }
    catch(error){
        alert("failed to fetch data");
    }
}

    function displayData(information){
        const displayContainer=document.getElementById('details');
        if(!displayContainer)
        {
            return;
        }

        const cards=information.map((product)=>{
        function title(text,length){
           return text.substring(0,length)+"...";
        }
        function text(data,length){
            return data.substring(0,length)+"..."
        }
        return(`
            <div class="info">
            <img src=${product.image}>
            <p class="title">${title(product.title,11)}</p>
            <p class="desp">${text(product.description,90)}</p>
            <hr>
            <p class="price">${"$ "+product.price}</p>
            <hr>
            <button>Details</button>
            <button class="add" data-id="${product.id}">Add to Cart</button>
            </div>
            `)
    })
    document.getElementById("details").innerHTML=cards.join("");
}





function filterByCat(category) {
    const reqData = flag ? localData : productData;
    const filteredData = category === 'all'
        ? reqData
        : reqData.filter(product => product.category === category);
    displayData(filteredData);
}

function addToCart(productId){
    let existingItem=cartData.find(item=>item.id==productId)
    if(!existingItem){
        let product=(flag ? localData:productData).find(item=>item.id==productId)
        if(product){
            product.count=1;
            cartData.push(product);
            console.log(("hello"));
            cartCount++;
            displayCart();
            
        }
    }
    else{
        existingItem.count++;
        updateProductCart(productId,existingItem.count);
    }
    localStorage.setItem('cartData',JSON.stringify(cartData));
    updateCartCount();
}

function updateProductCart(productId,count){
    const productElement=document.getElementById('addCart');
    if(!productElement){
        return
    }
    else{
        const countElement = document.querySelector(`.cart-item[data-id="${productId}"] .cartCount`);
        countElement.textContent=cartCount;
        const product=cartData.find(item=>item.id==productId)
        let totalPrice=document.getElementById('amount');
        totalPrice.textContent=`${count}× $ ${product.price}`;

    }
}

//function for update cartitem count

function updateCartItemCount(productId,operation){
    let product=cartData.find(item=>item.id==productId)
    if(product){
        if(operation==='increase'){
            product.count++;
            if(!product){
              cartCount++;
            }
        }
        else if(operation==='decrease'){
            product.count--;
            // cartCount--;
            if(product.count===0){
                cartData=cartData.filter(item=>item.id !=productId)
                let removeElement=document.querySelector(`.cart-item[data-id="${productId}"]`);
                removeElement.remove();
                cartCount--;
                

            }

        }
        if(product.count>0){
            updateProductCart(productId,product.count)
        }
        localStorage.setItem('cartData',JSON.stringify(cartData))
        updateCartCount();
        displayCart();
    }
}


function displayCart(){
    let cartContainer=document.getElementById('addCart');
    
    if(!cartContainer){
        return;
    }
    let cartSummary=document.getElementById('money');

    cartSummary.innerHTML=""
    cartContainer.innerHTML="";
    if(cartData.length===0){
        let mainContainer=document.querySelector('.cost');
        mainContainer.innerHTML=`
        <div class='empty'>
        <h3>cart</h3>
        <hr>
        <p class='title'>Your Cart is Empty</p>
        <a href="products.html" id='shop'><i class="fa-solid fa-left-long"></i>Continue Shopping</a>
        <p class='end'>Made by ❤️<u>Munisai</u></p>

        </div>`;
    }
    else{
        
        const itemsContianer=document.createElement('div');
        itemsContianer.id='items';
        let cartHtml=cartData.map((product)=>{
            return(`
                <div class="cart-item" data-id='${product.id}'>
                <img src="${product.image}">
                <p><strong>${product.title}</strong></p>
                <div class="symbol">
                   <div>
                   <button class="decrease">-</button>
                   <sapn class="cartCount">${product.count}</span>
                   <button class="increase">+</button>
                   </div>
                   <p id="amount">${product.count}<strong> × $${product.price}</strong></p>
                </div>
                </div>
                <hr>
                `)
        }).join("");
        itemsContianer.innerHTML=cartHtml;
        cartContainer.appendChild(itemsContianer);

        let totalItems=cartData.reduce((sum,product)=>sum+product.count,0);
        let totalPrice=cartData.reduce((sum,product)=>sum+product.count * Math.floor(product.price),0)
        let shiftAmount= 30
        let finalPrice=totalPrice+shiftAmount;
        cartSummary.innerHTML=`
        <div class="formate">
          <div>
            <p>Products(${totalItems})</p>
            <p>Shipping</p>
            <strong>Total amount</strong>
          </div>
          <div>
            <p>$ ${totalPrice}</p>
            <p>$ ${shiftAmount}</p>
            <strong>$ ${finalPrice}</strong>  
          </div>
        </div>
        <button>Go to checkout</button>`
    }
}
function login(){
    const registerButton=document.getElementById('btn');
    if(!registerButton){
        return;
    }
    else{
        registerButton.addEventListener('click',(e)=>{
        e.preventDefault();
        validateLogin();
        })

    }
}
function register(){
    const registerButton=document.getElementById('rbtn');
    if(!registerButton){
        return
    }
    else{
       registerButton.addEventListener('click',(e)=>{
        e.preventDefault();
        validateRegister();
       })
    }
}

//function for form validations
function validateLogin(){
    let login=document.querySelector("#log");
    if(!login){
        return;
    }
    else{
        let email=document.getElementById('email').value ;
        const mailPattern=/^[A-Za-z][A-Za-z\d\W]+[@][a-z]+[\.]com$/;
        let mailAns=mailPattern.test(email);
        let password=document.getElementById('psd').value;
        const pwdPattern=/^[A-Za-z](?=.*[\W])[A-Za-z\d\s\W]{7,12}$/;
        let pwdAns=pwdPattern.test(password);

        let emailField = document.getElementById('email');
        let emailError = document.getElementById('one');
        let passwordField = document.getElementById('psd');
        let passwordError = document.getElementById('two');

        if(email !="" && password !=""){
            if(mailAns && pwdAns){ 
                document.getElementById('data').reset();
                setTimeout(()=>{
                    alert("Login Sucessfull...")
                },500);

            }
            else{
                alert("Login failed due to invalid data...")
            }
        }
        if(email=="" || mailAns==false){
            emailField.style.border = "1px solid red";
            emailError.style.display = "block";
            emailError.style.color = "red";
        }
        else{
            emailField.style.border = "";
            emailError.style.display = "none";
        }
        if(password=="" || pwdAns==false){
            passwordField.style.border = "1px solid red";
            passwordError.style.display = "block";
            passwordError.style.color = "red";
        }
        else{
            passwordField.style.border = "";
            passwordError.style.display = "none";    
        }
    }

    



}
function validateRegister(){
    let register=document.querySelector('#register');
    
    if(!register){
        return;
    }
    else{
        let name=document.getElementById('txt').value;
        let namePtn=/^[A-Z][a-zA-Z\s]+$/
        let nameAns=namePtn.test(name);
        let email=document.getElementById('email').value ;
        const mailPattern=/^[A-Za-z][A-Za-z\d\W]+[@][a-z]+[\.]com$/;
        let mailAns=mailPattern.test(email);
        let password=document.getElementById('psd').value;
        const pwdPattern=/^[A-Za-z](?=.*[\W])[A-Za-z\d\s\W]{7,12}$/;
        let pwdAns=pwdPattern.test(password);

        let nameField=document.getElementById('txt')
        let nameError=document.getElementById('one');
        let emailField = document.getElementById('email');
        let emailError = document.getElementById('two');
        let passwordField = document.getElementById('psd');
        let passwordError = document.getElementById('three');

        if(name !="" && email !="" && password !=""){
            if(nameAns && mailAns && pwdAns){ 
                document.getElementById('rdata').reset();
                setTimeout(()=>{
                    alert("Registration Successfull...")
                },500);

            }
            else{
                alert("Registration failed due to invalid data...")
            }
        }

        if(name=="" || nameAns==false){
            nameField.style.border="1px solid red";
            nameError.style.display = "block";
            nameError.style.color = "red";
        }
        else{
            nameField.style.border="";
            nameError.style.display="none";
        }
        if(email=="" || mailAns==false){
            emailField.style.border = "1px solid red";
            emailError.style.display = "block";
            emailError.style.color = "red";
        }
        else{
            emailField.style.border = "";
            emailError.style.display = "none";
        }
        if(password=="" || pwdAns==false){
            passwordField.style.border = "1px solid red";
            passwordError.style.display = "block";
            passwordError.style.color = "red";
        }
        else{
            passwordField.style.border = "";
            passwordError.style.display = "none";    
        }
    }

}




//events for user choice data to display
function setupCategoryFilters(){
document.getElementById('men').addEventListener('click',(e)=>{
    e.preventDefault();
    filterByCat("men's clothing");
})
document.getElementById('women').addEventListener('click',(e)=>{
    e.preventDefault();
    filterByCat("women's clothing");
})
document.getElementById('chains').addEventListener('click',function(e){
    e.preventDefault();
    filterByCat("jewelery");
})
document.getElementById('electronic').addEventListener('click',function(e){
    e.preventDefault();
    filterByCat("electronics");
})
document.getElementById('all').addEventListener('click',function(e){
    e.preventDefault();
    filterByCat("all");
})

}


function loadData(){
    const storedData=localStorage.getItem('apiData');
    if(storedData){
        localData=JSON.parse(storedData);
        displayData(localData);
    }
    else{
        getData();
    }
}


document.addEventListener('click',(e)=>{
    if(e.target.classList.contains('add'))
    {
        e.preventDefault();
        let productId=e.target.getAttribute('data-id');
        addToCart(productId);
    }
    if(e.target.classList.contains('increase')){
        let productId=e.target.closest('.cart-item').getAttribute('data-id');
        updateCartItemCount(productId,'increase')
        
    }
    if(e.target.classList.contains('decrease')){
        let productId=e.target.closest('.cart-item').getAttribute('data-id');
        updateCartItemCount(productId,'decrease')

    }
});

function init(){
    const path=window.location.pathname;
    loadData();
    if(path.includes('index.html')){
        setupCategoryFilters()
    }
    if(path.includes('products.html')){
        setupCategoryFilters()
    }
    if(path.includes('cart.html')){
        displayCart();
    }
    if(path.includes('login.html')){
        login();
    }
    if(path.includes('register.html')){
        register();
    }

    
}

window.onload=init;
