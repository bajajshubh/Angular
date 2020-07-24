import { Component, OnInit } from '@angular/core';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { flyInOut,expand } from '../animations/app.animation';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  host: {
  '[@flyInOut]': 'true',
  'style': 'display: block;'
  },
  animations: [
    flyInOut(),
    expand()
  ]
})
export class AboutComponent implements OnInit {
  leaders: Leader[];
  constructor(private leaderservice: LeaderService,
     private route: ActivatedRoute,
     private location: Location) { }

  ngOnInit() {
    let id=this.route.snapshot.params['id'];
    this.leaderservice.getLeaders()
    .subscribe((leaders) => this.leaders = leaders);
  }
  goBack(): void{
    this.location.back();
  }

}
