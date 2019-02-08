import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { TranspPricePage } from '../transp-price/transp-price';
import { SignUpPage } from '../sign-up/sign-up';
import { Servidor } from '../../providers/classes/servidor';
import { Interface_usuario } from '../../providers/classes/interface';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { PwdRecoveryPage } from '../pwd-recovery/pwd-recovery';
@IonicPage()
@Component({selector: 'page-login', templateUrl: 'login.html'})
export class LoginPage 
{
	public senha : string;
	public login : string;
	constructor
	(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public servidor: Servidor,
		private iab: InAppBrowser,
		public interface_user: Interface_usuario
	) {}
	entrar()
	{
		if(this.login != null && this.login != undefined && this.login != "" && this.senha != null && this.senha != undefined && this.senha != "")
		{
			let data = JSON.stringify
			({ 
				email: this.login,
				password: this.senha
			});
			var func_resolve = (reject, resolve, data)=>
			{
				var dados : any = data;
				if(dados.user.emailVerified == false)
				{
					reject(false);
				}
				else
				{
					if(dados.id)
					{
						localStorage.setItem("login", this.login);
						localStorage.setItem("senha", this.senha);
						localStorage.setItem("session", dados.id);
						localStorage.setItem("id", dados.user.id);
						localStorage.setItem("nome", dados.user.nome);
						localStorage.setItem("documento", dados.user.documento);
						resolve(dados);
					}
					else
					{
						reject(dados);
					}
				}
			};
			var func_reject = (reject, data)=>
			{
				reject(data);
			};
			this.servidor.envia_post_api(data, "produtores/login?include=user", func_resolve, func_reject).then((id)=>
			{
				this.navCtrl.setRoot(TranspPricePage);
			}, (err)=>
			{
				if(err == false)
				{
					this.interface_user.alerta_padrao("Erro!", "Por favor, verifique seu email!", ["ok"]);
				}
				else
				{
					this.interface_user.alerta_padrao("Erro!", "Login ou senha inválidos!", ["ok"]);
				}
			});
		}
		else
		{
			this.interface_user.toast_padrao("Preencha os campos necessários!");
		}
	}
	cadastro()
	{
		this.navCtrl.push(SignUpPage);
	}
	site()
	{
		const browser = this.iab.create('http://www.farmdome.com.br', '_system');
	}
	pwd_rec()
	{
		this.navCtrl.push(PwdRecoveryPage);
	}
}
