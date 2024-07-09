import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Experience } from './experience/experience';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	standalone: true,
	imports: [IonApp, IonRouterOutlet, Experience],
})
export class AppComponent {
	constructor() {}
}
