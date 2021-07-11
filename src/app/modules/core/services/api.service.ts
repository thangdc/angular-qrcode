import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable()
export class ApiService {

    private defaultHeaders = new HttpHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': environment.API
    });

    private apiUrl: string;

    constructor(private http: HttpClient) {
        this.apiUrl = environment.API;
    }

    get(path: string, params: HttpParams = new HttpParams()): Observable<any> {
        return this.http.get(`${this.apiUrl}${path}`, { params: params, headers: this.defaultHeaders });
    }

    put(path: string, body: Object = {}): Observable<any> {
        return this.http.put(
          `${this.apiUrl}${path}`,
          JSON.stringify(body),
          { headers: this.defaultHeaders }
        );
    }
    
    post(path: string, body: Object = {}, options: object = {}): Observable<any> {
        return this.http.post(
          `${this.apiUrl}${path}`,
          JSON.stringify(body),
          { headers: this.defaultHeaders, ...options }
        );
    }
    
    delete(path: string): Observable<any> {
        return this.http.delete(
          `${this.apiUrl}${path}`,
          { headers: this.defaultHeaders }
        );
    }
}