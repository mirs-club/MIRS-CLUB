const menu=document.getElementById("menu"),nav=document.getElementById("nav"),toast=document.getElementById("toast");
menu.addEventListener("click",()=>nav.classList.toggle("open"));
document.querySelectorAll("#nav a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
function msg(text){toast.textContent=text;toast.style.display="block";setTimeout(()=>toast.style.display="none",3500)}
document.getElementById("serviceForm").addEventListener("submit",e=>{e.preventDefault();msg("Formulario listo. En la siguiente etapa lo conectaremos al panel MIRS y base de datos.")});
document.getElementById("techForm").addEventListener("submit",e=>{e.preventDefault();msg("Postulación preparada. En la siguiente etapa conectaremos el envío de datos y documentos.")});