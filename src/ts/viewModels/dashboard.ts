import * as ko from "knockout";
import * as AccUtils from "../accUtils";
import ArrayDataProvider = require("ojs/ojarraydataprovider");
import ModuleRouterAdapter = require("ojs/ojmodulerouter-adapter");
import "ojs/ojtable";
import "ojs/ojknockout";
import 'ojs/ojavatar';
import JQuery from "jquery";
import * as KnockoutTemplateUtils from 'ojs/ojknockouttemplateutils';
import {RouterDetail, RouterParameters} from "../RouterTypes";

//hh
class DashboardViewModel {
  private dataLoaded: boolean = false;
  private args: ModuleRouterAdapter.ViewModelParameters<RouterDetail, RouterParameters> = null;

  readonly columnArray = [
    {
      "headerText": "Avatar",
      "field": "avatar",
      "headerClassName": "oj-md-down-hide",
      "className": "oj-md-down-hide",
      "resizable": "enabled",
      "id": "avatar",
      sortable: 'disabled',
      renderer: KnockoutTemplateUtils.getRenderer('emp_photo', true)
    },
    {
      "headerText": "First Name",
      "field": "first_name",
      "headerClassName": "oj-sm-only-hide",
      "className": "oj-sm-only-hide",
      "resizable": "enabled",
      "id": "firstname",
      renderer: KnockoutTemplateUtils.getRenderer('name_renderer', true),
    },
    {
      "headerText": "Last Name",
      "field": "last_name",
      "resizable": "enabled",
      "id": "lastname"
    },
    {
      "headerText": "Email",
      "field": "email",
      "resizable": "enabled",
      "id": "email"
    },
    {
      "headerText": "Employee ID",
      "field": "id",
      "headerClassName": "oj-sm-only-hide",
      "className": "oj-sm-only-hide",
      "resizable": "enabled",
      "id": "id"
    }];

  dataProvider = ko.observable(new ArrayDataProvider([], {
    keyAttributes: "id",
    implicitSort: [{attribute: "id", direction: "ascending"}],
  }));

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
    AccUtils.announce("Dashboard page loaded.");
    document.title = "Dashboard";
   
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

  loadEmployeePage(data: any, evt: JQuery.Event): void {
    evt.stopPropagation();
    console.log(this.args);
    this.args.parentRouter.go({path: 'employee', params: {index: data.id}});
  }

  async loadData(): Promise<any> {
    if (this.dataLoaded) {
      return;
    }
    this.dataLoaded = true;

    try {
      const url = 'https://reqres.in/api/users?page=1';
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
        const tableData = jsonResponse.data;

        this.dataProvider(new ArrayDataProvider(tableData, {
          keyAttributes: "id",
          implicitSort: [{attribute: "id", direction: "ascending"}],
        }));
      }
    } catch(err) {
      console.error(err);
    }
  }

}

export = DashboardViewModel;
