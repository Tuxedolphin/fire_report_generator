import Dexie from "dexie";

export const db = new Dexie("PhotoDatabase");
db.version(1).stores({
  photos: "++id, numb",
});

/**
 * Add a photo along with its details to the database
 * @param {Photo} photo The photo object
 * @returns If => 0, the id of the photo, or -1 meaning there's been an error
 */
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

/**
 * Updates a photo entry in the database
 * @param {Photo} photo The photo object
 * @returns The status:
 * * > 0 -> The number of entries updated
 * * = 0 -> No photo was updated
 * * < 0 -> Error
 */
export async function updatePhoto(photo) {

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

/**
 * Deletes a photo from the database
 * @param {number} id The id of the photo to be deleted
 * @returns The status, -1 for for error and 1 for no error.
 */
export async function deletePhoto(id) {
  try {
    await db.photos.delete(id);
    return 1;
  } catch (error) {
    console.log(error);
    return -1;
  }
}

/**
 * Deletes all the entries in the database
 * @returns The status - 1 for success and -1 for error.
 */
export async function clearAll() {
  try {
    await db.photos.clear();
    return 1;
  } catch (error) {
    console.log(error);
    return -1;
  }
}

/**
 * Retrieves a specific photo based on the database ID
 * @param {number} id 
 * @returns {Photo | null} The photo object if there is one matching the id, or null if there isn't.
 */
export async function retrievePhoto(id) {
  try {
    return await db.photos.get(id);
  } catch (error) {
    console.log(error);
    return null;
  }
}

/**
 * Retrieves all of the entries in the database
 * @returns {Array<Object>} The array of objects (Not photo objects), with the key value pair matching
 * that of the database.
 */
export async function retrieveAll() {
  return await db.photos.toArray();
}
