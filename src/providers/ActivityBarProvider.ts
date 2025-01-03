import * as vscode from 'vscode';

export class MyViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(private readonly extensionUri: vscode.Uri) {}

  resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this.extensionUri],
    };

    webviewView.webview.html = this.getHtmlContent();

    webviewView.webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case 'saveData':
          vscode.window.showInformationMessage(
            `Key: ${message.key}, Name: ${message.name}`
          );
          break;
      }
    });
  }

  private getHtmlContent(): string {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>My Extension</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 10px;
          }
          input {
            width: 100%;
            margin-bottom: 10px;
            padding: 8px;
            box-sizing: border-box;
          }
          button {
            padding: 8px;
            width: 100%;
            background-color: #007acc;
            color: white;
            border: none;
            cursor: pointer;
          }
          button:hover {
            background-color: #005f99;
          }
        </style>
      </head>
      <body>
        <h3>Enter Details</h3>
        <input id="key" type="text" placeholder="Enter key" />
        <input id="name" type="text" placeholder="Enter name" />
        <button id="saveButton">Save</button>

        <script>
          const vscode = acquireVsCodeApi();

          document.getElementById('saveButton').addEventListener('click', () => {
            const key = document.getElementById('key').value;
            const name = document.getElementById('name').value;

            vscode.postMessage({ command: 'saveData', key, name });
          });
        </script>
      </body>
      </html>
    `;
  }
}
