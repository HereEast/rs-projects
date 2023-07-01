import { getCurrentLevelID } from "../../scripts/localStorage/get-current-id";
import { getSavedStatus } from "../../scripts/localStorage/get-saved-status";
import { Button, Info } from "../../types/enums";
import { createElement } from "../../utils/create-element";

// Level
export function createHeaderLevelInfo(): HTMLElement {
  const buttonLevels = createElement("button", ["button", "button--levels"], Button.Levels);

  const currentID = getCurrentLevelID();
  const savedStatus = getSavedStatus(currentID);

  const levelInfo = createElement("div", ["header__levels", savedStatus]);

  const levelInfoContent = `
    <div class="level__info">
      <span class="level__status"></span>
      <span class="header__data--level">1/${Info.TotalLevels}</span>
    </div>
  `;

  levelInfo.insertAdjacentHTML("afterbegin", levelInfoContent);
  levelInfo.append(buttonLevels);

  return levelInfo;
}
