import { Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
})
export class CardsComponent implements OnInit {
  @Input('Confirmed')
  Confirmed;
  @Input('Deaths')
  Deaths;
  @Input('Active')
  Active;
  @Input('Recovered')
  Recovered;

  constructor() {}

  ngOnInit(): void {}
}
