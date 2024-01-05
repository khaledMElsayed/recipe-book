import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  private userSub: Subscription;
  isAuthenticated = false;

  constructor(
    private dataStorageService: DataStorageService,
    private authservice: AuthService
  ) {}

  ngOnInit(): void {
    this.userSub = this.authservice.userSubject.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
  }

  onSaveDate() {
    this.dataStorageService.storeRecipes();
  }

  onFetchDate() {
    this.dataStorageService.fetchRecipes();
  }

  onLogout(){
    this.authservice.logout().subscribe();
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
