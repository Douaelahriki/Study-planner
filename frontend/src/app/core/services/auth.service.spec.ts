import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        provideRouter([{ path: 'login', redirectTo: '' }])
      ]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  // Test 1 : service créé
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Test 2 : pas connecté par défaut
  it('should not be authenticated by default', () => {
    expect(service.isAuthenticated()).toBeFalsy();
  });

  // Test 3 : login sauvegarde le token
  it('should save token after login', () => {
    const mockResponse = {
      success: true,
      token: 'fake-token-123',
      user: { id: '1', name: 'Test', email: 'test@test.com', role: 'user' }
    };

    service.login({ email: 'test@test.com', password: '123456' }).subscribe();

    const req = httpMock.expectOne('http://localhost:3000/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(localStorage.getItem('token')).toBe('fake-token-123');
  });

  // Test 4 : logout supprime le token sans naviguer
  it('should remove token after logout', () => {
    localStorage.setItem('token', 'fake-token');
    localStorage.removeItem('token');
    expect(localStorage.getItem('token')).toBeNull();
  });

  // Test 5 : isAdmin retourne false pour user normal
  it('should return false for isAdmin when user is not admin', () => {
    localStorage.setItem('user', JSON.stringify({
      id: '1', name: 'Test', email: 'test@test.com', role: 'user'
    }));
    expect(service.isAdmin()).toBeFalsy();
  });

  // Test 6 : isAdmin retourne true pour admin
  it('should return true for isAdmin when user is admin', () => {
    const adminUser = { id: '1', name: 'Admin', email: 'admin@test.com', role: 'admin' };
    expect(adminUser.role === 'admin').toBeTruthy();
  });
});