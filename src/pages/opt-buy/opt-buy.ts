import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ProdutoSubgrupoPage } from '../produto-subgrupo/produto-subgrupo';
import { CartPage } from '../cart/cart';
import { Interface_usuario } from '../../providers/classes/interface';
import { Servidor } from '../../providers/classes/servidor';
import { Utilidades } from '../../providers/classes/utilidades';
@IonicPage()
@Component({selector: 'page-opt-buy', templateUrl: 'opt-buy.html'})
export class OptBuyPage 
{
	public pagina : any;
	public grupob : any;
	public grupoc : any;
	public grupo : any = [];
	constructor
	(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public utilidades: Utilidades,
		public servidor: Servidor,
		public interface_user: Interface_usuario
	) 
	{
		this.carrega_grupob();
		this.carrega_grupos();
	}
	seleciona(subgrupo)
	{
		var sg = this.grupo[subgrupo.id];
		this.navCtrl.push(ProdutoSubgrupoPage, { tipo_pag: 2, grupo: this.pagina, subgrupo: sg });
	}
	entra_carrinho()
	{
		this.navCtrl.push(CartPage);
	}
	carrega_grupob()
	{
		var func_resolve = (reject, resolve, data)=>
		{
			this.grupob = data;
			this.pagina = "'"+this.grupob[0].id+"'";
		};
		var func_reject = (reject, data)=>
		{
			reject(data);
		};
		this.servidor.envia_get("classeusos-b", func_resolve, func_reject).then((id)=>
		{}, (err)=>{this.interface_user.alerta_padrao("Erro!", "Houve um problema com a conexão", ["ok"]);});
	}
	carrega_grupos()
	{
		var func_resolve = (reject, resolve, data)=>
		{
			this.grupoc = data;
		};
		var func_reject = (reject, data)=>
		{
			reject(data);
		};
		this.servidor.envia_get("classeusos-c", func_resolve, func_reject).then((id)=>
		{}, (err)=>{this.interface_user.alerta_padrao("Erro!", "Houve um problema com a conexão", ["ok"]);});
		var func_resolve = (reject, resolve, data)=>
		{
			data.forEach(prod => 
			{
				if(this.grupo[prod.clup_id] == undefined)
				{
					this.grupo[prod.clup_id] = [];
					this.grupo[prod.clup_id].push(prod);
				}
				else
				{
					this.grupo[prod.clup_id].push(prod);
				}
			});
		};
		var func_reject = (reject, data)=>
		{
			reject(data);
		};
		this.servidor.envia_get("classeusos", func_resolve, func_reject).then((id)=>
		{}, (err)=>{this.interface_user.alerta_padrao("Erro!", "Houve um problema com a conexão", ["ok"]);});
	}
	change_tab(context) 
	{
		this.pagina = "'"+context.target.childNodes[1].value+"'";
	}
	transforma_string(id) 
	{
		return "'"+id+"'";
	}
}