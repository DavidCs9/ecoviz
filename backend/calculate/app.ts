import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import Calculator from './Calculator'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const requestBody = JSON.parse(event.body || '{}')

    const userId = requestBody.userId

    const userInput = requestBody.userInput

    if (!userId || !userInput) {
      throw new Error('Missing userId or userInput in the request body')
    }

    const calculator = new Calculator()
    const result = await calculator.calculateHandler(userId, userInput)

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    }
  } catch (err) {
    console.error('Lambda function error:', err)
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'some error happened',
      }),
    }
  }
}
