const dialogflow = require('dialogflow');
const constants = require('../configs/app.config');
const LANGUAGE_CODE = 'en-US' 

class DialogFlowService {
	constructor (projectId) {
		this.projectId = constants.dialogflow.project_id

		let privateKey = constants.dialogflow.private_key
		let clientEmail = constants.dialogflow.client_email
		let config = {
			credentials: {
				private_key: privateKey,
				client_email: clientEmail
			}
		}
	
		this.sessionClient = new dialogflow.SessionsClient(config)
	}

	async sendTextMessageToDialogFlow(textMessage, sessionId) {
		// Define session path
		const sessionPath = this.sessionClient.sessionPath(this.projectId, sessionId);
		// The text query request.
		const request = {
			session: sessionPath,
			queryInput: {
				text: {
					text: textMessage,
					languageCode: LANGUAGE_CODE
				}
			}
		}
		try {
            let responses = await this.sessionClient.detectIntent(request)		
            	
			console.log('DialogFlow.sendTextMessageToDialogFlow: Detected intent',responses);
			return responses
		}
		catch(err) {
			console.error('DialogFlow.sendTextMessageToDialogFlow ERROR:', err);
			throw err
		}
	}
}
module.exports = new DialogFlowService()