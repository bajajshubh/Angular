import { Component, OnInit } from '@angular/core';
import { Leader } from '../shared/leader';
import { LeaderService } from '../services/leader.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  leaders: Leader[];
  constructor(private leaderservice: LeaderService,
     private route: ActivatedRoute,
     private location: Location) { }

  ngOnInit() {
    let id=this.route.snapshot.params['id'];
    this.leaders = this.leaderservice.getLeaders();
  }
  goBack(): void{
    this.location.back();
  }

}
