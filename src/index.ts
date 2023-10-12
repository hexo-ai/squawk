import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';

import { ISettingRegistry } from '@jupyterlab/settingregistry';
import { Widget } from '@lumino/widgets';

/**
 * Initialization data for the squawk extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'squawk:plugin',
  description: 'A Copilot extension for JupyterLab.',
  autoStart: true,
  optional: [ISettingRegistry, ICommandPalette],
  activate: async (
    app: JupyterFrontEnd,
    settingRegistry: ISettingRegistry | null,
    palette: ICommandPalette
  ) => {
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

    // Define a widget creator function,
    // then call it to make a new widget
    const newWidget = async () => {
      // Create a blank content widget inside of a MainAreaWidget
      const content = new Widget();
      let textOutput = document.createElement('p');
      textOutput.style.width = '100%';
      textOutput.style.height = '100%';
      textOutput.style.border = '1px solid black';
      textOutput.style.padding = '5px';
      textOutput.style.marginTop = '5px';
      textOutput.style.fontFamily = 'monospace';
      textOutput.style.whiteSpace = 'pre-wrap';
      textOutput.style.color = '#555';

      let textInput = document.createElement('input');
      textInput.type = 'text';
      textInput.placeholder = 'Enter a message';
      textInput.style.width = '100%';
      textInput.addEventListener('input', () => {
        textOutput.innerText = textInput.value;
      });
      content.node.appendChild(textInput);
      content.node.appendChild(textOutput);

      const widget = new MainAreaWidget({ content });
      widget.id = 'squawk-jupyterlab';
      widget.title.label = 'Squawk';
      widget.title.closable = true;

      return widget;
    };

    let widget = await newWidget();

    // Add an application command
    const command: string = 'squawk:open';
    app.commands.addCommand(command, {
      label: 'Squawk',
      execute: async () => {
        // Regenerate the widget if disposed
        if (widget.isDisposed) {
          widget = await newWidget();
        }
        if (!widget.isAttached) {
          // Attach the widget to the main work area if it's not there
          app.shell.add(widget, 'main');
        }
        // Activate the widget
        app.shell.activateById(widget.id);
      }
    });

    // Add the command to the palette.
    palette.addItem({ command, category: 'Tutorial' });
  }
};

export default plugin;
