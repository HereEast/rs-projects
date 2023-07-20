import { createElement } from "../../../utils/create-element";
import { Selector } from "../../../../types/types";

// Count element
export function createCountElement(n: number = 119): HTMLElement {
  const countContainer = createElement("div", [Selector.CarsCount]);
  const openBr = createElement("span", [], "(");
  const closeBr = createElement("span", [], ")");
  const count = createElement("span", [Selector.CurrentCount], String(n));

  countContainer.append(openBr, count, closeBr);

  return countContainer;
}
