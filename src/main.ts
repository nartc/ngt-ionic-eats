import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
	providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, provideIonicAngular()],
});
