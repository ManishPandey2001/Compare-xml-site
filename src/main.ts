import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { XmlCompareComponent } from './app/xml-compare/xml-compare';
import { Base64ExcelComponent } from './app/base64-excel/base64-excel.component';

const routes: Routes = [
  { path: '', redirectTo: 'xml-compare', pathMatch: 'full' },
  { path: 'xml-compare', component: XmlCompareComponent },
  { path: 'base64-excel', component: Base64ExcelComponent }
];

bootstrapApplication(AppComponent, {
  providers: [provideRouter(routes)]
}).catch((err) => console.error(err));