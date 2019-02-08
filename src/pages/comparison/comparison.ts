import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { SimilarsProductPage } from '../similars-product/similars-product';
import * as Chartist from 'chartist';
import { Utilidades } from '../../providers/classes/utilidades';
import { Interface_usuario } from '../../providers/classes/interface';
import { Servidor } from '../../providers/classes/servidor';
import { AddToCartPage } from '../add-to-cart/add-to-cart';
import { AddPrecoPage } from '../add-preco/add-preco';
@IonicPage()
@Component({selector: 'page-comparison', templateUrl: 'comparison.html'})
export class ComparisonPage 
{
	public produto_escolhido : number;
	public produto : any = [];
	public dados_compras : any = [];
	public produtos_similares : any = [];
	public produtos_quase_similares : any = [];
	public sigla = "";
	constructor
	(
		public navCtrl: NavController,
		public navParams: NavParams,
		public servidor: Servidor,
		public modalCtrl: ModalController,
		public interface_user: Interface_usuario,
		public utilidades: Utilidades
	)
	{
		this.produto_escolhido = navParams.get("id");
		this.carrega_info();
		this.carregar_preco_medio();
	}
	home()
	{
		this.navCtrl.popToRoot();
	}
	go_to_produtos_similares(tipo)
	{
		this.navCtrl.push(SimilarsProductPage, 
		{
			tipo_pag: tipo,
			valores: tipo == 1 ? JSON.stringify(this.produtos_similares) : JSON.stringify(this.produtos_quase_similares)
		});
	}
	faz_grafico(labels, series)
	{
		var data = 
		{
			// A labels array that can contain any sort of values
			labels: labels,
			// Our series array that contains series objects or in this case series data arrays
			series: series
		};
		var options = 
		{	
			horizontalBars: true,
			width: 350,
			height: 450,
			fullWidth: true,
			axisY: 
			{
				showGrid: false				
			},
			axisX: 
			{
				showGrid: false,
				showLabel: false
			}
		};
		var chart = new Chartist.Bar('.ct-chart', data, options);
		chart.on('draw', function (data) {
			if (data.type === 'bar') 
			{
				if (data.meta === 'your') 
				{
					data.group.append(new Chartist.Svg('circle', {
						cx: 90,
						cy: data.y1+14,
						r: 2
					}, 'ct-bar'));
				}
				else if (data.meta === 'best') 
				{
					data.group.append(new Chartist.Svg('circle', {
						cx: 90,
						cy: data.y1+21,
						r: 2
					}, 'ct-bar'));
				}
				else
				{
					// change initial x
					data.element.attr({
						x1: 80
					});
					// add the custom label text as an attribute to the bar for use by a tooltip
					data.element.attr({ label: "" }, "ct:series");
					// create a custom label element to insert into the bar
					var label = new Chartist.Svg("text");
					label.text(data.value.x);
					label.attr({
						x: data.x2-25,
						y: data.y2+5,
						"text-anchor": "right",
						style: "font-family: Roboto; font-size: 15px; fill: white;"
					});
					data.group.append(label);
				}
			}
		});
	}
	adicionar_favoritos()
	{
		var func_resolve = (reject, resolve, data)=>
		{
			var dados : any = data;
			resolve(dados);
		};
		var func_reject = (reject, data)=>
		{
			reject(data);
		};
		var data = JSON.stringify
		({
			pro_id: this.produto_escolhido,
			prod_id: localStorage.getItem("id")
		});
		var load = this.interface_user.load_variavel("Adicionando...");
		load.present();
		this.servidor.envia_post_api(data, "produtorprodutofavoritos", func_resolve, func_reject).then((dados)=>
		{
			load.dismiss();
			this.interface_user.toast_padrao("Adicionado com sucesso!");
		}, (err)=>
		{
			load.dismiss();
			this.interface_user.alerta_padrao("Erro!", "Não é possível realizar esta ação neste momento! Tente mais tarde.\nErro: "+err, ["ok"]);
		});
	}
	adicionar_orcamento(id)
	{
		this.navCtrl.push(AddToCartPage, {id : id});
	}
	carrega_info()
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
		func_resolve, func_reject).then((data)=>
		{
			this.produto = data;
			this.produto.iat_nome = "";
			this.sigla = this.produto.unidade_medida.sigla;
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
			this.carrega_similares();
		}, (err)=>
		{
			this.interface_user.alerta_padrao("Erro!", "Houve um problema de conexão!", ["ok"]);
		});
	}
	carrega_similares()
	{
		var func_resolve = (reject, resolve, data)=>
		{
			resolve(data);
		};
		var func_reject = (reject, data)=>
		{
			reject(data);
		};
		var load = this.interface_user.load_variavel("Carregando...");
		load.present();
		this.servidor.envia_get("produtos?filter={\"include\":[{\"ativos\":\"ingrediente_ativo\"},\"embalagens\",\"classe_uso\",\"unidade_medida\"]}", 
		func_resolve, func_reject).then((data)=>
		{
			var dados : any = data;
			dados.forEach((produto, i) => 
			{
				if(produto.ativos.length != 0)
				{
					produto.ativos.forEach((at, i) => 
					{
						if(i == 0)
						{
							produto.iat_nome = at.ingrediente_ativo.iat_nome.toString();
							produto.iat_conc = at.piat_concentracao.toString();
						}
						else
						{
							produto.iat_nome += " + " + at.ingrediente_ativo.iat_nome.toString();
							produto.iat_conc += " + " + at.piat_concentracao.toString();
						}
					});
					if(produto.iat_nome.includes(this.produto.iat_nome) && produto.iat_conc.includes(this.produto.iat_conc))
					{
						this.carregar_preco_medio_uni(produto.id).then(dado => produto.preco_medio = dado);
						produto.sigla = produto.unidade_medida.sigla;
						this.produtos_similares.push(produto);
					}
					produto.ativos.forEach((at, i) => 
					{
						this.produto.ativos.forEach((at2, i) => 
						{
							if(at.ingrediente_ativo.iat_nome == at2.ingrediente_ativo.iat_nome && !this.produtos_quase_similares.includes(produto) && !this.produtos_similares.includes(produto))
							{
								this.carregar_preco_medio_uni(produto.id).then(dado => produto.preco_medio = dado);								
								produto.sigla = produto.unidade_medida.sigla;
								this.produtos_quase_similares.push(produto);
							}
						});
					});
				}
			});
			load.dismiss();
		}, (err)=>
		{
			load.dismiss();
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
			this.trata_info_grafico(dado);
		}, (err)=>
		{
			this.interface_user.alerta_padrao("Erro!", "Houve um problema de conexão!", ["ok"]);
		});
	}
	carregar_preco_medio_uni(id)
	{
		return new Promise((resolve, reject) => 
		{
			var func_resolve = (reject, resolve, data)=>
			{
				resolve(data);
			};
			var func_reject = (reject, data)=>
			{
				reject(data);
			};
			this.servidor.envia_get("produtormediaprodutos?filter={\"include\":\"forma_pagamento\",\"where\":{\"pro_id\":"+id+"}}", 
			func_resolve, func_reject).then((dados)=>
			{
				var preco_medio = 0;
				var cont = 0;
				var dado : any = dados; 
				dado.forEach(preco => 
				{
					preco_medio += preco.preco == undefined ? 0 : preco.preco;
					cont++;
				});
				preco_medio /= cont == 0 ? 1 : cont;
				resolve(preco_medio);
			}, (err)=>
			{
				this.interface_user.alerta_padrao("Erro!", "Houve um problema de conexão!", ["ok"]);
				reject(err);
			});
		});
	}
	ver_preco(id, nome)
	{
		var func_resolve = (reject, resolve, data)=>
		{
			resolve(data);
		};
		var func_reject = (reject, data)=>
		{
			reject(data);
		};
		this.servidor.envia_get("produtormediaprodutos?filter=%7B%22where%22:%7B%22and%22:%5B%7B%22createdat%22:%7B%22gt%22:%22"+
		new Date().toISOString()+"%22,%22lt%22:%22"+new Date().toISOString()+"%22%7D%7D,%7B%22prod_id%22:"+localStorage.getItem("id")+"%7D,%7B%22pro_id%22:"+
		id+"%7D%5D%7D%7D",
		func_resolve, func_reject).then((dados)=>
		{
			var dados_ : any = dados;
			if(dados_.length == 0)
			{
				const modal = this.modalCtrl.create(AddPrecoPage, {produto: nome, id: id});
				modal.present();
			}
			else
			{
				this.navCtrl.push(ComparisonPage, {id: id});
			}
		}, (err)=>
		{
			this.interface_user.alerta_padrao("Erro!", "Login ou senha inválidos!", ["ok"]);
		});
	}
	trata_info_grafico(dados)
	{
		dados.forEach(pag =>
		{
			this.dados_compras.push({preco : pag.preco, id: pag.prod_id == localStorage.getItem("id") ? 'eu' : 'an'});	
		});
		this.dados_compras.sort((a, b) => a.preco - b.preco);
		// caso tenha mais que 10 registros, cria 6 linhas em vez de 4
		var linhas = this.dados_compras.length <= 10 ? 4 : 6;
		// recebendo o range de valores
		var range = this.dados_compras[this.dados_compras.length-1].preco - this.dados_compras[0].preco;
		// criando um separador das linhas
		var separador = parseInt((range / linhas).toFixed(2));
		var dados_final = [];
		var controle = this.dados_compras[0].preco;
		// moldando os dados das linhas
		for(let i = 0; i < linhas; i++) 
		{
			// declarando linha
			var linha = {inicio : controle, fim: controle + separador, registros: []};
			controle += separador+1;
			if(this.produto.preco_medio >= linha.inicio && this.produto.preco_medio <= linha.fim)
			{
				linha.registros.push({preco : this.produto.preco_medio, id: 'pm'});
			}
			this.dados_compras.forEach(dado => 
			{
				// se estiver dentro desta faixa de preço
				if(dado.preco >= linha.inicio && dado.preco <= linha.fim)
				{
					linha.registros.push(dado);
				}
			});
			dados_final.push(linha);
		}
		// criando as labels
		var labels = [];
		dados_final.forEach(faixa => 
		{
			var ini = parseFloat(faixa.inicio).toFixed(2).toString().replace(".", ",");
			var fim = parseFloat(faixa.fim).toFixed(2).toString().replace(".", ",");
			labels.push("R$ "+fim+"\naté "+ini)
		});
		// criando as faixas
		var anonimos = [];
		var media_mercado = [];
		var meu_preco = [];
		dados_final.forEach((faixa, i) => 
		{
			meu_preco[i] = null;
			media_mercado[i] = null;
			anonimos[i] = null;
			faixa.registros.forEach(registro => 
			{
				// se o registro for o preço pago pelo usuario, adiciona na array
				if(registro.id == "eu")
				{
					meu_preco[i] = {meta:"your", value:0};
				}
				// se for precos anonimos
				else if(registro.id == "an")
				{
					// se não houver nada no indice, adiciona linha
					if(anonimos[i] == null)
					{
						anonimos[i] = {meta:"valores", value:1};
					}
					// se houver, só incrementa o valor
					else
					{
						anonimos[i].value++;
					}
				}
				// se for precos anonimos
				else if(registro.id == "pm")
				{
					media_mercado[i] = {meta:"best", value:0};
				}
			});
		});
		var series = [anonimos, media_mercado, meu_preco];		
		this.faz_grafico(labels, series);
	}
}
