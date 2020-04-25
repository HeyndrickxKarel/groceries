import { autoinject } from "aurelia-framework";
import { GroceryClient, GroceryDto } from "resources/swagger/api-client";
import { AppService } from "services/app-service";
import * as $ from "jquery";
import moment = require("moment");

@autoinject
export class App {
  public groceries: GroceryDto[];

  constructor(
    private groceryClient: GroceryClient,
    private appService: AppService
  ) {}

  public attached() {
    this.groceryClient.sync([]).then((groceries) => {
      this.groceries = groceries;
    });
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
        groceryId: 0,
        description: "",
      } as GroceryDto;
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
