import { autoinject } from "aurelia-framework";
import { AppService } from "services/app-service";
import * as $ from "jquery";
import { Grocery } from "resources/mongo/models/grocery";
import { HttpClient, json } from "aurelia-fetch-client";

@autoinject
export class App {
  public groceries: Grocery[];
  public rotateSyncIcon: boolean = false;
  public deleteVisible: boolean = false;

  constructor(private appService: AppService, private httpClient: HttpClient) {}

  public async attached() {
    this.sync();
  }

  public activate() {
    window.addEventListener("keydown", (e) => {
      this.myKeypressCallback(e, this.appService.currentGrocery);
    });
  }

  public deactivate() {
    window.removeEventListener("keydown", (e) => {
      this.myKeypressCallback(e, this.appService.currentGrocery);
    });
  }

  public focus(grocery) {
    this.appService.currentGrocery = grocery;
    console.log(this.indexOfCurrentGrocery(grocery));
  }

  public myKeypressCallback(event: any, currentGrocery) {
    let key = event.which || event.keyCode;
    if (key === 13) {
      event.preventDefault();
      let index = 0;
      if (this.appService.currentGrocery) {
        index = this.indexOfCurrentGrocery(this.appService.currentGrocery);
      } else {
        index = -1;
      }
      const newGrocery = {
        checked: false,
        description: "",
      } as Grocery;
      let newIndex = 0;
      if (index > -1) {
        if (index + 1 == this.groceries.length) {
          this.groceries.push(newGrocery);
          newIndex = this.groceries.length - 1;
        } else {
          this.groceries.splice(index + 1, 0, newGrocery);
          newIndex = index + 1;
        }
      } else {
        this.groceries.push(newGrocery);
        newIndex = this.groceries.length - 1;
      }
      setTimeout(() => {
        $("#grocery-input-" + newIndex).focus();
      }, 20);
    } else if (key === 8) {
      if (currentGrocery.description.length === 0) {
        const index = this.indexOfCurrentGrocery(currentGrocery);
        if (index > 0) {
          $("#grocery-input-" + (index - 1)).focus();
          this.appService.currentGrocery = this.groceries[index - 1];
          this.groceries.splice(index, 1);
        } else if (index == 0) {
          $("#grocery-input-" + 0).focus();
          this.appService.currentGrocery = this.groceries[0];
          this.groceries.splice(index, 1);
        }
      }
    }
  }

  public sync() {
    this.rotateSyncIcon = true;
    setTimeout(() => {
      this.rotateSyncIcon = false;
    }, 1000);

    this.httpClient
      .fetch("/api/sync", {
        method: "post",
        body: json([]),
      })
      .then((response) => response.json())
      .then((data) => (this.groceries = data))
      .catch((error) => {
        console.log(error);
      });
  }

  public clear() {
    this.httpClient
      .fetch("/api/clear", {
        method: "post",
        body: null,
      })
      .then((response) => (this.groceries = []))
      .catch((error) => {
        console.log(error);
      });

    this.deleteVisible = false;
  }

  public delete(grocery) {}

  public toggleDeleteVisible() {
    this.deleteVisible = !this.deleteVisible;
  }

  private indexOfCurrentGrocery(grocery) {
    for (let i = 0; i < this.groceries.length; i++) {
      const element = this.groceries[i];
      if (element == grocery) {
        return i;
      }
    }
    return -1;
  }
}
