import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICurrentWeatherData } from '../interfaces/icurrent-weather-data';
import { ITempoAtual } from '../interfaces/itempo-atual';
import { LocalStorageService, StorageKeys } from '../local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TempoService {

  constructor(private httpClient: HttpClient, private localStorageService: LocalStorageService) {
    let { cidade, pais } = this.retorneUltimaBusca();
    this.getCurrentWeather(cidade,pais).subscribe(data => this.tempoAtual.next(data))
   }

   private retorneUltimaBusca() {
      let cidade = this.localStorageService.Criar(StorageKeys.CIDADE);
      cidade = cidade ? cidade : 'Lages';
      let pais = this.localStorageService.Criar(StorageKeys.PAIS);
      pais = pais ? pais : 'BR';
      this.tempoAtual.value.cidade = cidade;
      this.tempoAtual.value.pais = pais;
      return { cidade, pais };
   }

  tempoAtual: BehaviorSubject<ITempoAtual> = new BehaviorSubject<ITempoAtual>({
    cidade:'',
    pais:'',
    date: Date.now().toLocaleString(),
    descricao:'',
    temperatura: 0,
    image:''
  })

  getDefaulttWeather(): Observable<ITempoAtual> {
    return this.getCurrentWeather(this.tempoAtual.value.cidade, this.tempoAtual.value.pais)
  }

  getCurrentWeather(busca: string | number, pais?: string): Observable<ITempoAtual> {
    let uriParams = ''
    if (typeof busca === 'string') {
      uriParams = `q=${busca}`
    } else {
      uriParams = `zip=${busca}`
    }
    if (pais) {
      uriParams = `${uriParams},${pais}`
    }

    this.localStorageService.Editar(StorageKeys.CIDADE, busca.toLocaleString())
    this.localStorageService.Editar(StorageKeys.PAIS, pais ? pais : 'BR')
    return this.getCurrentWeatherHelper(uriParams)
  }

  private getCurrentWeatherHelper(uriParams: string): Observable<ITempoAtual> {
    return this.httpClient.get<ICurrentWeatherData>(
      `${environment.baseUrl}api.openweathermap.org/data/2.5/weather?${uriParams}&appid=${environment.appId}`)
      .pipe(map(data => {
        const tempo = this.transformToITempoAtual(data)
        this.localStorageService.Editar(StorageKeys.CIDADE, tempo.cidade)
        this.localStorageService.Editar(StorageKeys.PAIS, tempo.cidade)
        this.localStorageService.Editar(StorageKeys.TEMPO_ATUAL, JSON.stringify(tempo))
        return tempo
      }))
  }

  /*
  getCurrentWeatherByCoords(coords: Coordenadas): Observable<ITempoAtual> {
    const uriParams = `lat=${coords.latitude}&lon=${coords.longitude}`
    return this.getCurrentWeatherHelper(uriParams)
  }
  */

  private transformToITempoAtual(data: ICurrentWeatherData): ITempoAtual {
    console.log(data)
    return {
      cidade: data.name,
      pais: data.sys.country,
      date: new Date(data.dt * 1000).toLocaleDateString('en-US'),
      descricao: data.weather[0].description,
      temperatura: this.convertKelvinToCelcius(data.main.temp),
      image: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
    }
  }

  private convertKelvinToCelcius(kelvin: number): number {
    return kelvin - 272.15
  }
}