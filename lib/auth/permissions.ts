export type UserRole = 'super-admin' | 'admin' | 'gestor' | 'user'

export interface Permission {
  resource: string
  actions: string[]
}

export interface RolePermissions {
  role: UserRole
  permissions: Permission[]
}

// Definición de permisos por rol
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  'super-admin': [
    { resource: 'users', actions: ['create', 'read', 'update', 'delete', 'manage'] },
    { resource: 'clients', actions: ['create', 'read', 'update', 'delete', 'manage'] },
    { resource: 'campaigns', actions: ['create', 'read', 'update', 'delete', 'manage', 'send'] },
    { resource: 'templates', actions: ['create', 'read', 'update', 'delete', 'manage'] },
    { resource: 'analytics', actions: ['read', 'export', 'manage'] },
    { resource: 'automation', actions: ['create', 'read', 'update', 'delete', 'manage'] },
    { resource: 'settings', actions: ['read', 'update', 'manage'] },
    { resource: 'system', actions: ['manage'] },
  ],
  'admin': [
    { resource: 'users', actions: ['read', 'update'] },
    { resource: 'clients', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'campaigns', actions: ['create', 'read', 'update', 'delete', 'send'] },
    { resource: 'templates', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'analytics', actions: ['read', 'export'] },
    { resource: 'automation', actions: ['create', 'read', 'update', 'delete'] },
    { resource: 'settings', actions: ['read', 'update'] },
  ],
  'gestor': [
    { resource: 'clients', actions: ['create', 'read', 'update'] },
    { resource: 'campaigns', actions: ['create', 'read', 'update', 'send'] },
    { resource: 'templates', actions: ['create', 'read', 'update'] },
    { resource: 'analytics', actions: ['read'] },
    { resource: 'automation', actions: ['read', 'update'] },
  ],
  'user': [
    { resource: 'clients', actions: ['read'] },
    { resource: 'campaigns', actions: ['read'] },
    { resource: 'templates', actions: ['read'] },
    { resource: 'analytics', actions: ['read'] },
  ],
}

// Función para verificar si un usuario tiene un permiso específico
export function hasPermission(
  userRole: UserRole,
  resource: string,
  action: string
): boolean {
  const rolePermissions = ROLE_PERMISSIONS[userRole]
  
  if (!rolePermissions) {
    return false
  }

  const resourcePermission = rolePermissions.find(
    (permission) => permission.resource === resource
  )

  if (!resourcePermission) {
    return false
  }

  return resourcePermission.actions.includes(action)
}

// Función para verificar múltiples permisos
export function hasAnyPermission(
  userRole: UserRole,
  permissions: Array<{ resource: string; action: string }>
): boolean {
  return permissions.some(({ resource, action }) =>
    hasPermission(userRole, resource, action)
  )
}

// Función para verificar todos los permisos
export function hasAllPermissions(
  userRole: UserRole,
  permissions: Array<{ resource: string; action: string }>
): boolean {
  return permissions.every(({ resource, action }) =>
    hasPermission(userRole, resource, action)
  )
}

// Función para obtener todos los permisos de un rol
export function getRolePermissions(userRole: UserRole): Permission[] {
  return ROLE_PERMISSIONS[userRole] || []
}

// Función para verificar si un usuario puede acceder a una ruta
export function canAccessRoute(userRole: UserRole, route: string): boolean {
  const routePermissions: Record<string, Array<{ resource: string; action: string }>> = {
    '/admin/dashboard': [{ resource: 'analytics', action: 'read' }],
    '/admin/clients': [{ resource: 'clients', action: 'read' }],
    '/admin/clients/create': [{ resource: 'clients', action: 'create' }],
    '/admin/clients/[id]/edit': [{ resource: 'clients', action: 'update' }],
    '/admin/email-marketing': [{ resource: 'campaigns', action: 'read' }],
    '/admin/email-marketing/templates': [{ resource: 'templates', action: 'read' }],
    '/admin/email-marketing/campaigns': [{ resource: 'campaigns', action: 'read' }],
    '/admin/analytics': [{ resource: 'analytics', action: 'read' }],
    '/admin/automation': [{ resource: 'automation', action: 'read' }],
    '/admin/users': [{ resource: 'users', action: 'read' }],
    '/admin/settings': [{ resource: 'settings', action: 'read' }],
  }

  const requiredPermissions = routePermissions[route]
  
  if (!requiredPermissions) {
    return true // Si no hay permisos definidos, permitir acceso
  }

  return hasAnyPermission(userRole, requiredPermissions)
}

// Función para obtener el nivel de acceso de un rol
export function getRoleLevel(userRole: UserRole): number {
  const roleLevels: Record<UserRole, number> = {
    'super-admin': 4,
    'admin': 3,
    'gestor': 2,
    'user': 1,
  }

  return roleLevels[userRole] || 0
}

// Función para verificar si un rol puede gestionar otro rol
export function canManageRole(managerRole: UserRole, targetRole: UserRole): boolean {
  const managerLevel = getRoleLevel(managerRole)
  const targetLevel = getRoleLevel(targetRole)

  return managerLevel > targetLevel
}

// Función para obtener roles que puede gestionar un usuario
export function getManageableRoles(userRole: UserRole): UserRole[] {
  const allRoles: UserRole[] = ['super-admin', 'admin', 'gestor', 'user']
  
  return allRoles.filter(role => canManageRole(userRole, role))
}

// Función para verificar permisos de componente
export function usePermissions(userRole: UserRole) {
  return {
    can: (resource: string, action: string) => hasPermission(userRole, resource, action),
    canAny: (permissions: Array<{ resource: string; action: string }>) =>
      hasAnyPermission(userRole, permissions),
    canAll: (permissions: Array<{ resource: string; action: string }>) =>
      hasAllPermissions(userRole, permissions),
    getRolePermissions: () => getRolePermissions(userRole),
    getManageableRoles: () => getManageableRoles(userRole),
    canManageRole: (targetRole: UserRole) => canManageRole(userRole, targetRole),
  }
} 