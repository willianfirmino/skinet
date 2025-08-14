import {Component, inject, OnInit} from '@angular/core';
import {Header} from './layout/header/header';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [
    Header
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  baseUrl = 'https://localhost:5001/api/'
  title = 'Client';
  products: any[] = [];
  private http = inject(HttpClient);

  ngOnInit(): void {
    this.http.get<any>
    (this.baseUrl + 'products').subscribe({
      next: response => this.products = response.data,
      error: error => console.log(error)
    })
  }
}
