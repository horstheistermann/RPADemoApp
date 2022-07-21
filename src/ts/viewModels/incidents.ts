import * as AccUtils from "../accUtils";
import "ojs/ojtable";
import 'opaas-table-view';
import * as ko from "knockout";

import * as robotDetailView from "text!../views/robot_detail.html";
import {ojButtonEventMap} from "ojs/ojbutton";


console.log(robotDetailView);

interface HeaderData {
  headerText: string,
  width?: string,
  field: string,
  sortEnabled: boolean,
  default?: boolean
}

interface Robot {
  id: string,
  name: string,
  version: string,
  type: string
}

class IncidentsViewModel {
  fetchSize: number = 10;
  assetName: string;
  assetNamePlural: string;
  totalAssets: ko.Observable<number> = ko.observable(0);
  columns: HeaderData[];

  constructor() {
    this.assetName = 'Robot';
    this.assetNamePlural = 'Robots';
    this.columns = [
      {
        'headerText': 'Name',
        'field': 'asset.name',
        'width': '42%',
        'sortEnabled': false,
        'default': false
      },
      {
        'headerText': 'Version',
        'field': 'asset.version',
        'width': '10%',
        'sortEnabled': false
      },
      {
        'headerText': 'Type',
        'field': 'asset.type',
        'width': '16%',
        'sortEnabled': false
      }
    ];
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
    AccUtils.announce("Opaas Table page loaded.");
    document.title = "OPAAS Table";
    // implement further logic if needed
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

  fetchAssets = async (startIndex, fetchSize, options) => {
    this.totalAssets(10);
    const data: any[] = [];
    for (let i = 0; i < 10; i++) {
      const primaryActions =  [
        {
          "actionName": "VIEW",
          "actionId": "view_menu_id",
          "actionTitle": 'View'
        },
        {
          "actionName": "EDIT",
          "actionId": "edit_menu_id",
          "actionTitle": 'Edit'
        },
        {
          "actionName": "DELETE",
          "actionId": "delete_menu_id",
          "actionTitle": 'Delete'
        }
      ];

      const assetId = '' + i;
      const buttonAction = (event: ojButtonEventMap['ojAction']) => {
        const data = event.currentTarget as HTMLElement;
        alert('buttonAction clicked asset id:' + assetId);
        return true;
      };

      const asset = {
        id: assetId,
        name: {value:'Robot' + i, title: 'Tooltip'},
        version: '1.0',
        type: "oracle",
        primaryActions,
        detail: {
          test: 'horst',
          buttonAction
        },
        detailView: robotDetailView
      };
      data.push({
        asset: asset
      });
    }
    return Promise.resolve(data);
  }
}

export = IncidentsViewModel;
