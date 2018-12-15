import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, Event, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { merge } from 'rxjs/observable/merge';

import { SettingsComponent } from '@app/settings/settings.component';
import { AboutComponent } from '@app/about/about.component';
import { HomeComponent } from '@app/home/home.component';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent {
  tabs = [
    { component: HomeComponent, name: 'home', route: 'home', title: 'Home', icon: 'home' },
    { component: AboutComponent, name: 'about', route: 'about', title: 'About', icon: 'logo-angular' },
    { component: SettingsComponent, name: 'settings', route: 'settings', title: 'Settings', icon: 'cog' }
  ];
  selectedTabName$: Observable<string>;
  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    const firstRoute$ = of(activatedRoute);
    const navEventRoutes$ = router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => activatedRoute)
    );
    this.selectedTabName$ = merge(firstRoute$, navEventRoutes$).pipe(map(route => this.routeToTabId(route)));
  }
  private routeToTabId(route: ActivatedRoute) {
    if (!route || !route.firstChild) {
      return;
    }
    if (route && route.component === ShellComponent && route.firstChild) {
      route = route.firstChild;
      // Fixed the bug#19420 : route.component is undefined if module is lazy
      // See: https://github.com/angular/angular/issues/19420
      while (route.firstChild) {
        route = route.firstChild;
      }
      // Fixed #19420 end
      return this.tabs.find(tabElement => tabElement.route === route.routeConfig.path).name;
    }
  }
}
