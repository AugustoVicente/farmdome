import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ModalController } from 'ionic-angular';
import { AddPrecoPage } from '../add-preco/add-preco';
import { AddToCartPage } from '../add-to-cart/add-to-cart';
import { Interface_usuario } from '../../providers/classes/interface';
import { Servidor } from '../../providers/classes/servidor';
import { ComparisonPage } from '../comparison/comparison';
@IonicPage()
@Component({selector: 'page-produto-subgrupo', templateUrl: 'produto-subgrupo.html'})
export class ProdutoSubgrupoPage 
{
	public tipo_pagina : number;
	public grupo : string;
	public filtro : string = "";
	public subgrupo : number;
	public icone_action : string;
	public produtos : any;
	constructor
	(
		public navCtrl: NavController,
		public navParams: NavParams,
		public modalCtrl: ModalController,
		public servidor: Servidor,
		public interface_user: Interface_usuario
	) 
	{
		this.tipo_pagina = navParams.get("tipo_pag");
		this.grupo = navParams.get("grupo");
		this.subgrupo = navParams.get("subgrupo");
		this.carregar(null);
		if(this.tipo_pagina == 1)
		{
			this.icone_action = "md-search";
		}
		else if(this.tipo_pagina == 2)
		{
			this.icone_action = "ios-cart-outline";
		}
	}
	aciona_icone(id, nome)
	{
		if(this.tipo_pagina == 1)
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
		else
		{
			this.navCtrl.push(AddToCartPage, {id : id});
		}
	}
	carregar(event)
	{
		this.grupo = this.grupo.replace("'", "");
		let data = JSON.stringify
		({ 
			idClass: this.subgrupo,
			searchProduto: this.filtro
		});
		var func_resolve = (reject, resolve, data)=>
		{
			resolve(data);
		};
		var func_reject = (reject, data)=>
		{
			reject(data);
		};
		this.servidor.envia_post_api(data, "produtos/search", func_resolve, func_reject).then((dados)=>
		{
			this.produtos = dados;
			if(event != null)
			{
				event.complete();
			}
		}, (err)=>
		{
			this.interface_user.alerta_padrao("Erro!", "Houve um problema com a conexão", ["ok"]);
		});
	}
	home()
	{
		this.navCtrl.popToRoot();
	}
}
