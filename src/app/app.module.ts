import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPageModule } from '../pages/login/login.module';
import { LoginPage } from '../pages/login/login';
import { TranspPricePage } from '../pages/transp-price/transp-price';
import { OptBuyPageModule } from '../pages/opt-buy/opt-buy.module';
import { TranspPricePageModule } from '../pages/transp-price/transp-price.module';
import { OptBuyPage } from '../pages/opt-buy/opt-buy';
import { ProfilePage } from '../pages/profile/profile';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { HistoricPage } from '../pages/historic/historic';
import { HistoricPageModule } from '../pages/historic/historic.module';
import { MenuController } from 'ionic-angular/components/app/menu-controller';
import { ProdutoSubgrupoPage } from '../pages/produto-subgrupo/produto-subgrupo';
import { ProdutoSubgrupoPageModule } from '../pages/produto-subgrupo/produto-subgrupo.module';
import { AddPrecoPageModule } from '../pages/add-preco/add-preco.module';
import { AddPrecoPage } from '../pages/add-preco/add-preco';
import { AddToCartPageModule } from '../pages/add-to-cart/add-to-cart.module';
import { CartPageModule } from '../pages/cart/cart.module';
import { AddToCartPage } from '../pages/add-to-cart/add-to-cart';
import { CartPage } from '../pages/cart/cart';
import { FavoritesPageModule } from '../pages/favorites/favorites.module';
import { FavoritesPage } from '../pages/favorites/favorites';
import { ComparisonPageModule } from '../pages/comparison/comparison.module';
import { ComparisonPage } from '../pages/comparison/comparison';
import { SimilarsProductPageModule } from '../pages/similars-product/similars-product.module';
import { SimilarsProductPage } from '../pages/similars-product/similars-product';
import { SignUpPageModule } from '../pages/sign-up/sign-up.module';
import { SignUpPage } from '../pages/sign-up/sign-up';
import { Servidor } from '../providers/classes/servidor';
import { HttpClientModule } from '@angular/common/http';
import { Interface_usuario } from '../providers/classes/interface';
import { Utilidades } from '../providers/classes/utilidades';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { PwdRecoveryPage } from '../pages/pwd-recovery/pwd-recovery';
import { PwdRecoveryPageModule } from '../pages/pwd-recovery/pwd-recovery.module';

@NgModule({
	declarations: [
		MyApp
	],
	imports: [
		BrowserModule,
		LoginPageModule,
		TranspPricePageModule,
		ProfilePageModule,
		OptBuyPageModule,
		HttpClientModule,
		HistoricPageModule,
		ProdutoSubgrupoPageModule,
		AddToCartPageModule,
		SignUpPageModule,
		FavoritesPageModule,
		ComparisonPageModule,
		SimilarsProductPageModule,
		CartPageModule,
		PwdRecoveryPageModule,
		AddPrecoPageModule,
		IonicModule.forRoot(MyApp,{ backButtonText: 'Voltar'})
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		TranspPricePage,
		OptBuyPage,
		ProfilePage,
		ComparisonPage,
		AddToCartPage,
		FavoritesPage,
		CartPage,
		SignUpPage,
		LoginPage,
		SimilarsProductPage,
		HistoricPage,
		PwdRecoveryPage,
		ProdutoSubgrupoPage
	],
	providers: [
		StatusBar,
		SplashScreen,
		MenuController,
		HttpClientModule,
		InAppBrowser,
		Servidor,
		AddPrecoPage,
		Utilidades,
		{provide: ErrorHandler, useClass: IonicErrorHandler},
		Interface_usuario
	]
})
export class AppModule {}
