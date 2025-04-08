class Photo {
  /**
   * Constructor function
   * @param {File | Blob} image The file or blob object containing the information about the image
   * @param {number} numb The number of the photo, i.e. the number after PHOTO _ and COPY OF PHOTO _.
   * @param {string} photoNumb The UID of the photo, excluding the evidence bag number.
   * @param {string} description The description of the image.
   * @param {number} id The unique ID for each image, given as the return value of the add photo database
   * @param {number | null} copyOf If the photo is a copy of another image, the id of the image that it is a copy of, else null.
   * @param {number | null} hasCopy If the photo has a copy, the id of the image that is a copy of this photo, else null.
   */
  constructor(
    image,
    numb,
    photoNumb,
    description,
    id = -1,
    copyOf = null,
    hasCopy = null
  ) {
    this.id = id;
    this.image = new Image();
    this.image.src = URL.createObjectURL(image);
    this.photoNumb = photoNumb.toString();
    this.description = description;
    this.copyOf = copyOf;
    this.hasCopy = hasCopy;
    this.blob = new Blob([image]);

    this.numb = numb;
    this.displayedNumb = (copyOf ? "Copy of " : "") + numb.toString(); // The displayed string in the table
  }

  /**
   * Updates the photo number of the object.
   * @param {number} newNumb The new number to update the number to
   */
  updateNumb(newNumb) {
    this.numb = newNumb;
    this.displayedNumb = (this.copyOf ? "Copy of " : "") + newNumb.toString();
  }

  /**
   * Creates and returns an identical copy of the image
   * @returns A new photo object
   */
  createPureCopy() {
    return new Photo(
      this.image,
      this.numb,
      this.photoNumb,
      this.description,
      this.id,
      this.copyOf,
      this.hasCopy
    );
  }

  /**
   * Creates a copy of the image object for the 'COPY OF ...' photo.
   * @returns A new photo object with -1 for id and the original photo's id for copyOf
   */
  createCopy() {
    return new Photo(this.blob, this.numb, this.photoNumb, "", -1, this.id);
  }

  /**
   * Checks if the current image object is a landscape or portrait image
   * @returns "landscape" if the object is a landscape image, or "portrait" otherwise.
   */
  getOrientation() {
    return this.image.width > this.image.height ? "landscape" : "portrait";
  }
}

export default Photo;
