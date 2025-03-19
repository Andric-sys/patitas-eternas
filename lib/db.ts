import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"

// Función para obtener la conexión a la base de datos
export async function getDb() {
  const client = await clientPromise
  return client.db("patitas_eternas")
}

// Función para obtener una colección específica
export async function getCollection(collection: string) {
  const db = await getDb()
  return db.collection(collection)
}

// Funciones genéricas CRUD
export async function findOne(collection: string, query: any) {
  const coll = await getCollection(collection)
  return coll.findOne(query)
}

export async function findMany(collection: string, query: any = {}, options: any = {}) {
  const coll = await getCollection(collection)
  return coll.find(query, options).toArray()
}

export async function insertOne(collection: string, document: any) {
  const coll = await getCollection(collection)
  return coll.insertOne(document)
}

export async function updateOne(collection: string, query: any, update: any) {
  const coll = await getCollection(collection)
  return coll.updateOne(query, { $set: update })
}

export async function deleteOne(collection: string, query: any) {
  const coll = await getCollection(collection)
  return coll.deleteOne(query)
}

// Función para convertir string ID a ObjectId
export function toObjectId(id: string) {
  return new ObjectId(id)
}

