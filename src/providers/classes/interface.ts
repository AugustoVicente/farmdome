import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';
import { AlertController } from 'ionic-angular';
@Injectable()
export class Interface_usuario
{
    private toast;
    private alert;
	constructor
	(
		private toastCtrl: ToastController,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController
	) {}
	// função que cria um toast padrão com mensagem por parâmetro, duração 3 seg e em cima
	toast_padrao(msg) 
	{
		this.toast = this.toastCtrl.create(
		{
			message: msg,
			duration: 3000,
			position: 'top'
		});
		this.toast.present();
	}
	// função que retorna um objeto load com o texto passado por parâmetro e spinner do tipo dots
    load_variavel(text)
    {
        return this.loadingCtrl.create({
			spinner: 'dots',
			content: text
		});
	}
	// função que cria um alerta padrão com atributos passados por parâmetro
    alerta_padrao(title, message, buttons)
    {
        this.alert = this.alertCtrl.create({
			title: title,
			message: message,
            buttons: buttons
        });
		// apresentando alerta
		this.alert.present();
	}
	// função que cria um alerta com contexto
	alerta_com_contexto(title, message, context, title_confirm, confirm_action)
    {
        this.alert = this.alertCtrl.create({
			title: title, // título passado por parâmetro
			message: message, // mensagem passada por parâmetro
			// alerta com botões
            buttons: [
				{
					// cancela
					text: 'Cancelar'
				},
				{
					// envia
					text: title_confirm, // título do botão passado por parâmetro
					handler: () =>
					{
						confirm_action(context) // função de confirmação passada por parâmetro
					}
				}
			]
        });
		// apresentando alerta
		this.alert.present();
	}
	// função que cria um alerta com contexto
	alerta_btn_simples(title, message, title_confirm, confirm_action)
    {
        this.alert = this.alertCtrl.create({
			title: title, // título passado por parâmetro
			message: message, // mensagem passada por parâmetro
			// alerta com botões
            buttons: [
				{
					// cancela
					text: 'Cancelar'
				},
				{
					// envia
					text: title_confirm, // título do botão passado por parâmetro
					handler: () =>
					{
						confirm_action() // função de confirmação passada por parâmetro
					}
				}
			]
        });
		// apresentando alerta
		this.alert.present();
	}
	// função que cria alerta com duas funções passadas por parâmetro e contexto
	alerta_duplo_com_contexto(title, message, context, title_confirm, confirm_action, title_reject, reject_action)
    {
        this.alert = this.alertCtrl.create({
			title: title, // título passado por parâmetro
			message: message, // mensagem passada por parâmetro
			// alerta com botões
            buttons: [
				{
					// cancela
					text: 'Cancelar'
				},
				{
					// recusa
					text: title_reject,  // título do botão passado por parâmetro
					handler: () => reject_action(context) // função de rejeição passada por parâmetro
				},
				{
					// confirma
					text: title_confirm, // título do botão passado por parâmetro
					handler: () => confirm_action(context) // função de confirmação passada por parâmetro
				}
			]
        });
		// apresentando alerta
		this.alert.present();
	}
	// função que cria um alerta com contexto e subtítulo e inputs
	alerta_subtitulo_contexto_input(title, subtitle, inputs, message, context, title_confirm, confirm_action, obj_action)
    {
        this.alert = this.alertCtrl.create({
			title: title, // título passado por parâmetro
			message: message, // mensagem passada por parâmetro
			subTitle: subtitle, // subtítulo passada por parâmetro
			inputs: inputs, // inputs passados por parâmetro
			// alerta com botões
            buttons: [
				{
					// cancela
					text: 'Cancelar'
				},
				{
					// envia
					text: title_confirm, // título do botão passado por parâmetro
					handler: (valor_input) => 
					{
						// função de confirmação passada por parâmetro
						confirm_action(context, valor_input, obj_action);
					}
				}
			]
        });
		// apresentando alerta
		this.alert.present();
    }
}