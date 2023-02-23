import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Coordinate } from 'src/app/interface/coordinate.interface';
import { User } from 'src/app/interface/user.interface';
import * as Leaflet from  'leaflet';

@Component({
  selector: 'app-userdetail',
  templateUrl: './userdetail.component.html',
  styleUrls: ['./userdetail.component.css'],
})
export class UserdetailComponent implements OnInit {
  user: User;
  buttonText: string = 'Edit';
  mode: 'edit' | 'locked' = 'locked';
  marker = new Leaflet.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon.png',
    iconSize: [32, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    shadowSize: [41, 41]
  });

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.user = <User>this.route.snapshot.data['resolvedResponse']?.results[0];
    this.loadMap(this.user.coordinate);
    // this.route.paramMap.subscribe((params: ParamMap) => {
    //   this.userService.getUser(params.get('uuid')!).subscribe({
    //     next: (response: Response) => {
    //       console.log(response);
    //       this.user = response?.results[0];
    //     },
    //     error: (error: any) => {
    //       console.log(error);
    //     },
    //     complete: () => {
    //       console.log(`fetching user with ${params.get('uuid')} is complete`);
    //     },
    //   });
    // });
  }

  changeMode(mode?: 'edit' | 'locked'): void {
    this.mode = mode === 'locked' ? 'edit' : 'locked';
    this.buttonText = this.buttonText === 'Edit' ? 'Save' : 'Edit';
    if (mode === 'edit') {
      console.log('updaitng user in backed');
    }
  }

  private loadMap(coordinate: Coordinate): void {
    const map = Leaflet.map('map', {
      center: [coordinate.latitude, coordinate.longitude],
      zoom: 8
    });
    const mainLayer = Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      tileSize: 512,
      zoomOffset: -1,
      minZoom: 1,
      maxZoom:30,
      crossOrigin: true,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
    mainLayer.addTo(map);
    const marker = Leaflet.marker([coordinate.latitude, coordinate.longitude], { icon: this.marker });
    marker.addTo(map).bindPopup(`${this.user.firstName}'s Location`).openPopup();
  }

}
