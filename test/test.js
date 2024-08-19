function generate() {
    // Initialise pptx library
    let pptx = new PptxGenJS();

    // Add slides inside the ppt
    let slide1 = pptx.addSlide();

    let ops1 = {
        x:0.0,
        y:0.25,
        w:'100%',
        h:1.5,
        align:'center',
        color:'F00',
        fill:'000'
    }

    slide1.addText("This is the first hello world slide", ops1);

    pptx.writeFile();
}

let button = document.querySelector("button");
button.addEventListener("click", (e) => {
    generate();
});