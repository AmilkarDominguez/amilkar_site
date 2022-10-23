import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { NgParticlesModule } from "ng-particles";
import { ParticlesContainerComponent } from './pages/particles-container/particles-container.component';
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ParticlesContainerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgParticlesModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
