import { Injectable } from '@angular/core';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable()
export class Servidor
{
	// variável que recebe o link do servidor
	private SITE : string = "https://api.farmdome.com.br/";
	constructor
	(
		public http: HttpClient
	) {}
	// função que retorna a url que se encontra o webservice
	get_api_url()
	{
		return this.SITE + "api/";
	}
	// função que retorna a url que se encontra as imagens do produto
	get_product_image_url(image)
	{
		// concatenando com a url passafa por parâmetro
		return this.SITE + "sistema/" + image;
	}
	// função que retorna a url que se encontra as imagens do perfil
	get_profile_image_url()
	{
		return this.SITE + "sistema/";
	}
	// função que envia o request ao servidor
	envia_post_api(dados_request, diretorio, f_resolve, f_reject)
	{
		var headers;
		if(localStorage.getItem("session") == undefined || localStorage.getItem("session") == null)
		{
			headers = new HttpHeaders(
			{
				'Content-Type' : 'application/json'
			});
		}
		else
		{
			headers = new HttpHeaders(
			{
				'Content-Type' : 'application/json',
				"X-Access-Token" : localStorage.getItem("session")
			});
		}
		// criando a promise da função
		return new Promise((resolve, reject) => 
		{
			this.http.post(this.get_api_url()+diretorio, dados_request, { headers }).subscribe(data => 
			{
				f_resolve(reject, resolve, data);
			}, err => 
			{
				f_reject(reject, err);
			});
		});
	}
	envia_get(diretorio, f_resolve, f_reject)
	{
		let headers = new HttpHeaders(
		{
			'Content-Type' : 'application/json',
			"X-Access-Token" : localStorage.getItem("session")
		});
		// criando a promise da função
		return new Promise((resolve, reject) => 
		{
			this.http.get(this.get_api_url()+diretorio, { headers }).subscribe(data => 
			{
				f_resolve(reject, resolve, data);
			}, err => 
			{
				f_reject(reject, err);
			});
		});
	}
	envia_put(dados_request, diretorio, f_resolve, f_reject)
	{
		let headers = new HttpHeaders(
		{
			'Content-Type' : 'application/json',
			"X-Access-Token" : localStorage.getItem("session")
		});
		// criando a promise da função
		return new Promise((resolve, reject) => 
		{
			this.http.put(this.get_api_url()+diretorio, dados_request, { headers }).subscribe(data => 
			{
				f_resolve(reject, resolve, data);
			}, err => 
			{
				f_reject(reject, err);
			});
		});
	}
	envia_delete(diretorio, f_resolve, f_reject)
	{
		let headers = new HttpHeaders(
		{
			'Content-Type' : 'application/json',
			"X-Access-Token" : localStorage.getItem("session")
		});
		// criando a promise da função
		return new Promise((resolve, reject) => 
		{
			this.http.delete(this.get_api_url()+diretorio, { headers }).subscribe(data => 
			{
				f_resolve(reject, resolve, data);
			}, err => 
			{
				f_reject(reject, err);
			});
		});
	}
}