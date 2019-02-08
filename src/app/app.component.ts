import { Component, ViewChild } from '@angular/core';
import { Platform, Nav, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { OptBuyPage } from '../pages/opt-buy/opt-buy';
import { ProfilePage } from '../pages/profile/profile';
import { HistoricPage } from '../pages/historic/historic';
import { TranspPricePage } from '../pages/transp-price/transp-price';
import { FavoritesPage } from '../pages/favorites/favorites';
import { Servidor } from '../providers/classes/servidor';
import { Interface_usuario } from '../providers/classes/interface';
@Component({templateUrl: 'app.html'})
export class MyApp 
{
	@ViewChild(Nav) nav: Nav;	
	private rootPage : any = LoginPage;
	pages: Array<{title: string, component: any, icon: any}>;
	constructor
	(
		public platform: Platform, 
		public statusBar: StatusBar, 
		public splashScreen: SplashScreen, 
		public menuctrl: MenuController,
		public servidor: Servidor,
		public interface_user: Interface_usuario
	) 
	{
		platform.ready().then(() => 
		{
			statusBar.styleDefault();
			splashScreen.hide();
		});
		this.pages = [
			{ title: 'Inteligência de mercado', component: TranspPricePage, icon: "trending-up" },
			{ title: 'Opção de compra', component: OptBuyPage, icon: "cart" },
			{ title: 'Histórico', component: HistoricPage, icon: "ios-paper-outline" },
			{ title: 'Favoritos', component: FavoritesPage, icon: "ios-star-outline" },
			{ title: 'Perfil', component: ProfilePage, icon: "contact" }
		];
		// se o login e senha foram armazenados
		if(localStorage.getItem("login") && localStorage.getItem("senha"))
		{	
			var load = this.interface_user.load_variavel("Entrando...");
			load.present();
			// recebendo login e senha
			var login = localStorage.getItem("login");
			var senha = localStorage.getItem("senha");
			let data = JSON.stringify
			({ 
				email: login,
				password: senha
			});
			// fazendo login
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
						localStorage.setItem("login", login);
						localStorage.setItem("senha", senha);
						localStorage.setItem("session", dados.id);
						localStorage.setItem("id", dados.user.id);
						localStorage.setItem("nome", dados.user.nome);
						localStorage.setItem("documento", dados.user.documento);
						resolve(data);
					}
					else
					{
						reject(data);
					}
				}
			};
			var func_reject = (reject, err)=>
			{
				reject(err);
			};
			this.servidor.envia_post_api(data, "produtores/login?include=user", func_resolve, func_reject).then((id)=>
			{
				load.dismiss();
				this.rootPage = TranspPricePage;
			}, (err)=>
			{
				if(err == false)
				{
					load.dismiss();
					this.interface_user.alerta_padrao("Erro!", "Por favor, verifique seu email!", ["ok"]);
				}
				else
				{
					load.dismiss();
					this.interface_user.alerta_padrao("Erro!", "Login ou senha inválidos!", ["ok"]);
				}
			});
		}
		// se não foranm 
		else
		{
			// redireciona para a página de login
			this.rootPage = LoginPage;
		}
	}
	open_page(page)
	{
		this.nav.setRoot(page.component);
		this.menuctrl.close();
	}
	get_nome()
	{
		return localStorage.getItem("nome") == undefined ? "" : localStorage.getItem("nome");
	}
}
