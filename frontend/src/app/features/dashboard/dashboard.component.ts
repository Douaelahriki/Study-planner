import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div class="max-w-4xl mx-auto">
        <div class="bg-white rounded-2xl shadow-xl p-8">
          
          <div class="flex items-center justify-between mb-6">
            <div>
              <h1 class="text-3xl font-bold text-gray-900">
                👋 Bienvenue, {{ authService.currentUser()?.name }}!
              </h1>
              <p class="text-gray-600 mt-1">Ton tableau de bord Study Planner</p>
            </div>
            <button 
              (click)="logout()"
              class="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              Déconnexion
            </button>
          </div>
          
          <!-- 📚 ESPACE ÉTUDIANT (uniquement pour les non-admins) -->
          @if (!authService.isAdmin()) {
            <div class="mb-6 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl">
              <h2 class="text-xl font-bold text-blue-900 mb-3 flex items-center gap-2">
                📚 Mes Outils d'Étude
              </h2>
              <p class="text-blue-700 text-sm mb-4">Organisez et planifiez votre temps d'étude.</p>
              
              <div class="grid grid-cols-1 md:grid-cols-4 gap-3">
                <a routerLink="/subjects" 
                   class="flex items-center gap-3 p-4 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors">
                  <span class="text-3xl">📚</span>
                  <div>
                    <p class="font-semibold text-gray-900">Matières</p>
                    <p class="text-xs text-gray-600">Mes matières</p>
                  </div>
                </a>
                
                <a routerLink="/availability" 
                   class="flex items-center gap-3 p-4 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors">
                  <span class="text-3xl">📅</span>
                  <div>
                    <p class="font-semibold text-gray-900">Disponibilités</p>
                    <p class="text-xs text-gray-600">Créneaux libres</p>
                  </div>
                </a>
                
                <a routerLink="/sessions" 
                   class="flex items-center gap-3 p-4 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors">
                  <span class="text-3xl">📆</span>
                  <div>
                    <p class="font-semibold text-gray-900">Sessions</p>
                    <p class="text-xs text-gray-600">Mes sessions</p>
                  </div>
                </a>
                
                <a routerLink="/planning/auto" 
                   class="flex items-center gap-3 p-4 bg-gradient-to-br from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 border border-purple-200 rounded-lg transition-colors">
                  <span class="text-3xl">🤖</span>
                  <div>
                    <p class="font-semibold text-gray-900">Planning Auto</p>
                    <p class="text-xs text-purple-600 font-semibold">⭐ Génération IA</p>
                  </div>
                </a>
              </div>
            </div>
          }
          
          <!-- 👑 ESPACE ADMIN -->
          @if (authService.isAdmin()) {
            <div class="mb-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl">
              <h2 class="text-xl font-bold text-purple-900 mb-3 flex items-center gap-2">
                👑 Espace Administrateur
              </h2>
              <p class="text-purple-700 text-sm mb-4">Gérez les utilisateurs et consultez les statistiques globales.</p>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                <a routerLink="/admin/users" 
                   class="flex items-center gap-3 p-4 bg-white hover:bg-purple-50 border border-purple-200 rounded-lg transition-colors">
                  <span class="text-3xl">👥</span>
                  <div>
                    <p class="font-semibold text-gray-900">Utilisateurs</p>
                    <p class="text-xs text-gray-600">Gestion users</p>
                  </div>
                </a>
                
                <a routerLink="/admin/new-admin" 
                   class="flex items-center gap-3 p-4 bg-white hover:bg-purple-50 border border-purple-200 rounded-lg transition-colors">
                  <span class="text-3xl">➕</span>
                  <div>
                    <p class="font-semibold text-gray-900">Ajouter Admin</p>
                    <p class="text-xs text-gray-600">Créer compte</p>
                  </div>
                </a>
                
                <a routerLink="/admin/stats" 
                   class="flex items-center gap-3 p-4 bg-white hover:bg-purple-50 border border-purple-200 rounded-lg transition-colors">
                  <span class="text-3xl">📊</span>
                  <div>
                    <p class="font-semibold text-gray-900">Statistiques</p>
                    <p class="text-xs text-gray-600">Vue globale</p>
                  </div>
                </a>
              </div>
            </div>
          }

          <!-- Cards d'info -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 class="font-semibold text-blue-900 mb-2">Email</h3>
              <p class="text-blue-700 text-sm">{{ authService.currentUser()?.email }}</p>
            </div>
            
            <div class="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 class="font-semibold text-green-900 mb-2">Rôle</h3>
              <p class="text-green-700 text-sm capitalize font-bold">
                @if (authService.isAdmin()) { 👑 Admin } @else { 👤 Étudiant }
              </p>
            </div>
            
            <div class="bg-purple-50 border border-purple-200 rounded-xl p-6">
              <h3 class="font-semibold text-purple-900 mb-2">Status</h3>
              <p class="text-purple-700 text-sm">✅ Connecté</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class DashboardComponent {
  authService = inject(AuthService);

  logout(): void {
    this.authService.logout();
  }
}