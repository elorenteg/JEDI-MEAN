// UPDATES
use ejercicio_01

print("//3.1")
db.usuarios.update({nombre:'Fulgencio'}, {$set:{nombre:'José'}})

print("//3.2")
db.usuarios.update({}, {$set:{estado_animo:'radiante'}}, {multi:true})

print("//3.3")
db.tareas.update({'encargados.1.nombre':'Fabian'}, {$push:{encargados:{nombre:'Oscar', obligado:true}}})

print("//3.4")
db.tareas.update({'encargados.1.nombre':'Fabian'}, {$pop:{encargados:-1}})