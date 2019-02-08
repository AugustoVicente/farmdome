import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddPrecoPage } from './add-preco';

@NgModule({
  declarations: [
    AddPrecoPage,
  ],
  imports: [
    IonicPageModule.forChild(AddPrecoPage),
  ],
})
export class AddPrecoPageModule {}
