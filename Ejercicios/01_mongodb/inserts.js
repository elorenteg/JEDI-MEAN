// INSERTS
use ejercicio_01

print("//1.1")
db.usuarios.insert({nombre:'Maria', edad:22, estado_animo:'contenta', departamento:'Formación', habilidades:['node','c++','c','swift']})

print("//1.2")
db.usuarios.insert({nombre:'Sergio', edad:35, esta_casado:true, fecha_ultimo_casamiento:new Date(), departamento:'RRHH'})

print("//1.3")
db.tareas.insert({nombre:'Arreglar la bici', encargados:[{nombre:'Alberto', obligado:false}, {nombre:'Fabian', obligado:true}, {nombre:'Peter',obligado:false}]})

print("//1.3")
db.tareas.insert({nombre:'Limpiar el suelo', encargados:[], cancelada:true})
