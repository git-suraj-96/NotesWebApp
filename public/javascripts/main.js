const showPassBtn = document.querySelector(".show-pass");
const passInput = document.querySelector('.password')

showPassBtn.addEventListener('click', ()=>{
    passInput.type = "text";
})