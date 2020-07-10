import { Component, OnInit, ViewChild,Inject } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import{ DISHES } from '../shared/dishes';
import { FormBuilder,FormGroup,Validators } from '@angular/forms';
import { switchMap, switchMapTo } from 'rxjs/operators';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Comment } from '../shared/comment';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})

export class DishdetailComponent implements OnInit {
  @ViewChild('fform') commentFormDirective;
  commentForm: FormGroup;
  comment: Comment;
  dishIds: string[];
  prev: string;
  next: string;
  dish: Dish;
  dishcopy:Dish;

    formErrors = {
      author: '' ,
      rating: 5 ,
      comment: ''
    };
    validationMessages = {
      'author': {
        'required': 'Author is required.' ,
        'minlength': 'Author must be at least 2 characters long.'
      } ,
      'comment': {
        'required': 'comment is required.' ,
        'minlength': 'comment must be at least 2 characters long.'
      } ,
    };


  constructor(private dishservice: DishService,
    private route: ActivatedRoute,
    private location: Location,
    private fb:FormBuilder,
  @Inject('baseURL') private baseURL) { this.createForm();  }

    createForm()
    {
      this.commentForm=this.fb.group({
        author:['',[Validators.required,Validators.minLength(2),Validators.maxLength(25)] ],
        rating:[5],
        comment:['',Validators.required]

      });
      this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));

      this.onValueChanged();
    }
    onValueChanged(data?:any)
    {
      if(!this.commentForm){ return; }
      const form =this.commentForm;
      for(const field in this.formErrors)
      {
        if(this.formErrors.hasOwnProperty(field))
        {
          //clear previous
          this.formErrors[field]='';
          const control = form.get(field);
        if (control && control.dirty && !control.valid)
        {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
        }

      }


    }
    onSubmit(){
      this.comment=this.commentForm.value;
      this.comment.date= new Date().toISOString();
      this.dishcopy.comments.push(this.comment);
      this.commentForm.reset({
        author: '',
        rating: 5,
        comment: ''
      });
      this.commentFormDirective.resetForm();

    }

    ngOnInit() {
      this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
      this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
      .subscribe(dish => { this.dish = dish; this.dishcopy=dish ;this.setPrevNext(dish.id); });
    }
    setPrevNext(dishId: string){
      const index = this.dishIds.indexOf(dishId);
      this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
      this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
    }
    goBack():void
    {
      this.location.back();
    }



  }
