let canvas, context, W, H, imgInput, pozanemodificata = 0, selecting = false, selectieNoua;
let textScris = false;
function aplicatie() {
    canvas = document.querySelector('#canv');
    downloadbtn = document.getElementById('download');
    opbtn = document.getElementById('originalPhoto');
    albnegrubtn = document.getElementById('albnegru');
    vintagebtn = document.getElementById("vintage");
    resetbtn = document.getElementById("reset");
    coldbtn = document.getElementById("cold");
    pinkbtn = document.getElementById("pink");
    invertedbtn = document.getElementById("inverted");
    resizebtn = document.getElementById("rszz");
    selectionbtn = document.getElementById("selc");
    deleteselbtn = document.getElementById("delsel");
    cropbtn = document.getElementById("crop");
    addtextbtn = document.getElementById("addtxt");

    W = canvas.width;
    H = canvas.height;
    context = canvas.getContext('2d');
    imgInput = document.getElementById('fileBrowser');
    copieCanvas = document.createElement("canvas");
    copieContext = copieCanvas.getContext('2d');
    
    myImg = document.createElement('img');

    function copiazaCanvas() {
       copieCanvas.width = canvas.width;
       copieCanvas.height = canvas.height;
       copieContext.drawImage(canvas, 0, 0);
    }


    function stareActuala() {
        canvas.toBlob(function (blob) {
              image = document.createElement('img'),
              url = URL.createObjectURL(blob);

              image.addEventListener("load", function (event) {
                   URL.revokeObjectURL(url);
              });
              image.src = url;
        });

        copiazaCanvas();
    }

    function selectie(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width; 
        this.height = height;
    }

    selectie.prototype.desenDreptunghi = function () {
        context.strokeStyle = "red";
        context.lineWidth = 4;
        context.strokeRect(this.x, this.y, this.width, this.height);
    }

    selectionbtn.addEventListener("click", e => {
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        selectieNoua = new selectie(0, 0, canvas.width, canvas.height);
        selectieNoua.desenDreptunghi();

        function mousedown(e) {
            selectieNoua.x = Math.round(e.x - canvas.getBoundingClientRect().x);
            selectieNoua.y = Math.round(e.y - canvas.getBoundingClientRect().y);
            selecting = true;
        }
        canvas.addEventListener("mousedown", mousedown, false);

        function mouseup(e) {
            selecting = false;
        }
        canvas.addEventListener("mouseup", mouseup, false);

        function mousemove(e) {
            if (selecting == true) {
                selectieNoua.width = Math.round(e.x - canvas.getBoundingClientRect().x) - selectieNoua.x;
                selectieNoua.height = Math.round(e.y - canvas.getBoundingClientRect().y) - selectieNoua.y;
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
                selectieNoua.desenDreptunghi();
            }
        }
        canvas.addEventListener('mousemove', mousemove, false);
    });

    cropbtn.addEventListener("click", e => {
        if (selectieNoua != null) {
            canvas.width = selectieNoua.width;
            canvas.height = selectieNoua.height;

            context.drawImage(image, selectieNoua.x, selectieNoua.y, selectieNoua.width, selectieNoua.height, 0, 0, canvas.width, canvas.height);

            stareActuala();

            selectieNoua = null;
        }
    })

    deleteselbtn.addEventListener("click", e => {
        if (selectieNoua != null) {
            context.clearRect(selectieNoua.x, selectieNoua.y, selectieNoua.width, selectieNoua.height);

            stareActuala();
            selectieNoua = null;
        }
    });

    addtextbtn.addEventListener("click", e => {
        if (textScris == false) {
            textScris = true;

            let insertedtext = document.getElementById("inserttxt").value;
            let insertedsize = document.getElementById("sztxt").value;
            let colortxt = document.getElementById("colortxt").value;

            insertedtxtX = 0;
            insertedtxtY = 0;

            context.strokeStyle = colortxt;
            context.fillStyle = colortxt;
            context.font = insertedsize + 'px Tahoma';

            function mousedown(e) {
                insertedtxtX = e.x - canvas.getBoundingClientRect().x;
                insertedtxtY = e.y - canvas.getBoundingClientRect().y;
            }
            canvas.addEventListener('mousedown', mousedown, false);

            function mouseup(e) {
                context.fillText(insertedtext, insertedtxtX, insertedtxtY);
            }
            canvas.addEventListener("mouseup", mouseup, false);

            function mousemove(e) {
                insertedtxtX = e.x - canvas.getBoundingClientRect().x;
                insertedtxtY = e.y - canvas.getBoundingClientRect().y;
            }
            canvas.addEventListener("mousemove", mousemove, false);


        } else if (textScris == true) {
            context.drawImage(image, 0, 0);
            textScris = false;
            canvas.removeEventListener("mouseup", mouseup);
            canvas.removeEventListener("mousedown", mousedown);
            canvas.removeEventListener("mousemove", mousemove);
        }
    });

    imgInput.addEventListener('change', e => {

        if (e.target.files) {
            var imgFile = e.target.files[0];
            var reader = new FileReader();
            reader.readAsDataURL(imgFile);
            reader.onload = function (e) {
                const myImg = new Image();
                myImg.src = e.target.result;
                myImg.onload = function (ev) {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    r = myImg.naturalHeight / myImg.naturalWidth;
                    W = 800;
                    H = canvas.width * r;
                    context.drawImage(myImg, 0, 0, canvas.width, canvas.height);

                    stareActuala();

                    let imgData = canvas.toDataURL("image/jpeg", 0.75);
                }
            }

        }

        opbtn.addEventListener("click", e => {
            context.drawImage(copieCanvas, 0, 0);
        });

        albnegrubtn.addEventListener("click", albnegru);

        vintagebtn.addEventListener("click", e => {
            imgData = copieContext.getImageData(0, 0, copieCanvas.width, copieCanvas.height);
            pixeli = imgData.data;

            for (let i = 0; i < copieCanvas.height; i++) {
                for (let j = 0; j < copieCanvas.width; j++) {

                    var p = 4 * (j + i * copieCanvas.width);

                    rosu = pixeli[p];
                    verde = pixeli[p + 1];
                    albastru = pixeli[p + 2];
                    

                    var fr = rosu * .393 + verde * .769 + albastru * .189;
                    var sc = rosu * .349 + verde * .686 + albastru * .168;
                    var trd = rosu * .272 + verde * .534 + albastru * .131;

                    pixeli[p] = fr;
                    pixeli[p + 1] = sc;
                    pixeli[p + 2] = trd;

                    
                }
            }

            context.putImageData(imgData, 0, 0);
        });

        coldbtn.addEventListener("click", e => {
            imgData = copieContext.getImageData(0, 0, copieCanvas.width, copieCanvas.height);
            pixeli = imgData.data;

            for (let i = 0; i < copieCanvas.height; i++) {
                for (let j = 0; j < copieCanvas.width; j++) {
                    var p = 4 * (j + i * copieCanvas.width);
                    rosu = pixeli[p];
                    verde = pixeli[p + 1];
                    albastru = pixeli[p + 2];

                    pixeli[p] = 255 - rosu;
                    pixeli[p + 1] = verde;
                    pixeli[p + 2] = albastru;
                }
            }
            context.putImageData(imgData, 0, 0);

        });

        pinkbtn.addEventListener("click", e => {
            imgData = copieContext.getImageData(0, 0, copieCanvas.width, copieCanvas.height);
            pixeli = imgData.data;

            for (let i = 0; i < copieCanvas.height; i++) {
                for (let j = 0; j < copieCanvas.width; j++) {
                    var p = 4 * (j + i * copieCanvas.width);

                    rosu = pixeli[p];
                    verde = pixeli[p + 1];
                    albastru = pixeli[p + 2];

                    pixeli[p] = rosu;
                    pixeli[p + 1] = 255-verde;
                    pixeli[p + 2] = albastru;
                }
            }
            context.putImageData(imgData, 0, 0);


        });


        invertedbtn.addEventListener("click", e => {
            imgData = copieContext.getImageData(0, 0, copieCanvas.width, copieCanvas.height);
            pixeli = imgData.data;

            for (let i = 0; i < copieCanvas.height; i++) {
                for (let j = 0; j < copieCanvas.width; j++) {
                    var p = 4 * (j + i * copieCanvas.width);

                    rosu = pixeli[p];
                    verde = pixeli[p + 1];
                    albastru = pixeli[p + 2];

                    pixeli[p] = 255-rosu;
                    pixeli[p + 1] = 255 - verde;
                    pixeli[p + 2] = 255 -albastru;
                }
            }
            context.putImageData(imgData, 0, 0);
        });
   
        function albnegru(img, canv) {
            img = myImg;
            canv = copieCanvas;
            context.drawImage(img, 0, 0);
            var imageData = context.getImageData(
                0, 0, canv.width, canv.height);
            var pixeli = imageData.data;

            for (var i = 0; i < pixeli.length; i++) {
                rosu=pixeli[i];
                verde = pixeli[i + 1];
                albastru = pixeli[i + 2];


                pixeli[i] = pixeli[i + 1] = pixeli[i + 2] = Math.round((rosu + verde + albastru) )/ 3;
            }
            context.putImageData(imageData, 0, 0);
            pozanemodificata = 1;

        }


    });

    resizebtn.addEventListener("click", e => {
        if (document.getElementById("latNoua").checked == true) {
            newWidth = document.querySelector("#reswidth").value;

            r = image.naturalHeight / image.naturalWidth;
            newHeight = newWidth * r;

            context.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = newWidth;
            canvas.height = newHeight;
            context.drawImage(image, 0, 0, newWidth, newHeight);

            stareActuala();
        }

        else if (document.getElementById("inaltNoua").checked == true) {
            r = image.naturalHeight / image.naturalWidth;
            newHeight = document.querySelector("#reswidth").value;
            newWidth = newHeight * r;

            context.clearRect(0, 0, canvas.width, canvas.height);
            canvas.width = newWidth;
            canvas.height = newHeight;
            context.drawImage(image, 0, 0, newWidth, newHeight);

            stareActuala();
        }
    });

    //backbtn.addEventListener("click", e => {
    //    canvas.width = 450;
    //    canvas.height = 310;
    //    copieCanvas.width = 450;
    //    copieCanvas.height = 310;
    //    stareActuala();

    //});

    resetbtn.addEventListener("click", e => {
        canvas.width = 450;
        canvas.height = 310;
        copieCanvas.width = 450;
        copieCanvas.height = 310;
        context.clearRect(0, 0, canvas.width, canvas.height);
        copieContext.clearRect(0, 0, copieCanvas.width, copieCanvas.height);

    });

    downloadbtn.addEventListener('click', e => {
        console.log(canvas.toDataURL());
        const link = document.createElement('a');
        link.download = 'ModifiedPhoto.png';
        link.href = canvas.toDataURL();
        link.click();
        link.delete;
    });

}


document.addEventListener('DOMContentLoaded', aplicatie);

