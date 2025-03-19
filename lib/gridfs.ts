import { GridFSBucket, ObjectId } from "mongodb"
import clientPromise from "./mongodb"

// Función para obtener un bucket de GridFS
export async function getGridFSBucket() {
  const client = await clientPromise
  const db = client.db("patitas_eternas")
  return new GridFSBucket(db, { bucketName: "images" })
}

// Función para guardar una imagen en GridFS
export async function saveImage(buffer: Buffer, filename: string, contentType: string) {
  const bucket = await getGridFSBucket()

  return new Promise<string>((resolve, reject) => {
    const uploadStream = bucket.openUploadStream(filename, {
      contentType,
      metadata: {
        uploadDate: new Date(),
      },
    })

    uploadStream.on("error", reject)
    uploadStream.on("finish", () => {
      resolve(uploadStream.id.toString())
    })

    uploadStream.write(buffer)
    uploadStream.end()
  })
}

// Función para obtener una imagen por su ID
export async function getImageById(id: string) {
  const bucket = await getGridFSBucket()

  try {
    const _id = new ObjectId(id)
    const file = await bucket.find({ _id }).toArray()

    if (!file || file.length === 0) {
      return null
    }

    return {
      stream: bucket.openDownloadStream(_id),
      metadata: file[0],
    }
  } catch (error) {
    console.error("Error al obtener imagen:", error)
    return null
  }
}

// Función para eliminar una imagen por su ID
export async function deleteImageById(id: string) {
  const bucket = await getGridFSBucket()

  try {
    const _id = new ObjectId(id)
    await bucket.delete(_id)
    return true
  } catch (error) {
    console.error("Error al eliminar imagen:", error)
    return false
  }
}

