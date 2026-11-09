export interface UserPayload {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  role: 'admin' | 'vip' | 'user'
  provider: 'google' | 'password'
}

