import { Component, OnInit } from '@angular/core';
import { ITempoAtual } from './interfaces/itempo-atual';
import { TempoService } from './tempo/tempo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'tempo';

  tempoAtual!: ITempoAtual

  constructor(private tempoService: TempoService) {
    this.tempoService.getDefaulttWeather().subscribe(data => this.tempoAtual=data)
  }

  ngOnInit(): void {}
}
