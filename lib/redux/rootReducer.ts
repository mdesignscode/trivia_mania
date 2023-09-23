/* Instruments */

import { progressReducer } from "./slices/progressSlice";
import { userReducer } from "./slices/userSlice/userSlice";

export const reducer = {
  user: userReducer,
  progress: progressReducer
}
