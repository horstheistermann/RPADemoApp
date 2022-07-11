import * as AccUtils from "../accUtils";
import ModuleRouterAdapter = require("ojs/ojmodulerouter-adapter");
import {RouterDetail, RouterParameters} from "../RouterTypes";
import * as ko from "knockout";

interface Employee {
  id: number,
  avatar: string
}

class EmployeeViewModel {
  employeeData: ko.Observable<Employee> = ko.observable();
  private dataLoaded:boolean = false;
  private args: ModuleRouterAdapter.ViewModelParameters<RouterDetail, RouterParameters> = null;
  
  constructor(args: ModuleRouterAdapter.ViewModelParameters<RouterDetail, RouterParameters>) {
    this.args = args;
  }

  /**
   * Optional ViewModel method invoked after the View is inserted into the
   * document DOM.  The application can put logic that requires the DOM being
   * attached here.
   * This method might be called multiple times - after the View is created
   * and inserted into the DOM and after the View is reconnected
   * after being disconnected.
   */
  connected(): void {
    AccUtils.announce("Employee page loaded.");
    document.title = "Employee";
    // implement further logic if needed
    this.loadData();
  }

  /**
   * Optional ViewModel method invoked after the View is disconnected from the DOM.
   */
  disconnected(): void {
    // implement if needed
  }

  /**
   * Optional ViewModel method invoked after transition to the new View is complete.
   * That includes any possible animation between the old and the new View.
   */
  transitionCompleted(): void {
    // implement if needed
  }

  onGoBack = ():void => {
    this.args.parentRouter.go({path: 'dashboard'})
  }

  async loadData(): Promise<any> {
    if (this.dataLoaded) {
      return;
    }
    this.dataLoaded = true;

    try {
      const employeeId = this.args.params.index;
      const url = `https://reqres.in/api/users/${employeeId}`;
      const resp = await fetch(url, {
        method: 'GET', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
          'Content-Type': 'application/json'
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer' // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      });
      if (resp.status === 200) {
        const jsonResponse = await resp.json();
        this.employeeData(jsonResponse.data);
      }
    } catch (err) {
      console.error(err);
    }
  }
}

export = EmployeeViewModel;