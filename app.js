function dropHandler(e) {
  console.log("File(s) dropped");
  e.preventDefault();

  if (e.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    [...e.dataTransfer.items].forEach((item, i) => {
      if (item.kind === "file") {
        const file = item.getAsFile();
        const fileName = document.createElement("h2")
        fileName.innerText = file.name
        document.querySelector(".drop-zone h1").style.display="none"

        rentalDropZone.append(fileName)
        rentalDropZone.append(document.createElement("br"))
        console.log(`… file[${i}].name = ${file.name}`);
      }
    });
  } else {
    // Use DataTransfer interface to access the file(s)
    [...e.dataTransfer.files].forEach((file, i) => {
      console.log(`… file[${i}].name = ${file.name}`);
    });
  }
}

function installmentDropHandler(e) {
  console.log("File(s) dropped");
  e.preventDefault();

  if (e.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    [...e.dataTransfer.items].forEach((item, i) => {
      if (item.kind === "file") {
        const file = item.getAsFile();
        const fileName = document.createElement("h2")
        fileName.innerText = file.name
        document.querySelector(".installmentDropZone h1").style.display="none"

        installmentDropZone.append(fileName)
        installmentDropZone.append(document.createElement("br"))
        console.log(`… file[${i}].name = ${file.name}`);
      }
    });
  } else {
    // Use DataTransfer interface to access the file(s)
    [...e.dataTransfer.files].forEach((file, i) => {
      console.log(`… file[${i}].name = ${file.name}`);
    });
  }
}

function policyDropHandler(e) {
  console.log("File(s) dropped");
  e.preventDefault();

  if (e.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    [...e.dataTransfer.items].forEach((item, i) => {
      if (item.kind === "file") {
        const file = item.getAsFile();
        const fileName = document.createElement("h2")
        fileName.innerText = file.name
        document.querySelector(".policyDropZone h1").style.display="none"

        policyDropZone.append(fileName)
        policyDropZone.append(document.createElement("br"))
        console.log(`… file[${i}].name = ${file.name}`);
      }
    });
  } else {
    // Use DataTransfer interface to access the file(s)
    [...e.dataTransfer.files].forEach((file, i) => {
      console.log(`… file[${i}].name = ${file.name}`);
    });
  }
}

function dragOverHandler(e) {
  console.log("File(s) in drop zone");

  e.preventDefault();
}

const rentalDropZone = document.querySelector(".drop-zone")
const installmentDropZone = document.querySelector('.installmentDropZone')
const policyDropZone = document.querySelector('.policyDropZone')

rentalDropZone.addEventListener("drop", dropHandler)
rentalDropZone.addEventListener("dragover", dragOverHandler)

installmentDropZone.addEventListener("drop", installmentDropHandler)
installmentDropZone.addEventListener("dragover", dragOverHandler)

policyDropZone.addEventListener("drop", policyDropHandler)
policyDropZone.addEventListener("dragover", dragOverHandler)


const loanRadioY = document.querySelector("#yl")
const loanRadioN = document.querySelector("#nl")
const loanSeg = document.querySelector(".loan-segment")

const policyRadioY = document.querySelector("#yi")
const policyRadioN = document.querySelector("#ni")
const polSeg = document.querySelector(".policy-segment")

loanRadioY.addEventListener("click", () => {
    if (loanRadioY.checked) {
        console.log("check")
        loanSeg.style.display="block"
    }
})

loanRadioN.addEventListener("click", () => {
    if (loanRadioN.checked) {
        console.log("check")
        loanSeg.style.display="none"
    }
})

policyRadioY.addEventListener("click", () => {
    if (policyRadioY.checked) {
        console.log("check")
        polSeg.style.display="block"
    }
})

policyRadioN.addEventListener("click", () => {
    if (policyRadioN.checked) {
        console.log("check")
        polSeg.style.display="none"
    }
})