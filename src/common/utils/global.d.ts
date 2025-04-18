export {};

declare global {
  interface Window {
    deleteDatabase: () => Promise<void>;
    db: any;
  }
}
