import * as vscode from "vscode";
import path from "path";
import * as fs from "fs";
import OpenAI from "openai";
import {
  ACTIVE_ERROR_MSG,
  AI_REQUEST_MSG,
  CREATE_FILE_MSG,
  EMPTY_ERROR_MSG,
  EXTENSION_ERROR_MSG,
  FILE_SUCCESS_MSG,
  FRAMWORK_OPTIONS,
  SELECT_FILE_MSG,
  WORKSPACE_UNAVAILABLE_MSG,
} from "../constants/constants";

interface credentialType {
  apikey: string | undefined;
  baseurl: string | undefined;
}

const getFileContent = () => {
  const editor = vscode.window.activeTextEditor;

  if (!editor) {
    vscode.window.showErrorMessage(ACTIVE_ERROR_MSG);
    return null;
  }

  if (editor.document.languageId !== "solidity") {
    vscode.window.showErrorMessage(SELECT_FILE_MSG);
    return null;
  }

  const document = editor.document;
  const smartContractCode = document.getText();

  if (!smartContractCode) {
    vscode.window.showErrorMessage(EMPTY_ERROR_MSG);
    return;
  }

  const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;

  if (!workspaceFolder) {
    vscode.window.showErrorMessage(WORKSPACE_UNAVAILABLE_MSG);
    return null;
  }


  const outputFolder = path.join(workspaceFolder, "test");

  if (!fs.existsSync(outputFolder)) {
    fs.mkdirSync(outputFolder, { recursive: true });
  }

  const fileName =
    path.basename(document.fileName, path.extname(document.fileName)) +
    ".test.js";

  const outputPath = path.join(outputFolder, fileName);

  vscode.window.showInformationMessage(`Test folder created at: ${outputPath}`);

  return { smartContractCode, outputPath };
};

export const main = async ({ apikey, baseurl }: credentialType) => {
  const outputFileContents = getFileContent();

  if(outputFileContents == null) return;

  const statusBar = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left,
    100
  );
  statusBar.show();

  const selectedOption = await vscode.window.showQuickPick(FRAMWORK_OPTIONS, {
    placeHolder: "Choose your testing framework",
    ignoreFocusOut: true,
    canPickMany: false,
  });

  try {
    statusBar.text = "Creating test folder...";
    const smartContractCode = outputFileContents?.smartContractCode;
    const outputPath = outputFileContents?.outputPath;

    statusBar.text = "Creating test cases...";
    vscode.window.showInformationMessage(CREATE_FILE_MSG);

    const client = new OpenAI({
      baseURL: baseurl,
      apiKey: apikey,
      dangerouslyAllowBrowser: true,
    });

    const response = await client.chat.completions.create({
      messages: [
        {
          role: "system",
          content: AI_REQUEST_MSG,
        },
        {
          role: "user",
          content: `Here is my code: \n\n${smartContractCode}
                  Please generate solidity tests code for this smart contract using testing tool as: ${selectedOption}.`,
        },
      ],
      model: "gpt-4o",
      temperature: 1,
      max_tokens: 4096,
      top_p: 1,
    });

    if (response?.choices[0].message.content && outputPath) {
      fs.writeFileSync(outputPath, response?.choices[0].message.content);

      vscode.window.showInformationMessage(FILE_SUCCESS_MSG);
      statusBar.text = "";
    }
  } catch (error) {
    vscode.window.showErrorMessage(EXTENSION_ERROR_MSG);
    console.log("Error occured:", error);
    statusBar.text = `Error occured: ${error}`;
  }
};
