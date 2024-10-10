import pptxgen from "pptxgenjs";

/**
 * Functions increment the alphabet by one and returns the result
 * 
 * @param {char} c 
 * @returns The next character in the alphabet
 */
function nextChar(c) {
  return String.fromCharCode(c.charCodeAt(0) + 1);
}
nextChar('a');

/**
 * Generates the ppt report and downloads it on user's computer
 * 
 * @param {Array} photos Array of Photo objects 
 */
async function generateReport(photos) {

  console.log(photos);

  // Getting constants from local storage
  const bag = localStorage.getItem("bagNumb");
  const c1Acc = JSON.parse(localStorage.getItem("c1acc"));
  const incNumb = localStorage.getItem("incidentNumb");
  const location = localStorage.getItem("location").toUpperCase();
  const postalCode = localStorage.getItem("postalCode");
  
  console.log(c1Acc);

  // Formatting of slide
  let pptx = new pptxgen();
  
  pptx.subject = "Fire Report";
  pptx.theme = { headFontFace: "Arial", bodyFontFace: "Arial" };
  pptx.defineLayout({ name:'A4', width:7.5, height:11.0244094 });
  pptx.layout = "A4";
  
  let annex = "A";
  let pageNumb = 1;
  
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
        { text: `                                   SINGAPORE ${postalCode}`} // Extra white space for formatting
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
   * Generates the photo-log of the given project
   */
  const generatePhotoLog = () => {

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
    generatePhotoLog();

    let annexE = pptx.addSlide();
    formatPage(annexE);
    formatDrawingTemplate(annexE, true);
    annexE.addText(
      [
        { text: "PHOTO-LOG", options: { breakLine: true, fontSize: 14 } },
        { text: `Photos 1-${photos.at(-1).slice(-1)}`, options: { fontSize: 12 } },
      ],
      { x: leftEdge,
        y: 9.511811,
        w: 2.905512,
        h: 0.492126,
        bold: true,
        align: "center"
      });
  }

  let lastPhoto = {};

  for (let i = 0, total = photos.length; i < total; i++) {

    let slide = 

    let photo = photos[i];


    if ()
  }

  pptx.writeFile({ fileName: `${incNumb.replace("/", "-")}-location` });

}

export default generateReport;