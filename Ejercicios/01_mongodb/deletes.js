// DELETES
use ejercicio_01

print("//4.1")
db.usuarios.remove({nombre:'h4x0r'}, {justOne:true})

print("//4.2")
db.usuarios.remove({edad:{$gt:29}})