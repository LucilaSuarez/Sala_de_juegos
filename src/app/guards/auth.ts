// guards/auth.ts
import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth";

export const authGuard: CanActivateFn = async () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    await auth.sessionChecked;
    if (auth.isAuthenticated()) return true;
    router.navigate(['/login']);
    return false;
}

export const publicGuard: CanActivateFn = async () => {
    const auth = inject(AuthService);
    const router = inject(Router);
    await auth.sessionChecked;
    if (!auth.isAuthenticated()) return true;
    router.navigate(['/home']);
    return false;
}