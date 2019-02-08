import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { Servidor } from '../../providers/classes/servidor';
import { AddPrecoPage } from '../add-preco/add-preco';
import { ComparisonPage } from '../comparison/comparison';
import { Interface_usuario } from '../../providers/classes/interface';
import { AddToCartPage } from '../add-to-cart/add-to-cart';
import { Utilidades } from '../../providers/classes/utilidades';
@IonicPage()
@Component({selector: 'page-similars-product', templateUrl: 'similars-product.html'})
export class SimilarsProductPage 
{
	public titulo: string;
	public produtos_similares : any = [];
	constructor
	(
		public servidor: Servidor,
		public modalCtrl: ModalController,
		public interface_user: Interface_usuario,
		public navCtrl: NavController,
		public navParams: NavParams,
		public utilidades: Utilidades
	) 
	{
		if(navParams.get("tipo_pag") == 1)
		{
			this.titulo = "Ingrediente Ativo e Concentração";
		}
		else
		{
			this.titulo = "Ingrediente Ativo";
		}
		this.produtos_similares = JSON.parse(navParams.get("valores"));
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
		new Date().toISOString()+"%22,%22lt%22:%22"+new Date().toISOString()+"%22%7D%7D,%7B%22prod_id%22:"+localStorage.getItem("id")+
		"%7D,%7B%22pro_id%22:"+id+"%7D%5D%7D%7D",
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
	adicionar_orcamento(id)
	{
		this.navCtrl.push(AddToCartPage, {id : id});
	}
}
