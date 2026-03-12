const timeline=document.getElementById("timeline")

const tareas=JSON.parse(localStorage.getItem("misTareas"))||[]

tareas.sort((a,b)=>new Date(a.fecha)-new Date(b.fecha))

tareas.forEach(t=>{

const fecha=new Date(t.fecha)

const dia=fecha.getDate()

const mes=fecha.toLocaleString('es',{month:'short'})

const div=document.createElement("div")

div.className="event "+t.prioridad.toLowerCase()

div.innerHTML=`

<div class="event-date">

<div class="event-day">${dia}</div>

<div class="event-month">${mes}</div>

</div>

<div class="event-title">${t.nombre}</div>

<div>Responsable: ${t.respNom}</div>

<div>Fecha límite: ${t.fechaLimite||"Sin fecha"}</div>

`

timeline.appendChild(div)

})