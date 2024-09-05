import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';
import { compileNgModule } from '@angular/compiler';

@Injectable({providedIn: 'root'})
export class GifsService {

  private _tagsHistory: string[] = [];
  private apiKey:string = 'PoroWl7gYeMAdPItUa47Onzs1VgIM4EB';
  private serviceUrl: string = 'http://api.giphy.com/v1/gifs';
  public gifsList : Gif[] = [];

  constructor( private http:HttpClient) {
    this.getHistoryLocalStorage();

  }

  get tagsHistory(){
    return [...this._tagsHistory]
  }

  private organizeHistory(tag: string) {
    tag = tag.toLowerCase();

    if (this._tagsHistory.includes(tag)){
      this._tagsHistory = this._tagsHistory.filter( (oldtag) => oldtag !== tag)
    }

    this._tagsHistory.unshift( tag );
    this._tagsHistory = this._tagsHistory.splice(0,10);
    this.saveHistoryLocalStorage();
  }

saveHistoryLocalStorage ():void {
  localStorage.setItem('historyTag',JSON.stringify(this._tagsHistory));
}

getHistoryLocalStorage(): void{
    if(!localStorage.getItem('historyTag')) return
    this._tagsHistory = JSON.parse( localStorage.getItem('historyTag')!);


    if (this._tagsHistory.length === 0) return;

    this.searchTag(this._tagsHistory[0]);
}


searchTag ( tag : string): void {

    if( tag.length === 0 ) return;
    this.organizeHistory ( tag );

    const params = new HttpParams()
    .set('api_key', this.apiKey)
    .set('limit', '10')
    .set('q', tag)

    this.http.get<SearchResponse>(`${ this.serviceUrl }/search?`, { params } )
    .subscribe ( resp => {

      this.gifsList = resp.data;
      // console.log( { gifs: this.gifsList } );


    });

}




}
