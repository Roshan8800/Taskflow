declare module 'react-native-document-picker' {
  export interface DocumentPickerResponse {
    uri: string;
    type: string;
    name: string;
    size: number;
  }

  export const pick: (options?: any) => Promise<DocumentPickerResponse[]>;
  export const types: {
    allFiles: string;
    json: string;
  };
}