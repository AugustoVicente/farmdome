import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HistoricPage } from '../historic/historic';
import { Utilidades } from '../../providers/classes/utilidades';
import { Servidor } from '../../providers/classes/servidor';
import { Interface_usuario } from '../../providers/classes/interface';
import { TranspPricePage } from '../transp-price/transp-price';
@IonicPage()
@Component({selector: 'page-cart', templateUrl: 'cart.html'})
export class CartPage 
{
	public carrinho : any = this.util.busca_carrinho();
	constructor
	(
		public navCtrl: NavController, 
		public navParams: NavParams,
		public servidor: Servidor,
		public interface_user: Interface_usuario,
		public util: Utilidades
	)
	{}
	@ViewChild('lista') list : ElementRef;
	adicionar_outros() 
	{
		this.navCtrl.popToRoot();
	}
	enviar_orcamento()
	{
		let data = JSON.stringify
		({
			prod_id: parseInt(localStorage.getItem("id")),
			oc_data: Date.now()
		});
		var func_resolve = (reject, resolve, data)=>
		{
			var dados : any = data;
			resolve(dados);
		};
		var func_reject = (reject, data)=>
		{
			reject(data);
		};
		var load = this.interface_user.load_variavel("Carregando...");
		load.present();
		this.servidor.envia_post_api(data, "opcaocompras", func_resolve, func_reject).then((ops)=>
		{
			var ops_ : any = ops;
			this.carrinho.forEach(pedido => 
			{
				if(pedido != null)
				{
					pedido.forEach(produto =>
					{
						var data2 = JSON.stringify
						({ 
							for_id: produto.fornecedor.id,
							fpag_id: produto.fpag.id,
							oc_id: ops_.id,	
							ocp_preco: produto.ppag,
							ocp_qtd: produto.qtd,
							ops_id: 2,
							pemb_id: produto.embalagem.id,
							pro_id: produto.idproduto.id
						});
						this.servidor.envia_post_api(data2, "opcaocompraprodutos", func_resolve, func_reject).then((id)=>
						{}, (err)=>
						{
							this.interface_user.alerta_padrao("Erro!", "Não é possível realizar esta ação neste momento! Tente mais tarde.\nErro: "+err, ["ok"]);
						});
					});
					load.dismiss();
					this.interface_user.alerta_padrao("Sucesso!", "Parabêns seu orçamento foi enviado!", ["ok"]);
					this.util.esvazia_carrinho();
				}
			});
		}, (err)=>
		{
			load.dismiss();			
			this.interface_user.alerta_padrao("Erro!", "Não é possível realizar esta ação neste momento! Tente mais tarde.\nErro: "+err, ["ok"]);
		});
	}
	exclui(prod, pedido)
	{
		this.util.remove_carrinho(prod, pedido);
		this.carrinho = this.util.busca_carrinho();
	}
}
