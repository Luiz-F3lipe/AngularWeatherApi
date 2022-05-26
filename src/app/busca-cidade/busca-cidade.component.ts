import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { TempoService } from '../tempo/tempo.service';
import { debounceTime } from 'rxjs';


@Component({
  selector: 'app-busca-cidade',
  templateUrl: './busca-cidade.component.html',
  styleUrls: ['./busca-cidade.component.css']
})
export class BuscaCidadeComponent implements OnInit {

  constructor(private tempoService: TempoService) { }

  busca = new FormControl("", [Validators.minLength(2)]);

  ngOnInit(): void {
    this.busca.valueChanges.subscribe((valorDaBusca: string) => {
      if (valorDaBusca) {
        const valorDoInput = valorDaBusca.split(',').map(letra => letra.trim())
        this.tempoService.getCurrentWeather(valorDoInput[0], valorDoInput.length > 1 ? valorDoInput[1] : undefined).pipe(debounceTime(1000))
          .subscribe(data => (console.log(data)))
      }
    })
  }
}
