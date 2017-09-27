"use strict";

(function () {

	var btnBnf = document.getElementById("btn-bnf"),
	    inputBnf = document.getElementById("bnf"),
	    contenedorDiagramas = document.getElementById("container-diagramas");

	// FUNCION
	function btnBnfOnClick(e) {
		var diagramas = crearDiagramas(inputBnf.value),
		    results = [],
		    i,
		    length;

		if (diagramas.length > 0) {
			inputBnf.classList.remove("error");

			length = diagramas.length;
			for (i = 0; i < length; i++) {
				results.push(eval(diagramas[i]).format());
			}

			contenedorDiagramas.innerHTML = '';

			for (i = 0; i < length; i++) {
				results[i].addTo(contenedorDiagramas);
			}
		} else {
			inputBnf.classList.add("error");
			contenedorDiagramas.innerHTML = '';
		}

		e.preventDefault();
	}

	// limpia los espacios innecesarios
	function normalizar(strBnf) {
		var replaces = [{ regex: />\s{1,2}</g, replacement: "><" },
										{ regex: />\s{1,2}"/g, replacement: ">\"" },
										{ regex: /"\s{1,2}"/g, replacement: "\"\"" },
										{ regex: /"\s{1,2}</g, replacement: "\"<" },
										{ regex: />\s::=/g, replacement: ">::=" },
										{ regex: /::=\s/g, replacement: "::=" },
										{ regex: /\s\|/g, replacement: "|" },
										{ regex: /\|\s/g, replacement: "|" }],
		    length,
		    str,
		    i;

		length = replaces.length;
		str = strBnf;
		for (i = 0; i < length; i++) {
			str = str.replace(replaces[i].regex, replaces[i].replacement);
		}
		return str;
	}

	// crea un terminal o no terminal
	function crearComponente(exp) {
		var noTerm = /<([^>]+)>/,
		    term = /"([^"]+)"/,
		    reg = /^"/,
		    esTerminal,
		    nombre,
		    regex;

		esTerminal = reg.test(exp.charAt(0));
		regex = esTerminal ? term : noTerm;
		nombre = exp.match(regex)[1];
		return esTerminal ? Terminal(nombre) : NonTerminal(nombre);
	}

	// crea una concatenación compuesta de terminales y/o no terminales
	function crearSecuencia(exp) {
		var secuencia = [],
		    comp;

		while (exp.length != 0) {
			comp = crearComponente(exp);
			secuencia.push(comp);
			exp = exp.substring(comp.text.length + 2);
		}
		return Sequence.apply(undefined, secuencia);
	}



function reconstruir(segunda){
	var aux=[];
	var aux2=[];
	var i;
	var j=0;
	if (segunda.includes(">")){
		aux=segunda.split(">");
		for (i=0; i<aux.length-1;i++){
			aux2[i]=aux[i]+">";
		}
		return aux2;
	}
	else{
		aux=segunda.split(/([^"]+)/);
		for (i=0; i<aux.length;i++){
			if (!(aux[i].includes(String.fromCharCode(34)))){
				aux2[j]=String.fromCharCode(34)+aux[i]+String.fromCharCode(34);
				j++;
			}
		}
		return aux2;
	}
}

	// crea el diagrama de sintaxis de la bnf recibe una secuencia completa desde ::=
	function crearDiagrama(exp) {
		var aux=[];
		var primera=[];
		var segunda=[];
		var tercera=[];
		var secuencia1=[];
		var diagrama = [],
		    choices,
		    length,
				i;

			if (exp.includes("[")){
					primera= exp.split("[",1); //este es un arreglo por el split. primera es de long=1
					if (primera[0].includes("<")|primera[0].includes(String.fromCharCode(34))){
						for (i = 0; i < primera.length; i++) {
							secuencia1.push(crearSecuencia(primera[0]));
						}
					}

			segunda=exp.split("[");
			tercera=segunda[1].split("]");
			segunda=segunda[1].split("]",1);
			segunda=reconstruir(segunda[0]);
			aux.push(Skip())
			for (i = 0; i < segunda.length; i++) {
				aux.push(crearSecuencia(segunda[i]));
			}
			secuencia1.push(Choice.apply(undefined, [0].concat(aux)));

			if ((tercera[1].length)){
				secuencia1.push(crearSecuencia(tercera[1]));
			}
			return Diagram(Sequence.apply(undefined,secuencia1));
		}
		else{
			choices = exp.split("|");
			length = choices.length;
			for (i = 0; i < length; i++) {
				diagrama.push(crearSecuencia(choices[i]));
			}
			return Diagram(Choice.apply(undefined, [0].concat(diagrama)));
		}
	}

	// crea los diagramas de sintaxis de cada bnf
	function crearDiagramas(strBnf) {
		var regex = /^<[^<>"\n\t\v]+>\s?::=\s?(?:(?:"(?:[^<>"\n\t\v])+")| (?:<[^<>"\n\t\v]+>))(?:\s?(?:\|)?\s?(?:"(?:[^<>"\n\t\v])+"|(?:<[^<>"\n\t\v]+>)))*$/gm,
		    diagramas = [],
		    componente,
		    bnfs,
		    bnf,
		    exp,
		    i,
		    length;

		///if (regex.test(strBnf)) {
			bnfs = strBnf.split("\n");
			console.log(bnfs);
			length = bnfs.length;
			for (i = 0; i < length; i++) {
				bnf = normalizar(bnfs[i]);
				exp = bnf.split("::=")[1];
				if (exp) {
					diagramas.push(crearDiagrama(exp));
				}
			}

			return diagramas;
		//}
		return [];
	}

	// EVENTO
	btnBnf.addEventListener("click", btnBnfOnClick, false);
})();

