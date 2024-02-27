import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConsentComponent } from './component/consent/consent.component';
import { ExampleComponent } from './component/example/example.component';

const routes: Routes = [
  { path: 'consent', component: ConsentComponent },
  { path: 'example', component: ExampleComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
