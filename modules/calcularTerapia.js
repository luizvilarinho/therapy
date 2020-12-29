
function transformDate(tipo, data){
    if(tipo == "br"){
        [d,m,y] = data.split("/");

        return y + "/" + m + "/" + d;
    }

    if(tipo == "eua"){
        [y,m,d] = data.split("/");

        return d + "/" + m + "/" + y;
    }
}

var hArray = [];

//auxfunction
function hasDayInUse(day){
    var objDia = hArray.filter((el) =>{ 
        if(el.dia === day){
            return el;
        }
    });
    
    return objDia;
    
}

function getHorarios(dadosUsuario){
    
    var currentData = new Date(transformDate("eua", dadosUsuario.dataInicio));
    var qntComprimidos = dadosUsuario.totalComprimidos();
    
    currentData.setHours(parseFloat(dadosUsuario.horaInicio));

    dadosUsuario.horaInicio.split(":").length === 1 ? currentData.setMinutes(0) : currentData.setMinutes(parseFloat(dadosUsuario.horaInicio.split(":")[1]))


   var currentDay = currentData.getDate();
   var idxDia = 0;

    for(var d = 0; d < qntComprimidos; d++){
        
        var hasDay = hasDayInUse(currentData.toLocaleDateString("bt-br"))[0] || "" ;

        if(d == 0 && hasDay == ""){
            hArray.push({
                dia:currentData.toLocaleDateString("bt-br"),
                terapia:[{
                    nome:dadosUsuario.nome,
                    dosagem:dadosUsuario.dosagem,
                    horas:[dadosUsuario.horaInicio  + ":" + currentData.getMinutes()]
                }]
            });
        }

        if(d === 0 && hasDay != ""){
            
            var t = {
                nome:dadosUsuario.nome,
                dosagem:dadosUsuario.dosagem,
                horas:[dadosUsuario.horaInicio  + ":" + currentData.getMinutes()]
            }
            hasDay.terapia.push(t)
        }

        if(d != 0){
            
            if(currentData.getDate() != currentDay){
                idxDia ++;

                if(hasDay != ""){
                    hasDay.terapia.push({
                        nome:dadosUsuario.nome,
                        dosagem:dadosUsuario.dosagem,
                        horas:[currentData.getHours()  + ":" + currentData.getMinutes()]

                    })

                }else{
                    hArray.push({
                        dia:currentData.toLocaleDateString("bt-br"),
                        terapia:[{
                            nome:dadosUsuario.nome,
                            dosagem:dadosUsuario.dosagem,
                            horas:[]
                        }]
                    });
    
                    hArray[hArray.length -1 ].terapia[0].horas.push(currentData.getHours()  + ":" + currentData.getMinutes())

                }

                currentDay = currentData.getDate();
            }else{
                hasDay.terapia[hasDay.terapia.length - 1].horas.push(currentData.getHours() + ":" + currentData.getMinutes());
            }
        }

        currentData.setHours(currentData.getHours() + parseFloat(dadosUsuario.intervalo));
        
    }

    return hArray;
}

module.exports = getHorarios;

