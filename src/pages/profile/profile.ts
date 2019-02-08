import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { App } from 'ionic-angular';
import { Interface_usuario } from '../../providers/classes/interface';
import { LoginPage } from '../login/login';
import { Servidor } from '../../providers/classes/servidor';
@IonicPage()
@Component({ selector: 'page-profile', templateUrl: 'profile.html'})
export class ProfilePage 
{
	private nome : string = "";
	private email : string = "";
	private tel : any;
	private doc : string = "";
	constructor
	(
		private app : App,
		public navCtrl: NavController,
		private interface_usuario: Interface_usuario,
		public navParams: NavParams,
		public servidor: Servidor
	)
	{
		this.email = localStorage.getItem("login");
		this.doc = localStorage.getItem("documento");
		this.nome = localStorage.getItem("nome");
		this.carrega_tel();
	}
	logout()
	{
		var load = this.interface_usuario.load_variavel("Desconectando..");
		load.present();
		// redirecionando para a página de login
		this.app.getRootNav().setRoot(LoginPage).then(()=>
		{
			// limpando a memória local
			localStorage.clear();
			load.dismiss();
		});
	}
	carrega_tel()
	{
		var func_resolve = (reject, resolve, data)=>
		{
			this.tel = data;
			resolve(data);
		};
		var func_reject = (reject, data)=>
		{
			reject(data);
		};
		this.servidor.envia_get("telefones?filter=%7B%22where%22:%7B%22pes_id%22:"+localStorage.getItem("id")+"%7D%7D", func_resolve, func_reject).then((id)=>
		{}, (err)=>{this.interface_usuario.alerta_padrao("Erro!", "Houve um problema com a conexão", ["ok"]);});
	}
	salvar_dados()
	{
		this.tel.forEach(telefone => 
		{
			var data = JSON.stringify
			({ 
				numero: telefone.numero,
				contato: telefone.contato,
				pes_id: localStorage.getItem("id"),
				id: telefone.id
			});
			var func_resolve = (reject, resolve, data)=>
			{
				resolve(data);
			};
			var func_reject = (reject, data)=>
			{
				reject(data);
			};
			this.servidor.envia_put(data, "telefones?id="+telefone.id, func_resolve, func_reject).then((id)=>
			{}, (err)=>{this.interface_usuario.alerta_padrao("Erro!", "Houve um problema com a conexão", ["ok"]);});
		});
		var data = JSON.stringify
		({ 
			id: localStorage.getItem("id"),
			nome: this.nome,
			documento: this.doc,
			email: this.email
		});
		var func_resolve = (reject, resolve, data)=>
		{
			resolve(data);
		};
		var func_reject = (reject, data)=>
		{
			reject(data);
		};
		this.servidor.envia_put(data, "users?id="+localStorage.getItem("id"), func_resolve, func_reject).then((id)=>
		{this.interface_usuario.toast_padrao("Dados salvos com sucesso!")}, (err)=>{this.interface_usuario.alerta_padrao("Erro!", "Houve um problema com a conexão", ["ok"]);});
	}
}
