import pptxgen from "pptxgenjs";

//Defining constants for global use - note that let is used to update it every time the function is called
let bag, c1Acc, incNumb, location, postalCode, postalCodeLine;

let pptx;

let annex = "A";
let pageNumb = 1;

/**
 * Retrieves and updates the variables to be that from localStorage
 */
function updateBasicConstants() {
  //Getting constants from local storage
  bag = localStorage.getItem("bagNumb");
  c1Acc = (localStorage.getItem("c1acc") === null) ? false : JSON.parse(localStorage.getItem("c1acc"));
  incNumb = localStorage.getItem("incidentNumb");
  location = localStorage.getItem("location").toUpperCase();
  postalCode = (localStorage.getItem("postalCode"));

  if (!postalCode) {
    postalCodeLine = '';
  } else {
    postalCodeLine = `                                   SINGAPORE ${postalCode}`;
  }
}

/**
 * Functions increment the alphabet by one and returns the result
 * 
 * @param {char} c 
 * @returns The next character in the alphabet
 */
function nextChar(c) {
  return String.fromCharCode(c.charCodeAt(0) + 1);
}

/**
 * 
 * @param {Image} image The image object for calculating the aspect ratio
 * @returns The aspect ratio
 */
function getAspectRatio(image) {

  const w = image.naturalWidth;
  const h = image.naturalHeight;

  let aspectRatio;

  if (w > h) {
      aspectRatio = w / h;
  } else {
      aspectRatio = h / w;
  }

  return aspectRatio;

};

/**
 * Creates a new pptxgen object and formats its basic values
 */
function formatPptx() {
  
  pptx = new pptxgen();
  
  pptx.subject = "Fire Report";
  pptx.theme = { headFontFace: "Arial", bodyFontFace: "Arial" };
  pptx.defineLayout({ name:'A4', width:7.5, height:11.0244094 });
  pptx.layout = "A4";
  
}

/**
   * Adds the basic formatting to each slide. Specific values taken with reference from original ppt (in inches),
   * which is why the values are so specific.
   * 
   * @param {[slide]} slide
   */
const formatPage = (slide) => {
  slide.addText("CONFIDENTIAL", {
    y: 0.06,
    w: "100%",
    h: 0.29,
    align: "center",
    bold: true,
    fontSize: 12,
  });

  slide.addText(
    [
      { text: `INCIDENT NUMBER: /${incNumb}`, options: { breakLine: true } },
      { text: `LOCATION OF FIRE: ${location}`, options: { breakLine: true } },
      { text: postalCodeLine } // Extra white space for formatting
    ],
    { x: 0.6653543, y: 0.4291339, h: 0.6968504, w: 5.5472441, fontSize: 12 }
  );

  slide.addText(`ANNEX ${annex}`, {
    x: 6.2165354331,
    y: 0.4291339,
    h: 0.3425197,
    w: 1.14173,
    fontSize: 15,
    bold: true,
    underline: true
  });

  slide.addText(
    [
      { text: `${annex}-${pageNumb}`, options: { breakLine: true } },
      { text: "CONFIDENTIAL"}
    ],
    { y: 10.429134, w: "100%", h: 0.492126, bold: true, fontSize: 12, align: "center" }
  )
}

/**
 * Formats the slide if it is a slide which requires drawing (e.g. Annex A)
 * @param {slide} slide 
 * @param {bool} layout If the drawing is for the layout plan of the affected area
 */
const formatDrawingTemplate = (slide, layout) => {
  formatPage(slide);
  slide.addShape(pptx.shapes.RECTANGLE, { 
    x: 0.4173228,
    y: 1.511811,
    w: 6.8346457,
    h: 8.7559055,
    line: { width: 2.25 }
  });

  slide.addShape(pptx.shapes.LINE, {
    x: 0.4173228,
    y: 9.2637795,
    w: 6.8188976,
    h: 0,
    line: { width: 2.25 }
  });

  // For the location of "sketch" and "legend" text
  let sketchX, legendX, y;

  if (layout) {
    slide.addShape(pptx.shapes.LINE, {
      x: 3.334646,
      y: 9.2637795,
      w: 0,
      h: 1,
      line: { width: 2.25 }
    });

    slide.addShape(pptx.shapes.RECTANGLE, {
      x: 3.58268,
      y: 9.5393701,
      w: 0.3346457,
      h: 0.2519685,
      line: { width: 1 }
    });

    slide.addText("THE AFFECTED AREA", {
      x: 4,
      y: 9.5393701,
      w: 1.41732,
      h: 0.2519685,
      fontSize: 8,
    });

    slide.addShape(pptx.shapes.OVAL, {
      x: 3.58268,
      y: 9.8582677,
      w: 0.3346457,
      h: 0.3346457,
      line: {width : 1.5, color: "#FC0128" }
    });

    slide.addText("AREA OF FIRE ORIGIN", {
      x: 4,
      y: 9.8582677,
      w: 1.41732,
      h: 0.2519685,
      fontSize: 8,
    });

    y = 9.2637795;
    sketchX = 0.4173228;
    legendX = 3.354331;

  } else {
    slide.addShape(pptx.shapes.LINE, {
      x: 4.1653543,
      y: 9.2637795,
      w: 0,
      h: 1,
      line: { width: 2.25 }
    });

    y = 9.3385827;
    sketchX = 0.5826772;
    legendX = 4.3188976;
  }

  slide.addText("NOT DRAWN TO SCALE", {
    x: 0.6338583,
    y: 8.9685039,
    w: 1.480315,
    h: 0.23622,
    fontSize: 8,
    color: "919191",
    underline: true,
  });

  slide.addText("SKETCH:", {
    x: sketchX,
    y: y,
    h: 0.2598425,
    w: 0.826772,
    fontSize: 10,
    underline: true
  });
  
  slide.addText("LEGEND:", {
    x: legendX,
    y: y,
    h: 0.2598425,
    w: 0.826772,
    fontSize: 10,
    underline: true
  });

  annex = nextChar(annex);
}


/**
 * Generates the photo log of the app and adds it to the ppt slide
 * 
 * @param {Array<Photo>} photos The array of photo objects
 */
function generatePhotoLog(photos) {

  let basic = { bold: true, align: "center" };
  
  let rows = [[
    { text: "Photo", options: basic },
    { text: "Photo UID No.", options: basic },
    { text: "Descriptions", options: basic },
  ]];

  photos.forEach((photo) => {
    if (bag) {
      photo.photoUIDNumb = `${bag}/${photo.photoNumb}`
    }

    photo.isLandscape = (photo.image.width > photo.image.height) ? true : false;

    rows.push([
      { text: photo.displayedNumb, options: { align: "center" } },
      { text: photo.photoUIDNumb, options: basic },
      photo.description
    ]);
  });

  console.log(rows);

  let newSlide = pptx.addSlide();
  formatPage(newSlide);
  newSlide.addTable(rows, {
    x: 0.4173228,
    y: 2.200787,
    colW: [1.240157, 1.92913, 3.58268],
    rowH: 0.488189,
    h: 8,

    valign: "middle",
    border: { type: "solid" },
    autoPage: true,
    autoPageRepeatHeader: true,
    autoPageSlideStartY: 2.200787,
  });

  newSlide.addText("TABLE OF PHOTO-LOG", {
    x: 0.4094488,
    y: 1.673228,
    h: 0.3897638,
    w: 3.165354,
    fontSize: 18
  });

  pageNumb++;
  
  newSlide.newAutoPagedSlides.forEach((slide) => {
    
    formatPage(slide);
    pageNumb++;
    
    slide.addText("TABLE OF PHOTO-LOG", {
      x: 0.4094488,
      y: 1.673228,
      h: 0.3897638,
      w: 3.165354,
      fontSize: 18
    });
  });
  
  annex = nextChar(annex);
  pageNumb = 1;
}

/**
 * Generates the annex whereby the photos are displayed along with their descriptions
 * 
 * @param {Array<Photo>} photos 
 */
function generatePhotoAnnex(photos) {
  
  // The default Y position of photos if they are 4:3
  const defaultY = {
    l1: 1.326772, // First photo of landscape mode
    l2: 5.9094488,
    p: 2.3622,
  }

  const defaultX = {
    l: 1.251969, // X location for landscape pictures
    p1: 0.1653543, // X location for left portrait photo if there's two on one slide
    p2: 3.85827,
    pc: 2.07874, // X location for if there's only one portrait photo on the slide, i.e. it's in the center
  }

  // Defining the width of the photos
  const width = {
    l: 5.0748031, // For landscape
    p: 3.484252, // For portrait
  }

  for (let i = 0; i < photos.length; i++) {

    let slide = pptx.addSlide();
    formatPage(slide);

    const firstPhoto = photos[i];
    const firstRatio = getAspectRatio(firstPhoto.image);

    if (firstPhoto.isLandscape) {

      const firstPhotoHeight = (width.l * (1/firstRatio));
      slide.addImage({
        x: defaultX.l,
        y: defaultY.l1 + (3.5 - firstPhotoHeight), // Need to account for the difference in height for different aspect ratios
        w: width.l,
        h: firstPhotoHeight,
        path: firstPhoto.image.src,
        sizing: { type: "contain", w: width.l, h: firstPhotoHeight }
      });

      const topTextY = 4.8937008;
      const topTextHeight = 0.2007874;

      const leftTopTextFormat = {
        x: 1.251969,
        w: 2.5,
        h: topTextHeight,
        fontSize: 12,
        bold: true,
        margin: 0,
      };

      const rightTopTextFormat = {
        x: '50%',
        w: 2.574803,
        h: topTextHeight,
        fontSize: 12,
        bold: true,
        margin: 0,
        align: "right",
      };

      const descriptionFormat = {
        x: 1.2519685,
        h: 0.708661,
        w: 5.0748031,
        fontSize: 12,
        margin: 0,
        valign: "top",
      };

      slide.addText(`PHOTO ${firstPhoto.numb}`, {
        ...leftTopTextFormat,
        y: topTextY,
      });

      slide.addText(firstPhoto.photoUIDNumb, {
        ...rightTopTextFormat,
        y: topTextY
      });

      slide.addText(firstPhoto.description, {
        ...descriptionFormat,
        y: 5.0984252,
      });

      if (i < photos.length - 1) {
        // The second photo must be of the same orientation and not have a copy
        if (photos[i + 1].isLandscape && !photos[i + 1].hasCopy) {
          i++;
          const secondPhoto = photos[i];
          const secondRatio = getAspectRatio(secondPhoto.image);

          const secondPhotoHeight = width.l * (1/secondRatio);

          slide.addImage({
            x: defaultX.l,
            y: defaultY.l2 + (3.5 - secondPhotoHeight), // Need to account for the difference in height for different aspect ratios
            w: width.l,
            h: secondPhotoHeight,
            path: secondPhoto.image.src,
            sizing: { type: "contain", w: width.l, h: secondPhotoHeight }
          });

          const bottomTextY = 9.488189;

          slide.addText(`${secondPhoto.copyOf ? "COPY OF" : ""} PHOTO ${secondPhoto.numb}`, {
            ...leftTopTextFormat,
            y: bottomTextY,
          });

          slide.addText(secondPhoto.photoUIDNumb, {
            ...rightTopTextFormat,
            y: bottomTextY,
          });

          slide.addText(secondPhoto.description, {
            ...descriptionFormat,
            y: 9.6929134,
          });
        }
      }

    } else {

      let slide = pptx.addSlide();
      let photo = photos[i];

      formatPage(slide);

      // For the y-position and height of photo number and photo UID number text boxes
      const topTextY = 7.0590551;
      const topTextH = 0.2007874;

      // For the width of the textbox for photo number and photo UID number
      const leftW = 1.858268;
      const rightW = 1.625984;
      
      let ratio = getAspectRatio(photo);

      const imgDimension = {
        w: width.p,
        h: width.p * ratio
      };

      const topTextFormat = {
        y: topTextY,
        h: topTextH,
        fontSize: 12,
        bold: true,
        margin: 0,
      }

      const descriptionFormat = {
        y: 7.2598425,
        h: 0.9094488,
        w: 3.66142,
        valign: "top",
        fontSize: 12,
      };;

      // For when there is only one portrait photo on the slide
      if (i == photos.length - 1 || photos[i + 1].isLandscape || photos[i + 1].hasCopy) {

        slide.addImage({
          x: defaultX.pc,
          y: defaultY.p + (4.645669 - imgDimension.h),
          ...imgDimension,
          path: photo.image.src,
          sizing: { type: "contain", ...imgDimension },
        });

        slide.addText(`${photo.copyOf ? "COPY OF" : ""} PHOTO ${photo.numb}`, {
          ...topTextFormat,
          x: defaultX.pc,
          w: leftW,
        });

        slide.addText(photo.photoUIDNumb, {
          ...topTextFormat,
          x: defaultX.pc,
          w: rightW,
          align: "right"
        });
        
        slide.addText(photo.description, {
          ...descriptionFormat,
          x: defaultX.pc,
        });

      } else {

        let leftX = defaultX.p1;
        let rightX = 2.027559;

        // For loop for 2 photos
        for (let j = 0; j < 2; j++) {
          
          // Formatting of image and its descriptions
          slide.addImage({
            x: leftX,
            y: defaultY.p + (4.645669 - imgDimension.h),
            ...imgDimension,
            path: photo.image.src,
            sizing: { type: "contain", ...imgDimension }
          });
  
          slide.addText(`PHOTO ${photo.numb}`, {
            ...topTextFormat,
            x: leftX,
            w: leftW,
          });

          slide.addText(photo.photoUIDNumb, {
            ...topTextFormat,
            x: rightX,
            w: rightW,
            align: "right"
          });
          
          slide.addText(photo.description, {
            ...descriptionFormat,
            x: leftX,
          });

          // Update variables to follow that of the second image
          leftX = defaultX.p2;
          rightX = 5.7165354;
          photo = photos[i + 1];

          if (Math.abs(getAspectRatio(photo) - ratio) > 0.0001) {
            ratio = getAspectRatio(photo);
          }
        }
        i++;
      }
    }

    pageNumb++;
    
  }

  pageNumb = 1;
  annex = nextChar(annex);
}

/**
 * Generates the ppt report and downloads it on user's computer
 * 
 * @param {Array<Photo>} photos Array of Photo objects 
 */
async function generateReport(photos) {

  console.log(photos);

  updateBasicConstants();
  formatPptx();

  // Ensure the beginning variables are reset
  annex = 'A';
  pageNumb = 1;

  const leftEdge = 0.4173228;

  // Adds the front annexes
  if (!c1Acc) {

    let topEdge = 9.6732283;
    let rightEdge = 4.511811;

    let sketchWordsFormat = {
      x: leftEdge,
      y: topEdge,
      w: 3.732283,
      h: 0.3425197,
      bold: true,
      align: "center",
      fontSize: 15,
    }

    let legendWordsFormat = {
      x: 5.07874,
      y: topEdge,
      w: 1.389764,
      h: 0.2519685,
      fontSize: 8,
    }

    let rectangleFormat = {
      x: rightEdge,
      y: topEdge,
      w: 0.4173228,
      h: 0.2519685,
    }

    let annexA = pptx.addSlide();
    formatDrawingTemplate(annexA, false);
    annexA.addText("LOCATION PLAN", sketchWordsFormat);
    annexA.addShape(pptx.shapes.RECTANGLE, {
      ...rectangleFormat,
      line: { width: 1.5, color: "#FF0000" },
    });
    annexA.addText("INCIDENT SITE", legendWordsFormat);
    
    let annexB = pptx.addSlide();
    formatDrawingTemplate(annexB, false);
    annexB.addText("SITE PLAN", sketchWordsFormat);
    annexB.addShape(pptx.shapes.RECTANGLE, {
      ...rectangleFormat,
      line: { width: 1.5 },
      fill: { type: "solid", color: "#919191"}
    });
    annexB.addText("THE AFFECTED AREA", legendWordsFormat);
  }
  
  let newSlide = pptx.addSlide();
  formatDrawingTemplate(newSlide, true);
  newSlide.addText(
    [
      { text: "LAYOUT PLAN OF THE", options: { breakLine: true } },
      { text: "AFFECTED AREA"},
    ],
    { x: leftEdge,
      y: 9.511811,
      w: 2.905512,
      h: 0.492126,
      bold: true,
      align: "center",
      fontSize: 12,
    }
  );
  
  if (!c1Acc) {
    generatePhotoLog(photos);

    console.log(photos.at(-1));

    let annexE = pptx.addSlide();
    formatPage(annexE);
    formatDrawingTemplate(annexE, true);
    annexE.addText(
      [
        { text: "PHOTO-LOG", options: { breakLine: true, fontSize: 14 } },
        { text: `Photos 1-${photos.at(-1).numb}`, options: { fontSize: 12 } },
      ],
      { x: leftEdge,
        y: 9.511811,
        w: 2.905512,
        h: 0.492126,
        bold: true,
        align: "center"
      });
  }
  
  generatePhotoAnnex(photos);

  pptx.writeFile({ fileName: `${incNumb.replace("/", "-")}-location` });

}

export default generateReport;