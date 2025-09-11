import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import Calculator from './Calculator'

const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://ecoviz-frontend.vercel.app',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Handle preflight OPTIONS request
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    }
  }

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
      headers: corsHeaders,
      body: JSON.stringify(result),
    }
  } catch (err) {
    console.error('Lambda function error:', err)
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: 'some error happened',
      }),
    }
  }
}
