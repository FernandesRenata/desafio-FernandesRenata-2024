import { recintosDisponiveis } from "./recintos-disponiveis.js";
import { caracteristicasAnimais } from "./animais.js";

class RecintosZoo {
    encontraAnimal(animal) {
        //Descobre o indice do animal a ser colocado no recinto.
        return caracteristicasAnimais.findIndex(bicho => bicho.especie === animal);
    }

        
    transformaAnimal(indiceAnimal, quantidade) {
        //Transforma o animal atual e quantidade no tamanho que ele irá ocupar.
        if (indiceAnimal === -1) {
            throw new Error("Animal inválido");
        }
        if (quantidade <= 0 || Number.isNaN(quantidade)) {
            throw new Error("Quantidade inválida");
        }
        return quantidade * caracteristicasAnimais[indiceAnimal].tamanho;
    }
    
    
    transformaAnimalExistente() {
        //Transforma o aximal existentente no recinto  e quantidade no tamanho que ele ocupa.
        return recintosDisponiveis.map(recinto => {
            const [bichoExistente, quantidadeExistente] = recinto.animaisExistentes;
            if (bichoExistente !== 'VAZIO') {
                const indice = caracteristicasAnimais.findIndex(bicho => bicho.especie === bichoExistente);
                if (indice !== -1) {
                    return caracteristicasAnimais[indice].tamanho * quantidadeExistente;
                }
            }
            return 0; // Espaço ocupado é zero se o recinto estiver vazio.
        });
    }
    
    
    compatibilizaBiomas(biomaDoRecinto, biomaDoAnimal) {
        //Transforma o recinto do animal e do recinto percorrido em arrays
       // para que possam ser percorridos e assim verificar se um dos biomas é correspondente.
     
        const recintoArray = Array.isArray(biomaDoRecinto) ? biomaDoRecinto : [biomaDoRecinto];
        const animalArray = Array.isArray(biomaDoAnimal) ? biomaDoAnimal : [biomaDoAnimal];

        for (let biomaRecinto of recintoArray) {
            for (let biomaAnimal of animalArray) {
                if (biomaRecinto === biomaAnimal) {
                    return true;
                }
            }
        }
        //Retorna um booleano dizendo se os biomas são compativeis.
       
        return false;
    }
    
    
    
     constituiRegras(indiceAnimal, quantidade) {
         //Verifica se o recinto disponivel atende as regras especificadas.  
            const alimentacao = caracteristicasAnimais[indiceAnimal].carnivoro;
            const animal = caracteristicasAnimais[indiceAnimal].especie;
            const tamAnimalAtual  = this.transformaAnimal(indiceAnimal, quantidade); 
            const tamAnimalExistente = this.transformaAnimalExistente();
            const biomaDoAnimal = caracteristicasAnimais[indiceAnimal].bioma;
            let indice = 0;
            let recintosCorrespondentes = [];

            recintosDisponiveis.forEach((recinto) => {
               
                let espacoLivre = (recinto.tamanhoTotal -(tamAnimalExistente[indice] || 0)) >= tamAnimalAtual;
                
                const [bichoExistente, quantidadeExistente] = recinto.animaisExistentes;
                const biomaDoRecinto = recinto. bioma
                const combinaBioma = this.compatibilizaBiomas(biomaDoRecinto, biomaDoAnimal)
                //Somente animais hervbivoros de diferentes especies podem habitar juntos.
                const alimentacaoCompativel = !recinto.animaisCarnivoros && !alimentacao;
                const savanaERio  = ['savana', 'rio'];
                //Percorre bioma e verifica se é identico a savanaERio.
                const biomaIdentico = (biomaDoRecinto.length === savanaERio.length && 
                biomaDoRecinto.every((bioma, i) => bioma === savanaERio[i]));

                let recintoPermitido =  combinaBioma && espacoLivre;
                
               
                //Verifica se o outro animal e bioma são compatíveis e há espaço.
                if((animal != bichoExistente) && bichoExistente != 'VAZIO'){
                    espacoLivre =( recinto.tamanhoTotal -(tamAnimalExistente[indice] || 0)) > tamAnimalAtual;
                    recintoPermitido = alimentacaoCompativel && combinaBioma && espacoLivre;
                }
                //Se houver um hipopotamo no recinto ou
                //se o animal atual é hipopotamo o bioma precisa ser savana e rio.
                if ((animal === 'HIPOPOTAMO' && bichoExistente !== 'VAZIO') ||
                 (bichoExistente === 'HIPOPOTAMO' && animal !== 'HIPOPOTAMO')){
                    recintoPermitido = biomaIdentico && alimentacaoCompativel && espacoLivre;
                 }
                //Se o macaco for ficar sozinho, o recinto não é permitido.
                if (animal === 'MACACO' && quantidade === 1 && bichoExistente === 'VAZIO') {
                    recintoPermitido = false;
                } else if (recintoPermitido) {
                        recintosCorrespondentes.push(recinto);
                }   
                indice++;       
               
        });    
        
            //Se não há recinto retorna erro.
            if (recintosCorrespondentes.length === 0) {
                throw new Error("Não há recinto viável");
            }
        
            return recintosCorrespondentes;
        
    }    
    
       
        analisaRecintos(animal, quantidade) {
            try {
                //Verifica se há mensagem de erro e retorna os recintos viáveis.
                const indiceAnimal = this.encontraAnimal(animal); 
                const tamAnimalAtual = this.transformaAnimal(indiceAnimal, quantidade); 
                const tamAnimalExistente = this.transformaAnimalExistente();
                const recintosCorrespondentes = this.constituiRegras(indiceAnimal,  quantidade); 

                
                const recintosViaveis = recintosCorrespondentes.map(recinto => {

                    const [bichoExistente, quantidadeExistente] = recinto.animaisExistentes;
                    const indice = recintosDisponiveis.indexOf(recinto);
                    let espacoLivre = recinto.tamanhoTotal -(tamAnimalAtual + (tamAnimalExistente[indice] || 0));
                  
                    if((animal != bichoExistente) && bichoExistente != 'VAZIO'){
                         espacoLivre = espacoLivre - 1;
                    }

                    return `Recinto ${recinto.numero} (espaço livre: ${espacoLivre} total: ${recinto.tamanhoTotal})`;
                });
               
                return {
                    recintosViaveis
                };
            } catch (error) {
                return {
                    erro: error.message,
                };
            }
        }
    }       

export {RecintosZoo as RecintosZoo}