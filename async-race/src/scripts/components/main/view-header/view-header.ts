import { createElement } from "../../../utils/create-element";
import { Selector } from "../../../../types/types";
import { createCountElement } from "./view-count";
import { createGarageHeaderButtons } from "./view-buttons";

// View header
export function createViewHeader(): HTMLElement {
  const header = createElement("div", [Selector.ViewHeader]);

  const title = createElement("div", [Selector.TitleContainer]);
  const titleText = createElement("h2", [Selector.Title], "Garage");
  const countElement = createCountElement();

  const buttons = createGarageHeaderButtons();

  title.append(titleText, countElement);
  header.append(title, buttons);

  return header;
}
