import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';

import { Observable, BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
//import { Observer } from 'rxjs';
//import { Subscription, interval } from 'rxjs';
import { map, filter, take, takeUntil, share } from "rxjs/operators";

//import { OptimizationServiceControllerService } from 'build/openapi/api/optimizationServiceController.service';
import { JOptOptimizationProgress, JOptOptimizationOutput, JOptOpeningHours } from 'build/openapi';
import { EventSourceService } from '../../../eventService/event-source.service';

import { InputOptimizationDataService } from '../../../inputDataService/input-optimization-data.service';

//import { Observable, BehaviorSubject, ReplaySubject, Subject } from 'rxjs';


@Component({
  selector: 'app-optimization-progress',
  templateUrl: './optimization-progress.component.html',
  styleUrls: ['./optimization-progress.component.css'],
  //template: 'The current value is {{currentValue | async }}',
})
export class OptimizationProgressComponent implements OnInit {

  //observable$: Observable<string>;
  unsubscribe$: Subject<void> = new Subject<void>();
  //latestProgressValue: JOptOptimizationProgress;

  //latestProgressValue: string;
  latestProgress: JOptOptimizationProgress;
  //testEmitter$ = new ReplaySubject<string>();



  // constructor(private readonly optiService: OptimizationServiceControllerService) { }

  // currentValue = this.optiService.progress()
  //                    .pipe(share());

  constructor(
    private dataService: InputOptimizationDataService,
    private readonly eventService: EventSourceService,
    private ngZone: NgZone) {
    //console.log('OptimizationProgressComponent constructor called');
  }

  // time$ = new Observable<string>(observer => {
  //   setInterval(() => observer.next(new Date().toString()), 1000);
  // });


  // testEmitter$ = new BehaviorSubject<string>('FYO');

  //observable$ = this.eventService.newProgressObservable();

  reload() {
    this.eventService.progress().pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (watcherEvent: JOptOptimizationProgress) => {
          //console.log('success');

          this.ngZone.run(() => {
            //this.latestProgressValue = watcherEvent;
            this.latestProgress = watcherEvent;
          });
        },
        (error) => console.log('error', error),
        () => {
          //console.log('Completed')
        }
      );
  }

  testMofidyNode() {

    const myNode = this.dataService.node('Koeln');
    //console.log(myNode);

    let testNewOpeningHours: string =
      '[{"timeWindow": {"begin": "2025-03-20T08:00:00","end": "2025-03-20T18:00:00","zoneId": "Europe/Berlin"}}, {"timeWindow": {"begin": "2025-03-21T08:00:00","end": "2025-03-21T18:00:00","zoneId": "Europe/Berlin"}}]';

    const strIntoObj: JOptOpeningHours[] = JSON.parse(testNewOpeningHours);

    this.dataService.setNodeOpeningHour('Koeln', strIntoObj);


    const myNode2 = this.dataService.node('Koeln');

   //console.log(myNode2);

  }

  testStartOptimization() {
    this.dataService.startOptimization().subscribe(
      (watcherEvent: JOptOptimizationOutput) => {

        //console.log('success');
        //console.log(watcherEvent);

        //this.ngZone.run(() => {
        //  //this.latestProgressValue = watcherEvent;
        //  this.latestProgress = watcherEvent;
        //});
      },
      (error) => console.log('error', error),
      () => {
        //console.log('Completed')
      }
    )
  }



  ngOnInit(): void {

    this.reload();
    this.testMofidyNode();
    //this.testStartOptimization();

    //    const source = new EventSource('http://localhost:8080/api/optimization/stream/test');
    //  source.addEventListener('ping', message => {
    //      console.log('Observer got a next value: ' + message.);
    //  });

    //this.observable$ = this.eventService.newObservable('http://localhost:8080/api/optimization/stream/test');


    //   this.myStringObserver = {
    //    next: progress => console.log('Observer got a next value: ' + progress),
    //    error: err => console.error('Observer got an error: ' + err),
    //    complete: () => console.log('Observer got a complete notification'),
    //  };

    //  this.observable$.subscribe(this.myStringObserver);

    //this.eventService.newObservable('http://localhost:8080/api/optimization/stream/test').subscribe((watcherEvent: string) => console.log("test" + watcherEvent));

    // WORKING


    // this.eventService.newProgressObservable()
    //   .subscribe((watcherEvent: string) => {



    //    // this.latestProgressValue = JSON.parse(watcherEvent);
    //     this.latestProgressValue = watcherEvent;
    //     console.log("log:" + this.latestProgressValue);
    //   });

    // this.latestProgressValue = 'fuck';

    // this.eventService.newProgressObservable()
    //   .subscribe(
    //     () => console.log('success'),
    //     (error) => console.log('error', error),
    //     () => {
    //       console.log('success2')
    //       this.ngZone.run( () => {
    //     this.latestProgressValue += '-bar';
    //   });
    //       //this.latestProgressValue += '-bar';
    //       //this.testEmitter$.next(this.latestProgressValue);
    //     }
    //   );

    //this.latestProgressValue = '';

    // this.eventService.newProgressObservable()
    //   .subscribe(
    //     (watcherEvent: string) => {
    //       console.log('success');
    //       this.ngZone.run(() => {
    //         this.latestProgressValue = watcherEvent;
    //         this.latestProgress = JSON.parse(watcherEvent);
    //       });
    //     },
    //     (error) => console.log('error', error),
    //     () => {
    //       console.log('Completed')
    //     }
    //   );


    // this.eventService.progress().pipe(takeUntil(this.unsubscribe$))
    //   .subscribe(
    //     (watcherEvent: JOptOptimizationProgress) => {
    //       console.log('success');

    //       this.ngZone.run(() => {
    //         //this.latestProgressValue = watcherEvent;
    //         this.latestProgress = watcherEvent;
    //       });
    //     },
    //     (error) => console.log('error', error),
    //     () => {
    //       console.log('Completed')
    //     }
    //   );


    //   this.eventService.newProgressObservable().pipe(takeUntil(this.unsubscribe$))
    // .subscribe(
    //   (value: string) =>{
    //      this.latestProgressValue = value;
    //       console.log("value:" + value);

    //   });


    //this.eventService.newObservable('http://localhost:8080/api/optimization/stream/progress')
    //.subscribe((watcherEvent: string) => console.log("test" + watcherEvent));


    // this.observable$ = this.optiService.progress();

    // this.observable$
    //     .pipe(takeUntil(this.unsubscribe$))
    //     .subscribe(value =>{
    //       this.latestValue = value;
    //        console.log("value:" + value);
    //     });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }



  //progress$: Observable<JOptOptimizationProgress>;
  //progress2$: Observable<JOptOptimizationProgress>;
  //curProgress: JOptOptimizationProgress;
  //subscription: Subscription;
  //item: String;
  //itemSource: ReplaySubject<String>;
  //item$: Observable<String>

  //myObserver: Observer<JOptOptimizationProgress>;
  //myStringObserver: Observer<String>;
  // myObserver = {
  //   next: progress => console.log('Observer got a next value: ' + progress),
  //   error: err => console.error('Observer got an error: ' + err),
  //   complete: () => console.log('Observer got a complete notification'),
  // };

  // progress$.subscribe(myObserver);




  subscribeProgress() {

    // const source = new EventSource('http://localhost:8080/api/optimization/stream/test');
    // source.addEventListener('message', message => {
    //     console.log('Observer got a next value: ' + message);
    // });

    // this.itemSource = new ReplaySubject<String>(1) //create subject

    // this.item$ = this.itemSource.asObservable();

    //     this.subscription =  this.item$
    //   .subscribe(item => {
    //     this.item = item;
    //     console.log('Observer got a next value: ' + item)
    //   })

    //const numbers = interval(1000);

    //numbers.subscribe(value => console.log("Subscriber: " + value));

    //this.subscription =
    // this.optiService.events('events')
    //   .subscribe(item => {
    //      //this.item = item;
    //      //console.log('Observer got a next value: ' + item)
    //    })

    //    this.optiService.progress2a().pipe(take(3))
    // .subscribe(item => {
    //   //this.item = item;
    //   console.log('Observer got a next value2: ' + item);
    // })



    // this.myObserver = {
    //   next: x => console.log('Observer got a next value: ' + x),
    //   error: err => console.error('Observer got an error: ' + err),
    //   complete: () => console.log('Observer got a complete notification'),
    // };

    //  this.myStringObserver = {
    //      next: x => console.log('Observer got a next value: ' + x),
    //      error: err => console.error('Observer got an error: ' + err),
    //      complete: () => console.log('Observer got a complete notification'),
    //    };

    //     this.myStringObserver = {
    //    next: x => console.log('Observer got a next value: ' + x),
    //    error: err => console.error('Observer got an error: ' + err),
    //    complete: () => console.log('Observer got a complete notification'),
    //  };

    // const subTest = new ReplaySubject<String>(1) //create subject

    // this.optiService.events().subscribe(subTest)

    // subTest.subscribe(a => console.log(a)) //subscribe to subject

    //this.optiService.events().subscribe(this.myStringObserver);

    // const sub = new ReplaySubject<JOptOptimizationProgress>(1) //create subject

    // this.optiService.progress5().subscribe(sub) //<----- HERE ----- attach observable to subject

    //setTimeout(() => {sub.next([2, 3])}, 1500) //subject updated

    // sub.subscribe(a => console.log(a)) //subscribe to subject

    // this.sub = this.optiService.progress8()
    //   .subscribe(
    //     data => {
    //       this.curProgress = data;
    //       console.log(this.curProgress);
    //     },
    //     err => console.log(err)
    //   );
  }


  // ngOnInit() {
  //   //this.reloadData();
  //   console.log('OptimizationProgressComponent', 'init')

  //   //this.progress$ = this.optiService.progress5();
  //   this.subscribeProgress();

  //   // this.progress$.subscribe(x => {
  //   //   console.log('data', x)
  //   // });

  //   //  this.progress$.subscribe({
  //   //    next(prog) { console.log('Next prog: ' + prog)},
  //   // error(err) { console.log('Received an errror: ' + err)}
  //   //});

  //   //    this.progress$.subscribe(
  //   //     () => console.log('success'),
  //   //     (error) => console.log('error', error),
  //   //     () => {
  //   //        this.testVariable += '-bar';
  //   //        this.testEmitter.next(this.testVariable);
  //   //     }
  //   //  );
  // }

  //reloadData() {
  //
  //}
}
