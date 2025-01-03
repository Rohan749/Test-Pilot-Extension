import * as vscode from "vscode";
import { main } from "./utils/utils";
import {
  CREATE_FILE_MSG,
  CREDENTIAL_STORED_MSG,
  DELETE_CREDENTIAL_MSG,
  MISSING_DATA_MSG,
} from "./constants/constants";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, the extension "testpilot" is now active!');

  const disposable = vscode.commands.registerCommand(
    "testpilot.run",
    async () => {
      const data = await setCredentials();
      const apikey = data?.apikey;
      const baseurl = data?.baseurl;

      await main({ apikey, baseurl });
    }
  );

  const setCredentials = async () => {
    const apikey = await context.secrets.get("apikey");
    const baseurl = await context.secrets.get("baseurl");

    if (!apikey || !baseurl) {
      const apikey = await vscode.window.showInputBox({
        prompt: "Enter your API key",
        placeHolder: "API Key",
        ignoreFocusOut: true,
      });

      const baseurl = await vscode.window.showInputBox({
        prompt: "Enter your Base URL",
        placeHolder: "https://baseurl.com",
        ignoreFocusOut: true,
      });

      if (apikey === "" || baseurl === "") {
        await vscode.window.showWarningMessage(MISSING_DATA_MSG);
        return;
      }

      else if (apikey && baseurl) {
        await context.secrets.store("apikey", apikey);
        await context.secrets.store("baseurl", baseurl);
        vscode.window.showInformationMessage(CREDENTIAL_STORED_MSG);

        return { apikey, baseurl };
      } 
    } else return { apikey, baseurl };
  };

  const changeCredentials = vscode.commands.registerCommand(
    "testpilot.change-credentials",
    async () => {
      await context.secrets.delete("apikey");
      await context.secrets.delete("baseurl");

      const apikey = await vscode.window.showInputBox({
        prompt: "Enter a new API key",
        placeHolder: "API Key",
        ignoreFocusOut: true,
      });

      const baseurl = await vscode.window.showInputBox({
        prompt: "Enter a new base URL",
        placeHolder: "https://baseurl.com",
        ignoreFocusOut: true,
      });

      if (apikey && baseurl) {
        await context.secrets.store("apikey", apikey);
        await context.secrets.store("baseurl", baseurl);
        vscode.window.showInformationMessage(CREATE_FILE_MSG);
      }
    }
  );

  const deleteCredentials = vscode.commands.registerCommand(
    "testpilot.delete-credentials",
    async () => {
      await context.secrets.delete("apikey");
      await context.secrets.delete("baseurl");

      vscode.window.showInformationMessage(DELETE_CREDENTIAL_MSG);
    }
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(changeCredentials);
  context.subscriptions.push(deleteCredentials);
}

export function deactivate() {}
