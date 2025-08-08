const form = document.querySelector('.mainForm');
const rentalDropZone = document.querySelector(".drop-zone");
const installmentDropZone = document.querySelector('.installmentDropZone');

let rentalFile = null;
let installmentFile = null;

// ===== Drop Handlers =====
function dropHandler(e) {
    console.log("File(s) dropped");
    e.preventDefault();

    if (e.dataTransfer.items) {
        [...e.dataTransfer.items].forEach((item, i) => {
            if (item.kind === "file") {
                const file = item.getAsFile();
                if (file) {
                    rentalFile = file; // Store for later
                }

                const fileName = document.createElement("h2");
                fileName.innerText = file.name;
                document.querySelector(".drop-zone h1").style.display = "none";
                rentalDropZone.append(fileName, document.createElement("br"));
                console.log(`… file[${i}].name = ${file.name}`);
            }
        });
    }
}

function installmentDropHandler(e) {
    console.log("File(s) dropped");
    e.preventDefault();

    if (e.dataTransfer.items) {
        [...e.dataTransfer.items].forEach((item, i) => {
            if (item.kind === "file") {
                const file = item.getAsFile();
                if (file) {
                    installmentFile = file; // Store for later
                }

                const fileName = document.createElement("h2");
                fileName.innerText = file.name;
                document.querySelector(".installmentDropZone h1").style.display = "none";
                installmentDropZone.append(fileName, document.createElement("br"));
                console.log(`… file[${i}].name = ${file.name}`);
            }
        });
    }
}

function dragOverHandler(e) {
    console.log("File(s) in drop zone");
    e.preventDefault();
}

// Attach drop/drag events
rentalDropZone.addEventListener("drop", dropHandler);
rentalDropZone.addEventListener("dragover", dragOverHandler);

installmentDropZone.addEventListener("drop", installmentDropHandler);
installmentDropZone.addEventListener("dragover", dragOverHandler);

// ===== Loan Radio Logic =====
const loanRadioY = document.querySelector("#yl");
const loanRadioN = document.querySelector("#nl");
const loanSeg = document.querySelector(".loan-segment");

loanRadioY.addEventListener("click", () => {
    if (loanRadioY.checked) {
        loanSeg.style.display = "block";
    }
});

loanRadioN.addEventListener("click", () => {
    if (loanRadioN.checked) {
        loanSeg.style.display = "none";
    }
});

// ===== Submit =====
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    e.stopPropagation();

    let aadhar = document.getElementById("aadhar").value;
    let pan = document.getElementById("pan").value;

    // // 1. Upload Rental File to xyz.com
    // if (rentalFile) {
    //     const rentalFD = new FormData();
    //     rentalFD.append('rentals', rentalFile);
    //     try {
    //         await fetch(`http://0.0.0.0:5050/upload_rental/${aadhar}`, {
    //             method: "POST",
    //             body: rentalFD
    //         });
    //         console.log("Rental file uploaded successfully");
    //     } catch (err) {
    //         console.error("Rental upload failed", err);
    //     }
    // }

    if (rentalFile) {
    const rentalFD = new FormData();

    rentalFD.append('file', rentalFile); // Keep original field name

    try {
        const res = await fetch(`http://0.0.0.0:5050/upload_rental/${aadhar}`, {
            method: "POST",
            body: rentalFD
        });

        if (!res.ok) throw new Error(await res.text());
        console.log("Rental file uploaded successfully");
    } catch (err) {
        console.error("Rental upload failed", err);
    }
}


    // 2. Upload Installment File to ccc.com
    if (installmentFile) {
        const installmentFD = new FormData();
        installmentFD.append('file', installmentFile);
        try {
            await fetch(`http://0.0.0.0:5050/upload_installments/${aadhar}`, {
                method: "POST",
                body: installmentFD
            });
            console.log("Installment file uploaded successfully");
        } catch (err) {
            console.error("Installment upload failed", err);
        }
    }

    // // 3. Check Score (GET)


try {
    let res = await fetch(`http://0.0.0.0:5050/check/${aadhar}/${pan}`, {
        method: "GET"
    });

    let data = await res.text(); 
    ref = parseInt(data) / 50

    if (ref < 0.6655) {alert(`Your credit score is ${ref}, it is low`)}
    else if (ref < 0.7211) {alert(`Your credit score is ${ref}, it is fair`)}
    else {alert(`Your credit score is ${ref}, you have a high score`)}


} catch (err) {
    console.error("Score check failed", err);
}

});

