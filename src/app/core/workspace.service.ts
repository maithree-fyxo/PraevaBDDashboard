import { Injectable, computed, signal } from '@angular/core';

export type Workspace = 'Business Development' | 'Finance' | 'Delivery';
export const WORKSPACES: Workspace[] = ['Business Development', 'Finance', 'Delivery'];

/** Switches the dashboard between business areas. Only Business Development is scoped so far. */
@Injectable({ providedIn: 'root' })
export class WorkspaceService {
  readonly current = signal<Workspace>('Business Development');
  readonly scoped = computed(() => this.current() === 'Business Development');
}
