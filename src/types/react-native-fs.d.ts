declare module 'react-native-fs' {
  export const DocumentDirectoryPath: string;
  export const writeFile: (path: string, content: string, encoding?: string) => Promise<void>;
  export const readFile: (path: string, encoding?: string) => Promise<string>;
  export const exists: (path: string) => Promise<boolean>;
  export const unlink: (path: string) => Promise<void>;
}

export default DocumentDirectoryPath;