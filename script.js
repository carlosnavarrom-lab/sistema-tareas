function enviarCorreo(responsable, correo, tarea){

emailjs.send("SERVICE_ID","TEMPLATE_ID",{

responsable: responsable,
tarea: tarea.nombre,
descripcion: tarea.descripcion,
fecha: tarea.fechaLimite,
email: correo

})
.then(function(response) {

console.log("Correo enviado");

}, function(error) {

console.log("Error enviando correo", error);

});

}

// 🔔 PEDIR PERMISO DE NOTIFICACIONES
if ("Notification" in window) {
    Notification.requestPermission();
}

let tareas = JSON.parse(localStorage.getItem("misTareas")) || []
let responsables = JSON.parse(localStorage.getItem("responsables")) || []
let responsablesSeleccionados = []

let tareaActualIndex = -1



// 🔔 FUNCION PARA MOSTRAR NOTIFICACION
function notificarNuevaTarea(tarea){

if (Notification.permission === "granted") {

let responsablesTexto = (tarea.responsables && tarea.responsables.length > 0)
  ? tarea.responsables.map(r => r.nombre).join(", ")
  : "Sin responsable"

new Notification("Nueva tarea agregada", {

body: tarea.nombre + " asignada a " + responsablesTexto,
icon: "https://cdn-icons-png.flaticon.com/512/1827/1827392.png"

})

}

}



function cargarResponsables(){

renderResponsables()
renderSeleccionResponsables()

}

function renderSeleccionResponsables(){

const cont = document.getElementById("listaResponsablesCheckbox")
if(!cont) return

cont.innerHTML = ""

responsables.forEach((r, i) => {
    const div = document.createElement("label")
    div.className = "responsable-checkbox"
    
    const isChecked = responsablesSeleccionados.some(rs => rs.nombre === r.nombre)
    if(isChecked) div.classList.add("checked")
    
    div.innerHTML = `
        <input type="checkbox" value="${i}" ${isChecked ? 'checked' : ''}>
        <div>
            <div style="font-weight:bold;">${r.nombre}</div>
            <div style="font-size:12px; color:#666;">${r.gmail}</div>
        </div>
    `
    
    div.querySelector("input").addEventListener("change", (e) => {
        if(e.target.checked) {
            if(!responsablesSeleccionados.some(rs => rs.nombre === r.nombre)) {
                responsablesSeleccionados.push(r)
            }
            div.classList.add("checked")
        } else {
            responsablesSeleccionados = responsablesSeleccionados.filter(rs => rs.nombre !== r.nombre)
            div.classList.remove("checked")
        }
    })
    
    cont.appendChild(div)
})

}

function mostrarSeleccionResponsables(){
responsablesSeleccionados = []
renderSeleccionResponsables()
document.getElementById("modalSeleccionarResponsables").style.display = "flex"
}

function cerrarSeleccionResponsables(){
document.getElementById("modalSeleccionarResponsables").style.display = "none"
}

function confirmarResponsables(){
actualizarBadgesResponsables()
cerrarSeleccionResponsables()
}

function actualizarBadgesResponsables(){
const cont = document.getElementById("responsablesSeleccionados")
cont.innerHTML = ""

if(responsablesSeleccionados.length === 0) {
    cont.innerHTML = '<span style="color:#999; font-style:italic;">Selecciona responsables...</span>'
    return
}

responsablesSeleccionados.forEach(r => {
    const badge = document.createElement("div")
    badge.className = "responsable-badge"
    badge.innerHTML = `
        ${r.nombre}
        <button type="button" onclick="quitarResponsable('${r.nombre}')" style="padding:0 4px;">×</button>
    `
    cont.appendChild(badge)
})
}

function quitarResponsable(nombre){
responsablesSeleccionados = responsablesSeleccionados.filter(r => r.nombre !== nombre)
actualizarBadgesResponsables()
renderSeleccionResponsables()
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
responsables:responsablesSeleccionados,
descripcion:document.getElementById("taskDesc").value,
pidio:document.getElementById("taskPidio").value,
fecha:document.getElementById("fecha").value,
fechaLimite:document.getElementById("fechaLimite").value,
prioridad:document.getElementById("prioridad").value,
estado:"pendiente"

}

tareas.push(tarea)

localStorage.setItem("misTareas",JSON.stringify(tareas))

// ENVIAR CORREO A TODOS LOS RESPONSABLES
responsablesSeleccionados.forEach(resp => {
  if(resp){
    enviarCorreo(resp.nombre, resp.gmail, tarea)
  }
})

document.getElementById("taskName").value=""
document.getElementById("taskDesc").value=""
document.getElementById("taskPidio").value=""
document.getElementById("fecha").value=""
document.getElementById("fechaLimite").value=""
responsablesSeleccionados = []
actualizarBadgesResponsables()

renderTareas()

}


function renderTareas(){

document.querySelectorAll(".task-list").forEach(c=>c.innerHTML="")

tareas.forEach((t,i)=>{

if(t.estado === 'completada') return

let card=document.createElement("div")

card.className="card "+t.prioridad.toLowerCase()

let lineColor = getLineColor(t.prioridad, t.estado)
card.style.setProperty('--line-color', lineColor)

card.draggable = true

card.addEventListener('dragstart', (e) => {

e.dataTransfer.setData('text/plain', i.toString())

})

card.addEventListener('click', (e) => {

if(e.target.tagName === 'BUTTON') return

abrirDetallesTarea(i)

})

let completeBtn = ''

if(t.estado === 'listo'){
completeBtn = `<button class="complete-btn" onclick="completarTarea(${i}); event.stopPropagation();">Completada</button>`
}

let responsablesTexto = (t.responsables && t.responsables.length > 0) 
  ? t.responsables.map(r => r.nombre).join(", ")
  : "Sin asignar"

card.innerHTML=`

<strong>${t.nombre}</strong>

<div>Responsables: ${responsablesTexto}</div>

<div style="display:flex; gap:5px; margin-top:8px;">
<button class="delete-btn" onclick="eliminarTarea(${i}); event.stopPropagation();" style="flex:1;">
Eliminar
</button>

<button class="edit-btn" onclick="abrirEditarTarea(${i}); event.stopPropagation();" style="flex:1;">
Editar
</button>
</div>

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


function abrirEditarTarea(indice){
abrirDetallesTarea(indice)
}

function editarTarea(){

const tarea = tareas[tareaActualIndex]
const contenido = document.getElementById("detalleContenido")

let responsablesOpciones = responsables.map((r, i) => {
    const isSelected = tarea.responsables && tarea.responsables.some(tr => tr.nombre === r.nombre)
    return `<label style="display:block; margin:8px 0; cursor:pointer;">
        <input type="checkbox" value="${i}" ${isSelected ? 'checked' : ''} class="responsable-edit-checkbox">
        ${r.nombre}
    </label>`
}).join('')

contenido.innerHTML = `
<div class="detalle-item">
    <div class="detalle-label">Título</div>
    <input type="text" id="editNombre" value="${tarea.nombre}" style="padding:8px; border:1px solid #ddd; border-radius:4px; width:100%; box-sizing:border-box;">
</div>

<div class="detalle-item">
    <div class="detalle-label">Responsables</div>
    <div style="border:1px solid #ddd; padding:12px; border-radius:4px; background:white;">
        ${responsablesOpciones}
    </div>
</div>

<div class="detalle-item">
    <div class="detalle-label">Quién pidió</div>
    <input type="text" id="editPidio" value="${tarea.pidio || ''}" style="padding:8px; border:1px solid #ddd; border-radius:4px; width:100%; box-sizing:border-box;">
</div>

<div class="detalle-item">
    <div class="detalle-label">Descripción</div>
    <textarea id="editDescripcion" style="padding:8px; border:1px solid #ddd; border-radius:4px; width:100%; box-sizing:border-box; min-height:80px;">${tarea.descripcion || ''}</textarea>
</div>

<div class="detalle-item">
    <div class="detalle-label">Fecha inicio</div>
    <input type="date" id="editFecha" value="${tarea.fecha || ''}" style="padding:8px; border:1px solid #ddd; border-radius:4px; width:100%; box-sizing:border-box;">
</div>

<div class="detalle-item">
    <div class="detalle-label">Fecha límite</div>
    <input type="date" id="editFechaLimite" value="${tarea.fechaLimite || ''}" style="padding:8px; border:1px solid #ddd; border-radius:4px; width:100%; box-sizing:border-box;">
</div>

<div class="detalle-item">
    <div class="detalle-label">Prioridad</div>
    <select id="editPrioridad" style="padding:8px; border:1px solid #ddd; border-radius:4px; width:100%; box-sizing:border-box;">
        <option ${tarea.prioridad === 'Baja' ? 'selected' : ''}>Baja</option>
        <option ${tarea.prioridad === 'Media' ? 'selected' : ''}>Media</option>
        <option ${tarea.prioridad === 'Alta' ? 'selected' : ''}>Alta</option>
    </select>
</div>

<div class="detalle-item">
    <div class="detalle-label">Estado</div>
    <select id="editEstado" style="padding:8px; border:1px solid #ddd; border-radius:4px; width:100%; box-sizing:border-box;">
        <option ${tarea.estado === 'pendiente' ? 'selected' : ''}>pendiente</option>
        <option ${tarea.estado === 'en-curso' ? 'selected' : ''}>en-curso</option>
        <option ${tarea.estado === 'revision' ? 'selected' : ''}>revision</option>
        <option ${tarea.estado === 'listo' ? 'selected' : ''}>listo</option>
    </select>
</div>
`

document.getElementById("btnEditarTarea").style.display = "none"
document.getElementById("btnGuardarTarea").style.display = "block"

}

function guardarTareaEditada(){

const tarea = tareas[tareaActualIndex]

// Obtener responsables seleccionados
const checkboxes = document.querySelectorAll(".responsable-edit-checkbox:checked")
const nuevosResponsables = Array.from(checkboxes).map(cb => responsables[cb.value])

tarea.nombre = document.getElementById("editNombre").value
tarea.responsables = nuevosResponsables
tarea.pidio = document.getElementById("editPidio").value
tarea.descripcion = document.getElementById("editDescripcion").value
tarea.fecha = document.getElementById("editFecha").value
tarea.fechaLimite = document.getElementById("editFechaLimite").value
tarea.prioridad = document.getElementById("editPrioridad").value
tarea.estado = document.getElementById("editEstado").value

localStorage.setItem("misTareas", JSON.stringify(tareas))

abrirDetallesTarea(tareaActualIndex)
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

tareaActualIndex = indice

const tarea=tareas[indice]

const modal=document.getElementById("modalTareaDetail")

const contenido=document.getElementById("detalleContenido")

mostrarDetallesLectura(tarea, contenido)

document.getElementById("btnEditarTarea").style.display="block"
document.getElementById("btnGuardarTarea").style.display="none"

modal.style.display="flex"

}



function mostrarDetallesLectura(tarea, contenido){

let responsablesTexto = (tarea.responsables && tarea.responsables.length > 0)
  ? tarea.responsables.map(r => r.nombre).join(", ")
  : "Sin asignar"

contenido.innerHTML=`

<div class="detalle-item">
<div class="detalle-label">Título</div>
<div class="detalle-valor">${tarea.nombre}</div>
</div>

<div class="detalle-item">
<div class="detalle-label">Responsables</div>
<div class="detalle-valor">${responsablesTexto}</div>
</div>

<div class="detalle-item">
<div class="detalle-label">Quién pidió</div>
<div class="detalle-valor">${tarea.pidio||'No especificado'}</div>
</div>

<div class="detalle-item">
<div class="detalle-label">Descripción</div>
<div class="detalle-valor">${tarea.descripcion||'Sin descripción'}</div>
</div>

<div class="detalle-item">
<div class="detalle-label">Fecha inicio</div>
<div class="detalle-valor">${tarea.fecha||'No especificada'}</div>
</div>

<div class="detalle-item">
<div class="detalle-label">Fecha límite</div>
<div class="detalle-valor">${tarea.fechaLimite||'No especificada'}</div>
</div>

<div class="detalle-item">
<div class="detalle-label">Prioridad</div>
<div class="detalle-valor">${tarea.prioridad}</div>
</div>

<div class="detalle-item">
<div class="detalle-label">Estado</div>
<div class="detalle-valor">${tarea.estado}</div>
</div>

`

}



function getLineColor(prio, estado){

if(estado === 'listo'){
return '#2ecc71'
}

switch(prio.toLowerCase()){

case 'alta': return '#ffcccc'
case 'media': return '#fff9cc'
case 'baja': return '#ccffcc'
default: return '#6c63ff'

}

}



function completarTarea(i){

tareas[i].estado = 'completada'

localStorage.setItem("misTareas",JSON.stringify(tareas))

renderTareas()

}



document.querySelectorAll('.column').forEach(column=>{

column.addEventListener('dragover', (e)=>{
e.preventDefault()
})

column.addEventListener('drop', (e)=>{

e.preventDefault()

const index = e.dataTransfer.getData('text/plain')

const newEstado = column.id

tareas[index].estado = newEstado

localStorage.setItem("misTareas",JSON.stringify(tareas))

renderTareas()

})

})

// EVENT LISTENERS PARA SELECCIONAR RESPONSABLES
document.getElementById("btnAbrirSeleccionResponsables").onclick=()=>{
  mostrarSeleccionResponsables()
}

document.getElementById("btnConfirmarResponsables").onclick=()=>{
  confirmarResponsables()
}

document.getElementById("btnCerrarSeleccion").onclick=()=>{
  cerrarSeleccionResponsables()
}


cargarResponsables()
renderTareas()
