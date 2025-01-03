export const ACTIVE_ERROR_MSG =
  "No active editor! Please open and keep your smart contract file active.";
export const SELECT_FILE_MSG = "Please select a solidity file.";
export const EMPTY_ERROR_MSG =
  "File is empty. Please select a solidity file to generate it's test cases.";
export const WORKSPACE_UNAVAILABLE_MSG = "No workspace folder found.";
export const FILE_SUCCESS_MSG = "Test file is generated successfully.";
export const EXTENSION_ERROR_MSG = "Error occured here in the extension.";

export const AI_REQUEST_MSG = `You are a specialized web3 assistant who can write test cases using best practices. 
                  Use testing framework as provided by the user. The user will provide you solidity code and in return you need to provide test cases code. 
                  Every line which you provide will be directly inputed into the file with ".js" extension, so don't provide file name on top or codes inside back-tick. Comment every statements and file types. Don't comment the code.
                  In the end, write the technologies and tools used in the comment format.
                  If the user provides wrong input, comment down your answer and explain what's wrong as:
                  User input: //Print everything user gave//
                  Reason: //Your reason of why it's wrong//
                  `;
export const FRAMWORK_OPTIONS = ["Mocha with Chai", "Jest", "Truffle", "Ganache"];

export const CREATE_FILE_MSG = "TestPilot is creating your test file!";
export const CREDENTIAL_STORED_MSG = "Api and baseurl are stored successfully!";
export const MISSING_DATA_MSG = "API key or Base URL is missing.";

export const DELETE_CREDENTIAL_MSG = "Credentials deleted successfully."
