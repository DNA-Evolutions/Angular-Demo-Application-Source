import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from '@env/environment';

if (environment.production) {
  enableProdMode();
}

setTimeout(() => {
  const loadingElement = document.querySelector('.demo-loading');

  platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err))
    .then(() => loadingElement.classList.add('loaded'))
    .then(() => setTimeout(() => loadingElement.remove(), 1000));
}, 1000);
