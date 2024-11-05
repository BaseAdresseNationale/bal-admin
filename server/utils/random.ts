import { random } from "lodash";

export const shuffle = (array) => array.sort(() => random(0, 1) - 0.5);
