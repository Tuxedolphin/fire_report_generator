import pptxgen from "pptxgenjs";

/**
 * Functions increment the alphabet by one and returns the result
 * 
 * @param {Char} c 
 * @returns The next character in the alphabet
 */
function nextChar(c) {
  return String.fromCharCode(c.charCodeAt(0) + 1);
}
nextChar('a');

async function generateReport() {
  // Getting constants from local storage
  const bag = localStorage.getItem("bagNumb");
  const c1Acc = localStorage.getItem("c1acc");
  const incNumb = localStorage.getItem("incidentNumb");
  const location = localStorage.getItem("location").toUpperCase();
  const postalCode = localStorage.getItem("postalCode");
  
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

    slide.addText(`ANNEX ${annex}`, { x: 6.2165354331, y: 0.4291339, fontSize: 12 });

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

    slide.addShape(pptx.shapes.LINE, {
      x: 4.1653543,
      y: 9.2637795,
      w: 0,
      h: 1,
      line: { width: 2.25 }
    });

  }

  // Adds the front annexes
  if (c1Acc) {
    let slide = pptx.addSlide();
    formatDrawingTemplate(slide);
  } else {

  }
  


  let slide = pptx.addSlide();
  formatPage(slide);



  pptx.writeFile({ fileName: `${incNumb.replace("/", "-")}-location` });

}

export default generateReport;