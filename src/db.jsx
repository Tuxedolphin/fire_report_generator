import Dexie from "dexie";

export const db = new Dexie("PhotoDatabase");
db.version(1).stores({
  photos: "++id, numb",
});

// Add a photo along with its details to the database
export function addPhoto(photo) {
  try {
    return db.photos.add({
      numb: photo.numb,
      photoNumb: photo.photoNumb,
      copyOf: photo.copyOf,
      hasCopy: null,
      description: photo.description,
      image: photo.blob,
    });
  } catch (error) {
    console.log(error);
    return -1;
  }
}

// Updates a photo
export async function updatePhoto(photo) {

  console.log('photos updating')
  console.log(photo);

  try {
    const status = await db.photos.update(photo.id, {
      numb: photo.numb,
      photoNumb: photo.photoNumb,
      copyOf: photo.copyOf,
      hasCopy: photo.hasCopy,
      description: photo.description,
    });

    if (status > 0) {
      return status;
    } else {
      console.log(
        `No photo updated with id ${photo.id} for photo ${photo.photoNumb}`
      );
      return 0;
    }
  } catch (error) {
    console.log(error);
    return -1;
  }
}

// Deletes a photo entry from the database
export async function deletePhoto(id) {
  try {
    await db.photos.delete(id);
  } catch (error) {
    console.log(error);
    return -1;
  }
}

// Clears all the entries in the database
export async function clearAll() {
  try {
    await db.photos.clear();
    return 1;
  } catch (error) {
    console.log(error);
    return -1;
  }
}

// Retrieves a specific photo based on the database ID
export async function retrievePhoto(id) {
  try {
    return await db.photos.get(id);
  } catch (error) {
    console.log(error);
    return null;
  }
}

// Retrieves all the photos in the database
export async function retrieveAll() {
  return await db.photos.toArray();
}
