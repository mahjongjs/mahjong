declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "development" | "production";
    IS_SERVER: string;
  }
}
