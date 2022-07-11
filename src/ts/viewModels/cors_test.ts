import * as AccUtils from "../accUtils";
import * as ko from "knockout";
import "ojs/ojprogress-bar";
import * as deptData from "text!../../js/departmentData.json";

class CORSTestViewModel {
  loadDataCalled: boolean = false;
  callingServer: ko.Observable<boolean> = ko.observable(false);
  errorMessage: ko.Observable<string> = ko.observable();
  responseStatus: ko.Observable<string> = ko.observable();

  constructor() {

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
    AccUtils.announce("CORS test page loaded.");
    document.title = "CORS Test";
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

  async loadData(): Promise<any> {
    if (this.loadDataCalled) {
      return;
    }
    this.loadDataCalled = true;
    try {
      this.callingServer(true);
      const url = 'http://138.3.65.159:443/20230401/workRequests/ocid1.notreviewedplaceholder.oc1.iad.amaaaaaa7vbqoayaimt7t5o5ymyti2gxtqsiqkpllvtno4z4o3r7g5gaexyq';
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
      this.responseStatus('Response Status: ' + resp.status);
      if (resp.status === 200) {
        const jsonResponse = await resp.json();
        const data = jsonResponse.data;
        console.log(data)
      } else {
        this.errorMessage(resp.statusText);
      }
      this.callingServer(false);
    } catch (err) {
      this.callingServer(false);
      console.error(err);
      this.errorMessage('ERROR: ' + err.toString());
    }
  }
}

export = CORSTestViewModel;
