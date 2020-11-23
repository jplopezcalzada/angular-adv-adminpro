import { Component } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent {
  menuItems: any[];
  constructor(private sidebarService: SidebarService,
              private usuarioService: UsuarioService) {
    this.menuItems = sidebarService.menu;
    console.log(this.menuItems);
  }
  logout(){
    this.usuarioService.logout();
  }

}
