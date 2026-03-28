import { Component, input, linkedSignal } from '@angular/core';
import {MatRipple} from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from "@angular/router";

export interface NavigationTab {
  text?: string;
  icon: string;
  url: string;
}

@Component({
  selector: 'adaptative-tabs',
  imports: [RouterLink, RouterLinkActive, MatIcon, MatRipple],
  templateUrl: './adaptative-tabs.html',
  styleUrls: ['./adaptative-tabs.css'],
  host: {
    class: "flex justify-around items-center border-t border-gray-100 backdrop-blur-3xl"
  }
})
export class AdaptativeTabs {
  tabs = input.required<NavigationTab[]>();
  selected = linkedSignal({
    source: () => this.tabs,
    computation: () => 0
  });
}
