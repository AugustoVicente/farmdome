import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ComparisonPage } from './comparison';
@NgModule({
	declarations: [
		ComparisonPage,
	],
	imports: [
		IonicPageModule.forChild(ComparisonPage)
	],
})
export class ComparisonPageModule {}
