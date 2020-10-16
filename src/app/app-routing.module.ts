//import { OptimizationProgressComponent } from './component/flux/progress/optimization-progress.component';
//import { NodeDetailsComponent } from './component/nodeDetails/node-details.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'tourOptimization', pathMatch: 'full' },
  //{ path: 'test', component: OptimizationProgressComponent },
 // { path: 'nodeDetails', component: NodeDetailsComponent },
 // { path: 'search', component: SearchCustomersComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
