import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Interface_usuario } from '../../providers/classes/interface';
import { Servidor } from '../../providers/classes/servidor';
@IonicPage()
@Component({selector: 'page-favorites', templateUrl: 'favorites.html'})
export class FavoritesPage 
{
	public favoritos : any;
	constructor
	(
		public navCtrl: NavController,
		public servidor: Servidor,
		public interface_user: Interface_usuario,
		public navParams: NavParams
	)
	{
		this.carregar_favoritos();
	}
	carregar_favoritos()
	{
		var func_resolve = (reject, resolve, data)=>
		{
			resolve(data);
		};
		var func_reject = (reject, data)=>
		{
			reject(data);
		};
		this.servidor.envia_get("produtorprodutofavoritos?filter={\"include\":[\"produto\"],\"where\":{\"prod_id\":"+localStorage.getItem("id")+"}}", 
		func_resolve, func_reject).then((dados)=>
		{
			this.favoritos = dados;
			this.favoritos.forEach(favorito => 
			{
				favorito.pro_nome = favorito.produto.pro_nome;
				this.servidor.envia_get("produtos/"+favorito.pro_id+"?filter={\"include\":[{\"ativos\":\"ingrediente_ativo\"},\"embalagens\",\"classe_uso\",\"unidade_medida\"]}", 
				func_resolve, func_reject).then((data)=>
				{
					var dados_ : any = data;
					dados_.ativos.forEach((at, i) => 
					{
						if(i == 0)
						{
							favorito.iat_nome = at.ingrediente_ativo.iat_nome;
							favorito.iat_conc = at.piat_concentracao;
						}
						else
						{
							favorito.iat_nome += " + " + at.ingrediente_ativo.iat_nome;
							favorito.iat_conc += " + " + at.piat_concentracao;
						}
					});
				}, (err)=>
				{
					this.interface_user.alerta_padrao("Erro!", "Houve um problema de conexão!", ["ok"]);
				});
			});
		}, (err)=>
		{
			this.interface_user.alerta_padrao("Erro!", "Houve um problema de conexão!", ["ok"]);
		});
	}
	deleta(id)
	{
		var func_resolve = (reject, resolve, data)=>
		{
			resolve(data);
		};
		var func_reject = (reject, data)=>
		{
			reject(data);
		};
		this.servidor.envia_delete("produtorprodutofavoritos/"+id, 
		func_resolve, func_reject).then((dados)=>
		{
			this.carregar_favoritos();
		}, (err)=>
		{
			this.interface_user.alerta_padrao("Erro!", "Houve um problema de conexão!", ["ok"]);
		});
	}
}
