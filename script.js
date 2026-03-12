let tareas = JSON.parse(localStorage.getItem("misTareas")) || []
let responsables = JSON.parse(localStorage.getItem("responsables")) || []

const selectResponsable = document.getElementById("responsableSelect")

let tareaActualIndex = -1



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

card.innerHTML=`

<strong>${t.nombre}</strong>

<div>Responsable: ${t.respNom}</div>

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

contenido.innerHTML=`

<div class="detalle-item">
<div class="detalle-label">Título</div>
<div class="detalle-valor">${tarea.nombre}</div>
</div>

<div class="detalle-item">
<div class="detalle-label">Responsable</div>
<div class="detalle-valor">${tarea.respNom||'Sin asignar'}</div>
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



function abrirEditarTarea(indice){

tareaActualIndex = indice

const tarea = tareas[indice]

document.getElementById("detalleContenido").innerHTML = construirFormularioEdicion(tarea)

document.getElementById("btnEditarTarea").style.display="none"
document.getElementById("btnGuardarTarea").style.display="block"

document.getElementById("modalTareaDetail").style.display="flex"

}



function editarTarea(){

if(tareaActualIndex === -1) return

const tarea = tareas[tareaActualIndex]

document.getElementById("detalleContenido").innerHTML = construirFormularioEdicion(tarea)

document.getElementById("btnEditarTarea").style.display="none"
document.getElementById("btnGuardarTarea").style.display="block"

}



function construirFormularioEdicion(tarea){

let responsablesOptions = '<option value="">Selecciona responsable</option>'

responsables.forEach((r,i)=>{

const selected = r.nombre === tarea.respNom ? 'selected' : ''

responsablesOptions += `<option value="${i}" ${selected}>${r.nombre}</option>`

})

return `

<div class="detalle-form">

<label>Título</label>
<input id="editNombre" value="${tarea.nombre}">

<label>Responsable</label>
<select id="editResponsable">
${responsablesOptions}
</select>

<label>Quién pidió</label>
<input id="editPidio" value="${tarea.pidio||''}">

<label>Descripción</label>
<textarea id="editDescripcion">${tarea.descripcion||''}</textarea>

<label>Fecha inicio</label>
<input type="date" id="editFecha" value="${tarea.fecha||''}">

<label>Fecha límite</label>
<input type="date" id="editFechaLimite" value="${tarea.fechaLimite||''}">

<label>Prioridad</label>
<select id="editPrioridad">
<option ${tarea.prioridad=='Baja'?'selected':''}>Baja</option>
<option ${tarea.prioridad=='Media'?'selected':''}>Media</option>
<option ${tarea.prioridad=='Alta'?'selected':''}>Alta</option>
</select>

<label>Estado</label>
<select id="editEstado">
<option value="pendiente" ${tarea.estado=='pendiente'?'selected':''}>Pendiente</option>
<option value="en-curso" ${tarea.estado=='en-curso'?'selected':''}>En curso</option>
<option value="revision" ${tarea.estado=='revision'?'selected':''}>Revisión</option>
<option value="listo" ${tarea.estado=='listo'?'selected':''}>Listo</option>
</select>

</div>

`

}



function guardarTareaEditada(){

const tarea = tareas[tareaActualIndex]

tarea.nombre = document.getElementById("editNombre").value

const respIndex = document.getElementById("editResponsable").value

if(respIndex !== ""){
tarea.respNom = responsables[respIndex]?.nombre
}

tarea.pidio = document.getElementById("editPidio").value
tarea.descripcion = document.getElementById("editDescripcion").value
tarea.fecha = document.getElementById("editFecha").value
tarea.fechaLimite = document.getElementById("editFechaLimite").value
tarea.prioridad = document.getElementById("editPrioridad").value
tarea.estado = document.getElementById("editEstado").value

localStorage.setItem("misTareas",JSON.stringify(tareas))

mostrarDetallesLectura(tarea, document.getElementById("detalleContenido"))

document.getElementById("btnEditarTarea").style.display="block"
document.getElementById("btnGuardarTarea").style.display="none"

renderTareas()

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



cargarResponsables()
renderTareas()
