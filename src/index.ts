import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

/**
 * Initialization data for the squawk extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'squawk:plugin',
  description: 'A Copilot extension for JupyterLab.',
  autoStart: true,
  optional: [ISettingRegistry],
  activate: (app: JupyterFrontEnd, settingRegistry: ISettingRegistry | null) => {
    console.log('JupyterLab extension squawk is activated!');

    if (settingRegistry) {
      settingRegistry
        .load(plugin.id)
        .then(settings => {
          console.log('squawk settings loaded:', settings.composite);
        })
        .catch(reason => {
          console.error('Failed to load settings for squawk.', reason);
        });
    }
  }
};

export default plugin;