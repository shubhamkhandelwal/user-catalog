import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Coordinate } from '../interface/coordinate.interface';
import { Response } from '../interface/response.interface';
import { User } from '../interface/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly apiURL: string = 'https://randomuser.me/api';

  constructor(private http: HttpClient) {}

  // Fetch users from the api

  getUsers(size: number = 10): Observable<Response> {
    return this.http
      .get<Response>(`${this.apiURL}/?results=${size}`)
      .pipe(map(this.processResponse));
  }

  // Fetch user with the given uuid
  getUser(uuid: string): Observable<Response> {
    return this.http
      .get<Response>(`${this.apiURL}/?uuid=${uuid}`)
      .pipe(map(this.processResponse));
  }

  private processResponse(response: Response): Response {
    return {
      info: { ...response.info },
      results: response.results.map(
        (user: any) =>
          <User>{
            uuid: user.login.uuid,
            firstName: user.name.first,
            lastName: user.name.last,
            email: user.email,
            username: user.login.username,
            gender: user.gender,
            address: `${user.location.street.number} ${user.location.street.name} ${user.location.city}, ${user.location.country} - ${user.location.postcode}`,
            dateOfBirth: user.dob.date,
            phone: user.phone,
            imageUrl: user.picture.medium,
            coordinate: <Coordinate>{
              latitude: +user.location.coordinates.latitude,
              longitude: +user.location.coordinates.longitude,
            },
          }
      ),
    };
  }
}
