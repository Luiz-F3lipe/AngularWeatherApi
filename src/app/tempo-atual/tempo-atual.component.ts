import { Component, OnInit } from '@angular/core';
import { ITempoAtual } from '../interfaces/itempo-atual';
import { TempoService } from '../tempo/tempo.service';

@Component({
  selector: 'app-tempo-atual',
  templateUrl: './tempo-atual.component.html',
  styleUrls: ['./tempo-atual.component.css']
})
export class TempoAtualComponent implements OnInit {

  tempoAtual: ITempoAtual
    constructor(private tempoService: TempoService) {
      this.tempoAtual = {
        cidade: 'São Paulo',
        pais: 'Brasil ',
        date: '01/01/2020',
        descricao: 'Ensolarado',
        temperatura: 20,
        image: 'assets/img/ensolarado.svg'
      }
    }

    ngOnInit(): void {
      this.tempoService.getCurrentWeather('Blumenau', 'Brasil ').subscribe((data) => this.tempoAtual = data)
    }

}
