import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Renderer } from '@angular/core';
import { ComparisonPage } from '../comparison/comparison';
import { Utilidades } from '../../providers/classes/utilidades';
import { Interface_usuario } from '../../providers/classes/interface';
import { Servidor } from '../../providers/classes/servidor';
@IonicPage()
@Component({selector: 'page-add-preco', templateUrl: 'add-preco.html'})
export class AddPrecoPage 
{
	public fpag : any = 0;
	public fpagamentos : any;
	public produto_escolhido : number;
	public produto_escolhido_nome : string;
	public produto : any = {};
	public embalagem : number = 0;
	public preco : number = 1;
	constructor
	(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public renderer: Renderer,
		public viewCtrl: ViewController,
		public servidor: Servidor,
		public interface_user: Interface_usuario,
		public utilidades: Utilidades
	) 
	{
		this.renderer.setElementClass(viewCtrl.pageRef().nativeElement, 'my-popup', true);
		this.carregar_fpagamento();
		this.produto_escolhido = navParams.get("id");
		this.produto_escolhido_nome = navParams.get("produto");
		this.carregar_detalhes();
	}
	close()
	{
		this.viewCtrl.dismiss();
	}
	entrar_comparacao()
	{
		if(this.embalagem == 0 || this.preco < 1 || this.fpag == 0)
		{
			this.interface_user.toast_padrao("Preencha os campos necessários!");
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
				pro_id: this.produto_escolhido,
				prod_id: localStorage.getItem("id")
			});
			var load = this.interface_user.load_variavel("Carregando...");
			load.present();
			this.servidor.envia_post_api(data, "produtorprodutofavoritos", func_resolve, func_reject).then((dados)=>
			{
				var data2 = JSON.stringify
				({
					pag_id: this.fpag,
					pemb_id: this.embalagem,
					preco: this.preco,
					pro_id: this.produto_escolhido,
					prod_id: localStorage.getItem("id")
				});
				this.servidor.envia_post_api(data2, "produtormediaprodutos", func_resolve, func_reject).then((dados)=>
				{
					load.dismiss();
					this.navCtrl.push(ComparisonPage, {id: this.produto_escolhido});
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
	carregar_fpagamento()
	{
		var func_resolve = (reject, resolve, data)=>
		{
			resolve(data);
		};
		var func_reject = (reject, data)=>
		{
			reject(data);
		};
		this.servidor.envia_get("formapagamentos", func_resolve, func_reject).then((dados)=>
		{
			this.fpagamentos = dados;
		}, (err)=>
		{
			this.interface_user.alerta_padrao("Erro!", "Login ou senha inválidos!", ["ok"]);
		});
	}
	carregar_detalhes()
	{
		var func_resolve = (reject, resolve, data)=>
		{
			resolve(data);
		};
		var func_reject = (reject, data)=>
		{
			reject(data);
		};
		this.servidor.envia_get("produtos/"+this.produto_escolhido+"?filter={\"include\":[{\"ativos\":\"ingrediente_ativo\"},\"embalagens\",\"classe_uso\",\"unidade_medida\"]}", 
		func_resolve, func_reject).then((dados)=>
		{
			this.produto = dados;
		}, (err)=>
		{
			this.interface_user.alerta_padrao("Erro!", "Houve um problema de conexão!", ["ok"]);
		});
	}
}
