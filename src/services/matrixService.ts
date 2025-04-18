// Add this at the top of your Matrix service file
if (typeof global === "undefined") {
  var global = window as any;
}

import * as sdk from "matrix-js-sdk";
import { MatrixClient } from "matrix-js-sdk";

class MatrixService {
  constructor() {
  }

  async loginWithPassword(matrix_id?: string, matrix_token?: string): Promise<MatrixClient> {
    try {
      debugger
      const client = sdk.createClient({
        baseUrl: import.meta.env.VITE_MATRIX_URL,
        accessToken: matrix_token,
        userId: matrix_id,
      });
      return client;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  }

  async sendMessage(message: any, matrix_id?: string, matrix_token?: string, room_id?: string): Promise<void> {
    try {
      debugger
      const client = await this.loginWithPassword(matrix_id, matrix_token)
      // ait client.sendTextMessage(room_id??"", message);
      await client.sendEvent(room_id??"", "m.room.message" as any, {
        msgtype: "m.text",
        body: message,
        format: "org.matrix.custom.html",
        formatted_body: message });
      console.log("Message sent!");
    } catch (error) {
      console.error("Failed to send message:", error);
     
    }
  }
}

// Export an instance of the service
export const matrixService = new MatrixService();
