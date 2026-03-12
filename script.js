let tareas = JSON.parse(localStorage.getItem("misTareas")) || []
let responsables = JSON.parse(localStorage.getItem("responsables")) || []

const selectResponsable = document.getElementById("responsableSelect")

function cargarResponsables(){

if(!selectResponsable)return

selectResponsable.innerHTML=""

responsables.forEach((r,i)=>{

let option=document.createElement("option")

option.value=i
option.textContent=r.nombre

selectResponsable.appendChild(option)

})

renderResponsables()

}

function renderResponsables(){

const cont=document.getElementById("listaResponsables")

if(!cont)return

cont.innerHTML=""

responsables.forEach((r,i)=>{

const div=document.createElement("div")

div.className="responsable-card"

div.innerHTML=`

<div class="responsable-info">

<div class="responsable-nombre">
${r.nombre}
</div>

<div class="responsable-mail">
${r.gmail}
</div>

</div>

<button class="responsable-delete"
onclick="eliminarResponsable(${i})">
X
</button>

`

cont.appendChild(div)

})

}

function eliminarResponsable(i){

responsables.splice(i,1)

localStorage.setItem("responsables",JSON.stringify(responsables))

cargarResponsables()

}

document.getElementById("agregarResponsable").onclick=()=>{

const nombre=document.getElementById("nombreResponsable").value
const gmail=document.getElementById("gmailResponsable").value

if(!nombre || !gmail)return

responsables.push({
nombre:nombre,
gmail:gmail
})

localStorage.setItem("responsables",JSON.stringify(responsables))

document.getElementById("nombreResponsable").value=""
document.getElementById("gmailResponsable").value=""

cargarResponsables()

}

document.getElementById("btnAgregarTarea").onclick=()=>{

let tarea={

nombre:document.getElementById("taskName").value,
respNom:responsables[selectResponsable.value]?.nombre,
descripcion:document.getElementById("taskDesc").value,
pidio:document.getElementById("taskPidio").value,
fecha:document.getElementById("fecha").value,
fechaLimite:document.getElementById("fechaLimite").value,
prioridad:document.getElementById("prioridad").value,
estado:"pendiente"

}

tareas.push(tarea)

localStorage.setItem("misTareas",JSON.stringify(tareas))

document.getElementById("taskName").value=""
document.getElementById("taskDesc").value=""
document.getElementById("taskPidio").value=""
document.getElementById("fecha").value=""
document.getElementById("fechaLimite").value=""

renderTareas()

}

function renderTareas(){

document.querySelectorAll(".task-list").forEach(c=>c.innerHTML="")

tareas.forEach((t,i)=>{

// no mostramos tareas completadas en el tablero
if(t.estado === 'completada') return;

let card=document.createElement("div")

card.className="card "+t.prioridad.toLowerCase()

// aplica color de línea según prioridad y estado
let lineColor = getLineColor(t.prioridad, t.estado)
card.style.setProperty('--line-color', lineColor)

card.draggable = true

card.addEventListener('dragstart', (e) => {

e.dataTransfer.setData('text/plain', i.toString())

})

card.addEventListener('click', (e) => {

if(e.target.classList.contains('delete-btn')){
return
}

abrirDetallesTarea(i)

})

let completeBtn = ''
if(t.estado === 'listo'){
 completeBtn = `<button class="complete-btn" onclick="completarTarea(${i}); event.stopPropagation();">Completada</button>`
}

card.innerHTML=`

<strong>${t.nombre}</strong>

<div>Responsable: ${t.respNom}</div>

<button class="delete-btn" onclick="eliminarTarea(${i}); event.stopPropagation();">
Eliminar
</button>
${completeBtn}

`

document.querySelector("#"+t.estado+" .task-list").appendChild(card)

})

}

function eliminarTarea(i){

tareas.splice(i,1)

localStorage.setItem("misTareas",JSON.stringify(tareas))

renderTareas()

}


document.getElementById("btnOpenModal").onclick=()=>{
document.getElementById("modalResponsables").style.display="flex"
}

document.getElementById("cerrarModal").onclick=()=>{
document.getElementById("modalResponsables").style.display="none"
}

document.getElementById("cerrarModalTarea").onclick=()=>{
document.getElementById("modalTareaDetail").style.display="none"
}

document.getElementById("cerrarModalTareaBtn").onclick=()=>{
document.getElementById("modalTareaDetail").style.display="none"
}

function abrirDetallesTarea(indice){

const tarea=tareas[indice]
const modal=document.getElementById("modalTareaDetail")
const contenido=document.getElementById("detalleContenido")

const fechaInicio=new Date(tarea.fecha)
const fechaFin=new Date(tarea.fechaLimite)
const diasRestantes=Math.ceil((fechaFin-fechaInicio)/(1000*60*60*24))

contenido.innerHTML=`

<div class="detalle-item">
<div class="detalle-label">Título de la Tarea</div>
<div class="detalle-valor">${tarea.nombre}</div>
</div>

<div class="detalle-item">
<div class="detalle-label">Responsable</div>
<div class="detalle-valor">${tarea.respNom||'Sin asignar'}</div>
</div>

<div class="detalle-item">
<div class="detalle-label">¿Quién pidió la tarea?</div>
<div class="detalle-valor">${tarea.pidio||'No especificado'}</div>
</div>

<div class="detalle-item">
<div class="detalle-label">Descripción</div>
<div class="detalle-valor">${tarea.descripcion||'Sin descripción'}</div>
</div>

<div class="detalle-item">
<div class="detalle-label">Fecha de Inicio</div>
<div class="detalle-valor">${tarea.fecha||'No especificada'}</div>
</div>

<div class="detalle-item">
<div class="detalle-label">Fecha Límite</div>
<div class="detalle-valor">${tarea.fechaLimite||'No especificada'}</div>
</div>

<div class="detalle-item">
<div class="detalle-label">Prioridad</div>
<div class="detalle-valor">${tarea.prioridad||'No especificada'}</div>
</div>

<div class="detalle-item">
<div class="detalle-label">Estado</div>
<div class="detalle-valor">${tarea.estado||'Pendiente'}</div>
</div>

`

modal.style.display="flex"

}

cargarResponsables()
renderTareas()


function getLineColor(prio, estado){
    if(estado === 'listo'){
        return '#2ecc71';
    }
    switch(prio.toLowerCase()){
        case 'alta': return '#ffcccc';      // rojo tenue
        case 'media': return '#fff9cc';     // amarillo tenue
        case 'baja': return '#ccffcc';      // verde tenue
        default: return '#6c63ff';
    }
}

function completarTarea(i){
    tareas[i].estado = 'completada'
    localStorage.setItem("misTareas",JSON.stringify(tareas))
    renderTareas()
}


// Agregar drag and drop a las columnas
document.querySelectorAll('.column').forEach(column => {
    column.addEventListener('dragover', (e) => {
        e.preventDefault()
    })
    column.addEventListener('drop', (e) => {
        e.preventDefault()
        const index = e.dataTransfer.getData('text/plain')
        const newEstado = column.id
        tareas[index].estado = newEstado
        localStorage.setItem("misTareas", JSON.stringify(tareas))
        renderTareas()
    })
})
