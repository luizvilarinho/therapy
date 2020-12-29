const express = require("express");
const main = express.Router();
const calcularTerapia = require("../modules/calcularTerapia")

main.post("/", (req, res)=>{
    dadosUsuario={
        nome:req.body.nome,
        dosagem:req.body.dosagem,
        intervalo:req.body.intervalo,
        qntDias:req.body.qntDias,
        dataInicio:req.body.dataInicio,
        horaInicio:req.body.horaInicio,
        totalComprimidos:function(){
                
            var qntComprimidos = (this.qntDias * 24) / this.intervalo;
            
            return qntComprimidos;
        }
    }

    var terapia = {
        completeTherapy:calcularTerapia(dadosUsuario)
    }
    terapia.success = true;
    terapia.message = "Therapy returned successfully"

    res.json(terapia)
})

module.exports = main;