export interface UserPayload {
  uid: string
  email: string
  displayName?: string
  photoURL?: string
  role: 'admin' | 'user'
  provider: 'google' | 'password'
}

