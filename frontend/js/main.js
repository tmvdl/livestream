var controle = 0
function webCam(){
    if(controle == 0){
        document.getElementById("getCam").style.display="none"
        document.getElementById("controlCam").innerText="Mostrar câmera"
        controle = 1
    } else if(controle == 1){
        document.getElementById("getCam").style.display="initial"
        document.getElementById("controlCam").innerText="Esconder câmera"
        controle = 0
    }

}