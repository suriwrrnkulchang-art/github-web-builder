document.addEventListener("DOMContentLoaded", function () {

    console.log("mama.js เริ่มทำงานแล้ว");


    /* =========================================
       ELEMENT
    ========================================= */

    const soundBtn = document.getElementById("soundBtn");
    const joinPopup = document.getElementById("joinPopup");
    const popupContent = document.getElementById("popupContent");
    const cancelBtn = document.getElementById("cancelBtn");
    const confirmBtn = document.getElementById("confirmBtn");


    /* =========================================
       ตรวจสอบ HTML
    ========================================= */

    if (!soundBtn) {
        console.error("ไม่พบ #soundBtn");
        return;
    }

    if (!joinPopup) {
        console.error("ไม่พบ #joinPopup");
        return;
    }

    if (!popupContent) {
        console.error("ไม่พบ #popupContent");
        return;
    }

    if (!cancelBtn) {
        console.error("ไม่พบ #cancelBtn");
        return;
    }

    if (!confirmBtn) {
        console.error("ไม่พบ #confirmBtn");
        return;
    }


    /* =========================================
       เสียง
       
       HTML อยู่ใน /html/
       เสียงอยู่ใน /sounds/
       
       ดังนั้น ../sounds/ ถูกต้อง
    ========================================= */

    const clickSound = new Audio(
        "../sounds/u_62htdrvg4y-gun-shot-359196.mp3"
    );

    clickSound.preload = "auto";
    clickSound.volume = 1.0;


    /* =========================================
       ตัวแปร
    ========================================= */

    let timer = null;
    let timeLeft = 10;


    /* =========================================
       เปิด Popup
    ========================================= */

    soundBtn.addEventListener("click", function (event) {

        console.log("กดปุ่มหลักแล้ว");


        /* -----------------------------------------
           เล่นเสียง
        ----------------------------------------- */

        clickSound.pause();
        clickSound.currentTime = 0;

        clickSound.play()
            .then(function () {

                console.log("เสียงกำลังเล่น");

            })
            .catch(function (error) {

                console.error(
                    "เล่นเสียงไม่ได้:",
                    error
                );

            });


        /* -----------------------------------------
           Animation ปุ่ม
        ----------------------------------------- */

        soundBtn.classList.remove("pop-effect");

        void soundBtn.offsetWidth;

        soundBtn.classList.add("pop-effect");


        setTimeout(function () {

            soundBtn.classList.remove("pop-effect");

        }, 250);


        /* -----------------------------------------
           ซ่อนปุ่มหลัก
        ----------------------------------------- */

        soundBtn.style.display = "none";


        /* -----------------------------------------
           เปิด Popup
           
           ใช้ style โดยตรง
           ไม่พึ่ง .show อย่างเดียว
        ----------------------------------------- */

        joinPopup.style.display = "flex";
        joinPopup.classList.add("show");


        /* -----------------------------------------
           ตั้ง Popup กลางจอ
        ----------------------------------------- */

        popupContent.style.left = "50%";
        popupContent.style.top = "50%";
        popupContent.style.transform =
            "translate(-50%, -50%)";


        /* -----------------------------------------
           เริ่ม Countdown
        ----------------------------------------- */

        startCountdown();

    });



    /* =========================================
       COUNTDOWN
    ========================================= */

    function startCountdown() {

        if (timer !== null) {

            clearInterval(timer);
            timer = null;

        }


        timeLeft = 10;

        confirmBtn.disabled = true;

        confirmBtn.textContent = "ตกลง (10)";


        timer = setInterval(function () {

            timeLeft--;


            if (timeLeft > 0) {

                confirmBtn.textContent =
                    "ตกลง (" + timeLeft + ")";

            }


            else {

                clearInterval(timer);

                timer = null;


                confirmBtn.disabled = false;

                confirmBtn.textContent = "ตกลง";


                console.log(
                    "Countdown เสร็จแล้ว"
                );

            }

        }, 1000);

    }



    /* =========================================
       ปุ่มยกเลิก
    ========================================= */

    cancelBtn.addEventListener(
        "click",
        function () {

            console.log("กดยกเลิก");

            closePopup();

        }
    );



    /* =========================================
       ปุ่มตกลง
       
       เปลี่ยนหน้า
    ========================================= */

    confirmBtn.addEventListener(
        "click",
        function () {

            console.log("กดตกลง");


            /* ป้องกันกดก่อนเวลา */

            if (confirmBtn.disabled) {

                console.log(
                    "ยังไม่ครบ 10 วินาที"
                );

                return;

            }


            /* หยุด Timer */

            if (timer !== null) {

                clearInterval(timer);
                timer = null;

            }


            /* -----------------------------------------
               เปลี่ยนหน้า
               
               ไฟล์ปัจจุบัน:
               
               /html/index.html
               
               หน้าเป้าหมาย:
               
               /html2/home.html
               ----------------------------------------- */

            console.log(
                "กำลังไป ../html2/index.html"
            );


            window.location.assign(
                "../html2/index.html"
            );

        }
    );



    /* =========================================
       ปิด Popup
    ========================================= */

    function closePopup() {

        console.log("ปิด Popup");


        /* หยุด Timer */

        if (timer !== null) {

            clearInterval(timer);
            timer = null;

        }


        /* ซ่อน Popup */

        joinPopup.classList.remove("show");

        joinPopup.style.display = "none";


        /* แสดงปุ่มหลัก */

        soundBtn.style.display = "";


        /* Reset */

        timeLeft = 10;

        confirmBtn.disabled = true;

        confirmBtn.textContent = "ตกลง (10)";


        /* Reset Popup */

        popupContent.style.left = "50%";

        popupContent.style.top = "50%";

        popupContent.style.transform =
            "translate(-50%, -50%)";


        popupContent.classList.remove(
            "dragging"
        );

    }



    /* =========================================
       ระบบลาก Popup
    ========================================= */

    let isDragging = false;

    let mouseStartX = 0;
    let mouseStartY = 0;

    let popupStartX = 0;
    let popupStartY = 0;



    popupContent.addEventListener(
        "pointerdown",
        function (event) {


            /* ถ้ากดปุ่ม ไม่ลาก */

            if (
                event.target.closest("button")
            ) {

                return;

            }


            isDragging = true;


            popupContent.classList.add(
                "dragging"
            );


            const rect =
                popupContent.getBoundingClientRect();


            mouseStartX =
                event.clientX;

            mouseStartY =
                event.clientY;


            popupStartX =
                rect.left;

            popupStartY =
                rect.top;


            popupContent.style.left =
                popupStartX + "px";

            popupContent.style.top =
                popupStartY + "px";

            popupContent.style.transform =
                "none";


            try {

                popupContent.setPointerCapture(
                    event.pointerId
                );

            }

            catch (error) {

                console.warn(error);

            }

        }
    );



    /* =========================================
       ขณะลาก
    ========================================= */

    popupContent.addEventListener(
        "pointermove",
        function (event) {

            if (!isDragging) {
                return;
            }


            const rect =
                popupContent.getBoundingClientRect();


            let newX =
                popupStartX +
                (
                    event.clientX -
                    mouseStartX
                );


            let newY =
                popupStartY +
                (
                    event.clientY -
                    mouseStartY
                );


            const maxX =
                window.innerWidth -
                rect.width;


            const maxY =
                window.innerHeight -
                rect.height;


            newX =
                Math.max(
                    0,
                    Math.min(newX, maxX)
                );


            newY =
                Math.max(
                    0,
                    Math.min(newY, maxY)
                );


            popupContent.style.left =
                newX + "px";

            popupContent.style.top =
                newY + "px";

        }
    );



    /* =========================================
       ปล่อย Popup
    ========================================= */

    popupContent.addEventListener(
        "pointerup",
        function (event) {

            isDragging = false;

            popupContent.classList.remove(
                "dragging"
            );


            try {

                popupContent.releasePointerCapture(
                    event.pointerId
                );

            }

            catch (error) {

                /* ไม่ต้องทำอะไร */

            }

        }
    );



    /* =========================================
       กัน Pointer Cancel
    ========================================= */

    popupContent.addEventListener(
        "pointercancel",
        function () {

            isDragging = false;

            popupContent.classList.remove(
                "dragging"
            );

        }
    );


});