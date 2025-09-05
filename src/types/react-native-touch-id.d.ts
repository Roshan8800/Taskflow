declare module 'react-native-touch-id' {
  export const authenticate: (reason: string, config?: any) => Promise<boolean>;
  export const isSupported: () => Promise<boolean>;
}