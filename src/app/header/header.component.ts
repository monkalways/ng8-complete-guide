import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  constructor(private dataStorageService: DataStorageService) { }

  ngOnInit() {
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes();
  }
}
