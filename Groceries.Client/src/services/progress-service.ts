import * as nprogress from "nprogress";

export class ProgressService {
  // The counter keeps track of how many api calls are being performed at a time so only the last one ending will close the progress bar
  private makingApiCallCounter: number = 0;
  // The timer is used as a debouncer so when saving a grid for example with 6 edited rows and therefor 6 api calls, the progress will only end after a 200 milliseconds have past since the last api call.
  private timer: NodeJS.Timeout;

  public makingApiCall() {
    this.makingApiCallCounter++;
    nprogress.start();
  }

  public notMakingApiCallAnymore() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
    this.makingApiCallCounter--;
    this.timer = setTimeout(() => {
      if (this.makingApiCallCounter == 0) {
        nprogress.done();
      }
    }, 200);
  }
}
