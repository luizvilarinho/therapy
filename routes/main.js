const express = require("express");
const main = express.Router();
const calcularTerapia = require("../modules/calcularTerapia");
const auth = require('../modules/auth');
const config = require('../modules/config');
const mysql = require("mysql");
const { response } = require("express");

const pool = mysql.createPool({
    host     : 'sql399.main-hosting.eu',
    user     : 'u575119774_vila',
    password : 'Vila1234',
    database : 'u575119774_therapy',
    connectionLimit: 10
});

main.get("/", auth, (req, res)=>{
   
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Credentials', true);

    pool.getConnection((err, connection) => {
        if(err) throw err;

            let query = `SELECT * FROM terapia WHERE userId = '${config.userId}'`;

            connection.query(query, (error, result)=> {
                if (error) throw error;
                
                var responseObj = {};
                responseObj.success = true;
                //responseObj.idTerapia = result[0].idTerapia;
                //responseObj.terapia = calcularTerapia(dadosUsuario); 
               
                console.log("resultLength", result.length)
                
                result.map(dados =>{
                    var dadosUsuario={
                        nome:dados.nome,
                        dosagem:dados.dosagem,
                        intervalo:dados.intervalo,
                        qntDias:dados.qntDias,
                        dataInicio:dados.dataInicio,
                        horaInicio:dados.horaInicio,
                        totalComprimidos:function(){
                                
                            var qntComprimidos = (this.qntDias * 24) / this.intervalo;
                            
                            return qntComprimidos;
                        }
                    }
                    console.log("idTerapia", dados.idTerapia)
                    
                    responseObj.terapia=calcularTerapia.getHorarios(dadosUsuario, dados.idTerapia)
                })    

                connection.release();

                //retornar sucesso ou erro
                //res.json(result);
                //console.log("hArray", hArray)
                //hArray=[];
                calcularTerapia.hArray = [];
                res.json(responseObj);
            })
        })
    
   
})

main.post('/create-therapy', auth, (req, res)=>{

    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Credentials', true);

    var responseObj = {};

    var dadosUsuario={
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

    //gravar dadosUsuario no banco
    pool.getConnection((err, connection) => {
        if(err) throw err;

                let query = `INSERT INTO terapia (nome, dosagem, intervalo, qntDias, dataInicio, horaInicio, userId) VALUES('${dadosUsuario.nome}','${dadosUsuario.dosagem}','${dadosUsuario.intervalo}','${dadosUsuario.qntDias}','${dadosUsuario.dataInicio}','${dadosUsuario.horaInicio}','${config.userId}')`;

                connection.query(query, (error, result)=> {
                    if (error) throw error;
                    
                    responseObj.success = true;
                    responseObj.message = "Terapia criada com sucesso";
                    
                    connection.release();

                    //retornar sucesso ou erro
                    res.json(responseObj);
               })
        })
    
})

main.delete("/remove-therapy/:id", auth, (req, res)=>{
   
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Credentials', true);

    pool.getConnection((err, connection) => {
        var idTerapia = req.params.id
        if(err) throw err;

            let query = `DELETE FROM terapia WHERE userId = '${config.userId}' AND idTerapia = '${idTerapia}'`;

            connection.query(query, (error, result)=> {
                if (error) throw error;
                
                var responseObj = {};
                responseObj.success = true;
                   

                connection.release();

                
                res.json(responseObj);
            })
        })
    
   
})

module.exports = main;