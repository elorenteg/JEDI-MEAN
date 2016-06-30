// CONSULTAS
use ejercicio_01

print("//2.1")
db.usuarios.find().pretty()

print("//2.2")
db.usuarios.find({nombre:'Maria'}).pretty()

print("//2.3")
db.usuarios.find({estado_animo:{$in:['contento','contenta']}}).pretty()

print("//2.4")
db.usuarios.find({edad:{$gt:25}}, {nombre:1}).pretty()

print("//2.5")
db.usuarios.find({edad:{$gte:20,$lte:25}}, {edad:0}).pretty()

print("//2.6")
db.usuarios.find().pretty().sort({edad:-1})

print("//2.7")
db.usuarios.find({departamento:{$ne:'Marketing'}, edad:{$gte:20}}).pretty()

print("//2.8")
db.usuarios.find({edad:{$in:[30,25,16]}}).pretty()

print("//2.9")
db.usuarios.find({habilidades:'mongodb'}).pretty()

print("//2.10")
db.tareas.findOne({nombre:'Limpiar el suelo'})

print("//2.11")
db.usuarios.findOne({_id:ObjectId('56a2a3ef43e14e025b742bbc')})

print("//2.12")
db.usuarios.find({fecha_ultimo_casamiento:{$gte:new Date()}}).pretty()

print("//2.13")
db.usuarios.find({fecha_ultimo_casamiento:{$lt:new Date()}}).pretty()



