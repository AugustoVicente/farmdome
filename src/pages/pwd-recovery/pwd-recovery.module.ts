import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PwdRecoveryPage } from './pwd-recovery';

@NgModule({
  declarations: [
    PwdRecoveryPage,
  ],
  imports: [
    IonicPageModule.forChild(PwdRecoveryPage),
  ],
})
export class PwdRecoveryPageModule {}
