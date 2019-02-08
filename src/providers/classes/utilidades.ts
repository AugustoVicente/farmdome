import { Injectable } from '@angular/core';
@Injectable()
// classe de funções aleatórias
export class Utilidades
{
	constructor() {}
	//função que transforma uma data dateTime para dd/mm/aaaa
	transforma_to_date(data: string) 
	{
		var dia: string = data.substring(8, 10);
		var mes: string = data.substring(5, 7);
		var ano: string = data.substring(0, 4);
		data = dia + '/' + mes;
		return data;
	}
	transforma_to_full_date(data: string) 
	{
		var dia: string = data.substring(8, 10);
		var mes: string = data.substring(5, 7);
		var ano: string = data.substring(0, 4);
		data = dia + '/' + mes + '/' + ano;
		return data;
	}
	//função que transforma uma data dateTime para dd/mm/aaaa
	transforma_to_date_contrario(data: string) 
	{
		var dia: string = data.substring(0, 2);
		var mes: string = data.substring(3, 5);
		var ano: string = data.substring(6, 10);
		data = ano + '-' + mes + '-' + dia;
		return data;
	}
	// função que retorna true se um campo é inválido e false se não for
    valida_campo(campo)
	{
		if(campo == null || campo == "" || campo == undefined || campo == 0){return true;}
		else{return false}
	}
	// função que transforna um número qualquer para preço brasileiro (reais)
	transforma_to_preco(preco)
	{
		// caso venha indefinido ou nulo, deixa como padrão 0
		preco = (preco == undefined || preco == null) ? 0 : preco;
		/* convertendo o preço para float, deixa com duas casas decimais fixas, 
		convertendo para string, substituindo o ponto por vírgula e adiconando o prefixo R$*/
		var strPreco = "R$ " + parseFloat(preco).toFixed(2).toString().replace(".", ",");
		// retornando o resultado
		return strPreco;
	}
	adiciona_carrinho(idproduto, fornecedor, embalagem, qtd, fpag, ppag)
	{
		var pedido = {idproduto: idproduto, fornecedor: fornecedor, embalagem: embalagem, qtd: qtd, fpag: fpag, ppag: ppag};
		var carrinho = [];
		if(localStorage.getItem("carrinho") != null && localStorage.getItem("carrinho") != undefined && JSON.parse(localStorage.getItem("carrinho")).length > 0)	
		{
			carrinho = JSON.parse(localStorage.getItem("carrinho"));
			if(carrinho[fornecedor.id] == undefined)
			{
				carrinho[fornecedor.id] = [];
			}
		}
		else
		{
			carrinho[fornecedor.id] = [];
		}
		carrinho[fornecedor.id].push(pedido);
		localStorage.setItem("carrinho", JSON.stringify(carrinho));
	}
	remove_carrinho(idproduto, pedido)
	{
		var carrinho;
		carrinho = JSON.parse(localStorage.getItem("carrinho"));
		var index = carrinho[pedido].indexOf(carrinho[pedido].find(prod => prod == idproduto));
		carrinho[pedido].splice(index, 1);
		if(carrinho[pedido].length == 0)
		{
			carrinho.splice(pedido, 1);
		}
		localStorage.setItem("carrinho", JSON.stringify(carrinho));
	}
	busca_carrinho()
	{
		var carrinho = JSON.parse(localStorage.getItem("carrinho"));
		return (carrinho == null ? [] : carrinho);
	}
	esvazia_carrinho()
	{
		var carrinho = [];
		localStorage.setItem("carrinho", JSON.stringify(carrinho));
	}
	qtd_carrinho()
	{
		var cont = 0;
		var carrinho = JSON.parse(localStorage.getItem("carrinho"));
		if(carrinho != null)
		{
			carrinho.forEach(pedido => 
			{
				if(pedido != null) pedido.forEach(() => cont++);
			});
		}
		return cont;
	}
}