import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Servidor } from '../../providers/classes/servidor';
import { Interface_usuario } from '../../providers/classes/interface';
import { Utilidades } from '../../providers/classes/utilidades';
@IonicPage()
@Component({selector: 'page-historic', templateUrl: 'historic.html'})
export class HistoricPage 
{
	private historic : any;
	constructor
	(
		public navCtrl: NavController,
		public navParams: NavParams,
		private interface_usuario: Interface_usuario,
		private utils: Utilidades,
		public servidor: Servidor
	)
	{
		this.carrega_historic();
	}
	carrega_historic()
	{
		var func_resolve = (reject, resolve, data)=>
		{
			this.historic = data;
			resolve(data);
		};
		var func_reject = (reject, data)=>
		{
			reject(data);
		};
		this.servidor.envia_get("opcaocompras?filter=%7B%22include%22:%5B%7B%22opcao_compra_produtos%22:%5B%22opcao_compra_status%22,%22produto%22,%22fornecedor%22,%22produto_embalagem%22,%22forma_pagamento%22%5D%7D%5D,%22where%22:%7B%22prod_id%22:"+localStorage.getItem("id")+"%7D%7D", 
		func_resolve, func_reject).then((id)=>{}, (err)=>{this.interface_usuario.alerta_padrao("Erro!", "Houve um problema com a conexão", ["ok"]);});
	}
}
