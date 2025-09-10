import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { lambdaHandler } from '../../handler'
import { expect, describe, it, beforeAll } from '@jest/globals'

describe('Unit test for app handler', function () {
  // Set test environment to use fallback response
  beforeAll(() => {
    process.env.NODE_ENV = 'test'
  })

  it('verifies successful response', async () => {
    const event: APIGatewayProxyEvent = {
      httpMethod: 'POST',
      body: JSON.stringify({
        userId: '123e4567-e89b-12d3-a456-426614174000',
        userInput: {
          housing: {
            monthlyElectricityBill: 120,
            usesNaturalGas: true,
            monthlyNaturalGasBill: 50,
            usesHeatingOil: false,
          },
          transportation: {
            car: {
              make: 'Toyota',
              model: 'Camry',
              year: 2020,
              commuteMilesOneWay: 15,
              commuteDaysPerWeek: 5,
              weeklyErrandsMilesRange: '25-50',
            },
            publicTransit: {
              weeklyBusMiles: 10,
              weeklyTrainMiles: 5,
            },
            flights: {
              under3Hours: 2,
              between3And6Hours: 1,
              over6Hours: 0,
            },
          },
          food: {
            dietDescription: 'Meat a few times a week',
          },
          consumption: {
            shoppingFrequencyDescription: 'I buy new things every now and then.',
            recycledMaterials: ['Paper', 'Plastic'],
          },
        },
      }),
      headers: {},
      isBase64Encoded: false,
      multiValueHeaders: {},
      multiValueQueryStringParameters: {},
      path: '/calculate',
      pathParameters: {},
      queryStringParameters: {},
      requestContext: {
        accountId: '123456789012',
        apiId: '1234',
        authorizer: {},
        httpMethod: 'POST',
        identity: {
          accessKey: '',
          accountId: '',
          apiKey: '',
          apiKeyId: '',
          caller: '',
          clientCert: {
            clientCertPem: '',
            issuerDN: '',
            serialNumber: '',
            subjectDN: '',
            validity: { notAfter: '', notBefore: '' },
          },
          cognitoAuthenticationProvider: '',
          cognitoAuthenticationType: '',
          cognitoIdentityId: '',
          cognitoIdentityPoolId: '',
          principalOrgId: '',
          sourceIp: '',
          user: '',
          userAgent: '',
          userArn: '',
        },
        path: '/calculate',
        protocol: 'HTTP/1.1',
        requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
        requestTimeEpoch: 1428582896000,
        resourceId: '123456',
        resourcePath: '/calculate',
        stage: 'dev',
      },
      resource: '',
      stageVariables: {},
    }
    const result: APIGatewayProxyResult = await lambdaHandler(event)

    expect(result.statusCode).toEqual(200)
    const responseBody = JSON.parse(result.body)
    expect(responseBody).toHaveProperty('carbonFootprint')
    expect(responseBody).toHaveProperty('aiAnalysis')
    expect(responseBody).toHaveProperty('calculationId')

    // Verify the structured AI analysis format
    expect(responseBody.aiAnalysis).toHaveProperty('summary')
    expect(responseBody.aiAnalysis).toHaveProperty('recommendations')
    expect(responseBody.aiAnalysis).toHaveProperty('disclaimer')
    expect(responseBody.aiAnalysis.summary).toHaveProperty('totalEmissions')
    expect(responseBody.aiAnalysis.summary).toHaveProperty('comparisonToAverages')
    expect(responseBody.aiAnalysis.summary).toHaveProperty('topContributors')
    expect(Array.isArray(responseBody.aiAnalysis.recommendations)).toBe(true)
  })
})
