import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Interface_usuario } from '../../providers/classes/interface';
import { Utilidades } from '../../providers/classes/utilidades';
import { Servidor } from '../../providers/classes/servidor';
@IonicPage()
@Component({selector: 'page-sign-up', templateUrl: 'sign-up.html'})
export class SignUpPage
{
	public nome : string = "";
	public tel : string = "";
	public doc : string = "";
	public email : string = "";
	public senha : string = "";
	public csenha : string = "";
	constructor
	(
		public navCtrl: NavController,
		public interface_user: Interface_usuario,
		public servidor: Servidor,
		public util: Utilidades,
		public navParams: NavParams
	)
	{

	}
	cadastrar()
	{
		if(this.nome == "" || this.tel == "" || this.doc == "" || this.email == "" || this.senha == "" || this.csenha == "")
		{
			this.interface_user.toast_padrao("Preencha os campos necessários!");
		}
		else if(this.senha !== this.senha)
		{
			this.interface_user.toast_padrao("As senhas não são compatíveis! Por favor insira novamente.");
		}
		else
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
				confirmarsenha: this.csenha,
				documento : this.doc,
				email : this.email,
				nome : this.nome,
				password : this.senha,
				status: true,
				telefone: this.tel
			});
			var load = this.interface_user.load_variavel("Carregando...");
			load.present();
			this.servidor.envia_post_api(data, "users", func_resolve, func_reject).then((dados)=>
			{
				var dados_ : any = dados;
				var data2 = JSON.stringify
				({
					contato : this.nome,
					pes_id: dados_.id,
					numero: this.tel
				});
				var ok = (reject, data)=>
				{
					this.navCtrl.popToRoot();
				};
				this.servidor.envia_post_api(data2, "telefones", func_resolve, func_reject).then((id)=>
				{
					load.dismiss();
					this.interface_user.alerta_btn_simples("Obrigado por se cadastrar!", "Por favor olhe seu e-mail para que sua conta seja verificada.\n"
					+"Clique no botão de verificação do email para que você continue o cadastro.\nQualquer dúvida entre em contato com a gente.\n"
					+"contato@farmdome.com", "OK", ok);
				}, (err)=>
				{
					load.dismiss();
					this.interface_user.alerta_padrao("Erro!", "Não é possível realizar esta ação neste momento! Tente mais tarde.\nErro: "+err, ["ok"]);
				});
			}, (err)=>
			{
				load.dismiss();
				this.interface_user.alerta_padrao("Erro!", "Não é possível realizar esta ação neste momento! Tente mais tarde.\nErro: "+err, ["ok"]);
			});
		}
	}
}
