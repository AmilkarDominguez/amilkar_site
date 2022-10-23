import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from "./pages/home/home.component";
import {ParticlesContainerComponent} from "./pages/particles-container/particles-container.component";

const routes: Routes = [
  { path: '', component: ParticlesContainerComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
