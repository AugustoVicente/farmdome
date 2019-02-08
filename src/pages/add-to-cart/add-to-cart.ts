import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { CartPage } from '../cart/cart';
import { Interface_usuario } from '../../providers/classes/interface';
import { Servidor } from '../../providers/classes/servidor';
import { Utilidades } from '../../providers/classes/utilidades';
@IonicPage()
@Component({selector: 'page-add-to-cart', templateUrl: 'add-to-cart.html'})
export class AddToCartPage 
{
	public fpagamentos : any;
	public fpag : any = 0;
	public ppag : any = null;
	public qtd : any = null;
	public embalagem : any = 0;
	public produto : any = {};
	public fornecedores : any;
	public fornecedor_escolhido : number;
	public produto_escolhido : number;
	constructor
	(
		public navCtrl: NavController,
		public navParams: NavParams,
		public servidor: Servidor,
		public interface_user: Interface_usuario,
		public utilidades: Utilidades
	) 
	{
		this.produto_escolhido = navParams.get("id");
		this.produto.pro_nome = "";
		this.produto.iat_nome = "";
		this.produto.concentracao = "";
		this.produto.preco_medio = 0;
		this.carregar_fpagamento();
		this.carregar_detalhes();
		this.carregar_fornecedores();
		this.carregar_preco_medio();
	}
	adicionar_produto()
	{
		if(this.embalagem == 0 || this.qtd == 0  || this.qtd == null || this.fpag == 0 || this.ppag == 0 || this.ppag == null)
		{
			this.interface_user.toast_padrao("Preencha os campos necessários!");
		}
		else
		{
			this.fornecedores.forEach(fornecedor => 
			{
				if(fornecedor.check == true)
				{
					this.utilidades.adiciona_carrinho(this.produto, fornecedor, this.get_emb(this.embalagem), this.qtd, this.get_fpag(this.fpag), this.ppag);
				}
			});
			this.navCtrl.push(CartPage);
		}
	}
	home()
	{
		this.navCtrl.popToRoot();
	}
	carregar_fpagamento()
	{
		var func_resolve = (reject, resolve, data)=>
		{
			resolve(data);
		};
		var func_reject = (reject, data)=>
		{
			reject(data);
		};
		this.servidor.envia_get("formapagamentos", func_resolve, func_reject).then((dados)=>
		{
			this.fpagamentos = dados;
		}, (err)=>
		{
			this.interface_user.alerta_padrao("Erro!", "Não foi possível carregar as formas de pagamento!", ["ok"]);
		});
	}
	carregar_detalhes()
	{
		var func_resolve = (reject, resolve, data)=>
		{
			resolve(data);
		};
		var func_reject = (reject, data)=>
		{
			reject(data);
		};
		this.servidor.envia_get("produtos/"+this.produto_escolhido+"?filter={\"include\":[{\"ativos\":\"ingrediente_ativo\"},\"embalagens\",\"classe_uso\",\"unidade_medida\"]}", 
		func_resolve, func_reject).then((dados)=>
		{
			this.produto = dados;
			this.produto.ativos.forEach((at, i) => 
			{
				if(i == 0)
				{
					this.produto.iat_nome = at.ingrediente_ativo.iat_nome;
					this.produto.iat_conc = at.piat_concentracao;
				}
				else
				{
					this.produto.iat_nome += " + " + at.ingrediente_ativo.iat_nome;
					this.produto.iat_conc += " + " + at.piat_concentracao;
				}
			});
		}, (err)=>
		{
			this.interface_user.alerta_padrao("Erro!", "Houve um problema de conexão!", ["ok"]);
		});
	}
	carregar_fornecedores()
	{
		var func_resolve = (reject, resolve, data)=>
		{
			resolve(data);
		};
		var func_reject = (reject, data)=>
		{
			reject(data);
		};
		this.servidor.envia_get("fornecedores?filter={\"include\":{\"relation\":\"produtos\",\"scope\":{\"include\":{\"produto\":[{\"ativos\":\"ingrediente_ativo\"},\"embalagens\",\"classe_uso\"]}}}}", 
		func_resolve, func_reject).then((dados)=>
		{
			this.fornecedores = dados;
		}, (err)=>
		{
			this.interface_user.alerta_padrao("Erro!", "Houve um problema de conexão!", ["ok"]);
		});
	}
	carregar_preco_medio()
	{
		var func_resolve = (reject, resolve, data)=>
		{
			resolve(data);
		};
		var func_reject = (reject, data)=>
		{
			reject(data);
		};
		this.servidor.envia_get("produtormediaprodutos?filter={\"include\":\"forma_pagamento\",\"where\":{\"pro_id\":"+this.produto_escolhido+"}}", 
		func_resolve, func_reject).then((dados)=>
		{
			var preco_medio = 0;
			var cont = 0;
			var dado : any = dados;
			var juros, months = 0;
			var juro : boolean;
			var mes_pago;
			dado.forEach(preco => 
			{
				if(preco.prod_id == localStorage.getItem("id"))
				{
					mes_pago = preco.forma_pagamento.id;
				}
			});
			dado.forEach(preco => 
			{
				if(preco.preco != undefined)
				{
					var preco_ = preco.preco;
					if(mes_pago != preco.id)
					{
						juros = preco.forma_pagamento.fpag_juros;
						juro = (mes_pago > preco.id) ? true : false;
						var mes_atual = new Date().getMonth()+1;
						var mes_pag = new Date(preco.forma_pagamento.fpag_meses).getMonth()+1;
						if(mes_atual > mes_pag)
						{
							months = (12 - mes_atual) + mes_pag;
						}
						else if(mes_atual == mes_pag)
						{
							months = 1;
						}
						else if(mes_atual < mes_pag)
						{
							months = mes_pag - mes_atual;
						}
						juros *= (juro) ? -1 : 1;
						preco_ *= Math.pow(1 + juros, months);
						preco_ = parseFloat(preco_.toFixed(2));
					}
					preco_medio +=  preco_;
				}
				cont++;
			});
			preco_medio /= cont == 0 ? 1 : cont;
			this.produto.preco_medio = preco_medio;
		}, (err)=>
		{
			this.interface_user.alerta_padrao("Erro!", "Houve um problema de conexão!", ["ok"]);
		});
	}
	get_emb(id)
	{
		var index = this.produto.embalagens.indexOf(this.produto.embalagens.find(emb => emb.id == id));
		return this.produto.embalagens[index];
	}
	get_fpag(id)
	{
		var index = this.fpagamentos.indexOf(this.fpagamentos.find(fp => fp.id == id));
		return this.fpagamentos[index];
	}
}
