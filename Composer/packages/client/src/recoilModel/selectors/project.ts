// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { selector, selectorFamily } from 'recoil';
import isEmpty from 'lodash/isEmpty';

import {
  botErrorState,
  botDisplayNameState,
  botProjectFileState,
  botProjectIdsState,
  dialogsState,
  projectMetaDataState,
  botNameIdentifierState,
  botStatusState,
} from '../atoms';

// Actions
export const botsForFilePersistenceSelector = selector({
  key: 'botsForFilePersistenceSelector',
  get: ({ get }) => {
    const botProjectIds = get(botProjectIdsState);
    return botProjectIds.filter((projectId: string) => {
      const { isRemote } = get(projectMetaDataState(projectId));
      const botError = get(botErrorState(projectId));
      return !botError && !isRemote;
    });
  },
});

// TODO: This selector would be modfied and leveraged by the project tree
export const botProjectSpaceSelector = selector({
  key: 'botProjectSpaceSelector',
  get: ({ get }) => {
    const botProjects = get(botProjectIdsState);
    const result = botProjects.map((projectId: string) => {
      const dialogs = get(dialogsState(projectId));
      const metaData = get(projectMetaDataState(projectId));
      const botError = get(botErrorState(projectId));
      const name = get(botDisplayNameState(projectId));
      const botNameId = get(botNameIdentifierState(projectId));
      const botStatus = get(botStatusState(projectId));

      return { dialogs, projectId, name, ...metaData, error: botError, botNameId, botStatus };
    });
    console.log('RESULT', result);
    return result;
  },
});

export const rootBotProjectIdSelector = selector({
  key: 'rootBotProjectIdSelector',
  get: ({ get }) => {
    const projectIds = get(botProjectIdsState);
    const rootBotId = projectIds[0];
    const botProjectFile = get(botProjectFileState(rootBotId));

    const metaData = get(projectMetaDataState(rootBotId));
    if (metaData.isRootBot && !isEmpty(botProjectFile)) {
      return rootBotId;
    }
  },
});

export const skillsProjectIdSelector = selector({
  key: 'skillsProjectIdSelector',
  get: ({ get }) => {
    const botIds = get(botProjectIdsState);
    return botIds.filter((projectId: string) => {
      const { isRootBot } = get(projectMetaDataState(projectId));
      return !isRootBot;
    });
  },
});

export const botProjectSpaceFilterSelector = selectorFamily({
  key: 'botProjectSpaceFilterSelector',
  get: (filters: any) => ({ get }) => {
    const botProjects = get(botProjectIdsState);
    const result = botProjects.map((projectId: string) => {
      const dialogs = get(dialogsState(projectId));
      const metaData = get(projectMetaDataState(projectId));
      const botError = get(botErrorState(projectId));
      const name = get(botDisplayNameState(projectId));
      const botNameId = get(botNameIdentifierState(projectId));

      return { dialogs, projectId, name, ...metaData, error: botError, botNameId };
    });
    return filters(result);
  },
});
