import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PRIMENG_MODULES } from './utils/primeng.config';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PRIMENG_MODULES, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'morphotr-prueba';
}
