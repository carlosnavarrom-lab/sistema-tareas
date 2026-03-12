const timeline=document.getElementById("timeline")

const tareas=JSON.parse(localStorage.getItem("misTareas"))||[]

tareas.sort((a,b)=>new Date(a.fecha)-new Date(b.fecha))

// limpiar contenido previo para evitar duplicados
timeline.innerHTML = ''

tareas.forEach(t=>{

const fecha=new Date(t.fecha)

const dia=fecha.getDate()

const mes=fecha.toLocaleString('es',{month:'short'})

const div=document.createElement("div")

    // determinar si la tarea realmente está completada
    const done = (t.estado||'').toLowerCase() === 'completada'
    div.className="event "+(t.prioridad||'').toLowerCase();
    if(done){
        div.classList.add('completada');
    }
    // elegir color tenue según prioridad (no se muestra si completada gracias a CSS)
    const evColor = (t.prioridad||'').toLowerCase() === 'alta' ? '#ffcccc'
                  : (t.prioridad||'').toLowerCase() === 'media' ? '#fff9cc'
                  : (t.prioridad||'').toLowerCase() === 'baja' ? '#ccffcc'
                  : '#6c63ff';
    div.style.setProperty('--event-line-color', evColor)
div.innerHTML=`

<div class="event-date">

<div class="event-day">${dia}</div>

<div class="event-month">${mes}</div>

</div>

<div class="event-title">${t.nombre}</div>

<div>Responsables: ${t.responsables && t.responsables.length > 0 ? t.responsables.map(r => r.nombre).join(", ") : "Sin asignar"}</div>

<div>Fecha límite: ${t.fechaLimite||"Sin fecha"}</div>

${done ? '<div class="completed-label">Completado</div>' : ''}

`

timeline.appendChild(div)

})