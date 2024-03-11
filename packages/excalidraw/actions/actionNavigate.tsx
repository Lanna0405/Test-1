import { getClientColor } from "../clients";
import { Avatar } from "../components/Avatar";
import { GoToCollaboratorComponentProps } from "../components/UserList";
import { eyeIcon } from "../components/icons";
import { t } from "../i18n";
import { Collaborator } from "../types";
import { register } from "./register";
import clsx from "clsx";

export const actionGoToCollaborator = register({
  name: "goToCollaborator",
  viewMode: true,
  trackEvent: { category: "collab" },
  perform: (_elements, appState, collaborator: Collaborator) => {
    if (
      !collaborator.socketId ||
      appState.userToFollow?.socketId === collaborator.socketId ||
      collaborator.isCurrentUser
    ) {
      return {
        appState: {
          ...appState,
          userToFollow: null,
        },
        commitToHistory: false,
      };
    }

    return {
      appState: {
        ...appState,
        userToFollow: {
          socketId: collaborator.socketId,
          username: collaborator.username || "",
        },
        // Close mobile menu
        openMenu: appState.openMenu === "canvas" ? null : appState.openMenu,
      },
      commitToHistory: false,
    };
  },
  PanelComponent: ({ updateData, data, appState }) => {
    const { clientId, collaborator, withName, isBeingFollowed } =
      data as GoToCollaboratorComponentProps;

    const background = getClientColor(clientId);

    const avatarClassNames = clsx({
      "Avatar--is-followed": isBeingFollowed,
      "Avatar--is-current-user": collaborator.isCurrentUser === true,
      "Avatar--is-speaking": collaborator.isSpeaking,
      "Avatar--is-in-call": collaborator.isInCall,
      "Avatar--is-muted": collaborator.isMuted,
    });

    return withName ? (
      <div
        className="dropdown-menu-item dropdown-menu-item-base UserList__collaborator"
        onClick={() => updateData<Collaborator>(collaborator)}
      >
        <Avatar
          color={background}
          onClick={() => {}}
          name={collaborator.username || ""}
          src={collaborator.avatarUrl}
          className={avatarClassNames}
        />
        <div className="UserList__collaborator-name">
          {collaborator.username}
        </div>
        <div
          className="UserList__collaborator-follow-status-icon"
          style={{ visibility: isBeingFollowed ? "visible" : "hidden" }}
          title={isBeingFollowed ? t("userList.hint.followStatus") : undefined}
          aria-hidden
        >
          {eyeIcon}
        </div>
      </div>
    ) : (
      <Avatar
        color={background}
        onClick={() => {
          updateData(collaborator);
        }}
        name={collaborator.username || ""}
        src={collaborator.avatarUrl}
        className={avatarClassNames}
      />
    );
  },
});
