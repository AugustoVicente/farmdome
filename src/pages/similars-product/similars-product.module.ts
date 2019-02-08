import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SimilarsProductPage } from './similars-product';

@NgModule({
  declarations: [
    SimilarsProductPage,
  ],
  imports: [
    IonicPageModule.forChild(SimilarsProductPage),
  ],
})
export class SimilarsProductPageModule {}
