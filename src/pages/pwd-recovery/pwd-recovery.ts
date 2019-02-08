import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Interface_usuario } from '../../providers/classes/interface';
import { Servidor } from '../../providers/classes/servidor';
import { Utilidades } from '../../providers/classes/utilidades';
@IonicPage()
@Component({selector: 'page-pwd-recovery', templateUrl: 'pwd-recovery.html'})
export class PwdRecoveryPage 
{
	public email : string = "";
	constructor
	(
		public navCtrl: NavController,
		public interface_user: Interface_usuario,
		public navParams: NavParams,
		public servidor: Servidor,
		public util: Utilidades
	)
	{
	}
	recuperar()
	{
		if(this.email == "")
		{
			this.interface_user.toast_padrao("Preencha o campo necessário!");
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
				email : this.email,
			});
			var ok = (reject, data)=>
			{
				this.navCtrl.popToRoot();
			};
			var load = this.interface_user.load_variavel("Carregando...");
			load.present();
			this.servidor.envia_post_api(data, "users/reset", func_resolve, func_reject).then((result)=>
			{
				load.dismiss();
				this.interface_user.alerta_btn_simples("Sucesso!", "E-mail com instruções de recuperação de senha enviado com sucesso!\n"
				+" Enviado para email: "+this.email, "OK", ok);
			}, (err)=>
			{
				var resultado : any = err;
				load.dismiss();
				if(resultado.error.error.code == "EMAIL_NOT_FOUND")
				{
					this.interface_user.alerta_padrao("Erro!", "E-mail não encontrado!\n Tente novamente.", ["ok"]);
				}
				else
				{
					this.interface_user.alerta_padrao("Erro!", "Não é possível realizar esta ação neste momento! Tente mais tarde.\nErro: "+err, ["ok"]);
				}
			});
		}
	}
}
